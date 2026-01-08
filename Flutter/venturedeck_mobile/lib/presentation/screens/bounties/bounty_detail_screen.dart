/// VentureDeck Mobile - Bounty Detail Screen
///
/// Detailed view of a single bounty with claim/submit actions.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:timeago/timeago.dart' as timeago;
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/bounty.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/domain/providers/bounties_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Bounty detail screen
class BountyDetailScreen extends ConsumerStatefulWidget {
  const BountyDetailScreen({super.key, required this.bountyId});

  final String bountyId;

  @override
  ConsumerState<BountyDetailScreen> createState() => _BountyDetailScreenState();
}

class _BountyDetailScreenState extends ConsumerState<BountyDetailScreen> {
  final _submissionController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _submissionController.dispose();
    super.dispose();
  }

  Future<void> _handleClaim(Bounty bounty) async {
    final success = await ref
        .read(bountyActionsProvider.notifier)
        .claimBounty(bounty.id, bounty.projectId);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            success ? 'Bounty claimed successfully!' : 'Failed to claim bounty',
          ),
        ),
      );
    }
  }

  Future<void> _handleSubmit(Bounty bounty) async {
    final content = _submissionController.text.trim();
    if (content.isEmpty) return;

    setState(() => _isSubmitting = true);

    final success = await ref
        .read(bountyActionsProvider.notifier)
        .submitWork(
          bountyId: bounty.id,
          projectId: bounty.projectId,
          content: content,
        );

    if (mounted) {
      setState(() => _isSubmitting = false);
      if (success) {
        _submissionController.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Work submitted successfully!')),
        );
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Failed to submit work')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final bountyAsync = ref.watch(bountyProvider(widget.bountyId));
    final currentUserId = ref.watch(currentUserIdProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: bountyAsync.when(
          data: (bounty) {
            if (bounty == null) {
              return _buildNotFound();
            }

            final isCreator = currentUserId == bounty.creatorId;
            final isClaimer = currentUserId == bounty.claimedById;

            return CustomScrollView(
              slivers: [
                // App bar
                SliverAppBar(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  pinned: true,
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
                    if (isCreator && bounty.isOpen)
                      IconButton(
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.backgroundCard.withValues(
                              alpha: 0.9,
                            ),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 20,
                            color: AppColors.error,
                          ),
                        ),
                        onPressed: () => _showCancelDialog(bounty),
                      ),
                  ],
                ),

                // Content
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Header
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _StatusBadge(status: bounty.status),
                                  const SizedBox(height: AppSpacing.sm),
                                  Text(
                                    bounty.title,
                                    style: AppTypography.headlineSmall.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            // Reward
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 10,
                              ),
                              decoration: BoxDecoration(
                                gradient: AppColors.primaryGradient,
                                borderRadius: AppRadius.radiusMd,
                                boxShadow: AppShadows.glow,
                              ),
                              child: Column(
                                children: [
                                  Text(
                                    bounty.formattedReward,
                                    style: AppTypography.titleLarge.copyWith(
                                      color: AppColors.backgroundDark,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    'Reward',
                                    style: AppTypography.labelSmall.copyWith(
                                      color: AppColors.backgroundDark
                                          .withValues(alpha: 0.7),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ).animate().fadeIn().slideX(begin: -0.1),

                        const SizedBox(height: AppSpacing.lg),

                        // Type and deadline
                        Row(
                          children: [
                            _InfoChip(
                              icon: _getTypeIcon(bounty.type),
                              label: bounty.typeText,
                            ),
                            if (bounty.deadline != null) ...[
                              const SizedBox(width: AppSpacing.md),
                              _InfoChip(
                                icon: Icons.schedule,
                                label: 'Due ${_formatDate(bounty.deadline!)}',
                              ),
                            ],
                          ],
                        ).animate(delay: 100.ms).fadeIn(),

                        const SizedBox(height: AppSpacing.lg),

                        // Description
                        PremiumCard(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(
                                    Icons.description_outlined,
                                    size: 18,
                                    color: AppColors.primary,
                                  ),
                                  const SizedBox(width: AppSpacing.sm),
                                  Text(
                                    'Description',
                                    style: AppTypography.titleSmall,
                                  ),
                                ],
                              ),
                              const SizedBox(height: AppSpacing.md),
                              Text(
                                bounty.description,
                                style: AppTypography.bodyMedium,
                              ),
                            ],
                          ),
                        ).animate(delay: 150.ms).fadeIn().slideY(begin: 0.1),

                        const SizedBox(height: AppSpacing.lg),

                        // Skills
                        if (bounty.skills.isNotEmpty) ...[
                          PremiumCard(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.psychology_outlined,
                                      size: 18,
                                      color: AppColors.primary,
                                    ),
                                    const SizedBox(width: AppSpacing.sm),
                                    Text(
                                      'Required Skills',
                                      style: AppTypography.titleSmall,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: AppSpacing.md),
                                Wrap(
                                  spacing: AppSpacing.sm,
                                  runSpacing: AppSpacing.sm,
                                  children: bounty.skills.map((skill) {
                                    return Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.primary.withValues(
                                          alpha: 0.1,
                                        ),
                                        borderRadius: AppRadius.radiusFull,
                                        border: Border.all(
                                          color: AppColors.primary.withValues(
                                            alpha: 0.3,
                                          ),
                                        ),
                                      ),
                                      child: Text(
                                        skill,
                                        style: AppTypography.labelMedium
                                            .copyWith(color: AppColors.primary),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ],
                            ),
                          ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.1),
                          const SizedBox(height: AppSpacing.lg),
                        ],

                        // Submissions (for creator)
                        if (isCreator && bounty.submissions.isNotEmpty) ...[
                          Text('Submissions', style: AppTypography.titleMedium),
                          const SizedBox(height: AppSpacing.md),
                          ...bounty.submissions.map(
                            (submission) => Padding(
                              padding: const EdgeInsets.only(
                                bottom: AppSpacing.md,
                              ),
                              child: _SubmissionCard(
                                submission: submission,
                                bounty: bounty,
                              ),
                            ),
                          ),
                          const SizedBox(height: AppSpacing.lg),
                        ],

                        // Submit work form (for claimer)
                        if (isClaimer &&
                            (bounty.isClaimed || bounty.isSubmitted)) ...[
                          Text(
                            'Submit Your Work',
                            style: AppTypography.titleMedium,
                          ),
                          const SizedBox(height: AppSpacing.md),
                          PremiumCard(
                            child: Column(
                              children: [
                                TextField(
                                  controller: _submissionController,
                                  maxLines: 5,
                                  style: AppTypography.bodyMedium,
                                  decoration: InputDecoration(
                                    hintText:
                                        'Describe your work and provide any relevant links...',
                                    hintStyle: AppTypography.bodyMedium
                                        .copyWith(color: AppColors.textMuted),
                                    border: InputBorder.none,
                                  ),
                                ),
                                const SizedBox(height: AppSpacing.md),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    PremiumButton(
                                      label: 'Submit Work',
                                      icon: Icons.send,
                                      isLoading: _isSubmitting,
                                      onPressed: () => _handleSubmit(bounty),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: AppSpacing.lg),
                        ],

                        // Metadata
                        Row(
                          children: [
                            const Icon(
                              Icons.access_time,
                              size: 14,
                              color: AppColors.textMuted,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Posted ${timeago.format(bounty.createdAt)}',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.textMuted,
                              ),
                            ),
                          ],
                        ).animate(delay: 250.ms).fadeIn(),

                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                const SizedBox(height: AppSpacing.md),
                Text('Failed to load bounty', style: AppTypography.titleMedium),
              ],
            ),
          ),
        ),
      ),
      // Bottom action bar
      bottomNavigationBar: bountyAsync.whenOrNull(
        data: (bounty) {
          if (bounty == null) return null;
          final canClaim = bounty.canClaim(currentUserId ?? '');

          if (canClaim) {
            return Container(
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: const BoxDecoration(
                color: AppColors.backgroundCard,
                border: Border(top: BorderSide(color: AppColors.border)),
              ),
              child: SafeArea(
                child: PremiumButton(
                  label: 'Claim Bounty',
                  icon: Icons.assignment_turned_in,
                  variant: PremiumButtonVariant.gradient,
                  fullWidth: true,
                  onPressed: () => _handleClaim(bounty),
                ),
              ),
            );
          }
          return null;
        },
      ),
    );
  }

  Widget _buildNotFound() {
    return SafeArea(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off, size: 64, color: AppColors.textMuted),
          const SizedBox(height: AppSpacing.lg),
          Text('Bounty Not Found', style: AppTypography.titleLarge),
          const SizedBox(height: AppSpacing.md),
          PremiumButton(label: 'Go Back', onPressed: () => context.pop()),
        ],
      ),
    );
  }

  void _showCancelDialog(Bounty bounty) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Cancel Bounty?'),
        content: const Text('This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await ref
                  .read(bountyActionsProvider.notifier)
                  .cancelBounty(bounty.id, bounty.projectId);
              if (mounted) {
                context.pop();
              }
            },
            child: const Text('Yes', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
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

/// Status badge
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
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: AppTypography.labelSmall.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

/// Info chip
class _InfoChip extends StatelessWidget {
  const _InfoChip({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: AppRadius.radiusFull,
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: AppColors.textSecondary),
          const SizedBox(width: 6),
          Text(label, style: AppTypography.labelMedium),
        ],
      ),
    );
  }
}

