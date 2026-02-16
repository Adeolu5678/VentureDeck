import { mutation, query } from './_generated/server';
import { ensureUserExists } from './users';
import { v } from 'convex/values';

// Create a new project and its associated workspace
export const create = mutation({
  args: {
    title: v.string(),
    tagline: v.string(),
    description: v.string(),
    industry: v.string(),
    fundingGoal: v.number(),
    equityOffered: v.number(),
    logoUrl: v.optional(v.string()),
    pitchDeckUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called create project without authentication present');
    }

    // Ensure user exists (JIT creation)
    const userId = await ensureUserExists(ctx, identity);

    // Create the project
    const projectId = await ctx.db.insert('projects', {
      ownerId: userId,
      title: args.title,
      tagline: args.tagline,
      description: args.description,
      industry: args.industry,
      fundingGoal: args.fundingGoal,
      equityOffered: args.equityOffered,
      status: 'published', // Auto-publish for MVP
      logoUrl: args.logoUrl,
      pitchDeckUrl: args.pitchDeckUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create the associated workspace
    const workspaceId = await ctx.db.insert('workspaces', {
      projectId: projectId,
      name: args.title, // Workspace name defaults to Project Title
      members: [userId], // Owner is the first member
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Link the workspace back to the project
    await ctx.db.patch(projectId, { workspaceId });

    // Create default 'General' chatroom
    await ctx.db.insert('conversations', {
      workspaceId,
      type: 'workspace_general',
      name: 'General',
      visibility: 'public',
      participantIds: [userId],
      creatorId: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

// Update an existing project
export const update = mutation({
  args: {
    id: v.id('projects'),
    title: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    industry: v.optional(v.string()),
    fundingGoal: v.optional(v.number()),
    equityOffered: v.optional(v.number()),
    logoUrl: v.optional(v.string()),
    pitchDeckUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal('draft'), v.literal('published'), v.literal('funded'), v.literal('closed'))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const project = await ctx.db.get(args.id);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.tagline !== undefined ? { tagline: args.tagline } : {}),
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.industry !== undefined ? { industry: args.industry } : {}),
      ...(args.fundingGoal !== undefined ? { fundingGoal: args.fundingGoal } : {}),
      ...(args.equityOffered !== undefined ? { equityOffered: args.equityOffered } : {}),
      ...(args.logoUrl !== undefined ? { logoUrl: args.logoUrl } : {}),
      ...(args.pitchDeckUrl !== undefined ? { pitchDeckUrl: args.pitchDeckUrl } : {}),
      ...(args.status !== undefined ? { status: args.status } : {}),
      updatedAt: Date.now(),
    });
  },
});

// List projects for the discovery feed with pagination and search
export const list = query({
  args: {
    industry: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const offset = args.offset ?? 0;
    
    let projects;
    
    // Use search index if search term is provided
    if (args.search && args.search.trim().length > 0) {
      // Use the search index for efficient text search
      const searchResults = await ctx.db
        .query('projects')
        .withSearchIndex('search_projects', (q) => {
          let query = q.search('title', args.search!);
          // Apply status filter
          query = query.eq('status', 'published');
          // Apply industry filter if provided
          if (args.industry) {
            query = query.eq('industry', args.industry);
          }
          return query;
        })
        .take(limit + offset);
      
      projects = searchResults;
    } else if (args.industry) {
      // Use compound index for industry + status filter
      projects = await ctx.db
        .query('projects')
        .withIndex('by_industry_status', (q) => q.eq('industry', args.industry!).eq('status', 'published'))
        .collect();
    } else {
      // Default: all published projects
      projects = await ctx.db
        .query('projects')
        .withIndex('by_status', (q) => q.eq('status', 'published'))
        .collect();
    }

    // Sort by newest first (if not using search index which already may have relevance sorting)
    if (!args.search) {
      projects.sort((a, b) => b.createdAt - a.createdAt);
    }

    // Apply pagination
    const paginatedProjects = projects.slice(offset, offset + limit);

    return {
      projects: paginatedProjects,
      total: projects.length,
      hasMore: offset + limit < projects.length,
    };
  },
});

// Get a single project by ID
export const get = query({
  args: { id: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;

    // Allow access if project is published
    if (project.status === 'published') {
      return project;
    }

    // For non-published projects, require authentication and ownership
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    if (project.ownerId !== user._id) {
      throw new Error('Unauthorized');
    }

    return project;
  },
});

// Get projects owned by the current user
export const getMyProjects = query({
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
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', user._id))
      .collect();
  },
});

// Get projects owned by a specific user (public profile)
export const getUserProjects = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', args.userId))
      .collect();
  },
});

// Get projects where the current user is a member (but not the owner)
export const getProjectsIAmMemberOf = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const myWorkspaces = await ctx.db
      .query('workspaces')
      .withIndex('by_member', (q) => q.eq('members', user._id as any))
      .collect();

    if (myWorkspaces.length === 0) return [];

    const projectIds = [...new Set(myWorkspaces.filter(w => w.projectId).map(w => w.projectId!))];
    const projects = await Promise.all(projectIds.map(id => ctx.db.get(id)));
    
    return projects.filter((project): project is NonNullable<typeof project> => 
      project !== null && project.ownerId !== user._id
    );
  },
});

