import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a milestone (project owner only)
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    date: v.number(),
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
    
    if (project.ownerId !== user._id) {
      throw new Error('Only project owner can create milestones');
    }
    
    return await ctx.db.insert('milestones', {
      projectId: args.projectId,
      title: args.title,
      description: args.description,
      date: args.date,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

// List milestones for a project
export const list = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('milestones')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Update status (project owner or admin)
export const updateStatus = mutation({
  args: {
    id: v.id('milestones'),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('verified')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const milestone = await ctx.db.get(args.id);
    if (!milestone) throw new Error('Milestone not found');

    const project = await ctx.db.get(milestone.projectId);
    if (!project) throw new Error('Project not found');

    // Only project owner can mark as completed
    // Only admin can mark as verified
    if (args.status === 'completed' && project.ownerId !== user._id) {
      throw new Error('Only project owner can mark milestones as completed');
    }

    if (args.status === 'verified' && !user.isAdmin) {
      throw new Error('Only admins can verify milestones');
    }

    await ctx.db.patch(args.id, { 
      status: args.status,
      ...(args.status === 'verified' ? { verifiedBy: user._id } : {}),
    });

    // Notify followers when milestone is completed
    if (args.status === 'completed') {
      const followers = await ctx.db
        .query('project_followers')
        .withIndex('by_project', (q) => q.eq('projectId', project._id))
        .collect();

      for (const follower of followers) {
        await ctx.db.insert('notifications', {
          userId: follower.userId,
          type: 'milestone_completed',
          title: 'Milestone Achieved! 🎯',
          message: `${project.title} completed: "${milestone.title}"`,
          link: `/projects/${project._id}/milestones`,
          read: false,
          createdAt: Date.now(),
        });
      }
    }
  },
});

// Delete a milestone (project owner only)
export const remove = mutation({
  args: { id: v.id('milestones') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const milestone = await ctx.db.get(args.id);
    if (!milestone) throw new Error('Milestone not found');

    const project = await ctx.db.get(milestone.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Only project owner can delete milestones');
    }

    await ctx.db.delete(args.id);
  },
});

// Get project traction score based on milestones
export const getTractionScore = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const milestones = await ctx.db
      .query('milestones')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    if (milestones.length === 0) return 0;

    const completed = milestones.filter(m => m.status === 'completed' || m.status === 'verified').length;
    const verified = milestones.filter(m => m.status === 'verified').length;

    // Base score: percentage completed * 60 + verified bonus * 40
    const completionScore = (completed / milestones.length) * 60;
    const verifiedScore = milestones.length > 0 ? (verified / milestones.length) * 40 : 0;

    return Math.round(completionScore + verifiedScore);
  },
});