/// Submission card for review
class _SubmissionCard extends ConsumerWidget {
  const _SubmissionCard({required this.submission, required this.bounty});

  final BountySubmission submission;
  final Bounty bounty;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PremiumCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: const BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.person,
                  size: 16,
                  color: AppColors.backgroundDark,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Text('Submission', style: AppTypography.titleSmall),
              ),
              Text(
                timeago.format(submission.createdAt),
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Text(submission.content, style: AppTypography.bodyMedium),
          if (!submission.isApproved && bounty.isSubmitted) ...[
            const SizedBox(height: AppSpacing.md),
            Row(
              children: [
                Expanded(
                  child: PremiumButton(
                    label: 'Reject',
                    variant: PremiumButtonVariant.outline,
                    size: PremiumButtonSize.small,
                    onPressed: () => _showRejectDialog(context, ref),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: PremiumButton(
                    label: 'Approve',
                    variant: PremiumButtonVariant.gradient,
                    size: PremiumButtonSize.small,
                    onPressed: () => _handleApprove(context, ref),
                  ),
                ),
              ],
            ),
          ],
          if (submission.isApproved)
            Container(
              margin: const EdgeInsets.only(top: AppSpacing.md),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.1),
                borderRadius: AppRadius.radiusSm,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.check_circle,
                    size: 14,
                    color: AppColors.success,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Approved',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.success,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  void _handleApprove(BuildContext context, WidgetRef ref) {
    ref
        .read(bountyActionsProvider.notifier)
        .approveSubmission(submission.id, bounty.id, bounty.projectId);
  }

  void _showRejectDialog(BuildContext context, WidgetRef ref) {
    final feedbackController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Provide Feedback'),
        content: TextField(
          controller: feedbackController,
          maxLines: 3,
          decoration: const InputDecoration(
            hintText: 'Why is this submission being rejected?',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              ref
                  .read(bountyActionsProvider.notifier)
                  .rejectSubmission(
                    submission.id,
                    feedbackController.text,
                    bounty.id,
                    bounty.projectId,
                  );
            },
            child: const Text(
              'Reject',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }
}
