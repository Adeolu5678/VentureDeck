# API Endpoints Documentation

## Overview

VentureDeck is a professional platform for Entrepreneurs and Investors. The backend architecture uses **Convex** for real-time database capabilities and serverless functions, combined with **Clerk** for authentication.

- **Convex Functions:** Serverless functions for data persistence, business logic, and real-time updates.
- **Web API Routes:** Next.js API routes for webhook handling.

---

## Authentication

All authenticated endpoints require a valid Clerk JWT token. The user's Convex identity is derived via `ctx.auth.getUserIdentity()`, then resolved to a user record via the `by_clerk_id` index.

### Authorization Levels

| Level | Description |
|-------|-------------|
| `public` | No authentication required |
| `auth` | Any authenticated user |
| `entrepreneur` | User with role = "entrepreneur" |
| `investor` | User with role = "investor" |
| `owner` | Resource owner only |
| `member` | Workspace member |
| `admin` | User with isAdmin = true |

---

## User Management (`users.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getMe` | auth | Get current user's full profile | User object or null |
| `getById` | auth | Get user by ID | User object or null |
| `getPublicProfile` | auth | Get public profile data | Partial user object |
| `searchUsers` | auth | Search users by username | Array of users |
| `listAll` | admin | List all users with pagination | Paginated user list |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `sync` | internal | clerkId, email, username, etc. | Sync user from Clerk webhook |
| `updateProfile` | auth | displayName, bio, skills, etc. | Update profile fields |
| `updateRole` | owner | role | Set entrepreneur/investor role |
| `updateAvatar` | owner | avatarStorageId | Update profile picture |

---

## Project Management (`projects.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `list` | public | List published projects with filters | Array of projects |
| `getById` | public | Get single project by ID | Project with owner info |
| `getMyProjects` | auth | Get current user's owned projects | Array of projects |
| `getJoinedProjects` | auth | Get projects user is member of | Array of projects |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | entrepreneur | title, description, fundingGoal, etc. | Create project + workspace |
| `update` | owner | projectId, fields | Update project details |
| `updateStatus` | owner | projectId, status | Change project status |
| `delete` | owner | projectId | Delete project and workspace |

---

## Workspace Management (`workspaces.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByProject` | member | Get workspace for a project | Workspace with members |
| `getMyWorkspaces` | auth | Get user's workspaces | Array of workspaces |
| `getMembers` | member | Get workspace member details | Array of users |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `addMember` | owner | workspaceId, userId, role | Add member to workspace |
| `removeMember` | owner | workspaceId, userId | Remove member |
| `updateMemberRole` | owner | workspaceId, userId, role | Update member role |
| `generateInviteCode` | owner | workspaceId | Generate shareable invite |
| `joinViaCode` | auth | inviteCode | Join workspace via invite |

---

## Application System (`applications.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByProject` | owner | Get applications for a project | Array with applicant info |
| `getMyApplications` | auth | Get user's sent applications | Array with project info |
| `getById` | owner/applicant | Get single application | Application details |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `apply` | auth | projectId, role, message | Submit application |
| `updateStatus` | owner | applicationId, status | Change application status |
| `startInterview` | owner | applicationId | Create interview conversation |
| `acceptApplicant` | owner | applicationId | Accept and add to workspace |

---

## Application Templates (`applicationTemplates.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `list` | auth | Get user's templates | Array of templates |
| `getDefault` | auth | Get default template | Template or null |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | auth | name, role, message, isDefault | Create template (max 5) |
| `update` | owner | id, fields | Update template |
| `remove` | owner | id | Delete template |
| `incrementUsage` | owner | id | Track template usage |

---

## Messaging (`conversations.ts`, `messages.ts`)

### Conversation Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getMyConversations` | auth | Get user's conversations | Array with last message |
| `getById` | participant | Get conversation details | Conversation with participants |
| `getByWorkspace` | member | Get workspace conversations | Array of channels |

