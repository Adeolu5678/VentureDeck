/// VentureDeck Mobile - Project Detail Screen
///
/// Detailed view of a single project.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:share_plus/share_plus.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/project.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/domain/providers/projects_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/milestones_section.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';
import 'package:venturedeck_mobile/presentation/widgets/traction_badge.dart';

/// Project detail screen
class ProjectDetailScreen extends ConsumerWidget {
  const ProjectDetailScreen({super.key, required this.projectId});

  final String projectId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final projectAsync = ref.watch(projectProvider(projectId));
    final currentUser = ref.watch(currentUserProvider).valueOrNull;
    final isFollowingAsync = ref.watch(isFollowingProvider(projectId));

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: projectAsync.when(
          data: (project) {
            if (project == null) {
              return _buildNotFound(context);
            }

            final isOwner = currentUser?.id == project.ownerId;
            final isFollowing = isFollowingAsync.valueOrNull ?? false;

            return _ProjectDetailContent(
              project: project,
              isOwner: isOwner,
              isFollowing: isFollowing,
              isInvestor: currentUser?.isInvestor ?? false,
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.error_outline,
                  size: 48,
                  color: AppColors.error,
                ),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'Failed to load project',
                  style: AppTypography.titleMedium,
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(error.toString(), style: AppTypography.bodySmall),
                const SizedBox(height: AppSpacing.lg),
                PremiumButton(
                  label: 'Retry',
                  onPressed: () => ref.invalidate(projectProvider(projectId)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNotFound(BuildContext context) {
    return SafeArea(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off, size: 64, color: AppColors.textMuted),
          const SizedBox(height: AppSpacing.lg),
          Text('Project Not Found', style: AppTypography.titleLarge),
          const SizedBox(height: AppSpacing.md),
          PremiumButton(label: 'Go Back', onPressed: () => context.pop()),
        ],
      ),
    );
  }
}

class _ProjectDetailContent extends ConsumerWidget {
  const _ProjectDetailContent({
    required this.project,
    required this.isOwner,
    required this.isFollowing,
    required this.isInvestor,
  });

