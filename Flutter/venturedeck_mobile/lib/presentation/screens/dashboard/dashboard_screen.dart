/// VentureDeck Mobile - Dashboard Screen
///
/// Analytics and overview dashboard for entrepreneurs and investors.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/user.dart';
import 'package:venturedeck_mobile/domain/providers/analytics_provider.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/domain/providers/projects_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';
import 'package:venturedeck_mobile/presentation/widgets/project_card.dart';

/// Main dashboard screen
class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider).value;
    final isInvestor = user?.role == UserRole.investor;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              // Header
              SliverPadding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                sliver: SliverToBoxAdapter(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Dashboard',
                                style: AppTypography.headlineMedium.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: AppSpacing.xs),
                              Text(
                                isInvestor
                                    ? 'Portfolio Overview'
                                    : 'Project Analytics',
                                style: AppTypography.bodyMedium.copyWith(
                                  color: AppColors.textMuted,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(AppSpacing.sm),
                            decoration: BoxDecoration(
                              color: AppColors.backgroundCard,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.border),
                            ),
                            child: const Icon(
                              Icons.notifications_outlined,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ).animate().fadeIn().slideX(begin: -0.1, end: 0),
                    ],
                  ),
                ),
              ),

              // Content based on role
              if (isInvestor)
                const _InvestorDashboard()
              else
                const _EntrepreneurDashboard(),

              // Bottom padding
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }
}

/// Dashboard for Entrepreneurs
class _EntrepreneurDashboard extends ConsumerWidget {
  const _EntrepreneurDashboard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final myProjectsAsync = ref.watch(myProjectsProvider);

    return myProjectsAsync.when(
      data: (projects) {
        if (projects.isEmpty) {
          return SliverFillRemaining(
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.rocket_launch_outlined,
                    size: 64,
                    color: AppColors.textMuted,
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Text('No Projects Yet', style: AppTypography.titleLarge),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Create your first project to see analytics',
                    style: AppTypography.bodyMedium.copyWith(
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  PremiumButton(
                    label: 'Create Project',
                    icon: Icons.add,
                    variant: PremiumButtonVariant.gradient,
                    onPressed: () => context.push('/projects/create'),
                  ),
                ],
              ).animate().fadeIn().scale(),
            ),
          );
        }

        final project = projects.first; // MVP: Check first project
        return SliverList(
          delegate: SliverChildListDelegate([
            // Project Selector (if multiple?) - MVP just confirms active project
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: PremiumCard(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.sm),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.1),
                        borderRadius: AppRadius.radiusMd,
                      ),
                      child: const Icon(
                        Icons.rocket_launch,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            project.title,
                            style: AppTypography.titleSmall.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            project.statusDisplayName,
                            style: AppTypography.labelSmall.copyWith(
                              color: project.isPublished
                                  ? AppColors.success
                                  : AppColors.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.edit_outlined),
                      onPressed: () =>
                          context.push('/projects/${project.id}/edit'),
                    ),
                  ],
                ),
              ).animate(delay: 50.ms).fadeIn().slideY(begin: 0.1, end: 0),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Analytics Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: _ProjectAnalyticsGrid(projectId: project.id),
            ),

            const SizedBox(height: AppSpacing.lg),

            // Recent Activity / Call to Action
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: Text('Suggestions', style: AppTypography.titleMedium),
            ),
            const SizedBox(height: AppSpacing.sm),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: PremiumCard(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(
                        Icons.check_circle_outline,
                        color: AppColors.primary,
                      ),
                      title: const Text('Update Traction Score'),
                      subtitle: const Text(
                        'Keep investors updated with weekly progress',
                      ),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {},
                    ),
                    const Divider(color: AppColors.border),
                    ListTile(
                      leading: const Icon(
                        Icons.description_outlined,
                        color: AppColors.accent,
                      ),
                      title: const Text('Upload Documents'),
                      subtitle: const Text('Add pitch deck and legal docs'),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {},
                    ),
                  ],
                ),
              ).animate(delay: 200.ms).fadeIn(),
            ),
          ]),
        );
      },
      loading: () => const SliverFillRemaining(
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (err, stack) =>
          SliverFillRemaining(child: Center(child: Text('Error: $err'))),
    );
  }
}

