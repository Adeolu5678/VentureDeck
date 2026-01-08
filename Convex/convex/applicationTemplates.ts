import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Application Templates Module
 * 
 * Allows users to save application templates for faster applying to projects.
 */

// Create a new template
export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    message: v.string(),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Limit to 5 templates per user
    const existing = await ctx.db
      .query('applicationTemplates')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    if (existing.length >= 5) {
      throw new Error('Maximum 5 templates allowed. Please delete some before creating new ones.');
    }

    // If setting as default, unset other defaults
    if (args.isDefault) {
      for (const template of existing) {
        if (template.isDefault) {
          await ctx.db.patch(template._id, { isDefault: false });
        }
      }
    }

    const templateId = await ctx.db.insert('applicationTemplates', {
      userId: user._id,
      name: args.name,
      role: args.role,
      message: args.message,
      isDefault: args.isDefault ?? false,
      usageCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return templateId;
  },
});

// List user's templates
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

    const templates = await ctx.db
      .query('applicationTemplates')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    // Sort: default first, then by usage count
    return templates.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.usageCount - a.usageCount;
    });
  },
});

// Update a template
export const update = mutation({
  args: {
    id: v.id('applicationTemplates'),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    message: v.optional(v.string()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const template = await ctx.db.get(args.id);
    if (!template || template.userId !== user._id) {
      throw new Error('Template not found or not authorized');
    }

    // If setting as default, unset other defaults
    if (args.isDefault) {
      const others = await ctx.db
        .query('applicationTemplates')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect();

      for (const other of others) {
        if (other._id !== args.id && other.isDefault) {
          await ctx.db.patch(other._id, { isDefault: false });
        }
      }
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.role !== undefined) updates.role = args.role;
    if (args.message !== undefined) updates.message = args.message;
    if (args.isDefault !== undefined) updates.isDefault = args.isDefault;

    await ctx.db.patch(args.id, updates);
    return { updated: true };
  },
});

// Delete a template
export const remove = mutation({
  args: { id: v.id('applicationTemplates') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const template = await ctx.db.get(args.id);
    if (!template || template.userId !== user._id) {
      throw new Error('Template not found or not authorized');
    }

    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});

// Increment usage count (called when template is used)
export const incrementUsage = mutation({
  args: { id: v.id('applicationTemplates') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const template = await ctx.db.get(args.id);
    if (!template || template.userId !== user._id) {
      throw new Error('Template not found or not authorized');
    }

    await ctx.db.patch(args.id, {
      usageCount: template.usageCount + 1,
      updatedAt: Date.now(),
    });

    return { usageCount: template.usageCount + 1 };
  },
});

// Get default template
export const getDefault = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return null;

    const templates = await ctx.db
      .query('applicationTemplates')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    return templates.find(t => t.isDefault) ?? null;
  },
});
