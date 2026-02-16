import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { enforceRateLimit } from './rateLimits';

// Apply to a project
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    role: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      throw new Error('User not found');
    }

    await enforceRateLimit(ctx.db, user._id, 'applications');

    // Check if already applied
    const existingApp = await ctx.db
      .query('applications')
      .withIndex('by_applicant', (q) => q.eq('applicantId', user._id))
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .first();

    let applicationId;

    if (existingApp) {
      if (existingApp.status === 'rejected') {
        // Re-apply: Update existing application
        await ctx.db.patch(existingApp._id, {
          role: args.role,
          message: args.message,
          status: 'pending',
          updatedAt: Date.now(),
        });
        applicationId = existingApp._id;
      } else {
        throw new Error('You have already applied to this project');
      }
    } else {
      // New application
      applicationId = await ctx.db.insert('applications', {
        applicantId: user._id,
        projectId: args.projectId,
        role: args.role,
        message: args.message,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Notify Project Owner
    const project = await ctx.db.get(args.projectId);
    if (project) {
      await ctx.db.insert('notifications', {
        userId: project.ownerId,
        type: 'application_received',
        title: 'New Application Received',
        message: `${user.firstName || user.username} applied for ${args.role} in ${project.title}`,
        link: `/workspaces/${project.workspaceId}`, // Redirect to workspace applications view
        read: false,
        createdAt: Date.now(),
      });
    }

    return applicationId;
  },
});

// Check if I have applied to a specific project
export const getMyApplicationStatus = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
    
    if (!user) return null;

    const existingApp = await ctx.db
      .query('applications')
      .withIndex('by_applicant', (q) => q.eq('applicantId', user._id))
      .filter((q) => q.eq(q.field('projectId'), args.projectId))
      .first();

    return existingApp;
  },
});

// Get applications for a project (for Project Owner)
export const listByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Verify ownership
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
    
    if (!user) return [];

    const project = await ctx.db.get(args.projectId);
    if (!project || project.ownerId !== user._id) {
      // Only owner can see applications
      return [];
    }

    return await ctx.db
      .query('applications')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Get my applications (for Entrepreneur)
export const getMyApplications = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
    
    if (!user) return [];

    const applications = await ctx.db
      .query('applications')
      .withIndex('by_applicant', (q) => q.eq('applicantId', user._id))
      .collect();

    if (applications.length === 0) return [];

    const projectIds = [...new Set(applications.map(app => app.projectId))];
    const projects = await Promise.all(projectIds.map(id => ctx.db.get(id)));
    const projectMap = new Map(projects.filter(Boolean).map(p => [p!._id, p!]));

    return applications.map(app => ({
      ...app,
      project: projectMap.get(app.projectId),
    }));
  },
});

// Accept an application
export const accept = mutation({
  args: { applicationId: v.id('applications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error('Application not found');

    const project = await ctx.db.get(application.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.applicationId, {
      status: 'accepted',
      updatedAt: Date.now(),
    });

    // Add to workspace members and roles
    const workspace = await ctx.db.get(project.workspaceId!);
    if (workspace) {
      if (!workspace.members.includes(application.applicantId)) {
        await ctx.db.patch(workspace._id, {
          members: [...workspace.members, application.applicantId],
          roles: [...(workspace.roles || []), { userId: application.applicantId, role: application.role }],
        });
      }
    }

    // Notify Applicant
    await ctx.db.insert('notifications', {
      userId: application.applicantId,
      type: 'application_accepted',
      title: 'Application Accepted!',
      message: `You have been accepted as ${application.role} in ${project.title}.`,
      link: `/workspaces/${project.workspaceId}`,
      read: false,
      createdAt: Date.now(),
    });

    // Close interview conversation if exists
    const interviewConv = await ctx.db
      .query('conversations')
      .withIndex('by_application', q => q.eq('applicationId', args.applicationId))
      .first();
    
    if (interviewConv) {
      await ctx.db.patch(interviewConv._id, {
        isClosed: true,
        updatedAt: Date.now(),
      });
    }



    return args.applicationId;
  },
});

// Start an interview
export const interview = mutation({
  args: { applicationId: v.id('applications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error('Application not found');

    const project = await ctx.db.get(application.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.applicationId, {
      status: 'interviewing',
      updatedAt: Date.now(),
    });

    // Create or get interview conversation
    const existingConv = await ctx.db
      .query('conversations')
      .withIndex('by_application', q => q.eq('applicationId', args.applicationId))
      .first();

    let conversationId = existingConv?._id;

    if (existingConv) {
      // Re-open if closed
      if (existingConv.isClosed) {
        await ctx.db.patch(existingConv._id, {
          isClosed: false,
          updatedAt: Date.now(),
        });
      }
    } else {
        conversationId = await ctx.db.insert('conversations', {
            participantIds: [project.ownerId, application.applicantId],
            type: 'interview',
            workspaceId: project.workspaceId,
            projectId: project._id, // Ensure projectId is set for context
            applicationId: args.applicationId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }

    return conversationId;
  },
});

// Reject an application
export const reject = mutation({
  args: { applicationId: v.id('applications') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error('Application not found');

    const project = await ctx.db.get(application.projectId);
    if (!project) throw new Error('Project not found');

    if (project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.applicationId, {
      status: 'rejected',
      updatedAt: Date.now(),
    });

    // Notify Applicant
    await ctx.db.insert('notifications', {
      userId: application.applicantId,
      type: 'application_rejected',
      title: 'Application Rejected',
      message: `Your application for ${application.role} in ${project.title} was rejected.`,
      link: `/projects/${project._id}`,
      read: false,
      createdAt: Date.now(),
    });

        // Close interview conversation if exists
    const interviewConv = await ctx.db
      .query('conversations')
      .withIndex('by_application', q => q.eq('applicationId', args.applicationId))
      .first();
    
    if (interviewConv) {
      await ctx.db.patch(interviewConv._id, {
        isClosed: true,
        updatedAt: Date.now(),
      });
    }

    return args.applicationId;
  },
});
