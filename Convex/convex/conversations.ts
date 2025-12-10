import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

// Create a Direct Message conversation (e.g. Investor -> Founder)
export const createDirectMessage = mutation({
  args: {
    participantId: v.id('users'), // The other user
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Check for existing direct conversation
    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_type', q => q.eq('type', 'direct'))
      .filter(q => 
        q.and(
          q.eq(q.field('projectId'), args.projectId),
        )
      )
      .collect();

    const match = existingConversation.find(c => 
      c.participantIds.includes(user._id) && 
      c.participantIds.includes(args.participantId) &&
      c.projectId === args.projectId
    );

    if (match) {
      return match._id;
    }

    const conversationId = await ctx.db.insert('conversations', {
      participantIds: [user._id, args.participantId],
      type: 'direct',
      projectId: args.projectId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const getOrCreateWorkspaceDirectMessage = mutation({
  args: {
    participantId: v.id('users'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    // Check for existing direct conversation in this workspace
    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_type', q => q.eq('type', 'direct'))
      .filter(q => 
        q.and(
          q.eq(q.field('workspaceId'), args.workspaceId),
        )
      )
      .collect();

    const match = existingConversation.find(c => 
      c.participantIds.includes(user._id) && 
      c.participantIds.includes(args.participantId) &&
      c.workspaceId === args.workspaceId
    );

    if (match) {
      return match._id;
    }

    const conversationId = await ctx.db.insert('conversations', {
      participantIds: [user._id, args.participantId],
      type: 'direct',
      workspaceId: args.workspaceId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Authorization check
    let isAuthorized = false;
    if (conversation.type === 'workspace_general') {
      const workspace = await ctx.db.get(conversation.workspaceId!);
      if (workspace && workspace.members.includes(user._id)) {
        isAuthorized = true;
      }
    } else {
      if (conversation.participantIds.includes(user._id)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error('Not authorized');
    }

    const messageId = await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

// Get messages for a conversation
export const getMessages = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Authorization check
    let isAuthorized = false;
    if (conversation.type === 'workspace_general') {
      const workspace = await ctx.db.get(conversation.workspaceId!);
      if (workspace && workspace.members.includes(user._id)) {
        isAuthorized = true;
      }
    } else {
      if (conversation.participantIds.includes(user._id)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error('Not authorized');
    }

    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', q => q.eq('conversationId', args.conversationId))
      .collect();
  },
});

// List my conversations
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const conversations = await ctx.db.query('conversations').collect();
    const myConversations = conversations.filter(c => c.participantIds.includes(user._id));

    // Enrich with project details
    return await Promise.all(myConversations.map(async (c) => {
      let projectTitle = undefined;
      let projectRole = undefined;

      let applicationRole = undefined;
      let applicantId = undefined;

      if (c.projectId) {
        const project = await ctx.db.get(c.projectId);
        if (project) {
          projectTitle = project.title;
          const isOwner = project.ownerId === user._id;
          projectRole = isOwner ? 'Investor' : 'Founder';
        }
      }

      if (c.applicationId) {
        const application = await ctx.db.get(c.applicationId);
        if (application) {
          applicationRole = application.role;
          applicantId = application.applicantId;
        }
      }

      // Fetch other participant for display name
      const otherUserId = c.participantIds.find(id => id !== user._id);
      let otherUser = undefined;
      if (otherUserId) {
        otherUser = await ctx.db.get(otherUserId);
      }

      let workspaceName = undefined;
      if (c.workspaceId) {
        const workspace = await ctx.db.get(c.workspaceId);
        if (workspace) {
          workspaceName = workspace.name;
        }
      }

      return {
        ...c,
        projectTitle,
        projectRole,
        applicationRole,
        otherUserName: otherUser ? (otherUser.displayName || otherUser.firstName || otherUser.username) : undefined,
        otherUserUsername: otherUser?.username,
        otherUserRole: otherUser?.role,
        workspaceName,
        applicantId,
      };
    }));
  },
});

export const getConversation = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return null;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    // Authorization check
    let isAuthorized = false;
    if (conversation.type === 'workspace_general') {
      const workspace = await ctx.db.get(conversation.workspaceId!);
      if (workspace && workspace.members.includes(user._id)) {
        isAuthorized = true;
      }
    } else {
      if (conversation.participantIds.includes(user._id)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new Error('Not authorized');
    }

    // Enrich with project details for header
    let projectTitle = undefined;
    let projectRole = undefined;

    if (conversation.projectId) {
      const project = await ctx.db.get(conversation.projectId);
      if (project) {
        projectTitle = project.title;
        const isOwner = project.ownerId === user._id;
        
        if (conversation.type === 'interview' && conversation.applicationId) {
          const application = await ctx.db.get(conversation.applicationId);
          if (application) {
             projectRole = `${application.role} Interview`;
          }
        } else {
          projectRole = isOwner ? 'Investor' : 'Founder';
        }
      }
    }

    return { ...conversation, projectTitle, projectRole };
  },
});

export const createChannel = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    name: v.string(),
    visibility: v.union(v.literal('public'), v.literal('private')),
    memberIds: v.optional(v.array(v.id('users'))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    if (!workspace.members.includes(user._id)) {
      throw new Error('Not authorized');
    }

    let participantIds: Id<'users'>[] = [];
    if (args.visibility === 'public') {
      participantIds = workspace.members;
    } else {
      participantIds = [user._id, ...(args.memberIds || [])];
      // Verify all members are in workspace
      for (const memberId of participantIds) {
        if (!workspace.members.includes(memberId)) {
          throw new Error('Member not in workspace');
        }
      }
    }

    // Remove duplicates
    participantIds = Array.from(new Set(participantIds));

    const conversationId = await ctx.db.insert('conversations', {
      workspaceId: args.workspaceId,
      participantIds,
      type: 'custom_chat',
      name: args.name,
      visibility: args.visibility,
      creatorId: user._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const listChannels = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace || !workspace.members.includes(user._id)) {
      return [];
    }

    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_workspace', q => q.eq('workspaceId', args.workspaceId))
      .collect();

    // Filter for channels:
    // 1. Workspace General (always visible)
    // 2. Public Custom Chats (always visible to workspace members)
    // 3. Private Custom Chats (only if participant)
    return conversations.filter(c => 
      (c.type === 'workspace_general') || 
      (c.type === 'custom_chat' && c.visibility === 'public') ||
      (c.type === 'custom_chat' && c.participantIds.includes(user._id))
    );
  },
});

export const joinChannel = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    if (conversation.type !== 'custom_chat' || conversation.visibility !== 'public') {
      throw new Error('Cannot join this channel');
    }

    const workspace = await ctx.db.get(conversation.workspaceId!);
    if (!workspace || !workspace.members.includes(user._id)) {
      throw new Error('Not a member of this workspace');
    }

    if (!conversation.participantIds.includes(user._id)) {
      await ctx.db.patch(args.conversationId, {
        participantIds: [...conversation.participantIds, user._id],
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateChannel = mutation({
  args: {
    conversationId: v.id('conversations'),
    name: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
    isClosed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Check if user is a participant
    if (!conversation.participantIds.includes(user._id)) {
      throw new Error('Not authorized');
    }

    // Ideally check if creator or admin, but for now any participant can update
    // In a real app, we'd want stricter permissions

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.visibility !== undefined) updates.visibility = args.visibility;
    if (args.isClosed !== undefined) updates.isClosed = args.isClosed;

    await ctx.db.patch(args.conversationId, updates);
  },
});

export const addMembersToChannel = mutation({
  args: {
    conversationId: v.id('conversations'),
    memberIds: v.array(v.id('users')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Check if user is a participant
    if (!conversation.participantIds.includes(user._id)) {
      throw new Error('Not authorized');
    }

    const workspace = await ctx.db.get(conversation.workspaceId!);
    if (!workspace) throw new Error('Workspace not found');

    // Verify new members are in workspace
    for (const memberId of args.memberIds) {
      if (!workspace.members.includes(memberId)) {
        throw new Error('Member not in workspace');
      }
    }

    const newParticipantIds = Array.from(new Set([...conversation.participantIds, ...args.memberIds]));

    await ctx.db.patch(args.conversationId, {
      participantIds: newParticipantIds,
      updatedAt: Date.now(),
    });
  },
});
export const leaveChannel = mutation({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    if (conversation.type !== 'custom_chat') {
      throw new Error('Cannot leave this type of channel');
    }

    if (!conversation.participantIds.includes(user._id)) {
      throw new Error('Not a member of this channel');
    }

    const newParticipantIds = conversation.participantIds.filter(id => id !== user._id);

    await ctx.db.patch(args.conversationId, {
      participantIds: newParticipantIds,
      updatedAt: Date.now(),
    });
  },
});
