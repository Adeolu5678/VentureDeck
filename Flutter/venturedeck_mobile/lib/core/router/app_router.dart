/// VentureDeck Mobile - Router Configuration
///
/// GoRouter configuration with auth guards and navigation.
library;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/constants/app_constants.dart';
import 'package:venturedeck_mobile/data/services/auth_service.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/presentation/screens/auth/login_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/auth/role_selection_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/navigation/main_shell.dart';
import 'package:venturedeck_mobile/presentation/screens/projects/projects_list_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/projects/project_detail_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/discover/discover_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/conversations/conversations_list_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/profile/profile_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/profile/edit_profile_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/projects/project_form_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/conversations/chat_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/settings/settings_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/settings/notification_settings_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/bounties/bounties_list_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/bounties/bounty_detail_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/analytics/project_analytics_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/legal/legal_documents_screen.dart';
import 'package:venturedeck_mobile/presentation/screens/splash/splash_screen.dart';

/// Navigation shell key for nested navigation
final _shellNavigatorKey = GlobalKey<NavigatorState>();
final _rootNavigatorKey = GlobalKey<NavigatorState>();

/// Router provider
final routerProvider = Provider<GoRouter>((ref) {
  final authService = ref.watch(authServiceProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: RoutePaths.splash,
    debugLogDiagnostics: true,
    refreshListenable: _AuthRefreshListenable(authService),
    redirect: (context, state) {
      final isAuthenticated = authService.isAuthenticated;
      final isOnSplash = state.matchedLocation == RoutePaths.splash;
      final isOnLogin = state.matchedLocation == RoutePaths.login;

      // Let splash screen handle initial routing
      if (isOnSplash) return null;

      // If not authenticated, redirect to login
      if (!isAuthenticated && !isOnLogin) {
        return RoutePaths.login;
      }

      // If authenticated and on login, redirect to home
      if (isAuthenticated && isOnLogin) {
        return RoutePaths.home;
      }

      return null;
    },
    routes: [
      // Splash screen
      GoRoute(
        path: RoutePaths.splash,
        builder: (context, state) => const SplashScreen(),
      ),

      // Auth routes
      GoRoute(
        path: RoutePaths.login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/role-selection',
        builder: (context, state) => const RoleSelectionScreen(),
      ),

      // Main shell with bottom navigation
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          // Home / Dashboard
          GoRoute(
            path: RoutePaths.home,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: DashboardScreen()),
          ),

          // Projects
          GoRoute(
            path: RoutePaths.projects,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ProjectsListScreen()),
          ),

          // Discover / Search
          GoRoute(
            path: RoutePaths.search,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: DiscoverScreen()),
          ),

          // Messages
          GoRoute(
            path: RoutePaths.messages,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ConversationsListScreen()),
          ),

          // Profile
          GoRoute(
            path: RoutePaths.profile,
            pageBuilder: (context, state) =>
                const NoTransitionPage(child: ProfileScreen()),
          ),
        ],
      ),

      // Detail routes (outside shell for full-screen presentation)
      GoRoute(
        path: '${RoutePaths.projects}/:id',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return ProjectDetailScreen(projectId: projectId);
        },
      ),

      // Create project
      GoRoute(
        path: '/projects/new',
        builder: (context, state) => const ProjectFormScreen(),
      ),

      // Edit project
      GoRoute(
        path: '${RoutePaths.projects}/:id/edit',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return ProjectFormScreen(projectId: projectId);
        },
      ),

      // Chat screen
      GoRoute(
        path: '/chat/:id',
        builder: (context, state) {
          final conversationId = state.pathParameters['id']!;
          return ChatScreen(conversationId: conversationId);
        },
      ),

      // Edit profile
      GoRoute(
        path: '/profile/edit',
        builder: (context, state) => const EditProfileScreen(),
      ),

      // Settings
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),

      // Notification settings
      GoRoute(
        path: '/settings/notifications',
        builder: (context, state) => const NotificationSettingsScreen(),
      ),

      // Bounties list
      GoRoute(
        path: '/bounties',
        builder: (context, state) => const BountiesListScreen(),
      ),

      // Bounty detail
      GoRoute(
        path: '/bounties/:id',
        builder: (context, state) {
          final bountyId = state.pathParameters['id']!;
          return BountyDetailScreen(bountyId: bountyId);
        },
      ),

      // Project analytics
      GoRoute(
        path: '/projects/:id/analytics',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return ProjectAnalyticsScreen(projectId: projectId);
        },
      ),

      // Legal documents
      GoRoute(
        path: '/projects/:id/legal',
        builder: (context, state) {
          final projectId = state.pathParameters['id']!;
          return LegalDocumentsScreen(projectId: projectId);
        },
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Colors.red),
            const SizedBox(height: 16),
            Text(
              'Page not found',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(state.matchedLocation),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go(RoutePaths.home),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
});

/// Listenable for auth state changes
class _AuthRefreshListenable extends ChangeNotifier {
  _AuthRefreshListenable(this._authService) {
    _authService.stateStream.listen((_) => notifyListeners());
  }

  final AuthService _authService;
}
