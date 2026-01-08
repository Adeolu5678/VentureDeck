import { query } from './_generated/server';

// Public stats for landing page - no auth required
export const getPublicStats = query({
  args: {},
  handler: async (ctx) => {
    const [users, projects, commitments, milestones] = await Promise.all([
      ctx.db.query('users').collect(),
      ctx.db.query('projects').withIndex('by_status', (q) => q.eq('status', 'published')).collect(),
      ctx.db.query('soft_circles').collect(),
      ctx.db.query('milestones').collect(),
    ]);

    const entrepreneurs = users.filter(u => u.role === 'entrepreneur').length;
    const investors = users.filter(u => u.role === 'investor').length;
    const totalCommitted = commitments.reduce((sum, c) => sum + c.amount, 0);
    const completedMilestones = milestones.filter(m => m.status !== 'pending').length;

    return {
      entrepreneurs,
      investors,
      publishedProjects: projects.length,
      totalCommitted,
      completedMilestones,
      totalMilestones: milestones.length,
    };
  },
});
