import { v } from 'convex/values';
import { mutation, query, internalMutation, MutationCtx } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';
import { UserIdentity } from 'convex/server';

// Get current user or create if doesn't exist
export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .first();

    if (!user) return null;

    if (user.avatarStorageId) {
      const url = await ctx.storage.getUrl(user.avatarStorageId);
      if (url) {
        return { ...user, avatarUrl: url };
      }
    }

    return user;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .first();
  },
});

// Set user role
export const setRole = mutation({
  args: { role: v.union(v.literal('entrepreneur'), v.literal('investor')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Prevent overwriting existing role unless it's a specific admin override (not implemented yet)
    // or if the user is in a 'guest' state (which isn't current schema).
    // For now, stricter safety:
    if (user.role && user.role !== args.role) {
      throw new Error("Role cannot be changed once set. Please contact support.");
    }

    await ctx.db.patch(user._id, { role: args.role });
  },
});

// Set admin status (Internal/Dev tool - Secured)
export const setAdmin = mutation({
  args: { 
    userId: v.id('users'), 
    isAdmin: v.boolean(),
    secret: v.string() 
  },
  handler: async (ctx, args) => {
    // Environment variable for admin secret
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    
    if (!ADMIN_SECRET) {
      throw new Error("Admin secret not configured");
    }
    
    if (args.secret !== ADMIN_SECRET) {
      throw new Error("Invalid admin secret");
    }

    await ctx.db.patch(args.userId, { isAdmin: args.isAdmin });
  },
});

// Search users
export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    excludeUserId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    const { query, limit = 20, offset = 0, excludeUserId } = args;

    // Use the search index for efficient text search
    // Note: Search indexes are eventually consistent.
    const users = await ctx.db
      .query('users')
      .withSearchIndex('search_username', (q) => q.search('username', query))
      .take(limit);

    // Filter logic can be simplified or done post-fetch since search already did the heavy lifting
    const filtered = users.filter((user) => {
        if (excludeUserId && user._id === excludeUserId) return false;
        return true;
    });

    // Pagination
    const sliced = filtered.slice(offset, offset + limit);

    return {
      results: sliced.map(u => ({
        _id: u._id,
        username: u.username,
        displayName: u.username, // Force username as display name for anonymity
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.avatarUrl,
        role: u.role,
        career: u.professionalBio,
      })),
      total: filtered.length,
    };
  },
});

// Find a mood match (random user for now)
export const findMoodMatch = query({
  args: {
    mood: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!currentUser) return null;

    // For MVP, limit the pool of candidates to avoid scanning the whole DB.
    // In production, use a dedicated random index or vector search.
    const users = await ctx.db.query('users').take(50);
    const candidates = users.filter(u => u._id !== currentUser._id);

    if (candidates.length === 0) return null;

    const match = candidates[Math.floor(Math.random() * candidates.length)];

    return {
      _id: match._id,
      username: match.username,
      displayName:
        match.firstName && match.lastName
          ? `${match.firstName} ${match.lastName}`
          : match.firstName || match.username,
      avatarUrl: match.avatarUrl,
      mood: args.mood || 'Mysterious', // Echo back the mood or a default
    };
  },
});



export const getUser = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const generateUploadUrl = mutation(async ctx => {
  return await ctx.storage.generateUploadUrl();
});

// Helper to ensure user exists (JIT creation)
export async function ensureUserExists(ctx: MutationCtx, identity: UserIdentity) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .unique();

  if (user) return user._id;

  // Create user if not found
  const now = Date.now();
  const newUserId = await ctx.db.insert('users', {
    clerkId: identity.subject,
    username: identity.nickname || identity.name || identity.email?.split('@')[0] || 'User',
    email: identity.email || '',
    firstName: identity.givenName,
    lastName: identity.familyName,
    avatarUrl: identity.pictureUrl,
    createdAt: now,
    updatedAt: now,
    // Default role if needed, or leave optional
  });

  return newUserId;
}

// Helper for user upsert logic
async function upsertUser(ctx: MutationCtx, args: {
  clerkId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: 'entrepreneur' | 'investor';
  professionalBio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  interests?: string[];
  notificationPreferences?: { email: boolean; push: boolean };
  privacySettings?: { profileVisibility: 'public' | 'private' };
  avatarStorageId?: string;
  displayName?: string;
}) {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
      .unique();

    const now = Date.now();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        avatarUrl: args.avatarUrl,
        professionalBio: args.professionalBio,
        linkedinUrl: args.linkedinUrl,
        githubUrl: args.githubUrl,
        displayName: args.displayName,
        // Only update role if it's not set (or allow switching? For now, assume sticky role)
        ...(args.role !== undefined && !existing.role
          ? { role: args.role }
          : {}),
        ...(args.skills !== undefined ? { skills: args.skills } : {}),
        ...(args.interests !== undefined ? { interests: args.interests } : {}),
        ...(args.notificationPreferences !== undefined
          ? { notificationPreferences: args.notificationPreferences }
          : {}),
        ...(args.privacySettings !== undefined
          ? { privacySettings: args.privacySettings }
          : {}),
        ...(args.avatarStorageId !== undefined
          ? { avatarStorageId: args.avatarStorageId }
          : {}),
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new user
      return await ctx.db.insert('users', {
        clerkId: args.clerkId,
        username: args.username,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        avatarUrl: args.avatarUrl,
        professionalBio: args.professionalBio,
        linkedinUrl: args.linkedinUrl,
        githubUrl: args.githubUrl,
        skills: args.skills,
        interests: args.interests,
        notificationPreferences: args.notificationPreferences,
        privacySettings: args.privacySettings,
        avatarStorageId: args.avatarStorageId,
        displayName: args.displayName,
        role: args.role, // Role might be null initially if not selected during signup flow
        createdAt: now,
        updatedAt: now,
        // Legacy field default
        needsUsernameSelection: false,
      });
    }
}

export const createOrUpdateUser = mutation({
  args: {
    // clerkId removed - sourced from auth
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Launchpad Fields
    role: v.optional(v.union(v.literal('entrepreneur'), v.literal('investor'))),
    professionalBio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    notificationPreferences: v.optional(
      v.object({
        email: v.boolean(),
        push: v.boolean(),
      })
    ),
    privacySettings: v.optional(
      v.object({
        profileVisibility: v.union(v.literal('public'), v.literal('private')),
      })
    ),
    avatarStorageId: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createOrUpdateUser without authentication present");
    }
    const clerkId = identity.subject;

    return await upsertUser(ctx, { ...args, clerkId });
  },
});

export const internalUpdateUser = internalMutation({
  args: {
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    // Launchpad Fields
    role: v.optional(v.union(v.literal('entrepreneur'), v.literal('investor'))),
    professionalBio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    notificationPreferences: v.optional(
      v.object({
        email: v.boolean(),
        push: v.boolean(),
      })
    ),
    privacySettings: v.optional(
      v.object({
        profileVisibility: v.union(v.literal('public'), v.literal('private')),
      })
    ),
    avatarStorageId: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Trusted internal call - relies on 'internal' visibility
    return await upsertUser(ctx, args);
  },
});
