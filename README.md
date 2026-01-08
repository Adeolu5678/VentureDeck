# VentureDeck

> **"Where Ambition Meets Opportunity."**

![VentureDeck](https://via.placeholder.com/1200x400/1a1a2e/eab308?text=VentureDeck+-+The+Premium+Launchpad+for+Startups)

## Vision

We envision a world where every groundbreaking idea has a clear path to reality. VentureDeck is the catalyst that transforms raw ambition into investable enterprises, democratizing access to capital and talent for visionaries everywhere.

## Overview

VentureDeck is the ultimate launchpad for new startups. It bridges the gap between "I have an idea" and "I have funding" by providing a dual-interface platform:

- **The Forge (For Entrepreneurs):** A structured environment to articulate visions, build pitch decks, showcase traction, and connect with investors.
- **Deal Flow (For Investors):** A high-signal discovery engine with AI-powered matchmaking, due diligence data rooms, and commitment tracking.
- **Bounties (For Talent):** Micro-task opportunities to prove skills and join high-potential teams.

## Key Features

### For Entrepreneurs
- 🚀 **Project Forge** - Guided project creation with automatic workspace provisioning
- 📊 **AI Traction Scoring** - Automated scoring based on milestones, commitments, and engagement
- 📁 **Data Rooms** - Secure document sharing for investor due diligence
- 📜 **Legal Templates** - SAFE, NDA, Advisor agreements, and more
- 📈 **Analytics Dashboard** - Track views, followers, and engagement trends
- 🎯 **Milestone Tracking** - Living pitch deck with verifiable achievements

### For Investors
- 🔍 **Smart Discovery** - Filter by industry, stage, funding range, and traction score
- 🤖 **AI Matchmaking** - Personalized project recommendations based on investment thesis
- 💾 **Saved Searches** - Save filters with optional new-match alerts
- 💰 **Soft Circles** - Express non-binding investment interest
- 🔐 **Data Room Access** - Secure access to confidential documents

### For Everyone
- 💬 **Real-time Messaging** - Direct, workspace, and interview chats
- 👥 **Team Building** - Applications, interviews, and workspace collaboration
- ✅ **Verified Profiles** - Certification verification and vouch system
- 🔔 **Notifications** - Stay updated on applications, commitments, and messages
- 🤝 **Friends System** - Build your professional network

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend (Web)** | Next.js 15 (App Router), React 18, TypeScript |
| **Frontend (Mobile)** | Flutter (iOS/Android) - in development |
| **Backend** | Convex (Real-time Database & Serverless Functions) |
| **Authentication** | Clerk |
| **Styling** | Tailwind CSS, Framer Motion |
| **Typography** | Sora, Outfit (Google Fonts) |

## Project Structure

```
VentureDeck/
├── Convex/                 # Backend (Convex)
│   ├── convex/             # Functions and schema
│   │   ├── schema.ts       # Database schema (22 tables)
│   │   ├── users.ts        # User management
│   │   ├── projects.ts     # Project CRUD
│   │   ├── applications.ts # Application system
│   │   ├── conversations.ts# Messaging
│   │   ├── scoring.ts      # AI traction scoring
│   │   ├── matchmaking.ts  # Investor matching
│   │   ├── dataRooms.ts    # Due diligence rooms
│   │   ├── legal.ts        # Legal templates
│   │   └── ...             # 32+ function files
│   └── webhook-setup.md
│
├── Web/                    # Web Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities
│   └── package.json
│
├── Flutter/                # Mobile App (Flutter)
│   └── venturedeck_mobile/ # Flutter project
│
├── Documentations/         # Project documentation
│   ├── Software Specification Documentation (SSD)/
│   │   ├── 1. Introduction & Overview.md
│   │   ├── 2. System Architecture and Design.md
│   │   ├── 3. Data Models.md
│   │   ├── 4. Detailed Functional Workflows.md
│   │   ├── 5. Non-Functional Requirements (NFRs).md
│   │   ├── 6. External Interfaces and Dependencies.md
│   │   └── 7. Glossary of Terms.md
│   ├── Refined SSD/
│   │   └── Master Specification.md
│   ├── API Endpoints.md
│   └── environment-variables.md
│
├── design-system/          # Shared design tokens
├── ReactNative/            # Legacy (deprecated)
└── package.json            # Workspace root
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adeolu5678/VentureDeck.git
   cd VentureDeck
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   
   Create `.env.local` in `Web/` directory:
   ```env
   NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
   ```
   
   Set environment variables in Convex dashboard:
   - `CLERK_JWT_ISSUER_DOMAIN`
   - `CLERK_WEBHOOK_SECRET`

4. **Run Development Servers:**
   ```bash
   # Run both Frontend and Backend
   pnpm dev
   
   # Or individually:
   pnpm dev:web    # Web App (localhost:3000)
   pnpm dev:convex # Convex dev server
   ```

## Database Schema

VentureDeck uses **22 database tables** organized into functional domains:

| Category | Tables |
|----------|--------|
| Core | users, projects, workspaces, certifications |
| Communication | conversations, messages, notifications |
| Applications | applications, applicationTemplates |
| Engagement | milestones, bounties, project_followers, soft_circles, vouches |
| Analytics | projectAnalytics, projectViews |
| Due Diligence | dataRooms, dataRoomDocuments, dataRoomAccess |
| Legal | legalDocs |
| Social | friends |
| Configuration | featureFlags, savedSearches |

## API Reference

The backend exposes **32 function modules** with comprehensive queries and mutations. See [API Endpoints.md](./Documentations/API%20Endpoints.md) for full documentation.

### Key Endpoints

| Module | Purpose |
|--------|---------|
| `users` | User profile management |
| `projects` | Project CRUD and discovery |
| `applications` | Team application workflow |
| `scoring` | AI traction score calculation |
| `matchmaking` | Investor-project matching |
| `dataRooms` | Secure document sharing |
| `legal` | Legal document templates |

## Documentation

- **[SSD - Introduction & Overview](./Documentations/Software%20Specification%20Documentation%20(SSD)/1.%20Introduction%20%26%20Overview.md)** - Project scope and use cases
- **[SSD - System Architecture](./Documentations/Software%20Specification%20Documentation%20(SSD)/2.%20System%20Architecture%20and%20Design.md)** - Technical architecture
- **[SSD - Data Models](./Documentations/Software%20Specification%20Documentation%20(SSD)/3.%20Data%20Models.md)** - Complete database schema
- **[SSD - Functional Workflows](./Documentations/Software%20Specification%20Documentation%20(SSD)/4.%20Detailed%20Functional%20Workflows.md)** - 21 detailed user workflows
- **[Master Specification](./Documentations/Refined%20SSD/Master%20Specification.md)** - Executive overview
- **[API Endpoints](./Documentations/API%20Endpoints.md)** - Complete API reference
- **[Environment Variables](./Documentations/environment-variables.md)** - Configuration guide

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

---

**VentureDeck** - *Where Ambition Meets Opportunity* 🚀
