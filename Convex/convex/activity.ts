import { query, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';

// Activity types
const ACTIVITY_TYPES = v.union(
  v.literal('project_created'),
  v.literal('project_published'),
  v.literal('milestone_completed'),
  v.literal('milestone_verified'),
  v.literal('bounty_created'),
  v.literal('bounty_completed'),
  v.literal('application_received'),
  v.literal('application_accepted'),
  v.literal('soft_circle_committed'),
  v.literal('vouch_received'),
  v.literal('follower_added')
);

// Internal: Create activity entry
export const internalCreate = internalMutation({
  args: {
    userId: v.id('users'),
    type: ACTIVITY_TYPES,
    title: v.string(),
    description: v.optional(v.string()),
    projectId: v.optional(v.id('projects')),
    relatedUserId: v.optional(v.id('users')),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // We'll store activities in the notifications table with a special 'activity' type
    // For now, we can query recent activities from various sources
    // This is a placeholder for future activity tracking
  },
});

// Get recent activities for the current user (their projects, follows, etc.)
export const getMyActivities = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const limit = 20;
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: number;
      projectId?: Id<'projects'>;
      projectTitle?: string;
      icon: string;
      color: string;
    }> = [];

    // Get my projects
    const myProjects = await ctx.db
      .query('projects')
      .withIndex('by_owner', (q) => q.eq('ownerId', user._id))
      .collect();

    const projectIds = myProjects.map(p => p._id);

    // 1. Recent applications to my projects
    for (const projectId of projectIds) {
      const applications = await ctx.db
        .query('applications')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .order('desc')
        .take(5);
      
      for (const app of applications) {
        const applicant = await ctx.db.get(app.applicantId);
        const project = myProjects.find(p => p._id === projectId);
        activities.push({
          id: `app-${app._id}`,
          type: 'application',
          title: `${app.status === 'accepted' ? 'Accepted' : app.status === 'rejected' ? 'Rejected' : 'New'} application`,
          description: `${applicant?.displayName || applicant?.username || 'Someone'} applied to ${project?.title || 'your project'}`,
          timestamp: app.createdAt,
          projectId,
          projectTitle: project?.title,
          icon: app.status === 'accepted' ? 'UserCheck' : app.status === 'rejected' ? 'UserX' : 'UserPlus',
          color: app.status === 'accepted' ? 'emerald' : app.status === 'rejected' ? 'red' : 'blue',
        });
      }
    }

    // 2. Recent milestones completed on my projects
    for (const projectId of projectIds) {
      const milestones = await ctx.db
        .query('milestones')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .order('desc')
        .take(5);
      
      for (const milestone of milestones.filter(m => m.status !== 'pending')) {
        const project = myProjects.find(p => p._id === projectId);
        activities.push({
          id: `milestone-${milestone._id}`,
          type: 'milestone',
          title: milestone.status === 'verified' ? 'Milestone verified!' : 'Milestone completed',
          description: `"${milestone.title}" on ${project?.title}`,
          timestamp: milestone.createdAt,
          projectId,
          projectTitle: project?.title,
          icon: milestone.status === 'verified' ? 'ShieldCheck' : 'CheckCircle',
          color: milestone.status === 'verified' ? 'emerald' : 'primary',
        });
      }
    }

    // 3. Recent soft circles on my projects
    for (const projectId of projectIds) {
      const circles = await ctx.db
        .query('soft_circles')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .order('desc')
        .take(5);
      
      for (const circle of circles) {
        const investor = await ctx.db.get(circle.investorId);
        const project = myProjects.find(p => p._id === projectId);
        activities.push({
          id: `circle-${circle._id}`,
          type: 'soft_circle',
          title: 'New investor interest',
          description: `${investor?.displayName || investor?.username || 'An investor'} soft-circled $${circle.amount.toLocaleString()} on ${project?.title}`,
          timestamp: circle.createdAt,
          projectId,
          projectTitle: project?.title,
          icon: 'DollarSign',
          color: 'amber',
        });
      }
    }

    // 4. Recent followers on my projects
    for (const projectId of projectIds) {
      const followers = await ctx.db
        .query('project_followers')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .order('desc')
        .take(5);
      
      for (const follow of followers) {
        const follower = await ctx.db.get(follow.userId);
        const project = myProjects.find(p => p._id === projectId);
        activities.push({
          id: `follow-${follow._id}`,
          type: 'follower',
          title: 'New follower',
          description: `${follower?.displayName || follower?.username || 'Someone'} is now following ${project?.title}`,
          timestamp: follow.createdAt,
          projectId,
          projectTitle: project?.title,
          icon: 'Heart',
          color: 'pink',
        });
      }
    }

    // 5. Recent vouches received
    const vouches = await ctx.db
      .query('vouches')
      .filter((q) => q.eq(q.field('targetId'), user._id))
      .order('desc')
      .take(5);
    
    for (const vouch of vouches) {
      const voucher = await ctx.db.get(vouch.voucherId);
      activities.push({
        id: `vouch-${vouch._id}`,
        type: 'vouch',
        title: 'New vouch received!',
        description: `${voucher?.displayName || voucher?.username || 'Someone'} vouched for you`,
        timestamp: vouch.createdAt,
        icon: 'Award',
        color: 'purple',
      });
    }

    // 6. Recent bounty completions on my projects
    for (const projectId of projectIds) {
      const bounties = await ctx.db
        .query('bounties')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .order('desc')
        .take(5);
      
      for (const bounty of bounties.filter(b => b.status === 'completed' || b.status === 'paid')) {
        const assignee = bounty.assigneeId ? await ctx.db.get(bounty.assigneeId) : null;
        const project = myProjects.find(p => p._id === projectId);
        activities.push({
          id: `bounty-${bounty._id}`,
          type: 'bounty',
          title: bounty.status === 'paid' ? 'Bounty paid' : 'Bounty completed',
          description: `"${bounty.title}" completed by ${assignee?.displayName || assignee?.username || 'someone'}`,
          timestamp: bounty.createdAt,
          projectId,
          projectTitle: project?.title,
          icon: bounty.status === 'paid' ? 'Banknote' : 'Target',
          color: bounty.status === 'paid' ? 'green' : 'blue',
        });
      }
    }

    // Sort by timestamp and limit
    activities.sort((a, b) => b.timestamp - a.timestamp);
    return activities.slice(0, limit);
  },
});

