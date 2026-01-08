import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Helper to verify admin status
async function verifyAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q: any) => q.eq('clerkId', identity.subject))
    .unique();

  if (!user?.isAdmin) throw new Error('Not authorized');
  return user;
}

// List all users with pagination
export const listUsers = query({
  args: { 
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    roleFilter: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    
    const limit = args.limit || 20;
    const offset = args.offset || 0;
    
    let users = await ctx.db.query('users').collect();
    
    // Filter by role if specified
    if (args.roleFilter && args.roleFilter !== 'all') {
      users = users.filter(u => u.role === args.roleFilter);
    }
    
    // Simple search by username or email
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      users = users.filter(u => 
        u.username.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        (u.displayName && u.displayName.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by createdAt descending
    users.sort((a, b) => b.createdAt - a.createdAt);
    
    // Paginate
    const paginatedUsers = users.slice(offset, offset + limit);
    
    return {
      users: paginatedUsers.map(u => ({
        _id: u._id,
        username: u.username,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
        isAdmin: u.isAdmin,
        isVerified: u.isVerified,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
      })),
      total: users.length,
      hasMore: offset + limit < users.length,
    };
  },
});

// Suspend/unsuspend a user (soft approach - set a flag)
export const setUserSuspended = mutation({
  args: {
    userId: v.id('users'),
    suspended: v.boolean(),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    
    // Don't allow suspending self
    const admin = await verifyAdmin(ctx);
    if (admin._id === args.userId) {
      throw new Error('Cannot suspend yourself');
    }
    
    await ctx.db.patch(args.userId, {
      // Using isVerified as a proxy for suspended (false = suspended)
      // In a real app, you'd add a dedicated 'suspended' field
      isVerified: !args.suspended,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Toggle admin status
export const setUserAdmin = mutation({
  args: {
    userId: v.id('users'),
    isAdmin: v.boolean(),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    
    await ctx.db.patch(args.userId, {
      isAdmin: args.isAdmin,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// List all projects with moderation info
export const listProjects = query({
  args: { 
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    statusFilter: v.optional(v.string()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    
    const limit = args.limit || 20;
    const offset = args.offset || 0;
    
    let projects = await ctx.db.query('projects').collect();
    
    // Filter by status if specified
    if (args.statusFilter && args.statusFilter !== 'all') {
      projects = projects.filter(p => p.status === args.statusFilter);
    }
    
    // Simple search by title
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.tagline.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by createdAt descending
    projects.sort((a, b) => b.createdAt - a.createdAt);
    
    // Paginate
    const paginatedProjects = projects.slice(offset, offset + limit);
    
    // Get owner info
    const projectsWithOwners = await Promise.all(
      paginatedProjects.map(async (p) => {
        const owner = await ctx.db.get(p.ownerId);
        return {
          _id: p._id,
          title: p.title,
          tagline: p.tagline,
          status: p.status,
          industry: p.industry,
          fundingGoal: p.fundingGoal,
          createdAt: p.createdAt,
          owner: owner ? {
            _id: owner._id,
            username: owner.username,
            displayName: owner.displayName,
          } : null,
        };
      })
    );
    
    return {
      projects: projectsWithOwners,
      total: projects.length,
      hasMore: offset + limit < projects.length,
    };
  },
});

// Change project status (moderation action)
export const setProjectStatus = mutation({
  args: {
    projectId: v.id('projects'),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('funded'),
      v.literal('closed')
    ),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    
    await ctx.db.patch(args.projectId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

// Get audit log (simplified - just track admin actions in memory for now)
// In production, you'd have a dedicated audit_logs table
export const getRecentActions = query({
  args: {},
  handler: async (ctx) => {
    await verifyAdmin(ctx);
    
    // Return placeholder - in production, query from audit_logs table
    return {
      actions: [],
      message: 'Audit logging coming soon',
    };
  },
});
