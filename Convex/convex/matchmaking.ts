import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Enhanced Matchmaking Algorithm v2
 * 
 * Now includes:
 * - Geographic preference matching
 * - Stage-based filtering (seed, series-a, etc.)
 * - Uses pre-calculated traction scores
 * - Returns match explanations for UI
 */

interface MatchExplanation {
  category: string;
  matched: boolean;
  reason: string;
  score: number;
  maxScore: number;
}

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

    const thesis = user.investorThesis;
    const investmentRange = user.investmentRange;

    const scoredProjects = await Promise.all(projects.map(async (project) => {
      let score = 0;
      const maxScore = 100;
      const explanations: MatchExplanation[] = [];

      // 1. Industry Match (20%)
      const industryMaxScore = 20;
      let industryScore = 0;
      let industryReason = "";
      
      if (thesis?.preferredIndustries && thesis.preferredIndustries.length > 0) {
        const preferred = thesis.preferredIndustries.map(i => i.toLowerCase());
        if (preferred.includes(project.industry.toLowerCase())) {
          industryScore = industryMaxScore;
          industryReason = `Matches your preferred industry: ${project.industry}`;
        } else {
          const projectTags = (project.tags || []).map(t => t.toLowerCase());
          const industryInTags = preferred.some(ind => projectTags.includes(ind));
          if (industryInTags) {
            industryScore = 12;
            industryReason = `Related to your interests via tags`;
          } else {
            industryReason = `Not in your preferred industries`;
          }
        }
      } else {
        industryScore = 10;
        industryReason = `No industry preference set`;
      }
      score += industryScore;
      explanations.push({
        category: "Industry",
        matched: industryScore >= 15,
        reason: industryReason,
        score: industryScore,
        maxScore: industryMaxScore,
      });

      // 2. Investment Range (20%)
      const rangeMaxScore = 20;
      let rangeScore = 0;
      let rangeReason = "";
      
      if (investmentRange) {
        if (project.fundingGoal >= investmentRange.min && project.fundingGoal <= investmentRange.max) {
          rangeScore = rangeMaxScore;
          rangeReason = `$${(project.fundingGoal / 1000).toFixed(0)}K fits your range`;
        } else if (project.fundingGoal < investmentRange.min && project.fundingGoal >= investmentRange.min * 0.5) {
          rangeScore = 12;
          rangeReason = `Slightly below your minimum`;
        } else if (project.fundingGoal > investmentRange.max && project.fundingGoal <= investmentRange.max * 1.5) {
          rangeScore = 8;
          rangeReason = `Above your maximum`;
        } else {
          rangeReason = `Outside your investment range`;
        }
      } else {
        rangeScore = 10;
        rangeReason = `No investment range set`;
      }
      score += rangeScore;
      explanations.push({
        category: "Investment Size",
        matched: rangeScore >= 15,
        reason: rangeReason,
        score: rangeScore,
        maxScore: rangeMaxScore,
      });

      // 3. Stage Match (15%) - NEW
      const stageMaxScore = 15;
      let stageScore = 0;
      let stageReason = "";
      
      if (thesis?.preferredStages && thesis.preferredStages.length > 0 && project.stage) {
        if (thesis.preferredStages.includes(project.stage)) {
          stageScore = stageMaxScore;
          stageReason = `${project.stage} stage matches your preference`;
        } else {
          stageReason = `${project.stage} not in your preferred stages`;
        }
      } else if (project.stage) {
        stageScore = 8;
        stageReason = `No stage preference set`;
      } else {
        stageScore = 5;
        stageReason = `Project stage not specified`;
      }
      score += stageScore;
      explanations.push({
        category: "Stage",
        matched: stageScore >= 10,
        reason: stageReason,
        score: stageScore,
        maxScore: stageMaxScore,
      });

      // 4. Geographic Match (10%) - NEW
      const geoMaxScore = 10;
      let geoScore = 0;
      let geoReason = "";
      
      if (thesis?.geographicPreference && project.location) {
        const prefLoc = thesis.geographicPreference.toLowerCase();
        const projLoc = project.location.toLowerCase();
        if (projLoc.includes(prefLoc) || prefLoc.includes(projLoc) || prefLoc === "global") {
          geoScore = geoMaxScore;
          geoReason = `Located in ${project.location}`;
        } else {
          geoScore = 3;
          geoReason = `Located in ${project.location}, you prefer ${thesis.geographicPreference}`;
        }
      } else {
        geoScore = 5;
        geoReason = thesis?.geographicPreference ? `Project location not specified` : `No location preference set`;
      }
      score += geoScore;
      explanations.push({
        category: "Location",
        matched: geoScore >= 7,
        reason: geoReason,
        score: geoScore,
        maxScore: geoMaxScore,
      });

      // 5. Traction Score (20%) - Now uses pre-calculated score
      const tractionMaxScore = 20;
      let tractionScore = 0;
      const projectTractionScore = project.tractionScore ?? 0;
      
      if (thesis?.minTractionScore !== undefined) {
        if (projectTractionScore >= thesis.minTractionScore) {
          tractionScore = tractionMaxScore;
        } else if (projectTractionScore >= thesis.minTractionScore * 0.7) {
          tractionScore = 12;
        } else {
          tractionScore = 5;
        }
      } else {
        // Scale based on absolute traction score
        tractionScore = Math.min(tractionMaxScore, Math.floor(projectTractionScore / 5));
      }
      score += tractionScore;
      explanations.push({
        category: "Traction",
        matched: tractionScore >= 15,
        reason: `Traction score: ${projectTractionScore}/100`,
        score: tractionScore,
        maxScore: tractionMaxScore,
      });

      // 6. Tag/Interest Overlap (15%)
      const tagMaxScore = 15;
      let tagScore = 0;
      let tagReason = "";
      
      const userInterests = user.interests || user.tags || [];
      if (userInterests.length > 0 && project.tags && project.tags.length > 0) {
        const userTags = new Set(userInterests.map(t => t.toLowerCase()));
        const projectTags = project.tags.map(t => t.toLowerCase());
        const matchedTags = projectTags.filter(t => userTags.has(t));
        if (matchedTags.length > 0) {
          tagScore = Math.min(tagMaxScore, matchedTags.length * 6);
          tagReason = `${matchedTags.length} matching tags`;
        } else {
          tagReason = `No matching tags`;
        }
      } else {
        tagScore = 3;
        tagReason = userInterests.length === 0 ? `Set your interests for better matches` : `Project has no tags`;
      }
      score += tagScore;
      explanations.push({
        category: "Interests",
        matched: tagScore >= 10,
        reason: tagReason,
        score: tagScore,
        maxScore: tagMaxScore,
      });

      // Fetch owner data
      const owner = await ctx.db.get(project.ownerId);

      return {
        ...project,
        matchScore: Math.min(maxScore, score),
        tractionScore: projectTractionScore,
        explanations,
        owner: owner ? {
          _id: owner._id,
          username: owner.username,
          displayName: owner.displayName,
          avatarUrl: owner.avatarUrl,
          isVerified: owner.isVerified,
        } : null,
      };
    }));

    // Filter low scores and sort
    return scoredProjects
      .filter((p) => p.matchScore >= 20)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);
  },
});