### Conversation Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `createDirect` | auth | userId, projectId? | Create direct message |
| `createWorkspaceChannel` | member | workspaceId, name, visibility | Create channel |
| `archiveConversation` | participant | conversationId | Archive for user |

### Message Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByConversation` | participant | Get messages (paginated) | Array of messages |

### Message Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `send` | participant | conversationId, content, imageUrl? | Send message |

---

## Milestones (`milestones.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByProject` | public | Get project milestones | Sorted array |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | owner | projectId, title, description, date | Add milestone |
| `update` | owner | milestoneId, fields | Update milestone |
| `markComplete` | owner | milestoneId | Set status to completed |
| `verify` | admin | milestoneId | Set status to verified |
| `delete` | owner | milestoneId | Remove milestone |

---

## Bounties (`bounties.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByProject` | public | Get project bounties | Array with assignee info |
| `getMyBounties` | auth | Get user's claimed bounties | Array with project info |
| `getById` | public | Get single bounty | Bounty details |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | owner | projectId, title, description, reward | Post bounty |
| `claim` | auth | bountyId | Claim open bounty |
| `submit` | assignee | bountyId, submissionUrl, submissionNote | Submit work |
| `approve` | owner | bountyId | Approve submission |
| `reject` | owner | bountyId, reviewNote | Reject with feedback |
| `markPaid` | owner | bountyId | Mark as paid |
| `delete` | owner | bountyId | Remove bounty |

---

## Soft Circles (`soft_circles.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByProject` | owner | Get project's soft circles | Array with investor info |
| `getMyCommitments` | investor | Get user's commitments | Array with project info |
| `getProjectTotal` | public | Get total committed amount | Number |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | investor | projectId, amount | Express interest |
| `updateAmount` | investor | softCircleId, amount | Update amount |
| `updateStatus` | investor/owner | softCircleId, status | Change status |
| `withdraw` | investor | softCircleId | Withdraw interest |

---

## Project Followers (`project_followers.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `isFollowing` | auth | Check if user follows project | Boolean |
| `getFollowers` | owner | Get project followers | Array of users |
| `getFollowerCount` | public | Get follower count | Number |
| `getFollowedProjects` | auth | Get user's followed projects | Array of projects |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `follow` | auth | projectId | Follow project |
| `unfollow` | auth | projectId | Unfollow project |

---

## AI Deal Scoring (`scoring.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getScoreBreakdown` | public | Get score components for project | Breakdown object |
| `getTopProjects` | public | Get highest-scored projects | Sorted array |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `refreshScore` | owner | projectId | Trigger manual recalculation |

### Internal Mutations

| Function | Description |
|----------|-------------|
| `calculateProjectScore` | Calculate single project score |
| `recalculateAllScores` | Batch recalculation (scheduled) |

---

## Matchmaking (`matchmaking.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getMatches` | investor | Get matched projects for user | Scored and sorted array |
| `getMatchExplanation` | investor | Get detailed match breakdown | Explanation object |

---

## Due Diligence Data Rooms (`dataRooms.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `listByProject` | owner/granted | Get project's data rooms | Array with document counts |
| `getAccessLog` | owner | Get access audit trail | Array of access records |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | owner | projectId, name, accessType, expiresAt? | Create data room |
| `uploadDocument` | owner | dataRoomId, name, storageId, etc. | Add document |
| `listDocuments` | granted | dataRoomId | List room documents |
| `grantAccess` | owner | dataRoomId, userId, expiresAt? | Grant user access |
| `revokeAccess` | owner | dataRoomId, userId | Revoke access |
| `toggleActive` | owner | dataRoomId | Enable/disable room |
| `deleteDocument` | owner | documentId | Remove document |

---

## Legal Documents (`legal.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getTemplates` | auth | Get available template types | Array of template info |
| `listByProject` | owner | Get project's legal docs | Array of documents |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `generateDocument` | owner | projectId, type, variables | Generate from template |
| `markSigned` | owner | documentId | Update to signed status |
| `delete` | owner | documentId | Remove document |

---

