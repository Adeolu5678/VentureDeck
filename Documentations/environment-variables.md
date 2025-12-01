# Environment Variables Documentation

This document lists all environment variables used across the VentureDeck project, their purpose, and the services they are associated with.

## Standardized Naming Convention

We use the following naming convention for environment variables:
- `NEXT_PUBLIC_*`: Variables exposed to the client-side (browser).
- `CLERK_*`: Variables related to Clerk authentication.
- `CONVEX_*`: Variables related to Convex backend.
- `VERCEL_*`: Variables related to Vercel deployment.

## Environment Variables List

| Variable Name | Description | Service | Required In |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_CONVEX_URL` | The URL of the Convex backend instance. | Convex | Web (Client) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | The publishable key for Clerk authentication. | Clerk | Web (Client) |
| `CLERK_SECRET_KEY` | The secret key for Clerk authentication (Server-side). | Clerk | Web (Server), GitHub Actions |
| `CLERK_JWT_ISSUER_DOMAIN` | The domain of the Clerk JWT issuer (used for token validation). | Clerk | Convex |
| `CLERK_WEBHOOK_SECRET` | The secret used to verify Clerk webhooks. | Clerk | Convex |
| `CONVEX_DEPLOYMENT` | The deployment name for Convex (e.g., `dev:venture-deck-123`). | Convex | Web (Build), GitHub Actions |
| `CONVEX_APPLICATION_ID` | The application ID for Convex (used in auth config). | Convex | Convex |
| `VERCEL_TOKEN` | Vercel API token for deployments. | Vercel | GitHub Actions |
| `VERCEL_PROJECT_ID` | Vercel Project ID. | Vercel | GitHub Actions |
| `VERCEL_ORG_ID` | Vercel Organization ID. | Vercel | GitHub Actions |
| `CONVEX_DEPLOY_KEY` | Deploy key for Convex (used in CI/CD). | Convex | GitHub Actions |

## Service Configuration Guide

### Clerk
1.  **Development Instance**:
    - Create a new application in Clerk Dashboard.
    - Get `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from API Keys.
    - Configure `CLERK_JWT_ISSUER_DOMAIN` (usually the Clerk Issuer URL).
    - Create a webhook endpoint pointing to your Convex HTTP Actions URL and get `CLERK_WEBHOOK_SECRET`.
2.  **Production Instance**:
    - Create a separate production application in Clerk.
    - Repeat the steps above to get production keys.

### Convex
1.  **Development Instance**:
    - Run `npx convex dev` to initialize a development project.
    - Get `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` from `.env.local` or dashboard.
    - Set `CLERK_JWT_ISSUER_DOMAIN` and `CONVEX_APPLICATION_ID` in the Convex dashboard environment variables.
2.  **Production Instance**:
    - Run `npx convex deploy` to create a production deployment.
    - Get production URL and deployment name.
    - Set production environment variables in the Convex dashboard.

### Vercel
1.  **Project Settings**:
    - Add `NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to Environment Variables.
    - Ensure separate values are set for **Production** and **Preview/Development** environments.

### GitHub Actions
1.  **Repository Secrets**:
    - Add the following secrets to your GitHub repository settings:
        - `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`
        - `NEXT_PUBLIC_CONVEX_URL` (if needed for build)
        - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (if needed for build)
        - `CLERK_SECRET_KEY`
        - `CONVEX_DEPLOYMENT`
        - `CONVEX_STAGING_DEPLOY_KEY` (for `develop` branch)
        - `CONVEX_PRODUCTION_DEPLOY_KEY` (for `main` branch)
