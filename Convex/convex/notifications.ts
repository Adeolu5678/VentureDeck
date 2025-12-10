import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create a notification (Internal use mostly)
export const create = mutation({
  args: {
    userId: v.id('users'),
    type: v.union(v.literal('application_received'), v.literal('application_accepted'), v.literal('application_rejected'), v.literal('message_received'), v.literal('soft_circle_committed'), v.literal('system')),
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Any authenticated user can trigger a notification? 
    // Ideally this should be restricted or triggered by other mutations internally.
    // For now, we allow it but we might want to check if the sender has permission to notify the user.
    // In a real app, we'd use internal mutations.
    
    // For simplicity, we allow it for now.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    await ctx.db.insert('notifications', {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      link: args.link,
      read: false,
      createdAt: Date.now(),
    });
  },
});

// List my notifications
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query('notifications')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc')
      .take(20);
  },
});

// Mark as read
export const markAsRead = mutation({
  args: { notificationId: v.id('notifications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) throw new Error('Notification not found');

    if (notification.userId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.notificationId, {
      read: true,
    });
  },
});

// Mark all as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_read', (q) => q.eq('userId', user._id).eq('read', false))
      .collect();

    await Promise.all(notifications.map(n => ctx.db.patch(n._id, { read: true })));
  },
});

// Get unread count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return 0;

    const notifications = await ctx.db
      .query('notifications')
      .withIndex('by_user_read', (q) => q.eq('userId', user._id).eq('read', false))
      .collect();

    return notifications.length;
  },
});
