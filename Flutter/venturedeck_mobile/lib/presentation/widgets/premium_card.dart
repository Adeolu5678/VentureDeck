/// VentureDeck Mobile - Premium Card Widget
///
/// Glass-morphic card component matching the web design system.
library;

import 'package:flutter/material.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';

/// Premium card widget with glass-morphic style
class PremiumCard extends StatelessWidget {
  const PremiumCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.isSelected = false,
    this.onTap,
    this.showGlow = false,
    this.showGradientBorder = false,
  });

  final Widget child;
  final EdgeInsets? padding;
  final EdgeInsets? margin;
  final bool isSelected;
  final VoidCallback? onTap;
  final bool showGlow;
  final bool showGradientBorder;

  @override
  Widget build(BuildContext context) {
    Widget card = AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      margin: margin,
      decoration: BoxDecoration(
        color: AppColors.backgroundCard,
        borderRadius: AppRadius.radiusLg,
        border: Border.all(
          color: isSelected ? AppColors.primary : AppColors.border,
          width: isSelected ? 2 : 1,
        ),
        boxShadow: [
          if (showGlow || isSelected) ...AppShadows.glow,
          ...AppShadows.cardShadow,
        ],
      ),
      child: ClipRRect(
        borderRadius: AppRadius.radiusLg,
        child: Padding(
          padding: padding ?? const EdgeInsets.all(AppSpacing.lg),
          child: child,
        ),
      ),
    );

    if (showGradientBorder) {
      card = Container(
        margin: margin,
        decoration: BoxDecoration(
          gradient: AppColors.primaryGradient,
          borderRadius: AppRadius.radiusLg,
          boxShadow: showGlow ? AppShadows.glow : null,
        ),
        padding: const EdgeInsets.all(1.5),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.backgroundCard,
            borderRadius: BorderRadius.circular(14),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: Padding(
              padding: padding ?? const EdgeInsets.all(AppSpacing.lg),
              child: child,
            ),
          ),
        ),
      );
    }

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: card);
    }

    return card;
  }
}

/// Premium card header with title and optional action
class PremiumCardHeader extends StatelessWidget {
  const PremiumCardHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.action,
    this.icon,
  });

  final String title;
  final String? subtitle;
  final Widget? action;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        if (icon != null) ...[
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
        ],
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
              if (subtitle != null)
                Text(subtitle!, style: AppTypography.bodySmall),
            ],
          ),
        ),
        if (action != null) action!,
      ],
    );
  }
}
