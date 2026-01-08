/// VentureDeck Mobile - Dashboard Screen
///
/// Main dashboard with role-based content.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/constants/app_constants.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/user.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Main dashboard screen
class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

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
              return user.isEntrepreneur
                  ? _EntrepreneurDashboard(user: user)
                  : _InvestorDashboard(user: user);
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, _) => Center(child: Text('Error: $error')),
          ),
        ),
      ),
    );
  }
}

/// Dashboard for entrepreneurs
class _EntrepreneurDashboard extends StatelessWidget {
  const _EntrepreneurDashboard({required this.user});

  final User user;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Header
        SliverToBoxAdapter(child: _DashboardHeader(user: user)),

        // Quick Stats
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Quick Stats',
                  style: AppTypography.titleMedium,
                ).animate().fadeIn().slideX(begin: -0.1, end: 0),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.rocket_launch,
                        label: 'Projects',
                        value: '0',
                        color: AppColors.primary,
                      ).animate(delay: 100.ms).fadeIn().scale(),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.people,
                        label: 'Team',
                        value: '0',
                        color: AppColors.accent,
                      ).animate(delay: 150.ms).fadeIn().scale(),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.trending_up,
                        label: 'Traction',
                        value: '0',
                        color: AppColors.success,
                      ).animate(delay: 200.ms).fadeIn().scale(),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.attach_money,
                        label: 'Interest',
                        value: '\$0',
                        color: AppColors.info,
                      ).animate(delay: 250.ms).fadeIn().scale(),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        // Quick actions
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Quick Actions', style: AppTypography.titleMedium),
                const SizedBox(height: AppSpacing.md),
                PremiumCard(
                  child: Column(
                    children: [
                      _ActionTile(
                        icon: Icons.add_circle_outline,
                        title: 'Create New Project',
                        subtitle: 'Start building your pitch',
                        onTap: () => context.push('/projects/new'),
                      ),
                      const Divider(color: AppColors.border),
                      _ActionTile(
                        icon: Icons.flag_outlined,
                        title: 'Add Milestone',
                        subtitle: 'Track your progress',
                        onTap: () {},
                      ),
                      const Divider(color: AppColors.border),
                      _ActionTile(
                        icon: Icons.people_outline,
                        title: 'Invite Team Member',
                        subtitle: 'Grow your team',
                        onTap: () {},
                      ),
                    ],
                  ),
                ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1, end: 0),
              ],
            ),
          ),
        ),

        // Recent Activity placeholder
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Recent Activity', style: AppTypography.titleMedium),
                const SizedBox(height: AppSpacing.md),
                PremiumCard(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.xl),
                      child: Column(
                        children: [
                          const Icon(
                            Icons.history,
                            size: 48,
                            color: AppColors.textMuted,
                          ),
                          const SizedBox(height: AppSpacing.md),
                          Text(
                            'No recent activity',
                            style: AppTypography.bodyMedium.copyWith(
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Text(
                            'Create a project to get started',
                            style: AppTypography.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ),
                ).animate(delay: 400.ms).fadeIn().slideY(begin: 0.1, end: 0),
              ],
            ),
          ),
        ),

        // Bottom padding
        const SliverToBoxAdapter(child: SizedBox(height: 100)),
      ],
    );
  }
}

/// Dashboard for investors
class _InvestorDashboard extends StatelessWidget {
  const _InvestorDashboard({required this.user});

  final User user;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        // Header
        SliverToBoxAdapter(child: _DashboardHeader(user: user)),