// Get match explanation for a specific project
export const getMatchExplanation = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) return null;

    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    const thesis = user.investorThesis;
    const investmentRange = user.investmentRange;

    const explanations: MatchExplanation[] = [];

    // Industry
    let industryMatched = false;
    if (thesis?.preferredIndustries && thesis.preferredIndustries.length > 0) {
      industryMatched = thesis.preferredIndustries
        .map(i => i.toLowerCase())
        .includes(project.industry.toLowerCase());
    }
    explanations.push({
      category: "Industry",
      matched: industryMatched,
      reason: industryMatched 
        ? `${project.industry} is in your preferred industries`
        : thesis?.preferredIndustries?.length 
          ? `${project.industry} is not in your preferred industries`
          : `You haven't set industry preferences`,
      score: industryMatched ? 20 : 0,
      maxScore: 20,
    });

    // Investment Range
    let rangeMatched = false;
    if (investmentRange) {
      rangeMatched = project.fundingGoal >= investmentRange.min && 
                     project.fundingGoal <= investmentRange.max;
    }
    explanations.push({
      category: "Investment Size",
      matched: rangeMatched,
      reason: rangeMatched
        ? `$${project.fundingGoal.toLocaleString()} is within your range`
        : investmentRange
          ? `$${project.fundingGoal.toLocaleString()} is outside your $${investmentRange.min.toLocaleString()} - $${investmentRange.max.toLocaleString()} range`
          : `You haven't set an investment range`,
      score: rangeMatched ? 20 : 0,
      maxScore: 20,
    });

    // Stage
    let stageMatched = false;
    if (thesis?.preferredStages && thesis.preferredStages.length > 0 && project.stage) {
      stageMatched = thesis.preferredStages.includes(project.stage);
    }
    explanations.push({
      category: "Stage",
      matched: stageMatched,
      reason: stageMatched
        ? `${project.stage} matches your stage preferences`
        : project.stage
          ? `${project.stage} is not in your preferred stages`
          : `Project hasn't specified their stage`,
      score: stageMatched ? 15 : 0,
      maxScore: 15,
    });

    // Geographic
    let geoMatched = false;
    if (thesis?.geographicPreference && project.location) {
      const pref = thesis.geographicPreference.toLowerCase();
      geoMatched = project.location.toLowerCase().includes(pref) || pref === "global";
    }
    explanations.push({
      category: "Location",
      matched: geoMatched,
      reason: geoMatched
        ? `${project.location} matches your geographic preference`
        : project.location
          ? `${project.location} doesn't match your ${thesis?.geographicPreference || 'unset'} preference`
          : `Project hasn't specified their location`,
      score: geoMatched ? 10 : 0,
      maxScore: 10,
    });

    // Traction
    const tractionScore = project.tractionScore ?? 0;
    const minTraction = thesis?.minTractionScore ?? 0;
    const tractionMatched = tractionScore >= minTraction;
    explanations.push({
      category: "Traction",
      matched: tractionMatched,
      reason: `Project has ${tractionScore}/100 traction score${minTraction > 0 ? `, your minimum is ${minTraction}` : ''}`,
      score: Math.min(20, Math.floor(tractionScore / 5)),
      maxScore: 20,
    });

    const totalScore = explanations.reduce((sum, e) => sum + e.score, 0);
    const maxTotal = explanations.reduce((sum, e) => sum + e.maxScore, 0);

    return {
      projectId: args.projectId,
      totalScore,
      maxScore: maxTotal,
      percentage: Math.round((totalScore / maxTotal) * 100),
      explanations,
    };
  },
});

