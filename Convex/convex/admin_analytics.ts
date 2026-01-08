import { query } from './_generated/server';

/**
 * Admin analytics queries for dashboard metrics.
 */

// Get total user count by role
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user?.isAdmin) return null;

    const allUsers = await ctx.db.query('users').collect();
    
    const entrepreneurs = allUsers.filter(u => u.role === 'entrepreneur').length;
    const investors = allUsers.filter(u => u.role === 'investor').length;
    const noRole = allUsers.filter(u => !u.role).length;

    return {
      total: allUsers.length,
      entrepreneurs,
      investors,
      noRole,
    };
  },
});

// Get project stats
export const getProjectStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user?.isAdmin) return null;

    const allProjects = await ctx.db.query('projects').collect();
    
    const published = allProjects.filter(p => p.status === 'published').length;
    const draft = allProjects.filter(p => p.status === 'draft').length;
    const funded = allProjects.filter(p => p.status === 'funded').length;
    const closed = allProjects.filter(p => p.status === 'closed').length;

    return {
      total: allProjects.length,
      published,
      draft,
      funded,
      closed,
    };
  },
});

// Get commitment stats (soft circles)
export const getCommitmentStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user?.isAdmin) return null;

    const allCommitments = await ctx.db.query('soft_circles').collect();
    
    const totalAmount = allCommitments.reduce((sum, c) => sum + c.amount, 0);
    const interested = allCommitments.filter(c => c.status === 'interested').length;
    const committed = allCommitments.filter(c => c.status === 'committed').length;

    return {
      totalCount: allCommitments.length,
      totalAmount,
      interested,
      committed,
    };
  },
});

// Get bounty stats
export const getBountyStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user?.isAdmin) return null;

    const allBounties = await ctx.db.query('bounties').collect();
    
    const open = allBounties.filter(b => b.status === 'open').length;
    const assigned = allBounties.filter(b => b.status === 'assigned').length;
    const submitted = allBounties.filter(b => b.status === 'submitted').length;
    const completed = allBounties.filter(b => b.status === 'completed' || b.status === 'paid').length;

    return {
      total: allBounties.length,
      open,
      assigned,
      submitted,
      completed,
    };
  },
});

// Get follower stats
export const getFollowerStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user?.isAdmin) return null;

    const allFollowers = await ctx.db.query('project_followers').collect();
    
    return {
      totalFollows: allFollowers.length,
    };
  },
});

// Get platform overview - all stats combined
export const getPlatformOverview = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user?.isAdmin) return null;

    const [users, projects, commitments, bounties, followers, milestones, vouches] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('projects').collect(),
      ctx.db.query('soft_circles').collect(),
      ctx.db.query('bounties').collect(),
      ctx.db.query('project_followers').collect(),
      ctx.db.query('milestones').collect(),
      ctx.db.query('vouches').collect(),
    ]);

    return {
      users: {
        total: users.length,
        entrepreneurs: users.filter(u => u.role === 'entrepreneur').length,
        investors: users.filter(u => u.role === 'investor').length,
      },
      projects: {
        total: projects.length,
        published: projects.filter(p => p.status === 'published').length,
      },
      commitments: {
        total: commitments.length,
        amount: commitments.reduce((sum, c) => sum + c.amount, 0),
      },
      bounties: {
        total: bounties.length,
        completed: bounties.filter(b => b.status === 'completed' || b.status === 'paid').length,
      },
      followers: followers.length,
      milestones: {
        total: milestones.length,
        completed: milestones.filter(m => m.status === 'completed' || m.status === 'verified').length,
      },
      vouches: vouches.length,
    };
  },
});
