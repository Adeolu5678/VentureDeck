/// VentureDeck Mobile - Splash Screen
///
/// Initial loading screen with branding.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/constants/app_constants.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/services/auth_service.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';

/// Splash screen shown on app launch
class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Small delay for splash visibility
    await Future.delayed(AnimationDurations.splash);

    if (!mounted) return;

    try {
      // Initialize auth service
      await AuthService.instance.initialize();

      // Try to connect to Convex
      try {
        await ConvexService.instance.connect();

        // If we have an access token, authenticate with Convex
        final token = AuthService.instance.accessToken;
        if (token != null) {
          await ConvexService.instance.authenticate(token);
        }
      } catch (e) {
        debugPrint('Convex connection failed: $e');
        // Continue without Convex - will retry later
      }

      if (!mounted) return;

      // Navigate based on auth state
      final isAuthenticated = AuthService.instance.isAuthenticated;

      if (isAuthenticated) {
        // Check if user has selected a role
        final user = await ref.read(currentUserProvider.future);
        if (!mounted) return;
        if (user?.role == null) {
          context.go('/role-selection');
        } else {
          context.go(RoutePaths.home);
        }
      } else {
        if (!mounted) return;
        context.go(RoutePaths.login);
      }
    } catch (e) {
      debugPrint('Initialization error: $e');
      if (mounted) {
        context.go(RoutePaths.login);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: AppShadows.glow,
                    ),
                    child: const Icon(
                      Icons.rocket_launch_rounded,
                      color: AppColors.backgroundDark,
                      size: 48,
                    ),
                  )
                  .animate()
                  .scale(
                    begin: const Offset(0.5, 0.5),
                    end: const Offset(1, 1),
                    duration: 600.ms,
                    curve: Curves.easeOutBack,
                  )
                  .fadeIn(duration: 400.ms),
              const SizedBox(height: AppSpacing.lg),

              // App name
              Text(
                    'VentureDeck',
                    style: AppTypography.displaySmall.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  )
                  .animate(delay: 200.ms)
                  .fadeIn(duration: 400.ms)
                  .slideY(begin: 0.2, end: 0),

              const SizedBox(height: AppSpacing.sm),

              // Tagline
              Text(
                'Where Ambition Meets Opportunity',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textTertiary,
                ),
              ).animate(delay: 400.ms).fadeIn(duration: 400.ms),

              const SizedBox(height: AppSpacing.xxl),

              // Loading indicator
              SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.primary.withValues(alpha: 0.7),
                  ),
                ),
              ).animate(delay: 600.ms).fadeIn(duration: 300.ms),
            ],
          ),
        ),
      ),
    );
  }
}
