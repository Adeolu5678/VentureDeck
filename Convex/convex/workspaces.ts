
import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const get = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      return null;
    }

    if (!workspace.members.includes(user._id)) {
      throw new Error('Not authorized');
    }

    return workspace;
  },
});

export const getByProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const workspace = await ctx.db
      .query('workspaces')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .unique();

    if (!workspace) {
      return null;
    }

    if (!workspace.members.includes(user._id)) {
      throw new Error('Not authorized');
    }

    return workspace;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    const allWorkspaces = await ctx.db.query('workspaces').collect();
    
    // Filter in memory since we don't have an index on members array
    return allWorkspaces.filter(w => w.members.includes(user._id));
  },
});

export const updateRole = mutation({
  args: { 
    workspaceId: v.id('workspaces'),
    userId: v.id('users'),
    role: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Only owner can update roles (assuming first member is owner for now, or check project owner)
    // Better to check project owner
    const project = await ctx.db.get(workspace.projectId);
    if (!project || project.ownerId !== user._id) {
       throw new Error('Not authorized');
    }

    const currentRoles = workspace.roles || [];
    const otherRoles = currentRoles.filter(r => r.userId !== args.userId);
    
    await ctx.db.patch(args.workspaceId, {
      roles: [...otherRoles, { userId: args.userId, role: args.role }]
    });
  },
});

export const getPublicInfoByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    if (!workspace) return null;

    return {
      _id: workspace._id,
      members: workspace.members,
      roles: workspace.roles,
    };
  },
});

export const createChatRoom = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    visibility: v.union(v.literal("public"), v.literal("private")),
    memberIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    if (!workspace.members.includes(user._id)) {
      throw new Error("Not a member of this workspace");
    }

    const participantIds = args.visibility === "public" 
      ? workspace.members 
      : Array.from(new Set([...args.memberIds, user._id])); // Ensure creator is included

    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      type: "custom_chat",
      name: args.name,
      visibility: args.visibility,
      participantIds: participantIds,
      creatorId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const updateChatRoom = mutation({
  args: {
    conversationId: v.id("conversations"),
    name: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    memberIds: v.optional(v.array(v.id("users"))),
    isClosed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    // Check if user is a participant
    if (!conversation.participantIds.includes(user._id)) {
      throw new Error("Not a participant of this room");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name) updates.name = args.name;
    if (args.visibility) updates.visibility = args.visibility;
    if (args.isClosed !== undefined) updates.isClosed = args.isClosed;
    
    if (args.memberIds) {
       // If changing members, ensure we handle visibility logic if needed, 
       // but for now just update the list. 
       // Ideally, if public, members should always be all workspace members.
       // But let's assume this is mostly for private rooms or converting.
       updates.participantIds = args.memberIds;
    }

    await ctx.db.patch(args.conversationId, updates);
  },
});

export const kickMember = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    memberId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    // Check ownership via project owner for consistency
    const project = await ctx.db.get(workspace.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error("Only the workspace owner can kick members");
    }

    if (args.memberId === user._id) {
      throw new Error("Cannot kick yourself");
    }

    const newMembers = workspace.members.filter(id => id !== args.memberId);
    const newRoles = workspace.roles?.filter(r => r.userId !== args.memberId);

    await ctx.db.patch(args.workspaceId, {
      members: newMembers,
      roles: newRoles,
    });

    // Update application status to 'rejected' so they can re-apply
    const application = await ctx.db
      .query('applications')
      .withIndex('by_project', (q) => q.eq('projectId', workspace.projectId))
      .filter((q) => q.eq(q.field('applicantId'), args.memberId))
      .first();

    if (application) {
      await ctx.db.patch(application._id, {
        status: 'rejected',
        updatedAt: Date.now(),
      });
    }
  },
});

export const generateInviteCode = mutation({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    // Check ownership via project owner for consistency
    const project = await ctx.db.get(workspace.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    await ctx.db.patch(args.workspaceId, {
      inviteCode,
      updatedAt: Date.now(),
    });

    return inviteCode;
  },
});

export const joinByInviteCode = mutation({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const workspace = await ctx.db
      .query('workspaces')
      .withIndex('by_invite_code', q => q.eq('inviteCode', args.inviteCode))
      .first();

    if (!workspace) throw new Error('Invalid invite code');

    if (workspace.members.includes(user._id)) {
      return workspace._id; // Already a member
    }

    await ctx.db.patch(workspace._id, {
      members: [...workspace.members, user._id],
      roles: [...(workspace.roles || []), { userId: user._id, role: 'Member' }],
    });

    return workspace._id;
  },
});

export const getWorkspaceByInviteCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query('workspaces')
      .withIndex('by_invite_code', q => q.eq('inviteCode', args.inviteCode))
      .first();

    if (!workspace) return null;

    return {
      name: workspace.name,
      id: workspace._id,
    };
  },
});
