/// VentureDeck Mobile - Authentication Provider
///
/// Riverpod providers for authentication state management.
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/data/models/user.dart';
import 'package:venturedeck_mobile/data/services/auth_service.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';

/// Auth service provider
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService.instance;
});

/// Auth state provider
final authStateProvider = StreamProvider<AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.stateStream;
});

/// Is authenticated provider
final isAuthenticatedProvider = Provider<bool>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.isAuthenticated;
});

/// Current user ID provider
final currentUserIdProvider = Provider<String?>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.userId;
});

/// Current user provider - fetches user data from Convex
final currentUserProvider = FutureProvider<User?>((ref) async {
  final authService = ref.watch(authServiceProvider);

  if (!authService.isAuthenticated) {
    return null;
  }

  try {
    final convex = ConvexService.instance;
    final userData = await convex.query<Map<String, dynamic>?>(
      'users:getCurrentUser',
    );

    if (userData == null) {
      return null;
    }

    return _mapConvexUserToModel(userData);
  } catch (e) {
    return null;
  }
});

/// Map Convex user data to User model
User _mapConvexUserToModel(Map<String, dynamic> data) {
  return User(
    id: data['_id'] as String,
    clerkId: data['clerkId'] as String,
    username: data['username'] as String,
    email: data['email'] as String,
    firstName: data['firstName'] as String?,
    lastName: data['lastName'] as String?,
    avatarUrl: data['avatarUrl'] as String?,
    role: _parseUserRole(data['role'] as String?),
    displayName: data['displayName'] as String?,
    professionalBio: data['professionalBio'] as String?,
    linkedinUrl: data['linkedinUrl'] as String?,
    githubUrl: data['githubUrl'] as String?,
    isVerified: data['isVerified'] as bool? ?? false,
    isAdmin: data['isAdmin'] as bool? ?? false,
    skills: List<String>.from(data['skills'] as List? ?? []),
    interests: List<String>.from(data['interests'] as List? ?? []),
    tags: List<String>.from(data['tags'] as List? ?? []),
    createdAt: DateTime.fromMillisecondsSinceEpoch(
      (data['createdAt'] as num).toInt(),
    ),
    updatedAt: DateTime.fromMillisecondsSinceEpoch(
      (data['updatedAt'] as num).toInt(),
    ),
  );
}

UserRole? _parseUserRole(String? role) {
  switch (role) {
    case 'entrepreneur':
      return UserRole.entrepreneur;
    case 'investor':
      return UserRole.investor;
    default:
      return null;
  }
}

/// Auth notifier for login/logout actions
class AuthNotifier extends AsyncNotifier<User?> {
  @override
  Future<User?> build() async {
    final user = await ref.watch(currentUserProvider.future);
    return user;
  }

  /// Sign in
  Future<bool> signIn() async {
    state = const AsyncValue.loading();

    try {
      final authService = ref.read(authServiceProvider);
      final result = await authService.signIn();

      if (result != null) {
        // Authenticate with Convex
        await ConvexService.instance.authenticate(result.accessToken);

        // Refresh user data
        ref.invalidate(currentUserProvider);
        final user = await ref.read(currentUserProvider.future);
        state = AsyncValue.data(user);
        return true;
      }

      state = const AsyncValue.data(null);
      return false;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Sign in with token (for development)
  Future<bool> signInWithToken(String token, {String? userId}) async {
    state = const AsyncValue.loading();

    try {
      final authService = ref.read(authServiceProvider);
      final success = await authService.signInWithToken(token, userId: userId);

      if (success) {
        await ConvexService.instance.authenticate(token);
        ref.invalidate(currentUserProvider);
        final user = await ref.read(currentUserProvider.future);
        state = AsyncValue.data(user);
        return true;
      }

      state = const AsyncValue.data(null);
      return false;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    state = const AsyncValue.loading();

    try {
      final authService = ref.read(authServiceProvider);
      await authService.signOut();
      ConvexService.instance.clearAuth();
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Update user role
  Future<bool> updateRole(UserRole role) async {
    try {
      await ConvexService.instance.mutation('users:updateRole', {
        'role': role == UserRole.entrepreneur ? 'entrepreneur' : 'investor',
      });

      ref.invalidate(currentUserProvider);
      final user = await ref.read(currentUserProvider.future);
      state = AsyncValue.data(user);
      return true;
    } catch (e) {
      return false;
    }
  }
}

/// Auth notifier provider
final authNotifierProvider = AsyncNotifierProvider<AuthNotifier, User?>(
  AuthNotifier.new,
);
