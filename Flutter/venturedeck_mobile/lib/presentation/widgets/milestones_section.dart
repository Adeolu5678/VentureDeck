/// VentureDeck Mobile - Milestones Section Widget
///
/// Displays and manages project milestones.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/milestone.dart';
import 'package:venturedeck_mobile/domain/providers/milestones_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Milestones section for project detail
class MilestonesSection extends ConsumerStatefulWidget {
  const MilestonesSection({
    super.key,
    required this.projectId,
    this.isOwner = false,
  });

  final String projectId;
  final bool isOwner;

  @override
  ConsumerState<MilestonesSection> createState() => _MilestonesSectionState();
}

class _MilestonesSectionState extends ConsumerState<MilestonesSection> {
  bool _isExpanded = true;

  @override
  Widget build(BuildContext context) {
    final milestonesAsync = ref.watch(
      projectMilestonesProvider(widget.projectId),
    );

    return PremiumCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          InkWell(
            onTap: () => setState(() => _isExpanded = !_isExpanded),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: AppRadius.radiusSm,
                  ),
                  child: const Icon(
                    Icons.flag_outlined,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Milestones', style: AppTypography.titleSmall),
                      milestonesAsync.whenOrNull(
                            data: (milestones) => Text(
                              '${milestones.where((m) => m.isCompleted).length}/${milestones.length} completed',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textMuted,
                              ),
                            ),
                          ) ??
                          const SizedBox.shrink(),
                    ],
                  ),
                ),
                Icon(
                  _isExpanded ? Icons.expand_less : Icons.expand_more,
                  color: AppColors.textMuted,
                ),
              ],
            ),
          ),

          // Content
          if (_isExpanded) ...[
            const SizedBox(height: AppSpacing.lg),

            milestonesAsync.when(
              data: (milestones) {
                if (milestones.isEmpty) {
                  return _buildEmptyState();
                }

                // Calculate progress
                final completed = milestones.where((m) => m.isCompleted).length;
                final progress = milestones.isEmpty
                    ? 0.0
                    : completed / milestones.length;

                return Column(
                  children: [
                    // Progress bar
                    _ProgressIndicator(
                      progress: progress,
                      completed: completed,
                      total: milestones.length,
                    ),

                    const SizedBox(height: AppSpacing.lg),

                    // Milestone list
                    ...milestones.asMap().entries.map((entry) {
                      final index = entry.key;
                      final milestone = entry.value;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                        child:
                            _MilestoneItem(
                                  milestone: milestone,
                                  isOwner: widget.isOwner,
                                  isLast: index == milestones.length - 1,
                                )
                                .animate(
                                  delay: Duration(milliseconds: 50 * index),
                                )
                                .fadeIn()
                                .slideX(begin: -0.1),
                      );
                    }),
                  ],
                );
              },
              loading: () => const Center(
                child: Padding(
                  padding: EdgeInsets.all(AppSpacing.lg),
                  child: CircularProgressIndicator(),
                ),
              ),
              error: (_, stack) => Center(
                child: Text(
                  'Failed to load milestones',
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
              ),
            ),

            // Add milestone button (for owners)
            if (widget.isOwner) ...[
              const SizedBox(height: AppSpacing.md),
              PremiumButton(
                label: 'Add Milestone',
                icon: Icons.add,
                variant: PremiumButtonVariant.outline,
                size: PremiumButtonSize.small,
                fullWidth: true,
                onPressed: () => _showAddMilestoneDialog(context),
              ),
            ],
          ],
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
      child: Center(
        child: Column(
          children: [
            Icon(
              Icons.flag_outlined,
              size: 40,
              color: AppColors.textMuted.withValues(alpha: 0.5),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              'No milestones yet',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
            ),
            if (widget.isOwner) ...[
              const SizedBox(height: AppSpacing.sm),
              Text(
                'Add milestones to track your progress',
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _showAddMilestoneDialog(BuildContext context) {
    final titleController = TextEditingController();
    final descController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Add Milestone'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(
                labelText: 'Title',
                hintText: 'e.g., MVP Launch',
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            TextField(
              controller: descController,
              maxLines: 2,
              decoration: const InputDecoration(
                labelText: 'Description (optional)',
                hintText: 'What needs to be accomplished?',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              final title = titleController.text.trim();
              if (title.isEmpty) return;

              Navigator.pop(ctx);

              await ref
                  .read(milestonesActionsProvider.notifier)
                  .createMilestone(
                    projectId: widget.projectId,
                    title: title,
                    description: descController.text.trim().isEmpty
                        ? null
                        : descController.text.trim(),
                  );
            },
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }
}

/// Progress indicator widget
class _ProgressIndicator extends StatelessWidget {
  const _ProgressIndicator({
    required this.progress,
    required this.completed,
    required this.total,
  });

  final double progress;
  final int completed;
  final int total;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '${(progress * 100).toInt()}% Complete',
              style: AppTypography.labelMedium.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              '$completed of $total',
              style: AppTypography.labelSmall.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.sm),
        ClipRRect(
          borderRadius: AppRadius.radiusFull,
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: AppColors.backgroundCardLight,
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
            minHeight: 8,
          ),
        ),
      ],
    );
  }
}

