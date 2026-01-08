/// VentureDeck Mobile - Premium Button Widget
///
/// Styled button component matching the web design system.
library;

import 'package:flutter/material.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';

/// Button variants
enum PremiumButtonVariant { gradient, glass, outline, text }

/// Button sizes
enum PremiumButtonSize { small, medium, large }

/// Premium button widget
class PremiumButton extends StatelessWidget {
  const PremiumButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.variant = PremiumButtonVariant.gradient,
    this.size = PremiumButtonSize.medium,
    this.isLoading = false,
    this.fullWidth = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final PremiumButtonVariant variant;
  final PremiumButtonSize size;
  final bool isLoading;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    final isDisabled = onPressed == null || isLoading;

    return AnimatedOpacity(
      duration: const Duration(milliseconds: 150),
      opacity: isDisabled ? 0.6 : 1.0,
      child: Container(
        width: fullWidth ? double.infinity : null,
        decoration: _buildDecoration(isDisabled),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isDisabled ? null : onPressed,
            borderRadius: AppRadius.radiusMd,
            child: Container(
              padding: _getPadding(),
              child: Row(
                mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (isLoading) ...[
                    SizedBox(
                      width: _getIconSize(),
                      height: _getIconSize(),
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          _getTextColor(),
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                  ] else if (icon != null) ...[
                    Icon(icon, size: _getIconSize(), color: _getTextColor()),
                    const SizedBox(width: AppSpacing.sm),
                  ],
                  Text(label, style: _getTextStyle()),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  BoxDecoration _buildDecoration(bool isDisabled) {
    switch (variant) {
      case PremiumButtonVariant.gradient:
        return BoxDecoration(
          gradient: isDisabled ? null : AppColors.primaryGradient,
          color: isDisabled ? AppColors.textMuted : null,
          borderRadius: AppRadius.radiusMd,
          boxShadow: isDisabled ? null : AppShadows.glow,
        );
      case PremiumButtonVariant.glass:
        return BoxDecoration(
          color: AppColors.backgroundCard,
          borderRadius: AppRadius.radiusMd,
          border: Border.all(color: AppColors.border),
        );
      case PremiumButtonVariant.outline:
        return BoxDecoration(
          borderRadius: AppRadius.radiusMd,
          border: Border.all(color: AppColors.primary),
        );
      case PremiumButtonVariant.text:
        return const BoxDecoration();
    }
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case PremiumButtonSize.small:
        return const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        );
      case PremiumButtonSize.medium:
        return const EdgeInsets.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.md,
        );
      case PremiumButtonSize.large:
        return const EdgeInsets.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.lg,
        );
    }
  }

  double _getIconSize() {
    switch (size) {
      case PremiumButtonSize.small:
        return 16;
      case PremiumButtonSize.medium:
        return 18;
      case PremiumButtonSize.large:
        return 20;
    }
  }

  Color _getTextColor() {
    switch (variant) {
      case PremiumButtonVariant.gradient:
        return AppColors.backgroundDark;
      case PremiumButtonVariant.glass:
        return AppColors.textPrimary;
      case PremiumButtonVariant.outline:
        return AppColors.primary;
      case PremiumButtonVariant.text:
        return AppColors.primary;
    }
  }

  TextStyle _getTextStyle() {
    final baseStyle = switch (size) {
      PremiumButtonSize.small => AppTypography.labelSmall,
      PremiumButtonSize.medium => AppTypography.labelMedium,
      PremiumButtonSize.large => AppTypography.labelLarge,
    };

    return baseStyle.copyWith(
      color: _getTextColor(),
      fontWeight: FontWeight.w600,
    );
  }
}
