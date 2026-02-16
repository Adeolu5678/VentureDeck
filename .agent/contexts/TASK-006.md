# TASK-006: Flutter Feature Parity - Phase 1: Discover Screen

## 🎯 Objective
Bring the Flutter `DiscoverScreen` up to feature parity with the Web application by implementing real data fetching, industry filtering, and search functionality.

## 📝 Requirements
- Connect `DiscoverScreen` to `publishedProjectsProvider`.
- Implement interactive industry filtering using `projectsFilterProvider`.
- Implement text search with debounce.
- Replace mockup `_FeaturedProjectCard` with real `ProjectCard`.

## 📂 Relevant Files
- `Flutter/venturedeck_mobile/lib/presentation/screens/discover/discover_screen.dart` [TARGET]
- `Flutter/venturedeck_mobile/lib/domain/providers/projects_provider.dart` [SOURCE]
- `Flutter/venturedeck_mobile/lib/presentation/widgets/project_card.dart` [COMPONENT]

## 🛠️ Implementation Plan
1.  **Modify `discover_screen.dart`**:
    - Convert to `ConsumerStatefulWidget`.
    - Watch `projectsFilterProvider` for state.
    - Implement `_IndustryChip` selection logic.
    - Implement `TextField` listener for search query.
    - Use `ref.watch(publishedProjectsProvider)` to render project list.

## 🔗 References
- Web Implementation: `Web/src/app/projects/page.tsx`
- Design: Existing `DiscoverScreen` UI mockup.
