import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

/**
 * Follow a project. Creates a notification for the project owner.
 */
export const follow = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Check if already following
    const existing = await ctx.db
      .query('project_followers')
      .withIndex('by_project_user', (q) => 
        q.eq('projectId', args.projectId).eq('userId', user._id)
      )
      .first();

    if (existing) {
      return existing._id; // Already following
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    // Can't follow your own project
    if (project.ownerId === user._id) {
      throw new Error('Cannot follow your own project');
    }

    const followId = await ctx.db.insert('project_followers', {
      projectId: args.projectId,
      userId: user._id,
      createdAt: Date.now(),
    });

    // Notify project owner
    await ctx.db.insert('notifications', {
      userId: project.ownerId,
      type: 'project_followed',
      title: 'New Follower',
      message: `${user.displayName || user.username} is now following ${project.title}`,
      link: `/projects/${args.projectId}`,
      read: false,
      createdAt: Date.now(),
    });

    return followId;
  },
});

/**
 * Unfollow a project.
 */
export const unfollow = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const existing = await ctx.db
      .query('project_followers')
      .withIndex('by_project_user', (q) => 
        q.eq('projectId', args.projectId).eq('userId', user._id)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

/**
 * Check if current user is following a project.
 */
export const isFollowing = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return false;

    const existing = await ctx.db
      .query('project_followers')
      .withIndex('by_project_user', (q) => 
        q.eq('projectId', args.projectId).eq('userId', user._id)
      )
      .first();

    return !!existing;
  },
});

/**
 * Get follower count for a project.
 */
export const getFollowerCount = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query('project_followers')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return followers.length;
  },
});

/**
 * Get list of projects the current user is following.
 */
export const getFollowedProjects = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const follows = await ctx.db
      .query('project_followers')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    // Enrich with project details
    const projects = await Promise.all(
      follows.map(async (follow) => {
        const project = await ctx.db.get(follow.projectId);
        if (!project) return null;

        const owner = await ctx.db.get(project.ownerId);
        
        return {
          ...project,
          followedAt: follow.createdAt,
          ownerName: owner?.displayName || owner?.username || 'Unknown',
        };
      })
    );

    return projects.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

/**
 * Get list of followers for a project (owner only).
 */
export const getFollowers = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== user._id) return [];

    const follows = await ctx.db
      .query('project_followers')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Enrich with user details
    const followers = await Promise.all(
      follows.map(async (follow) => {
        const follower = await ctx.db.get(follow.userId);
        if (!follower) return null;

        return {
          _id: follower._id,
          username: follower.username,
          displayName: follower.displayName,
          avatarUrl: follower.avatarUrl,
          role: follower.role,
          followedAt: follow.createdAt,
        };
      })
    );

    return followers.filter((f): f is NonNullable<typeof f> => f !== null);
  },
});
