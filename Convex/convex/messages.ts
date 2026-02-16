import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { enforceRateLimit } from './rateLimits';

// Send a message to a workspace channel (general)
export const send = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    await enforceRateLimit(ctx.db, user._id, 'messages');

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    if (!workspace.members.includes(user._id)) {
      throw new Error('Not authorized');
    }

    // For now, all workspace messages go to a single "general" conversation per workspace
    // We need to find or create this conversation.
    // The schema has `workspaceId` on `conversations`.
    
    let conversation = await ctx.db
      .query('conversations')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', args.workspaceId))
      .filter((q) => q.eq(q.field('type'), 'workspace_general'))
      .first();

    if (!conversation) {
      // Create default general channel if it doesn't exist
      const conversationId = await ctx.db.insert('conversations', {
        workspaceId: args.workspaceId,
        participantIds: workspace.members,
        type: 'workspace_general',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      conversation = await ctx.db.get(conversationId);
    }

    if (!conversation) throw new Error('Failed to get conversation');

    const messageId = await ctx.db.insert('messages', {
      conversationId: conversation._id,
      senderId: user._id,
      content: args.content,
      createdAt: Date.now(),
    });

    await ctx.db.patch(conversation._id, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

// List messages for a workspace (general channel)
export const list = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || !workspace.members.includes(user._id)) {
      return [];
    }

    const conversation = await ctx.db
      .query('conversations')
      .withIndex('by_workspace', (q) => q.eq('workspaceId', args.workspaceId))
      .filter((q) => q.eq(q.field('type'), 'workspace_general'))
      .first();

    if (!conversation) return [];

    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => q.eq('conversationId', conversation._id))
      .collect();
  },
});
