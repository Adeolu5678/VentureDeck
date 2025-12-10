import { v } from "convex/values";
import { query } from "./_generated/server";

export const getMatches = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "investor") {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Simple matching algorithm
    const scoredProjects = projects.map((project) => {
      let score = 0;
      const maxScore = 100;

      // 1. Tag Overlap (50%)
      if (user.tags && project.tags) {
        const userTags = new Set(user.tags.map(t => t.toLowerCase()));
        const projectTags = project.tags.map(t => t.toLowerCase());
        const matches = projectTags.filter(t => userTags.has(t)).length;
        if (matches > 0) {
          // Cap at 50 points for 3+ matches
          score += Math.min(50, matches * 20); 
        }
      }

      // 2. Investment Range Fit (30%)
      if (user.investmentRange) {
        if (project.fundingGoal >= user.investmentRange.min && project.fundingGoal <= user.investmentRange.max) {
          score += 30;
        } else if (project.fundingGoal < user.investmentRange.min) {
           // Too small, but maybe interesting
           score += 10;
        }
      }

      // 3. Industry Match (20%)
      // Assuming user might have industry in tags or we check against a user.industry field if it existed.
      // For now, let's assume if industry is in tags, it counts there.
      
      // Random "AI" noise for demo purposes if score is low but not zero
      if (score > 0) {
        score += Math.floor(Math.random() * 10);
      }

      return {
        ...project,
        matchScore: Math.min(maxScore, score),
      };
    });

    // Filter out low scores and sort by match score
    return scoredProjects
      .filter((p) => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // Top 10 matches
  },
});
