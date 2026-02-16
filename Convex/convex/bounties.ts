import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a bounty (project owner only)
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    reward: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Verify project ownership
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');
    if (project.ownerId !== user._id) throw new Error('Only project owner can create bounties');

    return await ctx.db.insert('bounties', {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      reward: args.reward,
      status: 'open',
      createdAt: Date.now(),
    });
  },
});

// List bounties for a project
export const list = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('bounties')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// List bounties assigned to current user
export const getMyBounties = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const bounties = await ctx.db
      .query('bounties')
      .withIndex('by_assignee', (q) => q.eq('assigneeId', user._id))
      .collect();

    if (bounties.length === 0) return [];

    const projectIds = [...new Set(bounties.map(b => b.projectId))];
    const projects = await Promise.all(projectIds.map(id => ctx.db.get(id)));
    const projectMap = new Map(projects.filter(Boolean).map(p => [p!._id, p!]));

    return bounties.map(bounty => ({
      ...bounty,
      projectTitle: projectMap.get(bounty.projectId)?.title || 'Unknown Project',
    }));
  },
});

// Claim a bounty (for talent)
export const claim = mutation({
  args: { id: v.id('bounties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    if (bounty.status !== 'open') {
      throw new Error('Bounty is not open');
    }

    await ctx.db.patch(args.id, { 
      assigneeId: user._id,
      status: 'assigned'
    });

    // Notify project owner
    const project = await ctx.db.get(bounty.projectId);
    if (project) {
      await ctx.db.insert('notifications', {
        userId: project.ownerId,
        type: 'bounty_claimed',
        title: 'Bounty Claimed',
        message: `${user.displayName || user.username} claimed "${bounty.title}"`,
        link: `/projects/${bounty.projectId}/bounties`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

// Submit work for a claimed bounty
export const submit = mutation({
  args: { 
    id: v.id('bounties'),
    submissionUrl: v.string(),
    submissionNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    if (bounty.assigneeId !== user._id) {
      throw new Error('Only the assigned user can submit');
    }

    if (bounty.status !== 'assigned') {
      throw new Error('Bounty is not in assigned status');
    }

    await ctx.db.patch(args.id, { 
      status: 'submitted',
      submissionUrl: args.submissionUrl,
      submissionNote: args.submissionNote || '',
      submittedAt: Date.now(),
    });

    // Notify project owner
    const project = await ctx.db.get(bounty.projectId);
    if (project) {
      await ctx.db.insert('notifications', {
        userId: project.ownerId,
        type: 'bounty_submitted',
        title: 'Bounty Submission Ready',
        message: `${user.displayName || user.username} submitted work for "${bounty.title}"`,
        link: `/projects/${bounty.projectId}/bounties`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

// Approve a bounty submission (project owner only)
export const approveSubmission = mutation({
  args: { 
    id: v.id('bounties'),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    const project = await ctx.db.get(bounty.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Only project owner can approve submissions');
    }

    if (bounty.status !== 'submitted') {
      throw new Error('Bounty has no pending submission');
    }

    await ctx.db.patch(args.id, { 
      status: 'completed',
      reviewNote: args.reviewNote,
      reviewedAt: Date.now(),
    });

    // Notify assignee
    if (bounty.assigneeId) {
      await ctx.db.insert('notifications', {
        userId: bounty.assigneeId,
        type: 'bounty_approved',
        title: 'Bounty Approved! 🎉',
        message: `Your submission for "${bounty.title}" was approved. Reward: ${bounty.reward}`,
        link: `/projects/${bounty.projectId}/bounties`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

// Reject a bounty submission (project owner only)
export const rejectSubmission = mutation({
  args: { 
    id: v.id('bounties'),
    reviewNote: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    const project = await ctx.db.get(bounty.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Only project owner can reject submissions');
    }

    if (bounty.status !== 'submitted') {
      throw new Error('Bounty has no pending submission');
    }

    // Reset to assigned status so they can resubmit
    await ctx.db.patch(args.id, { 
      status: 'assigned',
      submissionUrl: undefined,
      submissionNote: undefined,
      submittedAt: undefined,
      reviewNote: args.reviewNote,
      reviewedAt: Date.now(),
    });

    // Notify assignee
    if (bounty.assigneeId) {
      await ctx.db.insert('notifications', {
        userId: bounty.assigneeId,
        type: 'bounty_rejected',
        title: 'Bounty Needs Revision',
        message: `Your submission for "${bounty.title}" needs changes: ${args.reviewNote}`,
        link: `/projects/${bounty.projectId}/bounties`,
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

// Mark bounty as paid (project owner only)
export const markAsPaid = mutation({
  args: { id: v.id('bounties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    const project = await ctx.db.get(bounty.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Only project owner can mark as paid');
    }

    if (bounty.status !== 'completed') {
      throw new Error('Bounty must be completed before marking as paid');
    }

    await ctx.db.patch(args.id, { status: 'paid' });
  },
});

// Unclaim a bounty (for assignee who wants to give up)
export const unclaim = mutation({
  args: { id: v.id('bounties') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const bounty = await ctx.db.get(args.id);
    if (!bounty) throw new Error('Bounty not found');

    if (bounty.assigneeId !== user._id) {
      throw new Error('Only the assigned user can unclaim');
    }

    if (bounty.status !== 'assigned') {
      throw new Error('Can only unclaim assigned bounties');
    }

    await ctx.db.patch(args.id, { 
      status: 'open',
      assigneeId: undefined,
    });
  },
});
