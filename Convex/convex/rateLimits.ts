import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { Id } from './_generated/dataModel';

export const RATE_LIMIT_CONFIGS = {
  messages: { maxRequests: 30, windowMs: 60 * 1000 },
  applications: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
  friendRequests: { maxRequests: 20, windowMs: 60 * 60 * 1000 },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

interface RateLimitEntry {
  _id: Id<'rateLimits'>;
  userId: Id<'users'>;
  limitType: RateLimitType;
  timestamps: number[];
}

export async function checkRateLimit(
  db: any,
  userId: Id<'users'>,
  limitType: RateLimitType
): Promise<void> {
  const config = RATE_LIMIT_CONFIGS[limitType];
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  const existing: RateLimitEntry | null = await db
    .query('rateLimits')
    .withIndex('by_user_type', (q: any) => q.eq('userId', userId).eq('limitType', limitType))
    .first();

  if (existing) {
    const validTimestamps = existing.timestamps.filter((ts: number) => ts > windowStart);
    
    if (validTimestamps.length >= config.maxRequests) {
      const oldestValid = validTimestamps[0];
      const retryAfterMs = oldestValid - windowStart;
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      
      throw new Error(
        `Rate limit exceeded. Please wait ${retryAfterSec} seconds before trying again.`
      );
    }
  }
}

export async function recordRateLimit(
  db: any,
  userId: Id<'users'>,
  limitType: RateLimitType
): Promise<void> {
  const config = RATE_LIMIT_CONFIGS[limitType];
  const now = Date.now();
  const windowStart = now - config.windowMs;

  const existing: RateLimitEntry | null = await db
    .query('rateLimits')
    .withIndex('by_user_type', (q: any) => q.eq('userId', userId).eq('limitType', limitType))
    .first();

  if (existing) {
    const validTimestamps = existing.timestamps.filter((ts: number) => ts > windowStart);
    await db.patch(existing._id, {
      timestamps: [...validTimestamps, now],
    });
  } else {
    await db.insert('rateLimits', {
      userId,
      limitType,
      timestamps: [now],
    });
  }
}

export async function enforceRateLimit(
  db: any,
  userId: Id<'users'>,
  limitType: RateLimitType
): Promise<void> {
  await checkRateLimit(db, userId, limitType);
  await recordRateLimit(db, userId, limitType);
}

export const getRateLimitStatus = mutation({
  args: {
    limitType: v.union(
      v.literal('messages'),
      v.literal('applications'),
      v.literal('friendRequests')
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();

    if (!user) return null;

    const config = RATE_LIMIT_CONFIGS[args.limitType];
    const now = Date.now();
    const windowStart = now - config.windowMs;

    const existing = await ctx.db
      .query('rateLimits')
      .withIndex('by_user_type', (q: any) =>
        q.eq('userId', user._id).eq('limitType', args.limitType)
      )
      .first();

    if (!existing) {
      return {
        used: 0,
        limit: config.maxRequests,
        resetAt: now + config.windowMs,
      };
    }

    const validTimestamps = existing.timestamps.filter((ts: number) => ts > windowStart);
    const oldestValid = validTimestamps.length > 0 ? validTimestamps[0] : null;
    const resetAt = oldestValid ? oldestValid + config.windowMs : now + config.windowMs;

    return {
      used: validTimestamps.length,
      limit: config.maxRequests,
      resetAt,
    };
  },
});
