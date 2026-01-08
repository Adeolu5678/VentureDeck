/// VentureDeck Mobile - Profile Screen
///
/// Current user profile screen with settings access.
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

/// Profile screen
class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(currentUserProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: userAsync.when(
            data: (user) {
              if (user == null) {
                return const Center(child: Text('User not found'));
              }
              return _ProfileContent(user: user);
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Center(child: Text('Error: $error')),
          ),
        ),
      ),
    );
  }
}

class _ProfileContent extends ConsumerWidget {
  const _ProfileContent({required this.user});

  final User user;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return CustomScrollView(
      slivers: [
        // Header
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Profile',
                  style: AppTypography.headlineMedium.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.settings_outlined),
                  onPressed: () {
                    // Navigate to settings
                  },
                ),
              ],
            ),
          ),
        ),

        // Profile card
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: PremiumCard(
              child: Column(
                children: [
                  // Avatar
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      shape: BoxShape.circle,
                      boxShadow: AppShadows.glow,
                    ),
                    child: user.avatarUrl != null
                        ? ClipOval(
                            child: Image.network(
                              user.avatarUrl!,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) =>
                                  _buildAvatarFallback(),
                            ),
                          )
                        : _buildAvatarFallback(),
                  ).animate().scale(begin: const Offset(0.8, 0.8)),

                  const SizedBox(height: AppSpacing.md),

                  // Name
                  Text(
                    user.fullName,
                    style: AppTypography.headlineSmall.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ).animate(delay: 50.ms).fadeIn(),

                  const SizedBox(height: 4),

                  // Username
                  Text(
                    '@${user.username}',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ).animate(delay: 100.ms).fadeIn(),

                  const SizedBox(height: AppSpacing.sm),

                  // Role badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.xs,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.2),
                      borderRadius: AppRadius.radiusFull,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          user.isEntrepreneur
                              ? Icons.rocket_launch
                              : Icons.trending_up,
                          size: 14,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          user.isEntrepreneur ? 'Entrepreneur' : 'Investor',
                          style: AppTypography.labelSmall.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ).animate(delay: 150.ms).fadeIn(),

                  if (user.professionalBio != null) ...[
                    const SizedBox(height: AppSpacing.lg),
                    Text(
                      user.professionalBio!,
                      style: AppTypography.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],

                  const SizedBox(height: AppSpacing.lg),

                  // Edit profile button
                  PremiumButton(
                    label: 'Edit Profile',
                    icon: Icons.edit_outlined,
                    variant: PremiumButtonVariant.glass,
                    onPressed: () {},
                  ),
                ],
              ),
            ).animate().fadeIn().slideY(begin: 0.1, end: 0),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

        // Stats row
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Row(
              children: [
                Expanded(
                  child: _StatBox(
                    icon: Icons.verified,
                    label: 'Verified',
                    value: user.isVerified ? 'Yes' : 'No',
                    color: user.isVerified
                        ? AppColors.success
                        : AppColors.textMuted,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: _StatBox(
                    icon: Icons.star,
                    label: 'Skills',
                    value: user.skills.length.toString(),
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                const Expanded(
                  child: _StatBox(
                    icon: Icons.people,
                    label: 'Network',
                    value: '0',
                    color: AppColors.accent,
                  ),
                ),
              ],
            ).animate(delay: 200.ms).fadeIn(),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

        // Menu items
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: PremiumCard(
              child: Column(
                children: [
                  _MenuItem(
                    icon: Icons.bookmark_outline,
                    label: 'Saved Items',
                    onTap: () {},
                  ),
                  const Divider(color: AppColors.border, height: 1),
                  _MenuItem(
                    icon: Icons.verified_outlined,
                    label: 'Certifications',
                    onTap: () {},
                  ),
                  const Divider(color: AppColors.border, height: 1),
                  _MenuItem(
                    icon: Icons.link,
                    label: 'Linked Accounts',
                    onTap: () {},
                  ),
                  const Divider(color: AppColors.border, height: 1),
                  _MenuItem(
                    icon: Icons.notifications_outlined,
                    label: 'Notifications',
                    onTap: () {},
                  ),
                  const Divider(color: AppColors.border, height: 1),
                  _MenuItem(
                    icon: Icons.privacy_tip_outlined,
                    label: 'Privacy',
                    onTap: () {},
                  ),
                ],
              ),
            ).animate(delay: 250.ms).fadeIn().slideY(begin: 0.1, end: 0),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

        // Sign out button
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: PremiumCard(
              child: _MenuItem(
                icon: Icons.logout,
                label: 'Sign Out',
                isDestructive: true,
                onTap: () async {
                  await ref.read(authNotifierProvider.notifier).signOut();
                  if (context.mounted) {
                    context.go(RoutePaths.login);
                  }
                },
              ),
            ).animate(delay: 300.ms).fadeIn(),
          ),
        ),

        // Bottom padding
        const SliverToBoxAdapter(child: SizedBox(height: 120)),
      ],
    );
  }

  Widget _buildAvatarFallback() {
    return Center(
      child: Text(
        user.initials,
        style: AppTypography.displaySmall.copyWith(
          color: AppColors.backgroundDark,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

/// Stat box widget
class _StatBox extends StatelessWidget {
  const _StatBox({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  final IconData icon;
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: AppSpacing.sm),
          Text(
            value,
            style: AppTypography.titleMedium.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(label, style: AppTypography.labelSmall),
        ],
      ),
    );
  }
}

/// Menu item widget
class _MenuItem extends StatelessWidget {
  const _MenuItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.isDestructive = false,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isDestructive;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        child: Row(
          children: [
            Icon(
              icon,
              color: isDestructive ? AppColors.error : AppColors.textSecondary,
              size: 22,
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Text(
                label,
                style: AppTypography.bodyMedium.copyWith(
                  color: isDestructive
                      ? AppColors.error
                      : AppColors.textPrimary,
                ),
              ),
            ),
            const Icon(
              Icons.chevron_right,
              color: AppColors.textMuted,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
