# Task Context: Environment Setup (Flutter .env & Setup)

## 📋 Task Reference

| Field | Value |
|-------|-------|
| **Task ID** | TASK-001 |
| **Priority** | P0 |
| **Created** | 2026-02-07 |
| **Status** | 🔄 IN PROGRESS |

---

## 🎯 Objective

### What
Configure the Flutter environment variables to allow the mobile application to connect to the configured Convex backend and Clerk authentication service.

### Why
The Flutter app cannot function without a connection to the backend. The `.env` file is missing, causing build or runtime failures when trying to access `CONVEX_URL` or `CLERK_PUBLISHABLE_KEY`.

### Success Criteria
- [ ] `.env` file exists in `Flutter/venturedeck_mobile`
- [ ] `CONVEX_URL` matches the Web environment
- [ ] `CLERK_PUBLISHABLE_KEY` matches the Web environment

---

## 📁 Relevant Files

### Primary Files (will be modified)
| File | Purpose |
|------|---------|
| `Flutter/venturedeck_mobile/.env` | The target environment configuration file |

### Secondary Files (for reference)
| File | Purpose |
|------|---------|
| `Web/.env.development` | Source of truth for backend URLs/keys |
| `Flutter/venturedeck_mobile/.env.example` | Template for the .env file |

---

## 🔗 Dependencies

### Task Dependencies
None. This is a foundational task.

---

## ⚙️ Technical Context

### Current State
The Flutter project has a `pubspec.yaml` and source code, but no `.env` file. It relies on `flutter_dotenv` (implied by `.env.example`).

### Desired State
A valid `.env` file exists with the correct keys for the development environment.

### Constraints
- Must match the values used in the Web version to ensure they hit the same database.

---
