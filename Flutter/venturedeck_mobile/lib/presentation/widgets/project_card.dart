/// VentureDeck Mobile - Project Card Widget
///
/// Card component for displaying project in lists.
library;

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/constants/app_constants.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/project.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';
import 'package:venturedeck_mobile/presentation/widgets/traction_badge.dart';

/// Project card for list display
class ProjectCard extends StatelessWidget {
  const ProjectCard({
    super.key,
    required this.project,
    this.onTap,
    this.showActions = false,
    this.isCompact = false,
  });

  final Project project;
  final VoidCallback? onTap;
  final bool showActions;
  final bool isCompact;

  @override
  Widget build(BuildContext context) {
    return PremiumCard(
      onTap:
          onTap ?? () => context.push('${RoutePaths.projects}/${project.id}'),
      padding: EdgeInsets.all(isCompact ? AppSpacing.md : AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Logo
              _ProjectLogo(
                logoUrl: project.logoUrl,
                title: project.title,
                size: isCompact ? 40 : 48,
              ),
              const SizedBox(width: AppSpacing.md),

              // Title and info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            project.title,
                            style: isCompact
                                ? AppTypography.titleSmall
                                : AppTypography.titleMedium,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (project.tractionScore != null)
                          TractionScoreBadge(
                            score: project.tractionScore,
                            size: isCompact
                                ? TractionBadgeSize.small
                                : TractionBadgeSize.medium,
                            showLabel: !isCompact,
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        _buildChip(project.industry),
                        if (project.stage != null) ...[
                          const SizedBox(width: AppSpacing.xs),
                          _buildChip(project.stageDisplayName),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          if (!isCompact) ...[
            const SizedBox(height: AppSpacing.md),

            // Tagline
            Text(
              project.tagline,
              style: AppTypography.bodyMedium,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),

            const SizedBox(height: AppSpacing.md),

            // Stats row
            Row(
              children: [
                _buildStat(
                  Icons.attach_money,
                  project.formattedFundingGoal,
                  'Goal',
                ),
                const SizedBox(width: AppSpacing.lg),
                _buildStat(
                  Icons.pie_chart_outline,
                  project.formattedEquity,
                  'Equity',
                ),
                const Spacer(),
                // Status badge
                _buildStatusBadge(project.status),
              ],
            ),
          ],

          if (showActions) ...[
            const SizedBox(height: AppSpacing.md),
            const Divider(color: AppColors.border),
            const SizedBox(height: AppSpacing.sm),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _ActionButton(
                  icon: Icons.edit_outlined,
                  label: 'Edit',
                  onTap: () {
                    // TODO: Navigate to edit
                  },
                ),
                _ActionButton(
                  icon: Icons.visibility_outlined,
                  label: 'View',
                  onTap: () =>
                      context.push('${RoutePaths.projects}/${project.id}'),
                ),
                _ActionButton(
                  icon: project.isPublished ? Icons.public_off : Icons.public,
                  label: project.isPublished ? 'Unpublish' : 'Publish',
                  onTap: () {
                    // TODO: Publish/unpublish
                  },
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: const BoxDecoration(
        color: AppColors.backgroundCardLight,
        borderRadius: AppRadius.radiusSm,
      ),
      child: Text(label, style: AppTypography.labelSmall),
    );
  }

  Widget _buildStat(IconData icon, String value, String label) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.textMuted),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: AppTypography.labelMedium.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatusBadge(ProjectStatus status) {
    final color = switch (status) {
      ProjectStatus.draft => AppColors.textMuted,
      ProjectStatus.published => AppColors.success,
      ProjectStatus.funded => AppColors.primary,
      ProjectStatus.closed => AppColors.error,
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: AppRadius.radiusSm,
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

/// Project logo with fallback
class _ProjectLogo extends StatelessWidget {
  const _ProjectLogo({
    required this.logoUrl,
    required this.title,
    this.size = 48,
  });

  final String? logoUrl;
  final String title;
  final double size;

  @override
  Widget build(BuildContext context) {
    if (logoUrl != null && logoUrl!.isNotEmpty) {
      return ClipRRect(
        borderRadius: AppRadius.radiusMd,
        child: CachedNetworkImage(
          imageUrl: logoUrl!,
          width: size,
          height: size,
          fit: BoxFit.cover,
          placeholder: (context, url) => _buildFallback(),
          errorWidget: (context, url, error) => _buildFallback(),
        ),
      );
    }

    return _buildFallback();
  }

  Widget _buildFallback() {
    return Container(
      width: size,
      height: size,
      decoration: const BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: AppRadius.radiusMd,
      ),
      child: Center(
        child: Text(
          title.isNotEmpty ? title[0].toUpperCase() : '?',
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.backgroundDark,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

/// Action button for project card
class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadius.radiusSm,
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: AppColors.textSecondary),
            const SizedBox(width: 4),
            Text(label, style: AppTypography.labelSmall),
          ],
        ),
      ),
    );
  }
}