/// Analytics Grid for a project
class _ProjectAnalyticsGrid extends ConsumerWidget {
  const _ProjectAnalyticsGrid({required this.projectId});

  final String projectId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analyticsAsync = ref.watch(projectAnalyticsProvider(projectId));

    return analyticsAsync.when(
      data: (analytics) {
        final realtime = analytics.realtime;
        return GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: AppSpacing.md,
          crossAxisSpacing: AppSpacing.md,
          childAspectRatio: 1.5,
          children: [
            _StatCard(
              icon: Icons.visibility,
              label: 'Total Views',
              value:
                  '${realtime.todayViews}', // Using todayViews as placeholder or total depending on API
              subValue: '${realtime.todayUniqueViews} unique',
              color: AppColors.primary,
              delay: 0,
            ),
            _StatCard(
              icon: Icons.people,
              label: 'Followers',
              value: '${realtime.totalFollowers}',
              color: AppColors.accent,
              delay: 50,
            ),
            _StatCard(
              icon: Icons.handshake,
              label: 'Soft Circle',
              value: '\$${_formatCurrency(realtime.totalSoftCircle)}',
              subValue: '${realtime.softCircleCount} commitments',
              color: AppColors.accent,
              delay: 100,
            ),
            _StatCard(
              icon: Icons.trending_up,
              label: 'Traction',
              value: '${realtime.tractionScore}',
              color: AppColors.success,
              delay: 150,
            ),
          ],
        );
      },
      loading: () => const SizedBox(
        height: 200,
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (err, _) => const Center(child: Text('Failed to load stats')),
    );
  }

  String _formatCurrency(int value) {
    if (value >= 1000000) {
      return '${(value / 1000000).toStringAsFixed(1)}M';
    } else if (value >= 1000) {
      return '${(value / 1000).toStringAsFixed(0)}K';
    }
    return '$value';
  }
}

/// Dashboard for Investors
class _InvestorDashboard extends ConsumerWidget {
  const _InvestorDashboard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final followedProjectsAsync = ref.watch(followedProjectsProvider);

    return SliverList(
      delegate: SliverChildListDelegate([
        // Stats
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          child: GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: AppSpacing.md,
            crossAxisSpacing: AppSpacing.md,
            childAspectRatio: 1.5,
            children: [
              _StatCard(
                icon: Icons.star,
                label: 'Following',
                value: followedProjectsAsync.maybeWhen(
                  data: (projects) => '${projects.length}',
                  orElse: () => '-',
                ),
                color: AppColors.primary,
                delay: 0,
              ),
              const _StatCard(
                icon: Icons.pie_chart,
                label: 'Invested',
                value: '-',
                subValue: 'Coming soon',
                color: AppColors.accent,
                delay: 50,
              ),
            ],
          ),
        ),

        const SizedBox(height: AppSpacing.xl),

        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          child: Text('Following', style: AppTypography.titleMedium),
        ),
        const SizedBox(height: AppSpacing.md),

        // Followed Projects List
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          child: followedProjectsAsync.when(
            data: (projects) {
              if (projects.isEmpty) {
                return const PremiumCard(
                  child: Center(
                    child: Padding(
                      padding: EdgeInsets.all(AppSpacing.lg),
                      child: Text('Not following any projects yet'),
                    ),
                  ),
                );
              }
              return Column(
                children: projects
                    .map(
                      (project) => Padding(
                        padding: const EdgeInsets.only(bottom: AppSpacing.md),
                        child: ProjectCard(
                          project: project,
                          onTap: () => context.push('/projects/${project.id}'),
                        ),
                      ),
                    )
                    .toList()
                    .animate(interval: 50.ms)
                    .fadeIn()
                    .slideX(),
              );
            },
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, _) => Text('Error: $err'),
          ),
        ),
      ]),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    this.subValue,
    required this.color,
    this.delay = 0,
  });

  final IconData icon;
  final String label;
  final String value;
  final String? subValue;
  final Color color;
  final int delay;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: AppTypography.labelMedium.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
              Icon(icon, size: 16, color: color),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: AppTypography.headlineSmall.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              if (subValue != null)
                Text(
                  subValue!,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                    fontSize: 10,
                  ),
                ),
            ],
          ),
        ],
      ),
    ).animate(delay: Duration(milliseconds: delay)).fadeIn().scale();
  }
}
