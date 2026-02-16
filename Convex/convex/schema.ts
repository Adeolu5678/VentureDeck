import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Users table - synced with Clerk
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    
    // Launchpad Specific Fields
    role: v.optional(v.union(v.literal('entrepreneur'), v.literal('investor'))),
    displayName: v.optional(v.string()),
    professionalBio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),

    // Profile & Settings
    skills: v.optional(v.array(v.string())),
    interests: v.optional(v.array(v.string())),
    notificationPreferences: v.optional(v.object({
      email: v.boolean(),
      push: v.boolean(),
      digestFrequency: v.optional(v.union(v.literal('daily'), v.literal('weekly'), v.literal('never'))),
      digestDay: v.optional(v.number()), // 0-6 for weekly digest (0 = Sunday)
    })),
    privacySettings: v.optional(v.object({
      profileVisibility: v.union(v.literal('public'), v.literal('private')),
    })),
    tags: v.optional(v.array(v.string())),
    investmentRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
    })),
    // Investor thesis fields
    investorThesis: v.optional(v.object({
      preferredIndustries: v.optional(v.array(v.string())),
      preferredStages: v.optional(v.array(v.string())), // seed, series-a, etc.
      thesisDescription: v.optional(v.string()),
      geographicPreference: v.optional(v.string()),
      minTractionScore: v.optional(v.number()),
    })),
    avatarStorageId: v.optional(v.string()),
    
    // Legacy fields
    needsUsernameSelection: v.optional(v.boolean()),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerk_id', ['clerkId'])
    .index('by_email', ['email'])
    .index('by_role', ['role'])
    .searchIndex('search_username', {
      searchField: 'username',
      filterFields: ['role']
    }),

  // Certifications table - for user verification
  certifications: defineTable({
    userId: v.id('users'),
    title: v.string(),
    imageUrl: v.string(),
    status: v.union(v.literal('pending'), v.literal('verified'), v.literal('rejected')),
    verifiedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_user_id', ['userId'])
    .index('by_status', ['status']),

  // Projects table - the core entity for Entrepreneurs
  projects: defineTable({
    ownerId: v.id('users'),
    workspaceId: v.optional(v.id('workspaces')), // Linked after workspace creation
    title: v.string(),
    tagline: v.string(),
    description: v.string(),
    industry: v.string(),
    tags: v.optional(v.array(v.string())),
    fundingGoal: v.number(),
    equityOffered: v.number(),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('funded'), v.literal('closed')),
    logoUrl: v.optional(v.string()),
    pitchDeckUrl: v.optional(v.string()),
    // AI Deal Scoring fields
    tractionScore: v.optional(v.number()), // Calculated score 0-100
    scoreLastUpdated: v.optional(v.number()), // Timestamp of last score calculation
    scoreBreakdown: v.optional(v.object({
      milestones: v.number(),
      softCircles: v.number(),
      followers: v.number(),
      applications: v.number(),
      teamCompleteness: v.number(),
      pitchDeck: v.number(),
      legalDocs: v.number(),
    })),
    // Stage for matching
    stage: v.optional(v.union(
      v.literal('idea'),
      v.literal('mvp'),
      v.literal('seed'),
      v.literal('series-a'),
      v.literal('series-b'),
      v.literal('growth')
    )),
    // Geographic location for matching
    location: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_owner', ['ownerId'])
    .index('by_status', ['status'])
    .index('by_industry_status', ['industry', 'status']) // For filtering
    .index('by_funding_status', ['fundingGoal', 'status']) // For filtering
    .index('by_traction_score', ['tractionScore']) // For sorting by score
    .searchIndex('search_projects', {
      searchField: 'title',
      filterFields: ['status', 'industry']
    }),

  // Workspaces table - for team collaboration
  workspaces: defineTable({
    projectId: v.id('projects'),
    name: v.string(),
    members: v.array(v.id('users')),
    roles: v.optional(v.array(v.object({ userId: v.id('users'), role: v.string() }))),
    inviteCode: v.optional(v.string()),
    ownerId: v.optional(v.id('users')), // Explicit owner field for consistency
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_member', ['members'])
    .index('by_invite_code', ['inviteCode']),

  // Applications table - for joining projects
  applications: defineTable({
    applicantId: v.id('users'),
    projectId: v.id('projects'),
    role: v.string(), // e.g. "Co-founder", "CTO"
    message: v.string(),
    status: v.union(v.literal('pending'), v.literal('interviewing'), v.literal('accepted'), v.literal('rejected')),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_applicant', ['applicantId'])
    .index('by_project_status', ['projectId', 'status']),

  // Conversations table - supports Direct (Investor-Founder), Team (Workspace), and Interview chats
  conversations: defineTable({
    participantIds: v.array(v.id('users')),
    workspaceId: v.optional(v.id('workspaces')),
    projectId: v.optional(v.id('projects')),
    applicationId: v.optional(v.id('applications')),
    type: v.optional(v.union(v.literal('direct'), v.literal('workspace_general'), v.literal('interview'), v.literal('custom_chat'))),
    name: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
    isClosed: v.optional(v.boolean()),
    creatorId: v.optional(v.id('users')),
    archivedBy: v.optional(v.array(v.id('users'))),
    lastMessageId: v.optional(v.id('messages')),
    // Legacy fields
    status: v.optional(v.string()),
    participantKey: v.optional(v.string()),
    initialWhisperId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_workspace', ['workspaceId'])
    .index('by_application', ['applicationId'])
    .index('by_type', ['type']),

  // Messages table
  messages: defineTable({
    conversationId: v.id('conversations'),
    senderId: v.id('users'),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_conversation', ['conversationId']),

  // Milestones table - for "Living Pitch Deck"
  milestones: defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    date: v.number(), // Target date
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('verified')),
    verifiedBy: v.optional(v.id('users')), // Admin or trusted user
    createdAt: v.number(),
  })
    .index('by_project', ['projectId']),

  // Bounties table - for "Micro-Bounties"
  bounties: defineTable({
    projectId: v.id('projects'),
    title: v.string(),
    description: v.string(),
    reward: v.string(), // e.g. "$500" or "0.5% Equity"
    status: v.union(v.literal('open'), v.literal('assigned'), v.literal('submitted'), v.literal('completed'), v.literal('paid')),
    assigneeId: v.optional(v.id('users')),
    // Submission fields
    submissionUrl: v.optional(v.string()), // Link to PR, file, or deliverable
    submissionNote: v.optional(v.string()), // Explanation from claimant
    submittedAt: v.optional(v.number()),
    reviewNote: v.optional(v.string()), // Feedback from reviewer
    reviewedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_status', ['status'])
    .index('by_assignee', ['assigneeId']),

  // Project Followers table - for investors following projects
  project_followers: defineTable({
    projectId: v.id('projects'),
    userId: v.id('users'),
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_user', ['userId'])
    .index('by_project_user', ['projectId', 'userId']),

  // Soft Circles table - for Investor interest
  soft_circles: defineTable({
    projectId: v.id('projects'),
    investorId: v.id('users'),
    amount: v.number(),
    status: v.union(v.literal('interested'), v.literal('committed'), v.literal('withdrawn')),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index('by_project', ['projectId'])
    .index('by_investor', ['investorId']),

  // Vouches table - for Reputation
  vouches: defineTable({
    voucherId: v.id('users'),
    targetId: v.id('users'),
    relationship: v.string(), // e.g. "Former Co-founder"
    text: v.string(),
    createdAt: v.number(),
  })
    .index('by_target', ['targetId'])
    .index('by_voucher', ['voucherId']),

  // Feature Flags table
  featureFlags: defineTable({
    name: v.string(),
    enabled: v.boolean(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_name', ['name']),

  // Friends table
  friends: defineTable({
    userId: v.id('users'),
    friendId: v.id('users'),
    status: v.union(v.literal('pending'), v.literal('accepted'), v.literal('rejected')),
    message: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user_friend', ['userId', 'friendId'])
    .index('by_user_status', ['userId', 'status'])
    .index('by_friend_status', ['friendId', 'status']),

  // Legal Documents table
  legalDocs: defineTable({
    projectId: v.id('projects'),
    type: v.union(
      v.literal('SAFE'),
      v.literal('NDA'),
      v.literal('ADVISOR'),
      v.literal('FOUNDER'),
      v.literal('CONVERTIBLE_NOTE'),
      v.literal('TERM_SHEET'),
      v.literal('INVESTMENT_AGREEMENT')
    ),
    status: v.union(v.literal('draft'), v.literal('signed')),
    storageId: v.string(), // ID of the stored PDF file
    createdAt: v.number(),
    signedAt: v.optional(v.number()),
    signerId: v.optional(v.id('users')),
  })
    .index('by_project', ['projectId']),

  // Notifications table
  notifications: defineTable({
    userId: v.id('users'), // Recipient
    type: v.union(
      v.literal('application_received'), 
      v.literal('application_accepted'), 
      v.literal('application_rejected'), 
      v.literal('message_received'), 
      v.literal('soft_circle_committed'), 
      v.literal('bounty_claimed'),
      v.literal('bounty_submitted'),
      v.literal('bounty_approved'),
      v.literal('bounty_rejected'),
      v.literal('project_followed'),
      v.literal('milestone_completed'),
      v.literal('digest'),
      v.literal('system')
    ),
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()), // URL to redirect to
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_read', ['userId', 'read']),

  // ============================================
  // NEW TABLES FOR FEATURE EXPANSION
  // ============================================

  // Project Analytics - daily snapshots for founder dashboard
  projectAnalytics: defineTable({
    projectId: v.id('projects'),
    date: v.number(), // Timestamp for the day (midnight UTC)
    views: v.number(),
    uniqueViews: v.number(),
    followerCount: v.number(),
    softCircleTotal: v.number(),
    softCircleCount: v.number(),
    applicationCount: v.number(),
    tractionScore: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_project_date', ['projectId', 'date']),

  // Project View Tracking - for real-time analytics
  projectViews: defineTable({
    projectId: v.id('projects'),
    viewerId: v.optional(v.id('users')), // Optional for anonymous views
    viewerFingerprint: v.optional(v.string()), // For unique view counting
    createdAt: v.number(),
  })
    .index('by_project', ['projectId'])
    .index('by_project_date', ['projectId', 'createdAt']),

  // Due Diligence Data Rooms - secure document sharing
  dataRooms: defineTable({
    projectId: v.id('projects'),
    name: v.string(),
    description: v.optional(v.string()),
    accessType: v.union(v.literal('invite_only'), v.literal('nda_required')),
    isActive: v.boolean(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_project', ['projectId']),

  // Data Room Documents
  dataRoomDocuments: defineTable({
    dataRoomId: v.id('dataRooms'),
    name: v.string(),
    description: v.optional(v.string()),
    storageId: v.string(), // Convex file storage ID
    fileType: v.optional(v.string()), // e.g., 'pdf', 'xlsx'
    fileSize: v.optional(v.number()),
    uploadedBy: v.id('users'),
    uploadedAt: v.number(),
  })
    .index('by_data_room', ['dataRoomId']),

  // Data Room Access Control & Audit Trail
  dataRoomAccess: defineTable({
    dataRoomId: v.id('dataRooms'),
    userId: v.id('users'),
    grantedBy: v.id('users'),
    grantedAt: v.number(),
    expiresAt: v.optional(v.number()),
    status: v.union(v.literal('active'), v.literal('revoked'), v.literal('expired')),
    viewCount: v.number(),
    lastViewedAt: v.optional(v.number()),
    ndaSignedAt: v.optional(v.number()), // If NDA required
  })
    .index('by_data_room', ['dataRoomId'])
    .index('by_user', ['userId'])
    .index('by_data_room_user', ['dataRoomId', 'userId']),

  // Saved Searches for Investors
  savedSearches: defineTable({
    userId: v.id('users'),
    name: v.string(),
    filters: v.object({
      industries: v.optional(v.array(v.string())),
      stages: v.optional(v.array(v.string())),
      minFunding: v.optional(v.number()),
      maxFunding: v.optional(v.number()),
      minTractionScore: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
      location: v.optional(v.string()),
    }),
    alertEnabled: v.optional(v.boolean()), // Send notifications for new matches
    lastRunAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_user', ['userId']),

  // Application Templates for repeated use
  applicationTemplates: defineTable({
    userId: v.id('users'),
    name: v.string(),
    role: v.string(), // e.g., "CTO", "Co-founder"
    message: v.string(), // Template message
    isDefault: v.optional(v.boolean()),
    usageCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId']),

  // Rate Limits table - for tracking user action rates
  rateLimits: defineTable({
    userId: v.id('users'),
    limitType: v.union(
      v.literal('messages'),
      v.literal('applications'),
      v.literal('friendRequests')
    ),
    timestamps: v.array(v.number()),
  })
    .index('by_user_type', ['userId', 'limitType']),
});
