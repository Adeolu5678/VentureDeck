import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';

/**
 * Project Analytics Module
 * 
 * Tracks project views and generates daily snapshots for founder dashboards.
 */

// Track a project view
export const trackView = mutation({
  args: { 
    projectId: v.id('projects'),
    fingerprint: v.optional(v.string()), // For unique view counting
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let userId: Id<'users'> | undefined;
    if (identity) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .unique();
      userId = user?._id;
    }

    await ctx.db.insert('projectViews', {
      projectId: args.projectId,
      viewerId: userId,
      viewerFingerprint: args.fingerprint,
      createdAt: Date.now(),
    });

    return { tracked: true };
  },
});

// Get analytics for a project (for founder dashboard)
export const getProjectAnalytics = query({
  args: { 
    projectId: v.id('projects'),
    days: v.optional(v.number()), // Number of days to look back
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return null;

    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    // Only owner can view analytics
    if (project.ownerId !== user._id && !user.isAdmin) {
      return null;
    }

    const daysBack = args.days ?? 30;
    const startDate = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

    // Get daily snapshots
    const snapshots = await ctx.db
      .query('projectAnalytics')
      .withIndex('by_project_date', (q) => 
        q.eq('projectId', args.projectId).gte('date', startDate)
      )
      .collect();

    // Get real-time stats
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);

    // Today's views
    const todayViews = await ctx.db
      .query('projectViews')
      .withIndex('by_project_date', (q) => 
        q.eq('projectId', args.projectId).gte('createdAt', todayStart)
      )
      .collect();

    // Current followers
    const followers = await ctx.db
      .query('project_followers')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    // Current soft circles
    const softCircles = await ctx.db
      .query('soft_circles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const activeCircles = softCircles.filter(c => c.status !== 'withdrawn');
    const totalCommitted = activeCircles.reduce((sum, c) => sum + c.amount, 0);

    // Current applications
    const applications = await ctx.db
      .query('applications')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    return {
      snapshots: snapshots.sort((a, b) => a.date - b.date),
      realtime: {
        todayViews: todayViews.length,
        todayUniqueViews: new Set(todayViews.map(v => v.viewerFingerprint || v.viewerId || 'anon')).size,
        totalFollowers: followers.length,
        totalSoftCircle: totalCommitted,
        softCircleCount: activeCircles.length,
        applicationCount: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        tractionScore: project.tractionScore ?? 0,
      },
    };
  },
});

// Internal: Create daily snapshot (called by scheduled function)
export const createDailySnapshot = internalMutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    const todayStart = new Date().setHours(0, 0, 0, 0);

    // Check if snapshot already exists for today
    const existing = await ctx.db
      .query('projectAnalytics')
      .withIndex('by_project_date', (q) => 
        q.eq('projectId', args.projectId).eq('date', todayStart)
      )
      .first();

    if (existing) {
      return { alreadyExists: true };
    }

    // Calculate today's metrics
    const yesterdayStart = todayStart - (24 * 60 * 60 * 1000);

    const views = await ctx.db
      .query('projectViews')
      .withIndex('by_project_date', (q) => 
        q.eq('projectId', args.projectId)
          .gte('createdAt', yesterdayStart)
          .lt('createdAt', todayStart)
      )
      .collect();

    const followers = await ctx.db
      .query('project_followers')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const softCircles = await ctx.db
      .query('soft_circles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    const activeCircles = softCircles.filter(c => c.status !== 'withdrawn');
    const totalCommitted = activeCircles.reduce((sum, c) => sum + c.amount, 0);

    const applications = await ctx.db
      .query('applications')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();

    await ctx.db.insert('projectAnalytics', {
      projectId: args.projectId,
      date: todayStart,
      views: views.length,
      uniqueViews: new Set(views.map(v => v.viewerFingerprint || v.viewerId || 'anon')).size,
      followerCount: followers.length,
      softCircleTotal: totalCommitted,
      softCircleCount: activeCircles.length,
      applicationCount: applications.length,
      tractionScore: project.tractionScore ?? 0,
    });

    return { created: true };
  },
});

// Internal: Run daily analytics for all projects
export const runDailyAnalytics = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    for (const project of projects) {
      await ctx.scheduler.runAfter(0, internal.analytics.createDailySnapshot, {
        projectId: project._id,
      });
    }

    return { projectsProcessed: projects.length };
  },
});

// Get view trends (for charts)
export const getViewTrends = query({
  args: { 
    projectId: v.id('projects'),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project) return [];

    if (project.ownerId !== user._id && !user.isAdmin) {
      return [];
    }

    const daysBack = args.days ?? 14;
    const startDate = Date.now() - (daysBack * 24 * 60 * 60 * 1000);

    const snapshots = await ctx.db
      .query('projectAnalytics')
      .withIndex('by_project_date', (q) => 
        q.eq('projectId', args.projectId).gte('date', startDate)
      )
      .collect();

    return snapshots
      .sort((a, b) => a.date - b.date)
      .map(s => ({
        date: s.date,
        views: s.views,
        uniqueViews: s.uniqueViews,
        followers: s.followerCount,
        softCircle: s.softCircleTotal,
      }));
  },
});
