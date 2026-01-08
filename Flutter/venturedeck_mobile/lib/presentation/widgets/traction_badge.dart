/// VentureDeck Mobile - Traction Score Badge Widget
///
/// Displays project traction score with visual indicator.
library;

import 'package:flutter/material.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';

/// Traction score badge sizes
enum TractionBadgeSize { small, medium, large }

/// Traction score badge widget
class TractionScoreBadge extends StatelessWidget {
  const TractionScoreBadge({
    super.key,
    required this.score,
    this.size = TractionBadgeSize.medium,
    this.showLabel = true,
  });

  final int? score;
  final TractionBadgeSize size;
  final bool showLabel;

  @override
  Widget build(BuildContext context) {
    final displayScore = score ?? 0;
    final color = _getScoreColor(displayScore);
    final level = _getScoreLevel(displayScore);

    return Container(
      padding: _getPadding(),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: AppRadius.radiusSm,
        border: Border.all(color: color.withValues(alpha: 0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.trending_up, size: _getIconSize(), color: color),
          SizedBox(width: size == TractionBadgeSize.small ? 4 : 6),
          Text(
            displayScore.toString(),
            style: _getTextStyle().copyWith(
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
          if (showLabel && size != TractionBadgeSize.small) ...[
            const SizedBox(width: 4),
            Text(
              level,
              style: _getLabelStyle().copyWith(
                color: color.withValues(alpha: 0.8),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 80) return AppColors.success;
    if (score >= 60) return const Color(0xFF22D3EE); // Cyan
    if (score >= 40) return AppColors.primary;
    if (score >= 20) return AppColors.warning;
    return AppColors.textMuted;
  }

  String _getScoreLevel(int score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Good';
    if (score >= 20) return 'Building';
    return 'Starting';
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case TractionBadgeSize.small:
        return const EdgeInsets.symmetric(horizontal: 6, vertical: 2);
      case TractionBadgeSize.medium:
        return const EdgeInsets.symmetric(horizontal: 8, vertical: 4);
      case TractionBadgeSize.large:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 6);
    }
  }

  double _getIconSize() {
    switch (size) {
      case TractionBadgeSize.small:
        return 12;
      case TractionBadgeSize.medium:
        return 14;
      case TractionBadgeSize.large:
        return 18;
    }
  }

  TextStyle _getTextStyle() {
    switch (size) {
      case TractionBadgeSize.small:
        return AppTypography.labelSmall;
      case TractionBadgeSize.medium:
        return AppTypography.labelMedium;
      case TractionBadgeSize.large:
        return AppTypography.labelLarge;
    }
  }

  TextStyle _getLabelStyle() {
    switch (size) {
      case TractionBadgeSize.small:
        return AppTypography.labelSmall;
      case TractionBadgeSize.medium:
        return AppTypography.labelSmall;
      case TractionBadgeSize.large:
        return AppTypography.labelMedium;
    }
  }
}

/// Circular traction score indicator for detail pages
class TractionScoreCircle extends StatelessWidget {
  const TractionScoreCircle({super.key, required this.score, this.size = 80});

  final int? score;
  final double size;

  @override
  Widget build(BuildContext context) {
    final displayScore = score ?? 0;
    final color = _getScoreColor(displayScore);
    final progress = displayScore / 100;

    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Background circle
          SizedBox(
            width: size,
            height: size,
            child: const CircularProgressIndicator(
              value: 1,
              strokeWidth: 6,
              backgroundColor: Colors.transparent,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.border),
            ),
          ),
          // Progress circle
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              value: progress,
              strokeWidth: 6,
              backgroundColor: Colors.transparent,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
          // Score text
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                displayScore.toString(),
                style: AppTypography.headlineSmall.copyWith(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Score',
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

  Color _getScoreColor(int score) {
    if (score >= 80) return AppColors.success;
    if (score >= 60) return const Color(0xFF22D3EE);
    if (score >= 40) return AppColors.primary;
    if (score >= 20) return AppColors.warning;
    return AppColors.textMuted;
  }
}
