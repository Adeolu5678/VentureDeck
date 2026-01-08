/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activity from "../activity.js";
import type * as admin_analytics from "../admin_analytics.js";
import type * as admin_moderation from "../admin_moderation.js";
import type * as analytics from "../analytics.js";
import type * as applicationTemplates from "../applicationTemplates.js";
import type * as applications from "../applications.js";
import type * as bounties from "../bounties.js";
import type * as certifications from "../certifications.js";
import type * as conversations from "../conversations.js";
import type * as dataRooms from "../dataRooms.js";
import type * as featureFlags from "../featureFlags.js";
import type * as fileStorage from "../fileStorage.js";
import type * as friends from "../friends.js";
import type * as legal from "../legal.js";
import type * as matchmaking from "../matchmaking.js";
import type * as messages from "../messages.js";
import type * as milestones from "../milestones.js";
import type * as notifications from "../notifications.js";
import type * as project_followers from "../project_followers.js";
import type * as projects from "../projects.js";
import type * as public_stats from "../public_stats.js";
import type * as savedSearches from "../savedSearches.js";
import type * as scoring from "../scoring.js";
import type * as soft_circles from "../soft_circles.js";
import type * as users from "../users.js";
import type * as vouches from "../vouches.js";
import type * as webhooks from "../webhooks.js";
import type * as workspaces from "../workspaces.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activity: typeof activity;
  admin_analytics: typeof admin_analytics;
  admin_moderation: typeof admin_moderation;
  analytics: typeof analytics;
  applicationTemplates: typeof applicationTemplates;
  applications: typeof applications;
  bounties: typeof bounties;
  certifications: typeof certifications;
  conversations: typeof conversations;
  dataRooms: typeof dataRooms;
  featureFlags: typeof featureFlags;
  fileStorage: typeof fileStorage;
  friends: typeof friends;
  legal: typeof legal;
  matchmaking: typeof matchmaking;
  messages: typeof messages;
  milestones: typeof milestones;
  notifications: typeof notifications;
  project_followers: typeof project_followers;
  projects: typeof projects;
  public_stats: typeof public_stats;
  savedSearches: typeof savedSearches;
  scoring: typeof scoring;
  soft_circles: typeof soft_circles;
  users: typeof users;
  vouches: typeof vouches;
  webhooks: typeof webhooks;
  workspaces: typeof workspaces;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
