/// VentureDeck Mobile - Login Screen
///
/// Authentication screen with OAuth sign-in.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/constants/app_constants.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';

/// Login screen with OAuth options
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  bool _isLoading = false;

  Future<void> _handleSignIn() async {
    setState(() => _isLoading = true);

    try {
      final success = await ref.read(authNotifierProvider.notifier).signIn();

      if (mounted && success) {
        // Check if user needs role selection
        final user = await ref.read(currentUserProvider.future);

        if (!mounted) return;

        if (user?.role == null) {
          context.go('/role-selection');
        } else {
          context.go(RoutePaths.home);
        }
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // For development: bypass auth
  Future<void> _handleDevSignIn() async {
    setState(() => _isLoading = true);

    try {
      // Use a dev token for testing
      final success = await ref
          .read(authNotifierProvider.notifier)
          .signInWithToken('dev_token', userId: 'dev_user');

      if (mounted && success) {
        context.go('/role-selection');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              children: [
                const Spacer(),

                // Logo and branding
                _buildHeader(),

                const Spacer(),

                // Sign in options
                _buildSignInSection(),

                const SizedBox(height: AppSpacing.xl),

                // Terms notice
                _buildTermsNotice(),

                const SizedBox(height: AppSpacing.lg),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      children: [
        // Logo
        Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(20),
                boxShadow: AppShadows.glow,
              ),
              child: const Icon(
                Icons.rocket_launch_rounded,
                color: AppColors.backgroundDark,
                size: 40,
              ),
            )
            .animate()
            .scale(
              begin: const Offset(0.8, 0.8),
              duration: 500.ms,
              curve: Curves.easeOutBack,
            )
            .fadeIn(),

        const SizedBox(height: AppSpacing.lg),

        // App name
        Text(
          'VentureDeck',
          style: AppTypography.displaySmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ).animate(delay: 100.ms).fadeIn().slideY(begin: 0.2, end: 0),

        const SizedBox(height: AppSpacing.sm),

        // Tagline
        Text(
          'Where Ambition Meets Opportunity',
          style: AppTypography.bodyMedium.copyWith(
            color: AppColors.textTertiary,
          ),
          textAlign: TextAlign.center,
        ).animate(delay: 200.ms).fadeIn(),

        const SizedBox(height: AppSpacing.xxl),

        // Description
        Container(
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            color: AppColors.backgroundCard,
            borderRadius: AppRadius.radiusLg,
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              _buildFeatureRow(
                Icons.rocket_launch,
                'Launch',
                'Build your startup pitch',
              ),
              const SizedBox(height: AppSpacing.md),
              _buildFeatureRow(
                Icons.people,
                'Connect',
                'Find investors & co-founders',
              ),
              const SizedBox(height: AppSpacing.md),
              _buildFeatureRow(
                Icons.trending_up,
                'Grow',
                'Track traction & funding',
              ),
            ],
          ),
        ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1, end: 0),
      ],
    );
  }

  Widget _buildFeatureRow(IconData icon, String title, String subtitle) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.primary.withValues(alpha: 0.1),
            borderRadius: AppRadius.radiusSm,
          ),
          child: Icon(icon, color: AppColors.primary, size: 20),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.labelLarge.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
              Text(subtitle, style: AppTypography.bodySmall),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSignInSection() {
    return Column(
      children: [
        // Main sign in button
        PremiumButton(
          onPressed: _isLoading ? null : _handleSignIn,
          isLoading: _isLoading,
          icon: Icons.login_rounded,
          label: 'Continue with Clerk',
          variant: PremiumButtonVariant.gradient,
          size: PremiumButtonSize.large,
          fullWidth: true,
        ).animate(delay: 400.ms).fadeIn().slideY(begin: 0.2, end: 0),

        const SizedBox(height: AppSpacing.md),

        // Dev sign in (only in debug mode)
        if (const bool.fromEnvironment('dart.vm.product') == false) ...[
          TextButton(
            onPressed: _isLoading ? null : _handleDevSignIn,
            child: Text(
              'Dev Mode: Skip Auth',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textTertiary,
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildTermsNotice() {
    return Text(
      'By continuing, you agree to our Terms of Service and Privacy Policy',
      style: AppTypography.labelSmall.copyWith(color: AppColors.textMuted),
      textAlign: TextAlign.center,
    ).animate(delay: 500.ms).fadeIn();
  }
}
