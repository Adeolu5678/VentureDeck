# VentureDeck Environment Variables

This document lists all required environment variables for running VentureDeck.

## Web Application (Next.js)

Create a `.env.local` file in the `Web` directory with:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication (get from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

## Convex Backend

Create a `.env.local` file in the `Convex` directory with:

```bash
# Clerk JWT Configuration (from Clerk Dashboard > JWT Templates)
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev

# Convex Application ID (from Convex Dashboard)
CONVEX_APPLICATION_ID=convex

# Clerk Webhook Secret (from Clerk Dashboard > Webhooks)
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

## Clerk Webhook Configuration

1. Go to Clerk Dashboard > Webhooks
2. Add endpoint: `https://your-convex-deployment.convex.site/clerkWebhook`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SECRET`

## Getting Your Keys

| Variable | Where to Find |
|----------|--------------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex Dashboard > Settings > Deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard > API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard > API Keys |
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk Dashboard > JWT Templates > Convex template |
| `CONVEX_APPLICATION_ID` | Usually "convex" for standard setups |
| `CLERK_WEBHOOK_SECRET` | Clerk Dashboard > Webhooks > Signing Secret |

## Security Notes

> [!CAUTION]
> Never commit `.env.local` files to version control. They are already in `.gitignore`.

> [!IMPORTANT]
> In production, set these as environment secrets in your deployment platform (Vercel, etc.)
