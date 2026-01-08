import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';

/**
 * AI Deal Scoring Engine
 * 
 * Calculates a traction score (0-100) for projects based on:
 * - Milestones completed/verified (25% weight)
 * - Soft circle momentum (20% weight)
 * - Follower growth (15% weight)
 * - Application activity (10% weight)
 * - Team completeness (10% weight)
 * - Pitch deck uploaded (10% weight)
 * - Legal docs in place (10% weight)
 */

// Calculate score for a single project
export const calculateProjectScore = internalMutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    const scoreBreakdown = {
      milestones: 0,
      softCircles: 0,
      followers: 0,
      applications: 0,
      teamCompleteness: 0,
      pitchDeck: 0,
      legalDocs: 0,
    };

    // 1. Milestones (25 points max)
    const milestones = await ctx.db
      .query('milestones')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    if (milestones.length > 0) {
      const completed = milestones.filter(m => m.status === 'completed').length;
      const verified = milestones.filter(m => m.status === 'verified').length;
      const total = milestones.length;
      
      // Base points for completion rate
      const completionRate = (completed + verified) / total;
      scoreBreakdown.milestones = Math.round(completionRate * 20);
      
      // Bonus for verified milestones (extra 5 points max)
      const verifiedBonus = Math.min(5, Math.round((verified / Math.max(1, total)) * 5));
      scoreBreakdown.milestones += verifiedBonus;
    }

    // 2. Soft Circles (20 points max)
    const softCircles = await ctx.db
      .query('soft_circles')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    const activeCircles = softCircles.filter(c => c.status !== 'withdrawn');
    const totalCommitted = activeCircles.reduce((sum, c) => sum + c.amount, 0);
    const fundingProgress = project.fundingGoal > 0 
      ? Math.min(1, totalCommitted / project.fundingGoal) 
      : 0;
    
    // Points based on funding progress
    scoreBreakdown.softCircles = Math.round(fundingProgress * 15);
    
    // Bonus for committed (not just interested) investors
    const committedCount = activeCircles.filter(c => c.status === 'committed').length;
    scoreBreakdown.softCircles += Math.min(5, committedCount);

    // 3. Followers (15 points max)
    const followers = await ctx.db
      .query('project_followers')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    // Tiered scoring: 1 point per 2 followers, max 15
    scoreBreakdown.followers = Math.min(15, Math.floor(followers.length / 2));

    // 4. Applications (10 points max)
    const applications = await ctx.db
      .query('applications')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    const acceptedApps = applications.filter(a => a.status === 'accepted').length;
    const pendingApps = applications.filter(a => a.status === 'pending').length;
    
    // Points for having applications shows interest
    scoreBreakdown.applications = Math.min(5, pendingApps);
    // Bonus for accepted applications (team growth)
    scoreBreakdown.applications += Math.min(5, acceptedApps * 2);

    // 5. Team Completeness (10 points max)
    const workspace = project.workspaceId 
      ? await ctx.db.get(project.workspaceId) 
      : null;
    
    if (workspace) {
      const teamSize = workspace.members.length;
      // Solo founder = 2 pts, 2-3 team = 6 pts, 4+ team = 10 pts
      if (teamSize >= 4) {
        scoreBreakdown.teamCompleteness = 10;
      } else if (teamSize >= 2) {
        scoreBreakdown.teamCompleteness = 6;
      } else {
        scoreBreakdown.teamCompleteness = 2;
      }
    }

    // 6. Pitch Deck (10 points max)
    if (project.pitchDeckUrl) {
      scoreBreakdown.pitchDeck = 10;
    }

    // 7. Legal Docs (10 points max)
    const legalDocs = await ctx.db
      .query('legalDocs')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
    
    if (legalDocs.length > 0) {
      const signedDocs = legalDocs.filter(d => d.status === 'signed').length;
      scoreBreakdown.legalDocs = Math.min(10, signedDocs * 5 + (legalDocs.length - signedDocs) * 2);
    }

    // Calculate total score
    const totalScore = Object.values(scoreBreakdown).reduce((a, b) => a + b, 0);

    // Update the project
    await ctx.db.patch(args.projectId, {
      tractionScore: totalScore,
      scoreBreakdown,
      scoreLastUpdated: Date.now(),
    });

    return { projectId: args.projectId, score: totalScore, breakdown: scoreBreakdown };
  },
});

// Recalculate scores for all published projects (scheduled function)
export const recalculateAllScores = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    const results = [];
    for (const project of projects) {
      // Schedule individual score calculation to avoid timeout
      await ctx.scheduler.runAfter(0, internal.scoring.calculateProjectScore, {
        projectId: project._id,
      });
      results.push(project._id);
    }

    return { projectsQueued: results.length };
  },
});

// Query: Get score breakdown for a project
export const getScoreBreakdown = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    return {
      score: project.tractionScore ?? 0,
      breakdown: project.scoreBreakdown ?? {
        milestones: 0,
        softCircles: 0,
        followers: 0,
        applications: 0,
        teamCompleteness: 0,
        pitchDeck: 0,
        legalDocs: 0,
      },
      lastUpdated: project.scoreLastUpdated,
    };
  },
});

// Mutation: Manually trigger score recalculation for a project
export const refreshScore = mutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    // Verify owner or admin
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');
    if (project.ownerId !== user._id && !user.isAdmin) {
      throw new Error('Not authorized to refresh this project\'s score');
    }

    // Schedule immediate recalculation
    await ctx.scheduler.runAfter(0, internal.scoring.calculateProjectScore, {
      projectId: args.projectId,
    });

    return { scheduled: true };
  },
});

// Helper: Get projects sorted by traction score
export const getTopProjects = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(50, Math.max(1, args?.limit ?? 10));
    
    const projects = await ctx.db
      .query('projects')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    // Sort by traction score (descending)
    const sorted = projects
      .map(p => ({ ...p, tractionScore: p.tractionScore ?? 0 }))
      .sort((a, b) => b.tractionScore - a.tractionScore)
      .slice(0, limit);

    // Enrich with owner data
    return Promise.all(sorted.map(async (project) => {
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
    }));
  },
});
