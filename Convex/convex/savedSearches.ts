import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Saved Searches Module
 * 
 * Allows investors to save search filters and optionally get alerts
 * when new projects match their criteria.
 */

// Create a saved search
export const create = mutation({
  args: {
    name: v.string(),
    filters: v.object({
      industries: v.optional(v.array(v.string())),
      stages: v.optional(v.array(v.string())),
      minFunding: v.optional(v.number()),
      maxFunding: v.optional(v.number()),
      minTractionScore: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      location: v.optional(v.string()),
    }),
    alertEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Limit to 10 saved searches per user
    const existing = await ctx.db
      .query('savedSearches')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    if (existing.length >= 10) {
      throw new Error('Maximum 10 saved searches allowed. Please delete some before creating new ones.');
    }

    const searchId = await ctx.db.insert('savedSearches', {
      userId: user._id,
      name: args.name,
      filters: args.filters,
      alertEnabled: args.alertEnabled ?? false,
      createdAt: Date.now(),
    });

    return searchId;
  },
});

// List user's saved searches
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
      .query('savedSearches')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();
  },
});

// Update a saved search
export const update = mutation({
  args: {
    id: v.id('savedSearches'),
    name: v.optional(v.string()),
    filters: v.optional(v.object({
      industries: v.optional(v.array(v.string())),
      stages: v.optional(v.array(v.string())),
      minFunding: v.optional(v.number()),
      maxFunding: v.optional(v.number()),
      minTractionScore: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      location: v.optional(v.string()),
    })),
    alertEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const search = await ctx.db.get(args.id);
    if (!search || search.userId !== user._id) {
      throw new Error('Saved search not found or not authorized');
    }

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.filters !== undefined) updates.filters = args.filters;
    if (args.alertEnabled !== undefined) updates.alertEnabled = args.alertEnabled;

    await ctx.db.patch(args.id, updates);
    return { updated: true };
  },
});

// Delete a saved search
export const remove = mutation({
  args: { id: v.id('savedSearches') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const search = await ctx.db.get(args.id);
    if (!search || search.userId !== user._id) {
      throw new Error('Saved search not found or not authorized');
    }

    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});

// Run a saved search and return matching projects
export const runSearch = query({
  args: { id: v.id('savedSearches') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { results: [], error: 'Not authenticated' };

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return { results: [], error: 'User not found' };

    const search = await ctx.db.get(args.id);
    if (!search || search.userId !== user._id) {
      return { results: [], error: 'Saved search not found' };
    }

    const { filters } = search;

    // Get all published projects
    let projects = await ctx.db
      .query('projects')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    // Apply filters
    if (filters.industries && filters.industries.length > 0) {
      const industriesLower = filters.industries.map(i => i.toLowerCase());
      projects = projects.filter(p => 
        industriesLower.includes(p.industry.toLowerCase())
      );
    }

    if (filters.stages && filters.stages.length > 0) {
      projects = projects.filter(p => 
        p.stage && filters.stages!.includes(p.stage)
      );
    }

    if (filters.minFunding !== undefined) {
      projects = projects.filter(p => p.fundingGoal >= filters.minFunding!);
    }

    if (filters.maxFunding !== undefined) {
      projects = projects.filter(p => p.fundingGoal <= filters.maxFunding!);
    }

    if (filters.minTractionScore !== undefined) {
      projects = projects.filter(p => 
        (p.tractionScore ?? 0) >= filters.minTractionScore!
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagsLower = filters.tags.map(t => t.toLowerCase());
      projects = projects.filter(p => {
        const projectTags = (p.tags ?? []).map(t => t.toLowerCase());
        return tagsLower.some(t => projectTags.includes(t));
      });
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      projects = projects.filter(p => 
        p.location?.toLowerCase().includes(locationLower)
      );
    }

    // Sort by traction score
    projects.sort((a, b) => (b.tractionScore ?? 0) - (a.tractionScore ?? 0));

    // Enrich with owner data (limit to top 20)
    const enriched = await Promise.all(
      projects.slice(0, 20).map(async (project) => {
        const owner = await ctx.db.get(project.ownerId);
        return {
          ...project,
          owner: owner ? {
            _id: owner._id,
            username: owner.username,
            displayName: owner.displayName,
            avatarUrl: owner.avatarUrl,
          } : null,
        };
      })
    );

    return { results: enriched, total: projects.length };
  },
});

// Run filters directly (without saving)
export const runFilters = query({
  args: {
    filters: v.object({
      industries: v.optional(v.array(v.string())),
      stages: v.optional(v.array(v.string())),
      minFunding: v.optional(v.number()),
      maxFunding: v.optional(v.number()),
      minTractionScore: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      location: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { filters } = args;

    let projects = await ctx.db
      .query('projects')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    // Apply same filtering logic
    if (filters.industries && filters.industries.length > 0) {
      const industriesLower = filters.industries.map(i => i.toLowerCase());
      projects = projects.filter(p => 
        industriesLower.includes(p.industry.toLowerCase())
      );
    }

    if (filters.stages && filters.stages.length > 0) {
      projects = projects.filter(p => 
        p.stage && filters.stages!.includes(p.stage)
      );
    }

    if (filters.minFunding !== undefined) {
      projects = projects.filter(p => p.fundingGoal >= filters.minFunding!);
    }

    if (filters.maxFunding !== undefined) {
      projects = projects.filter(p => p.fundingGoal <= filters.maxFunding!);
    }

    if (filters.minTractionScore !== undefined) {
      projects = projects.filter(p => 
        (p.tractionScore ?? 0) >= filters.minTractionScore!
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagsLower = filters.tags.map(t => t.toLowerCase());
      projects = projects.filter(p => {
        const projectTags = (p.tags ?? []).map(t => t.toLowerCase());
        return tagsLower.some(t => projectTags.includes(t));
      });
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      projects = projects.filter(p => 
        p.location?.toLowerCase().includes(locationLower)
      );
    }

    projects.sort((a, b) => (b.tractionScore ?? 0) - (a.tractionScore ?? 0));

    const enriched = await Promise.all(
      projects.slice(0, 20).map(async (project) => {
        const owner = await ctx.db.get(project.ownerId);
        return {
          ...project,
          owner: owner ? {
            _id: owner._id,
            username: owner.username,
            displayName: owner.displayName,
            avatarUrl: owner.avatarUrl,
          } : null,
        };
      })
    );

    return { results: enriched, total: projects.length };
  },
});