/// Milestone item widget
class _MilestoneItem extends ConsumerWidget {
  const _MilestoneItem({
    required this.milestone,
    required this.isOwner,
    required this.isLast,
  });

  final Milestone milestone;
  final bool isOwner;
  final bool isLast;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Timeline indicator
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: milestone.isCompleted
                    ? AppColors.success
                    : milestone.isOverdue
                    ? AppColors.error
                    : AppColors.backgroundCardLight,
                shape: BoxShape.circle,
                border: Border.all(
                  color: milestone.isCompleted
                      ? AppColors.success
                      : milestone.isInProgress
                      ? AppColors.primary
                      : AppColors.border,
                  width: 2,
                ),
              ),
              child: milestone.isCompleted
                  ? const Icon(Icons.check, size: 14, color: Colors.white)
                  : null,
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 40,
                color: milestone.isCompleted
                    ? AppColors.success.withValues(alpha: 0.3)
                    : AppColors.border,
              ),
          ],
        ),

        const SizedBox(width: AppSpacing.md),

        // Content
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      milestone.title,
                      style: AppTypography.bodyMedium.copyWith(
                        fontWeight: FontWeight.w500,
                        decoration: milestone.isCompleted
                            ? TextDecoration.lineThrough
                            : null,
                        color: milestone.isCompleted
                            ? AppColors.textMuted
                            : AppColors.textPrimary,
                      ),
                    ),
                  ),
                  // Status badge
                  _StatusBadge(status: milestone.status),
                ],
              ),
              if (milestone.description != null) ...[
                const SizedBox(height: 2),
                Text(
                  milestone.description!,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textMuted,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              if (milestone.targetDate != null) ...[
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      Icons.schedule,
                      size: 12,
                      color: milestone.isOverdue
                          ? AppColors.error
                          : AppColors.textMuted,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _formatDate(milestone.targetDate!),
                      style: AppTypography.labelSmall.copyWith(
                        color: milestone.isOverdue
                            ? AppColors.error
                            : AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ],

              // Actions for owner
              if (isOwner && !milestone.isCompleted) ...[
                const SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    GestureDetector(
                      onTap: () => _handleMarkComplete(ref),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.success.withValues(alpha: 0.1),
                          borderRadius: AppRadius.radiusSm,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.check_circle_outline,
                              size: 14,
                              color: AppColors.success,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Complete',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.success,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    GestureDetector(
                      onTap: () => _handleDelete(context, ref),
                      child: const Icon(
                        Icons.delete_outline,
                        size: 16,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  void _handleMarkComplete(WidgetRef ref) {
    ref
        .read(milestonesActionsProvider.notifier)
        .markComplete(milestone.id, milestone.projectId);
  }

  void _handleDelete(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Delete Milestone?'),
        content: Text('Are you sure you want to delete "${milestone.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              ref
                  .read(milestonesActionsProvider.notifier)
                  .deleteMilestone(milestone.id, milestone.projectId);
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

/// Status badge widget
class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.status});

  final MilestoneStatus status;

  @override
  Widget build(BuildContext context) {
    final (color, text) = switch (status) {
      MilestoneStatus.pending => (AppColors.textMuted, 'Pending'),
      MilestoneStatus.inProgress => (Colors.blue, 'In Progress'),
      MilestoneStatus.completed => (AppColors.success, 'Done'),
      MilestoneStatus.overdue => (AppColors.error, 'Overdue'),
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: AppRadius.radiusSm,
      ),
      child: Text(
        text,
        style: AppTypography.labelSmall.copyWith(color: color, fontSize: 10),
      ),
    );
  }
}
