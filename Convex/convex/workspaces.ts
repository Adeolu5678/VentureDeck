import { v } from 'convex/values';
import { query } from './_generated/server';

export const get = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      return null;
    }

    if (!workspace.members.includes(user._id)) {
      throw new Error('Not authorized');
    }

    return workspace;
  },
});

export const getByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const workspace = await ctx.db
      .query('workspaces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .unique();

    if (!workspace) {
      return null;
    }

    if (!workspace.members.includes(user._id)) {
      throw new Error('Not authorized');
    }

    return workspace;
  },
});
