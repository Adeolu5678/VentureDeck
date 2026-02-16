import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Express interest / Commit
export const commit = mutation({
  args: {
    projectId: v.id('projects'),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Check if already committed
    const existing = await ctx.db
      .query('soft_circles')
      .withIndex('by_investor', (q) => q.eq('investorId', user._id))
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .first();

    let result;
    if (existing) {
      // Update existing commitment
      await ctx.db.patch(existing._id, {
        amount: args.amount,
        updatedAt: Date.now(),
      });
      result = existing._id;
    } else {
      // Create new commitment
      result = await ctx.db.insert('soft_circles', {
        projectId: args.projectId,
        investorId: user._id,
        amount: args.amount,
        status: 'interested',
        createdAt: Date.now(),
      });
    }

    // Notify Project Owner (only if new or significantly changed? For now, always notify on update too)
    const project = await ctx.db.get(args.projectId);
    if (project) {
      const investorName = user.displayName || user.firstName || user.username || 'An investor';
      const action = existing ? 'updated their commitment' : 'committed';
      
      await ctx.db.insert('notifications', {
        userId: project.ownerId,
        type: 'soft_circle_committed',
        title: existing ? 'Soft Circle Updated' : 'New Soft Circle Commitment',
        message: `${investorName} ${action} to $${args.amount.toLocaleString()} for ${project.title}`,
        link: `/projects/${args.projectId}/soft-circles`,
        read: false,
        createdAt: Date.now(),
      });
    }

    return result;
  },
});

// List soft circles for a project with investor details
// Access control:
// - Project owners can see all commitments with amounts
// - Investors can only see their own commitments with amounts
// - Public/unauthenticated users see commitments without amounts
export const list = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let currentUser = null;
    if (identity) {
      currentUser = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .unique();
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const isProjectOwner = currentUser && project.ownerId === currentUser._id;

    const softCircles = await ctx.db
      .query('soft_circles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    if (softCircles.length === 0) return [];

    const investorIds = [...new Set(softCircles.map(c => c.investorId))];
    const investors = await Promise.all(investorIds.map(id => ctx.db.get(id)));
    const investorMap = new Map(investors.filter(Boolean).map(i => [i!._id, i!]));

    return softCircles.map(circle => {
      const investor = investorMap.get(circle.investorId);
      const isOwnCommitment = currentUser && circle.investorId === currentUser._id;
      const canSeeAmount = isProjectOwner || isOwnCommitment;

      return {
        ...circle,
        amount: canSeeAmount ? circle.amount : null,
        investor: investor ? {
          _id: investor._id,
          username: investor.username,
          displayName: investor.displayName,
          avatarUrl: investor.avatarUrl,
          role: investor.role,
        } : null,
        isOwnCommitment: isOwnCommitment || false,
      };
    });
  },
});

/**
 * Update soft circle status (e.g. Investor confirms, or withdraws).
 * Only the investor who made the commitment or the project owner can update.
 */
export const updateStatus = mutation({
  args: {
    id: v.id('soft_circles'),
    status: v.union(v.literal('interested'), v.literal('committed'), v.literal('withdrawn')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Authentication required');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    const softCircle = await ctx.db.get(args.id);
    if (!softCircle) {
      throw new Error('Soft circle commitment not found');
    }

    const project = await ctx.db.get(softCircle.projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    // Only the investor who made the commitment or the project owner can update
    const isInvestor = softCircle.investorId === user._id;
    const isProjectOwner = project.ownerId === user._id;

    if (!isInvestor && !isProjectOwner) {
      throw new Error('Unauthorized: Only the investor or project owner can update this commitment');
    }

    await ctx.db.patch(args.id, { 
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Alias for `list` to maintain backward compatibility with frontend.
 * @deprecated Use `list` instead.
 */
export const get = list;