        // Quick Stats
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Portfolio Overview',
                  style: AppTypography.titleMedium,
                ).animate().fadeIn().slideX(begin: -0.1, end: 0),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.star,
                        label: 'Following',
                        value: '0',
                        color: AppColors.primary,
                      ).animate(delay: 100.ms).fadeIn().scale(),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.handshake,
                        label: 'Committed',
                        value: '\$0',
                        color: AppColors.success,
                      ).animate(delay: 150.ms).fadeIn().scale(),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.auto_awesome,
                        label: 'Matches',
                        value: '0',
                        color: AppColors.accent,
                      ).animate(delay: 200.ms).fadeIn().scale(),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: const _StatCard(
                        icon: Icons.analytics,
                        label: 'Avg Score',
                        value: '-',
                        color: AppColors.info,
                      ).animate(delay: 250.ms).fadeIn().scale(),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        // Quick actions
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Quick Actions', style: AppTypography.titleMedium),
                const SizedBox(height: AppSpacing.md),
                PremiumCard(
                  child: Column(
                    children: [
                      _ActionTile(
                        icon: Icons.explore_outlined,
                        title: 'Discover Projects',
                        subtitle: 'Browse curated deals',
                        onTap: () => context.go(RoutePaths.search),
                      ),
                      const Divider(color: AppColors.border),
                      _ActionTile(
                        icon: Icons.auto_awesome,
                        title: 'AI Matchmaking',
                        subtitle: 'Find perfect matches',
                        onTap: () {},
                      ),
                      const Divider(color: AppColors.border),
                      _ActionTile(
                        icon: Icons.bookmark_outline,
                        title: 'Saved Searches',
                        subtitle: 'View your saved filters',
                        onTap: () {},
                      ),
                    ],
                  ),
                ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1, end: 0),
              ],
            ),
          ),
        ),

        // Top Matches placeholder
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Top Matches', style: AppTypography.titleMedium),
                    TextButton(
                      onPressed: () => context.go(RoutePaths.search),
                      child: Text(
                        'View All',
                        style: AppTypography.labelSmall.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                PremiumCard(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(AppSpacing.xl),
                      child: Column(
                        children: [
                          const Icon(
                            Icons.auto_awesome,
                            size: 48,
                            color: AppColors.textMuted,
                          ),
                          const SizedBox(height: AppSpacing.md),
                          Text(
                            'No matches yet',
                            style: AppTypography.bodyMedium.copyWith(
                              color: AppColors.textMuted,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Text(
                            'Complete your thesis to get personalized matches',
                            style: AppTypography.bodySmall,
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ).animate(delay: 400.ms).fadeIn().slideY(begin: 0.1, end: 0),
              ],
            ),
          ),
        ),

        // Bottom padding
        const SliverToBoxAdapter(child: SizedBox(height: 100)),
      ],
    );
  }
}

/// Dashboard header with greeting
class _DashboardHeader extends StatelessWidget {
  const _DashboardHeader({required this.user});

  final User user;

  @override
  Widget build(BuildContext context) {
    final greeting = _getGreeting();

    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  greeting,
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textTertiary,
                  ),
                ).animate().fadeIn(),
                const SizedBox(height: 4),
                Text(
                  user.fullName,
                  style: AppTypography.headlineMedium.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ).animate(delay: 50.ms).fadeIn().slideX(begin: -0.1, end: 0),
              ],
            ),
          ),
          GestureDetector(
            onTap: () => context.go(RoutePaths.profile),
            child: Container(
              width: 48,
              height: 48,
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
            ),
          ).animate(delay: 100.ms).fadeIn().scale(),
        ],
      ),
    );
  }

  Widget _buildAvatarFallback() {
    return Center(
      child: Text(
        user.initials,
        style: AppTypography.titleMedium.copyWith(
          color: AppColors.backgroundDark,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}

/// Stat card widget
class _StatCard extends StatelessWidget {
  const _StatCard({
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: AppRadius.radiusSm,
                ),
                child: Icon(icon, size: 16, color: color),
              ),
              const Spacer(),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            value,
            style: AppTypography.headlineSmall.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(label, style: AppTypography.bodySmall),
        ],
      ),
    );
  }
}

/// Action tile widget
class _ActionTile extends StatelessWidget {
  const _ActionTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        child: Row(
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
                  Text(title, style: AppTypography.titleSmall),
                  Text(subtitle, style: AppTypography.bodySmall),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
