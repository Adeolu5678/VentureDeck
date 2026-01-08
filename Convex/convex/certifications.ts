import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Create a new certification (upload)
export const create = mutation({
  args: {
    title: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    return await ctx.db.insert('certifications', {
      userId: user._id,
      title: args.title,
      imageUrl: args.imageUrl,
      status: 'pending',
      createdAt: Date.now(),
    });
  },
});

// List certifications for a user
export const list = query({
  args: { targetId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    let userId = args.targetId;

    if (!userId) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];

      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .unique();

      if (!user) return [];
      userId = user._id;
    }

    return await ctx.db
      .query('certifications')
      .withIndex('by_user_id', (q) => q.eq('userId', userId!))
      .collect();
  },
});

// List pending certifications (Admin only)
export const listPending = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user || !user.isAdmin) return [];

    return await ctx.db
      .query('certifications')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();
  },
});

// Verify a certification (Admin only)
export const verify = mutation({
  args: { id: v.id('certifications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user || !user.isAdmin) throw new Error('Unauthorized');
    
    await ctx.db.patch(args.id, {
      status: 'verified',
      verifiedAt: Date.now(),
    });
  },
});

// Reject a certification (Admin only)
export const reject = mutation({
  args: { id: v.id('certifications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user || !user.isAdmin) throw new Error('Unauthorized');
    
    await ctx.db.patch(args.id, {
      status: 'rejected',
      verifiedAt: Date.now(),
    });
  },
});

// List pending certifications with user details (Admin only)
export const listPendingWithUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser || !currentUser.isAdmin) return [];

    const certs = await ctx.db
      .query('certifications')
      .withIndex('by_status', (q) => q.eq('status', 'pending'))
      .collect();

    // Fetch user details for each certification
    const certsWithUsers = await Promise.all(
      certs.map(async (cert) => {
        const user = await ctx.db.get(cert.userId);
        return {
          ...cert,
          user: user ? {
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            email: user.email,
          } : null,
        };
      })
    );

    return certsWithUsers;
  },
});
