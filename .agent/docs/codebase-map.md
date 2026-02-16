# 🗺️ CODEBASE MAP

> **Purpose**: Quick navigation guide for finding relevant files.
> **Project**: VenturDeck
> **Technology**: TypeScript (Web) / Dart & Flutter (Mobile)
> **Last Updated**: 2026-02-07

---

## 📁 Project Structure

```
c:\Projects\Applications Development\VenturDeck\
├── .agent/                   # 🤖 Workflow system
│
├── Web/                      # 🌐 Next.js Web Application
│   ├── .env.development      # Web Env Config
│   └── src/                  # Web Source Code
│
├── Flutter/venturedeck_mobile/ # 📱 Flutter Mobile Application
│   ├── lib/
│   │   ├── core/             # Constants, utilities
│   │   ├── data/
│   │   │   ├── models/       # Freezed data models
│   │   │   ├── repositories/ # Calls to Convex Service
│   │   │   └── services/     # ConvexService implementation
│   │   ├── domain/           # Riverpod Providers
│   │   └── presentation/     # UI Screens & Widgets
│   ├── pubspec.yaml          # Flutter dependencies
│   └── .env (missing)        # Flutter Env Config
│
└── Convex/convex/            # ☁️ Backend Functions
    ├── schema.ts             # Database Schema
    ├── projects.ts
    ├── bounties.ts
    └── conversations.ts
```

---

## 🏷️ Directory Purposes

| Directory | Purpose | When to Look Here |
|-----------|---------|-------------------|
| `./.agent/` | Workflow system | Always start here |
| `Web/` | Web App | Reference for functionality |
| `Flutter/` | Mobile App | **Primary Work Area** |
| `Convex/` | Backend | **API Reference & Source of Truth** |

---

## 🔎 Quick Find Guide

| Looking For | Check These Locations |
|-------------|----------------------|
| Backend Schema | `Convex/convex/schema.ts` |
| Flutter Models | `Flutter/venturedeck_mobile/lib/data/models/` |
| Flutter API Calls | `Flutter/venturedeck_mobile/lib/data/repositories/` |
| API Definitions | `Convex/convex/*.ts` |

---

## 🔗 Related Documentation

- Task Registry: `./.agent/docs/task-registry.md`
- Workflow Guide: `./.agent/workflows/ralph.md`

---