## Saved Searches (`savedSearches.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `list` | auth | Get user's saved searches | Array of searches |
| `runSearch` | auth | Run saved search filters | Matching projects |
| `runFilters` | auth | Run ad-hoc filters | Matching projects |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | auth | name, filters, alertEnabled? | Save search |
| `update` | owner | id, fields | Update search |
| `remove` | owner | id | Delete search |

---

## Analytics (`analytics.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getProjectAnalytics` | owner | Get project metrics | Snapshots + realtime |
| `getViewTrends` | owner | Get view trend data | Chart data array |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `trackView` | public | projectId, fingerprint? | Record project view |

### Internal Mutations

| Function | Description |
|----------|-------------|
| `createDailySnapshot` | Create daily metric snapshot |
| `runDailyAnalytics` | Scheduled daily job |

---

## Vouches (`vouches.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByUser` | public | Get vouches for a user | Array with voucher info |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `create` | auth | targetId, relationship, text | Create vouch |
| `delete` | voucher | vouchId | Remove vouch |

---

## Friends (`friends.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getFriendsList` | auth | Get accepted friends | Array with user info |
| `getPendingRequests` | auth | Get incoming requests | Array with sender info |
| `getSentRequests` | auth | Get outgoing requests | Array with recipient info |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `sendFriendRequest` | auth | friendId, message? | Send request |
| `acceptFriendRequest` | recipient | requestId | Accept request |
| `rejectFriendRequest` | recipient | requestId | Reject request |
| `removeFriend` | either | friendshipId | Remove connection |

---

## Certifications (`certifications.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getByUser` | public | Get user's certifications | Array of certifications |
| `getPending` | admin | Get pending verifications | Array for review |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `upload` | auth | title, imageUrl | Submit certification |
| `verify` | admin | certificationId | Mark as verified |
| `reject` | admin | certificationId | Mark as rejected |

---

## Notifications (`notifications.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getMyNotifications` | auth | Get user's notifications | Sorted array |
| `getUnreadCount` | auth | Get unread count | Number |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `markAsRead` | owner | notificationId | Mark single as read |
| `markAllAsRead` | auth | - | Mark all as read |

---

## Activity Feed (`activity.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getMyActivities` | auth | Get personal activity feed | Aggregated activity array |
| `getDiscoverActivity` | auth | Get platform-wide activity | Public activity array |

---

## Feature Flags (`featureFlags.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getFeatureFlags` | public | Get all flags as map | `{name: boolean}` |
| `getFeatureFlag` | public | Get single flag status | Boolean |
| `list` | admin | Get flags with details | Full flag objects |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `setFeatureFlag` | admin | name, enabled, description? | Set flag value |
| `update` | admin | id, enabled | Toggle by ID |
| `initializeDefaultFlags` | admin | - | Create default flags |

---

## Admin Moderation (`admin_moderation.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `listUsers` | admin | List users with filters | Paginated user list |
| `listProjects` | admin | List projects with filters | Paginated project list |
| `getRecentActions` | admin | Get audit log | Action array |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `setUserSuspended` | admin | userId, suspended | Suspend/unsuspend user |
| `setUserAdmin` | admin | userId, isAdmin | Toggle admin status |
| `setProjectStatus` | admin | projectId, status | Change project status |

---

## File Storage (`fileStorage.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getUrl` | auth | Get download URL for storage ID | URL string |

### Mutations

| Function | Auth | Args | Description |
|----------|------|------|-------------|
| `generateUploadUrl` | auth | - | Get upload URL |

---

## Webhooks

### Clerk Webhook Handler

**Internal Location:** `Convex/convex/webhooks.ts`

**Supported Events:**
- `user.created` → Create user record
- `user.updated` → Sync profile changes
- `user.deleted` → Handle user deletion

**Verification:** SVIX signature validation using `CLERK_WEBHOOK_SECRET`

---

## Public Statistics (`public_stats.ts`)

### Queries

| Function | Auth | Description | Returns |
|----------|------|-------------|---------|
| `getStats` | public | Platform statistics | `{projectCount, userCount, totalCommitted}` |
