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

    if (follows.length === 0) return [];

    const projectIds = [...new Set(follows.map(f => f.projectId))];
    const projects = await Promise.all(projectIds.map(id => ctx.db.get(id)));
    const projectMap = new Map(projects.filter(Boolean).map(p => [p!._id, p!]));

    const ownerIds = [...new Set(projects.filter(Boolean).map(p => p!.ownerId))];
    const owners = await Promise.all(ownerIds.map(id => ctx.db.get(id)));
    const ownerMap = new Map(owners.filter(Boolean).map(o => [o!._id, o!]));

    return follows.map(follow => {
      const project = projectMap.get(follow.projectId);
      if (!project) return null;
      const owner = ownerMap.get(project.ownerId);
      return {
        ...project,
        followedAt: follow.createdAt,
        ownerName: owner?.displayName || owner?.username || 'Unknown',
      };
    }).filter((p): p is NonNullable<typeof p> => p !== null);
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

    if (follows.length === 0) return [];

    const userIds = [...new Set(follows.map(f => f.userId))];
    const users = await Promise.all(userIds.map(id => ctx.db.get(id)));
    const userMap = new Map(users.filter(Boolean).map(u => [u!._id, u!]));

    return follows.map(follow => {
      const follower = userMap.get(follow.userId);
      if (!follower) return null;
      return {
        _id: follower._id,
        username: follower.username,
        displayName: follower.displayName,
        avatarUrl: follower.avatarUrl,
        role: follower.role,
        followedAt: follow.createdAt,
      };
    }).filter((f): f is NonNullable<typeof f> => f !== null);
  },
});