// Get platform-wide recent activity (for investors)
export const getDiscoverActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const limit = 15;
    const activities: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: number;
      projectId?: Id<'projects'>;
      projectTitle?: string;
      icon: string;
      color: string;
    }> = [];

    // Get projects the user is following
    const following = await ctx.db
      .query('project_followers')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();
    
    const followedProjectIds = following.map(f => f.projectId);

    // Get milestones from followed projects
    for (const projectId of followedProjectIds.slice(0, 10)) {
      const milestones = await ctx.db
        .query('milestones')
        .withIndex('by_project', (q) => q.eq('projectId', projectId))
        .order('desc')
        .take(3);
      
      const project = await ctx.db.get(projectId);
      for (const milestone of milestones.filter(m => m.status !== 'pending')) {
        activities.push({
          id: `milestone-${milestone._id}`,
          type: 'milestone',
          title: milestone.status === 'verified' ? 'Milestone verified!' : 'Milestone completed',
          description: `${project?.title} completed "${milestone.title}"`,
          timestamp: milestone.createdAt,
          projectId,
          projectTitle: project?.title,
          icon: milestone.status === 'verified' ? 'ShieldCheck' : 'CheckCircle',
          color: milestone.status === 'verified' ? 'emerald' : 'primary',
        });
      }
    }

    // Get recently published projects
    const recentProjects = await ctx.db
      .query('projects')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .order('desc')
      .take(10);
    
    for (const project of recentProjects) {
      const owner = await ctx.db.get(project.ownerId);
      activities.push({
        id: `project-${project._id}`,
        type: 'project',
        title: 'New project launched',
        description: `${project.title} by ${owner?.displayName || owner?.username}`,
        timestamp: project.createdAt,
        projectId: project._id,
        projectTitle: project.title,
        icon: 'Rocket',
        color: 'accent',
      });
    }

    // Sort and limit
    activities.sort((a, b) => b.timestamp - a.timestamp);
    return activities.slice(0, limit);
  },
});
