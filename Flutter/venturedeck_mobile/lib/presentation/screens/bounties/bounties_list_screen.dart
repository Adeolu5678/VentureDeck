/// VentureDeck Mobile - Bounties List Screen
///
/// Screen showing available bounties for discovery.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/bounty.dart';
import 'package:venturedeck_mobile/domain/providers/bounties_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Bounties list screen
class BountiesListScreen extends ConsumerStatefulWidget {
  const BountiesListScreen({super.key});

  @override
  ConsumerState<BountiesListScreen> createState() => _BountiesListScreenState();
}

class _BountiesListScreenState extends ConsumerState<BountiesListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  BountyType? _selectedType;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back),
                      onPressed: () => context.pop(),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Text(
                      'Bounties',
                      style: AppTypography.headlineMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),

              // Tabs
              Container(
                margin: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                decoration: const BoxDecoration(
                  color: AppColors.backgroundCard,
                  borderRadius: AppRadius.radiusMd,
                ),
                child: TabBar(
                  controller: _tabController,
                  indicatorSize: TabBarIndicatorSize.tab,
                  dividerColor: Colors.transparent,
                  indicator: const BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: AppRadius.radiusMd,
                  ),
                  labelColor: AppColors.backgroundDark,
                  unselectedLabelColor: AppColors.textSecondary,
                  tabs: const [
                    Tab(text: 'Open'),
                    Tab(text: 'My Bounties'),
                    Tab(text: 'Completed'),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              // Type filter chips
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                child: Row(
                  children: [
                    _FilterChip(
                      label: 'All',
                      isSelected: _selectedType == null,
                      onTap: () => setState(() => _selectedType = null),
                    ),
                    ...BountyType.values.map(
                      (type) => _FilterChip(
                        label:
                            type.name[0].toUpperCase() + type.name.substring(1),
                        isSelected: _selectedType == type,
                        onTap: () => setState(() => _selectedType = type),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppSpacing.md),

              // Content
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _OpenBountiesList(selectedType: _selectedType),
                    const _MyBountiesList(),
                    const _CompletedBountiesList(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Open bounties list
class _OpenBountiesList extends ConsumerWidget {
  const _OpenBountiesList({this.selectedType});

  final BountyType? selectedType;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bountiesAsync = selectedType == null
        ? ref.watch(openBountiesProvider)
        : ref.watch(filteredBountiesProvider(selectedType));

    return RefreshIndicator(
      onRefresh: () async {
        if (selectedType == null) {
          ref.invalidate(openBountiesProvider);
        } else {
          ref.invalidate(filteredBountiesProvider(selectedType));
        }
      },
      color: AppColors.primary,
      backgroundColor: AppColors.backgroundCard,
      child: bountiesAsync.when(
        data: (bounties) {
          if (bounties.isEmpty) {
            return _buildEmptyState(
              'No open bounties',
              'Check back later for new opportunities',
            );
          }
          return ListView.builder(
            padding: const EdgeInsets.all(AppSpacing.lg),
            itemCount: bounties.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: _BountyCard(bounty: bounties[index])
                    .animate(delay: Duration(milliseconds: 50 * index))
                    .fadeIn()
                    .slideX(begin: -0.1, end: 0),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.error),
              const SizedBox(height: AppSpacing.md),
              Text('Failed to load bounties', style: AppTypography.bodyMedium),
              const SizedBox(height: AppSpacing.lg),
              PremiumButton(
                label: 'Retry',
                onPressed: () => ref.invalidate(openBountiesProvider),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(String title, String subtitle) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.paid_outlined,
                size: 40,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(title, style: AppTypography.titleMedium),
            const SizedBox(height: AppSpacing.sm),
            Text(
              subtitle,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

/// My bounties list
class _MyBountiesList extends ConsumerWidget {
  const _MyBountiesList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bountiesAsync = ref.watch(myBountiesProvider);

    return bountiesAsync.when(
      data: (bounties) {
        final inProgress = bounties
            .where((b) => b.isClaimed || b.isSubmitted)
            .toList();
        if (inProgress.isEmpty) {
          return _buildEmptyState();
        }
        return ListView.builder(
          padding: const EdgeInsets.all(AppSpacing.lg),
          itemCount: inProgress.length,
          itemBuilder: (context, index) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: _BountyCard(bounty: inProgress[index], showActions: true),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, stack) => const Center(child: Text('Failed to load')),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.work_outline,
                size: 40,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            Text('No active bounties', style: AppTypography.titleMedium),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'Claim a bounty to get started',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Completed bounties list
class _CompletedBountiesList extends ConsumerWidget {
  const _CompletedBountiesList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bountiesAsync = ref.watch(myBountiesProvider);

    return bountiesAsync.when(
      data: (bounties) {
        final completed = bounties.where((b) => b.isCompleted).toList();
        if (completed.isEmpty) {
          return Center(
            child: Text(
              'No completed bounties yet',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          );
        }
        return ListView.builder(
          padding: const EdgeInsets.all(AppSpacing.lg),
          itemCount: completed.length,
          itemBuilder: (context, index) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: _BountyCard(bounty: completed[index]),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, stack) => const Center(child: Text('Failed to load')),
    );
  }
}

/// Filter chip widget
class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.sm),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : AppColors.backgroundCard,
            borderRadius: AppRadius.radiusFull,
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Text(
            label,
            style: AppTypography.labelMedium.copyWith(
              color: isSelected
                  ? AppColors.backgroundDark
                  : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}

/// Bounty card widget
class _BountyCard extends StatelessWidget {
  const _BountyCard({required this.bounty, this.showActions = false});

  final Bounty bounty;
  final bool showActions;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      onTap: () => context.push('/bounties/${bounty.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: _getTypeColor(bounty.type).withValues(alpha: 0.1),
                  borderRadius: AppRadius.radiusMd,
                ),
                child: Icon(
                  _getTypeIcon(bounty.type),
                  color: _getTypeColor(bounty.type),
                  size: 20,
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      bounty.title,
                      style: AppTypography.titleSmall.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      bounty.typeText,
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              // Reward badge
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: const BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: AppRadius.radiusFull,
                ),
                child: Text(
                  bounty.formattedReward,
                  style: AppTypography.labelMedium.copyWith(
                    color: AppColors.backgroundDark,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),

          // Description
          Text(
            bounty.description,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),

          // Skills
          if (bounty.skills.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.md),
            Wrap(
              spacing: AppSpacing.xs,
              runSpacing: AppSpacing.xs,
              children: bounty.skills.take(3).map((skill) {
                return Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: const BoxDecoration(
                    color: AppColors.backgroundCardLight,
                    borderRadius: AppRadius.radiusSm,
                  ),
                  child: Text(skill, style: AppTypography.labelSmall),
                );
              }).toList(),
            ),
          ],

          const SizedBox(height: AppSpacing.md),

          // Footer
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _StatusBadge(status: bounty.status),
              if (bounty.deadline != null)
                Text(
                  'Due: ${_formatDate(bounty.deadline!)}',
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getTypeColor(BountyType type) {
    switch (type) {
      case BountyType.development:
        return Colors.blue;
      case BountyType.design:
        return Colors.purple;
      case BountyType.marketing:
        return Colors.green;
      case BountyType.research:
        return Colors.orange;
      case BountyType.content:
        return Colors.teal;
      case BountyType.other:
        return AppColors.primary;
    }
  }

  IconData _getTypeIcon(BountyType type) {
    switch (type) {
      case BountyType.development:
        return Icons.code;
      case BountyType.design:
        return Icons.palette;
      case BountyType.marketing:
        return Icons.campaign;
      case BountyType.research:
        return Icons.science;
      case BountyType.content:
        return Icons.article;
      case BountyType.other:
        return Icons.work;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

/// Status badge widget
class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final BountyStatus status;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      BountyStatus.open => AppColors.success,
      BountyStatus.claimed => Colors.blue,
      BountyStatus.submitted => Colors.orange,
      BountyStatus.completed => AppColors.primary,
      BountyStatus.cancelled => AppColors.error,
    };

    final text = switch (status) {
      BountyStatus.open => 'Open',
      BountyStatus.claimed => 'In Progress',
      BountyStatus.submitted => 'Under Review',
      BountyStatus.completed => 'Completed',
      BountyStatus.cancelled => 'Cancelled',
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: AppTypography.labelSmall.copyWith(
          color: color,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
