# TASK-007: Flutter Feature Parity - Phase 2: Dashboard Data

## 🎯 Objective
Connect `DashboardScreen` to real analytics data from the backend, replacing placeholders with actual statistics for both Entrepreneurs and Investors.

## 📝 Requirements
- Create `AnalyticsRepository` to interact with `convex/analytics.ts`.
- Create `analyticsProvider` and `dashboardStatsProvider`.
- Update `DashboardScreen` to fetch and display data:
    - **Entrepreneur**: Total Views, Unique Views, Followers, Soft Circle, Traction Score.
    - **Investor**: Following count, Portfolio updates (mock or real if API exists).

## 📂 Relevant Files
- `Flutter/venturedeck_mobile/lib/presentation/screens/dashboard/dashboard_screen.dart` [TARGET]
- `Flutter/venturedeck_mobile/lib/data/repositories/analytics_repository.dart` [NEW]
- `Flutter/venturedeck_mobile/lib/domain/providers/analytics_provider.dart` [NEW]
- `Convex/convex/analytics.ts` [API REFERENCE]

## 🛠️ Implementation Plan
1.  **Create `analytics_repository.dart`**:
    -   Implement `getProjectAnalytics(projectId, days)`.
    -   Use `ConvexService` to call `analytics:getProjectAnalytics`.

2.  **Create `analytics_provider.dart`**:
    -   `analyticsRepositoryProvider`.
    -   `projectAnalyticsProvider(projectId)`.

3.  **Modify `dashboard_screen.dart`**:
    -   Use `myProjectsProvider` to get the user's primary project.
    -   Fetch analytics for that project.
    -   Bind data to `_StatCard` widgets.
    -   Handle loading/error states.

## 🔗 References
- Web Implementation: `Web/src/app/dashboard/page.tsx`
- API: `analytics:getProjectAnalytics` returns `{ snapshots: [], realtime: { ... } }`.
