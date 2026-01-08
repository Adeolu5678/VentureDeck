/// VentureDeck Mobile - Role Selection Screen
///
/// Screen for users to select their role (Entrepreneur or Investor).
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/constants/app_constants.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/user.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Screen for role selection after sign up
class RoleSelectionScreen extends ConsumerStatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  ConsumerState<RoleSelectionScreen> createState() =>
      _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends ConsumerState<RoleSelectionScreen> {
  UserRole? _selectedRole;
  bool _isLoading = false;

  Future<void> _handleContinue() async {
    if (_selectedRole == null) return;

    setState(() => _isLoading = true);

    try {
      final success = await ref
          .read(authNotifierProvider.notifier)
          .updateRole(_selectedRole!);

      if (mounted && success) {
        context.go(RoutePaths.home);
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
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: AppSpacing.xl),

                // Header
                Text(
                  'Choose Your Path',
                  style: AppTypography.displaySmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ).animate().fadeIn().slideY(begin: -0.2, end: 0),

                const SizedBox(height: AppSpacing.sm),

                Text(
                  'Select how you want to use VentureDeck',
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textTertiary,
                  ),
                  textAlign: TextAlign.center,
                ).animate(delay: 100.ms).fadeIn(),

                const Spacer(),

                // Role cards
                _buildRoleCard(
                  role: UserRole.entrepreneur,
                  icon: Icons.rocket_launch_rounded,
                  title: 'Entrepreneur',
                  subtitle: 'The Forge',
                  description:
                      'Build your pitch deck, track milestones, and connect with investors to fund your vision.',
                  features: [
                    'Create and manage projects',
                    'Build team workspaces',
                    'Track traction score',
                    'Access investor network',
                  ],
                  delay: 200.ms,
                ),

                const SizedBox(height: AppSpacing.md),

                _buildRoleCard(
                  role: UserRole.investor,
                  icon: Icons.trending_up_rounded,
                  title: 'Investor',
                  subtitle: 'Deal Flow',
                  description:
                      'Discover high-potential startups, manage your portfolio, and connect with founders.',
                  features: [
                    'Browse curated deals',
                    'AI-powered matchmaking',
                    'Due diligence tools',
                    'Portfolio tracking',
                  ],
                  delay: 300.ms,
                ),

                const Spacer(),

                // Continue button
                PremiumButton(
                  onPressed: _selectedRole != null && !_isLoading
                      ? _handleContinue
                      : null,
                  isLoading: _isLoading,
                  label: 'Continue',
                  icon: Icons.arrow_forward_rounded,
                  variant: PremiumButtonVariant.gradient,
                  size: PremiumButtonSize.large,
                  fullWidth: true,
                ).animate(delay: 400.ms).fadeIn().slideY(begin: 0.2, end: 0),

                const SizedBox(height: AppSpacing.lg),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard({
    required UserRole role,
    required IconData icon,
    required String title,
    required String subtitle,
    required String description,
    required List<String> features,
    required Duration delay,
  }) {
    final isSelected = _selectedRole == role;

    return GestureDetector(
      onTap: () => setState(() => _selectedRole = role),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        child: PremiumCard(
          isSelected: isSelected,
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      gradient: isSelected ? AppColors.primaryGradient : null,
                      color: isSelected
                          ? null
                          : AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: AppRadius.radiusMd,
                    ),
                    child: Icon(
                      icon,
                      color: isSelected
                          ? AppColors.backgroundDark
                          : AppColors.primary,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: AppTypography.headlineSmall.copyWith(
                            color: isSelected
                                ? AppColors.primary
                                : AppColors.textPrimary,
                          ),
                        ),
                        Text(
                          subtitle,
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.textTertiary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primary
                            : AppColors.border,
                        width: 2,
                      ),
                      color: isSelected
                          ? AppColors.primary
                          : Colors.transparent,
                    ),
                    child: isSelected
                        ? const Icon(
                            Icons.check,
                            size: 14,
                            color: AppColors.backgroundDark,
                          )
                        : null,
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.md),
              Text(description, style: AppTypography.bodySmall),
              const SizedBox(height: AppSpacing.md),
              Wrap(
                spacing: AppSpacing.sm,
                runSpacing: AppSpacing.sm,
                children: features.map((feature) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.sm,
                      vertical: AppSpacing.xs,
                    ),
                    decoration: const BoxDecoration(
                      color: AppColors.backgroundCardLight,
                      borderRadius: AppRadius.radiusSm,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.check_circle_outline,
                          size: 12,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(feature, style: AppTypography.labelSmall),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    ).animate(delay: delay).fadeIn().slideX(begin: 0.05, end: 0);
  }
}