  final Project project;
  final bool isOwner;
  final bool isFollowing;
  final bool isInvestor;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return CustomScrollView(
      slivers: [
        // App bar
        SliverAppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          pinned: true,
          expandedHeight: 0,
          leading: IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.backgroundCard.withValues(alpha: 0.9),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.arrow_back, size: 20),
            ),
            onPressed: () => context.pop(),
          ),
          actions: [
            IconButton(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.backgroundCard.withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.share_outlined, size: 20),
              ),
              onPressed: () => _shareProject(project),
            ),
            if (isOwner)
              IconButton(
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.backgroundCard.withValues(alpha: 0.9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.edit_outlined, size: 20),
                ),
                onPressed: () => context.push('/projects/${project.id}/edit'),
              ),
            PopupMenuButton<String>(
              icon: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.backgroundCard.withValues(alpha: 0.9),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.more_vert, size: 20),
              ),
              color: AppColors.backgroundCard,
              itemBuilder: (context) => [
                if (isOwner) ...[
                  PopupMenuItem(
                    value: 'publish',
                    child: Row(
                      children: [
                        Icon(
                          project.isPublished ? Icons.public_off : Icons.public,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Text(project.isPublished ? 'Unpublish' : 'Publish'),
                      ],
                    ),
                  ),
                  const PopupMenuDivider(),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(
                          Icons.delete_outline,
                          size: 20,
                          color: AppColors.error,
                        ),
                        SizedBox(width: 8),
                        Text(
                          'Delete',
                          style: TextStyle(color: AppColors.error),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  const PopupMenuItem(
                    value: 'report',
                    child: Row(
                      children: [
                        Icon(Icons.flag_outlined, size: 20),
                        SizedBox(width: 8),
                        Text('Report'),
                      ],
                    ),
                  ),
                ],
              ],
              onSelected: (value) => _handleMenuAction(context, ref, value),
            ),
          ],
        ),

        // Project header
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo and traction score
                Row(
                  children: [
                    _ProjectLogo(project: project),
                    const Spacer(),
                    TractionScoreCircle(score: project.tractionScore, size: 70),
                  ],
                ).animate().fadeIn(),

                const SizedBox(height: AppSpacing.lg),

                // Title and status
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            project.title,
                            style: AppTypography.headlineMedium.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Text(
                            project.tagline,
                            style: AppTypography.bodyLarge.copyWith(
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    _StatusBadge(status: project.status),
                  ],
                ).animate(delay: 100.ms).fadeIn().slideX(begin: -0.1, end: 0),

                const SizedBox(height: AppSpacing.md),

                // Tags
                Wrap(
                  spacing: AppSpacing.sm,
                  runSpacing: AppSpacing.sm,
                  children: [
                    _Tag(project.industry, isPrimary: true),
                    if (project.stage != null) _Tag(project.stageDisplayName),
                    ...project.tags.map((t) => _Tag(t)),
                  ],
                ).animate(delay: 150.ms).fadeIn(),
              ],
            ),
          ),
        ),

        // Stats cards
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: Row(
              children: [
                Expanded(
                  child: _StatCard(
                    icon: Icons.attach_money,
                    label: 'Funding Goal',
                    value: project.formattedFundingGoal,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: _StatCard(
                    icon: Icons.pie_chart_outline,
                    label: 'Equity',
                    value: project.formattedEquity,
                  ),
                ),
                if (project.location != null) ...[
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: _StatCard(
                      icon: Icons.location_on_outlined,
                      label: 'Location',
                      value: project.location!,
                    ),
                  ),
                ],
              ],
            ).animate(delay: 200.ms).fadeIn(),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

        // Description section
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: PremiumCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.description_outlined,
                        size: 20,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Text('About', style: AppTypography.titleMedium),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(project.description, style: AppTypography.bodyMedium),
                ],
              ),
            ).animate(delay: 250.ms).fadeIn().slideY(begin: 0.1, end: 0),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

        // Milestones section
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: MilestonesSection(
              projectId: project.id,
              isOwner: isOwner,
            ).animate(delay: 300.ms).fadeIn().slideY(begin: 0.1, end: 0),
          ),
        ),

        // Action buttons
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Row(
              children: [
                if (isInvestor && !isOwner) ...[
                  Expanded(
                    child: PremiumButton(
                      label: isFollowing ? 'Following' : 'Follow',
                      icon: isFollowing ? Icons.star : Icons.star_outline,
                      variant: isFollowing
                          ? PremiumButtonVariant.outline
                          : PremiumButtonVariant.glass,
                      fullWidth: true,
                      onPressed: () => _toggleFollow(ref),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: PremiumButton(
                      label: 'Contact',
                      icon: Icons.chat_bubble_outline,
                      variant: PremiumButtonVariant.gradient,
                      fullWidth: true,
                      onPressed: () {
                        // TODO: Start conversation
                      },
                    ),
                  ),
                ] else if (isOwner) ...[
                  Expanded(
                    child: PremiumButton(
                      label: 'View Analytics',
                      icon: Icons.analytics_outlined,
                      variant: PremiumButtonVariant.glass,
                      fullWidth: true,
                      onPressed: () =>
                          context.push('/projects/${project.id}/analytics'),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: PremiumButton(
                      label: 'Edit Project',
                      icon: Icons.edit_outlined,
                      variant: PremiumButtonVariant.gradient,
                      fullWidth: true,
                      onPressed: () =>
                          context.push('/projects/${project.id}/edit'),
                    ),
                  ),
                ],
              ],
            ).animate(delay: 350.ms).fadeIn().slideY(begin: 0.2, end: 0),
          ),
        ),

        // Bottom padding
        const SliverToBoxAdapter(child: SizedBox(height: 100)),
      ],
    );
  }

  void _shareProject(Project project) {
    Share.share(
      'Check out ${project.title} on VentureDeck!\n\n${project.tagline}',
      subject: 'VentureDeck - ${project.title}',
    );
  }

  void _toggleFollow(WidgetRef ref) {
    final actions = ref.read(projectActionsProvider.notifier);
    if (isFollowing) {
      actions.unfollowProject(project.id);
    } else {
      actions.followProject(project.id);
    }
  }

  void _handleMenuAction(BuildContext context, WidgetRef ref, String action) {
    switch (action) {
      case 'publish':
        ref.read(projectActionsProvider.notifier).publishProject(project.id);
        break;
      case 'delete':
        _showDeleteConfirmation(context, ref);
        break;
      case 'report':
        // TODO: Implement report
        break;
    }
  }

  void _showDeleteConfirmation(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Delete Project?'),
        content: const Text(
          'This action cannot be undone. All project data will be permanently deleted.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final success = await ref
                  .read(projectActionsProvider.notifier)
                  .deleteProject(project.id);
              if (success && context.mounted) {
                context.pop();
              }
            },
            child: const Text(
              'Delete',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }
}

// Helper widgets

class _ProjectLogo extends StatelessWidget {
  const _ProjectLogo({required this.project});

  final Project project;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: AppRadius.radiusLg,
        boxShadow: AppShadows.glow,
      ),
      child: project.logoUrl != null
          ? ClipRRect(
              borderRadius: AppRadius.radiusLg,
              child: Image.network(
                project.logoUrl!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _buildFallback(),
              ),
            )
          : _buildFallback(),
    );
  }

  Widget _buildFallback() {
    return Center(
      child: Text(
        project.title.isNotEmpty ? project.title[0].toUpperCase() : '?',
        style: AppTypography.displaySmall.copyWith(
          color: AppColors.backgroundDark,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final ProjectStatus status;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      ProjectStatus.draft => AppColors.textMuted,
      ProjectStatus.published => AppColors.success,
      ProjectStatus.funded => AppColors.primary,
      ProjectStatus.closed => AppColors.error,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        status.name.toUpperCase(),
        style: AppTypography.labelSmall.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  const _Tag(this.label, {this.isPrimary = false});

  final String label;
  final bool isPrimary;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: isPrimary
            ? AppColors.primary.withValues(alpha: 0.15)
            : AppColors.backgroundCardLight,
        borderRadius: AppRadius.radiusSm,
      ),
      child: Text(
        label,
        style: AppTypography.labelSmall.copyWith(
          color: isPrimary ? AppColors.primary : AppColors.textSecondary,
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        children: [
          Icon(icon, color: AppColors.primary, size: 20),
          const SizedBox(height: AppSpacing.sm),
          Text(
            value,
            style: AppTypography.labelMedium.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            label,
            style: AppTypography.labelSmall,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
