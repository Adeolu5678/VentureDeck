import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Due Diligence Data Rooms Module
 * 
 * Secure document sharing for investors doing due diligence.
 * Features: access control, expiry, NDA tracking, audit trail.
 */

// Create a new data room
export const create = mutation({
  args: {
    projectId: v.id('projects'),
    name: v.string(),
    description: v.optional(v.string()),
    accessType: v.union(v.literal('invite_only'), v.literal('nda_required')),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    // Only project owner can create data rooms
    if (project.ownerId !== user._id) {
      throw new Error('Only the project owner can create data rooms');
    }

    const dataRoomId = await ctx.db.insert('dataRooms', {
      projectId: args.projectId,
      name: args.name,
      description: args.description,
      accessType: args.accessType,
      isActive: true,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return dataRoomId;
  },
});

// List data rooms for a project
export const listByProject = query({
  args: { projectId: v.id('projects') },
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

    // Only owner can see all data rooms
    if (project.ownerId !== user._id) {
      // For investors, only show rooms they have access to
      const myAccess = await ctx.db
        .query('dataRoomAccess')
        .withIndex('by_user', (q) => q.eq('userId', user._id))
        .collect();

      const accessibleRoomIds = new Set(
        myAccess
          .filter(a => a.status === 'active')
          .map(a => a.dataRoomId)
      );

      const allRooms = await ctx.db
        .query('dataRooms')
        .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
        .collect();

      return allRooms.filter(r => r.isActive && accessibleRoomIds.has(r._id));
    }

    return await ctx.db
      .query('dataRooms')
      .withIndex('by_project', (q) => q.eq('projectId', args.projectId))
      .collect();
  },
});

// Upload document to data room
export const uploadDocument = mutation({
  args: {
    dataRoomId: v.id('dataRooms'),
    name: v.string(),
    description: v.optional(v.string()),
    storageId: v.string(),
    fileType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const dataRoom = await ctx.db.get(args.dataRoomId);
    if (!dataRoom) throw new Error('Data room not found');

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error('Not authorized to upload to this data room');
    }

    const docId = await ctx.db.insert('dataRoomDocuments', {
      dataRoomId: args.dataRoomId,
      name: args.name,
      description: args.description,
      storageId: args.storageId,
      fileType: args.fileType,
      fileSize: args.fileSize,
      uploadedBy: user._id,
      uploadedAt: Date.now(),
    });

    return docId;
  },
});

// List documents in a data room
export const listDocuments = mutation({
  args: { dataRoomId: v.id('dataRooms') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const dataRoom = await ctx.db.get(args.dataRoomId);
    if (!dataRoom) throw new Error('Data room not found');

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project) throw new Error('Project not found');

    // Check access
    const isOwner = project.ownerId === user._id;
    if (!isOwner) {
      const access = await ctx.db
        .query('dataRoomAccess')
        .withIndex('by_data_room_user', (q) => 
          q.eq('dataRoomId', args.dataRoomId).eq('userId', user._id)
        )
        .first();

      if (!access || access.status !== 'active') {
        throw new Error('Access denied');
      }

      // Track view
      await ctx.db.patch(access._id, {
        viewCount: access.viewCount + 1,
        lastViewedAt: Date.now(),
      });
    }

    return await ctx.db
      .query('dataRoomDocuments')
      .withIndex('by_data_room', (q) => q.eq('dataRoomId', args.dataRoomId))
      .collect();
  },
});

// Grant access to a user
export const grantAccess = mutation({
  args: {
    dataRoomId: v.id('dataRooms'),
    userId: v.id('users'),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const dataRoom = await ctx.db.get(args.dataRoomId);
    if (!dataRoom) throw new Error('Data room not found');

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error('Not authorized to grant access');
    }

    // Check if access already exists
    const existing = await ctx.db
      .query('dataRoomAccess')
      .withIndex('by_data_room_user', (q) => 
        q.eq('dataRoomId', args.dataRoomId).eq('userId', args.userId)
      )
      .first();

    if (existing) {
      // Reactivate if revoked
      await ctx.db.patch(existing._id, {
        status: 'active',
        expiresAt: args.expiresAt,
      });
      return existing._id;
    }

    const accessId = await ctx.db.insert('dataRoomAccess', {
      dataRoomId: args.dataRoomId,
      userId: args.userId,
      grantedBy: user._id,
      grantedAt: Date.now(),
      expiresAt: args.expiresAt,
      status: 'active',
      viewCount: 0,
    });

    // Notify the user
    const targetUser = await ctx.db.get(args.userId);
    if (targetUser) {
      await ctx.db.insert('notifications', {
        userId: args.userId,
        type: 'system',
        title: 'Data Room Access Granted',
        message: `You've been granted access to "${dataRoom.name}" for ${project.title}`,
        link: `/projects/${project._id}/data-room/${args.dataRoomId}`,
        read: false,
        createdAt: Date.now(),
      });
    }

    return accessId;
  },
});

// Revoke access
export const revokeAccess = mutation({
  args: {
    dataRoomId: v.id('dataRooms'),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const dataRoom = await ctx.db.get(args.dataRoomId);
    if (!dataRoom) throw new Error('Data room not found');

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error('Not authorized to revoke access');
    }

    const access = await ctx.db
      .query('dataRoomAccess')
      .withIndex('by_data_room_user', (q) => 
        q.eq('dataRoomId', args.dataRoomId).eq('userId', args.userId)
      )
      .first();

    if (access) {
      await ctx.db.patch(access._id, { status: 'revoked' });
    }

    return { revoked: true };
  },
});

// Get access log (audit trail)
export const getAccessLog = query({
  args: { dataRoomId: v.id('dataRooms') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return [];

    const dataRoom = await ctx.db.get(args.dataRoomId);
    if (!dataRoom) return [];

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project || project.ownerId !== user._id) {
      return [];
    }

    const accessRecords = await ctx.db
      .query('dataRoomAccess')
      .withIndex('by_data_room', (q) => q.eq('dataRoomId', args.dataRoomId))
      .collect();

    // Enrich with user data
    return Promise.all(accessRecords.map(async (record) => {
      const accessUser = await ctx.db.get(record.userId);
      return {
        ...record,
        user: accessUser ? {
          _id: accessUser._id,
          username: accessUser.username,
          displayName: accessUser.displayName,
          avatarUrl: accessUser.avatarUrl,
        } : null,
      };
    }));
  },
});

// Toggle data room active status
export const toggleActive = mutation({
  args: { dataRoomId: v.id('dataRooms') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const dataRoom = await ctx.db.get(args.dataRoomId);
    if (!dataRoom) throw new Error('Data room not found');

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.dataRoomId, {
      isActive: !dataRoom.isActive,
      updatedAt: Date.now(),
    });

    return { isActive: !dataRoom.isActive };
  },
});

// Delete document
export const deleteDocument = mutation({
  args: { documentId: v.id('dataRoomDocuments') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) throw new Error('User not found');

    const document = await ctx.db.get(args.documentId);
    if (!document) throw new Error('Document not found');

    const dataRoom = await ctx.db.get(document.dataRoomId);
    if (!dataRoom) throw new Error('Data room not found');

    const project = await ctx.db.get(dataRoom.projectId);
    if (!project || project.ownerId !== user._id) {
      throw new Error('Not authorized');
    }

    await ctx.db.delete(args.documentId);
    return { deleted: true };
  },
});
