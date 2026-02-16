# Task Context: API Layer Refactoring (Services & Repositories)

## 📋 Task Reference

| Field | Value |
|-------|-------|
| **Task ID** | TASK-002 |
| **Priority** | P0 |
| **Created** | 2026-02-07 |
| **Status** | 🔄 IN PROGRESS |

---

## 🎯 Objective

### What
Refactor the Flutter data layer (`repositories` and `services`) to ensure all API calls match the actual function names and signatures exposed by the Convex backend.

### Why
The current Flutter implementation uses outdated or incorrect function names (e.g., `projects:listPublished` instead of `projects:list`). This causes runtime errors and broken functionality.

### Success Criteria
- [ ] `projects_repository.dart` calls correct Convex functions (projects:list, projects:get, etc.)
- [ ] `bounties_repository.dart` calls correct Convex functions
- [ ] `conversations_repository.dart` calls correct Convex functions
- [ ] `convex_service.dart` is cleaned of outdated helper methods

---

## 📁 Relevant Files

### Primary Files (will be modified)
| File | Purpose |
|------|---------|
| `lib/data/repositories/projects_repository.dart` | Handles project data fetching |
| `lib/data/repositories/bounties_repository.dart` | Handles bounty data fetching |
| `lib/data/repositories/conversations_repository.dart` | Handles messaging |
| `lib/data/services/convex_service.dart` | Core Convex client wrapper |

### Secondary Files (for reference)
| File | Purpose |
|------|---------|
| `Convex/convex/*.ts` | Backend Source of Truth |

---

## 🧩 Approach

Each repository will be updated systematically:
1.  **Projects**: Map `listPublished` -> `list`, `getById` -> `get`. Handle `delete` and `publish` gaps.
2.  **Bounties**: Map `listByProject` -> `list`. Handle `reward` type change (Double -> String) in arguments.
3.  **Conversations**: Map `messages:list` -> `conversations:getMessages`.
4.  **Service**: Remove "helper" methods that hardcode function names, encouraging repositories to call `client.query/mutation` directly with the correct string.
