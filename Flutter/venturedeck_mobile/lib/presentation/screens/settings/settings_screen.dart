/// VentureDeck Mobile - Settings Screen
///
/// Main settings screen with navigation to sub-settings.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/services/auth_service.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Settings screen
class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider).valueOrNull;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back),
                        onPressed: () => context.pop(),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Text(
                        'Settings',
                        style: AppTypography.headlineMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Account section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionTitle('Account'),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: [
                            _SettingsItem(
                              icon: Icons.person_outline,
                              title: 'Edit Profile',
                              subtitle: 'Update your personal information',
                              onTap: () => context.push('/profile/edit'),
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.email_outlined,
                              title: 'Email',
                              subtitle: user?.email ?? 'Not set',
                              showChevron: false,
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.badge_outlined,
                              title: 'Role',
                              subtitle: user?.isEntrepreneur == true
                                  ? 'Entrepreneur'
                                  : 'Investor',
                              showChevron: false,
                            ),
                          ],
                        ),
                      ).animate(delay: 100.ms).fadeIn().slideX(begin: -0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Preferences section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionTitle('Preferences'),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: [
                            _SettingsItem(
                              icon: Icons.notifications_outlined,
                              title: 'Notifications',
                              subtitle: 'Manage notification preferences',
                              onTap: () =>
                                  context.push('/settings/notifications'),
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.lock_outline,
                              title: 'Privacy',
                              subtitle: 'Control your privacy settings',
                              onTap: () => context.push('/settings/privacy'),
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            const _SettingsItem(
                              icon: Icons.palette_outlined,
                              title: 'Appearance',
                              subtitle: 'Dark mode is always on',
                              showChevron: false,
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            const _SettingsItem(
                              icon: Icons.language,
                              title: 'Language',
                              subtitle: 'English',
                              showChevron: false,
                            ),
                          ],
                        ),
                      ).animate(delay: 200.ms).fadeIn().slideX(begin: -0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Security section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionTitle('Security'),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: [
                            _SettingsItem(
                              icon: Icons.password,
                              title: 'Change Password',
                              subtitle: 'Update your password',
                              onTap: () {
                                // TODO: Password change
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.security,
                              title: 'Two-Factor Authentication',
                              subtitle: 'Add extra security',
                              onTap: () {
                                // TODO: 2FA settings
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.devices,
                              title: 'Active Sessions',
                              subtitle: 'Manage logged-in devices',
                              onTap: () {
                                // TODO: Sessions
                              },
                            ),
                          ],
                        ),
                      ).animate(delay: 300.ms).fadeIn().slideX(begin: -0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Support section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionTitle('Support'),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: [
                            _SettingsItem(
                              icon: Icons.help_outline,
                              title: 'Help Center',
                              subtitle: 'Get help and FAQs',
                              onTap: () {
                                // TODO: Help center
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.feedback_outlined,
                              title: 'Send Feedback',
                              subtitle: 'Help us improve',
                              onTap: () {
                                // TODO: Feedback
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.description_outlined,
                              title: 'Terms of Service',
                              onTap: () {
                                // TODO: Terms
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.privacy_tip_outlined,
                              title: 'Privacy Policy',
                              onTap: () {
                                // TODO: Privacy policy
                              },
                            ),
                          ],
                        ),
                      ).animate(delay: 400.ms).fadeIn().slideX(begin: -0.1),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Danger zone
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSectionTitle('Danger Zone', isDestructive: true),
                      const SizedBox(height: AppSpacing.md),
                      PremiumCard(
                        padding: EdgeInsets.zero,
                        child: Column(
                          children: [
                            _SettingsItem(
                              icon: Icons.logout,
                              title: 'Sign Out',
                              iconColor: AppColors.error,
                              titleColor: AppColors.error,
                              onTap: () => _showSignOutDialog(context, ref),
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _SettingsItem(
                              icon: Icons.delete_outline,
                              title: 'Delete Account',
                              subtitle: 'Permanently delete your account',
                              iconColor: AppColors.error,
                              titleColor: AppColors.error,
                              onTap: () => _showDeleteAccountDialog(context),
                            ),
                          ],
                        ),
                      ).animate(delay: 500.ms).fadeIn().slideX(begin: -0.1),
                    ],
                  ),
                ),
              ),

              // Version info
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Center(
                    child: Text(
                      'VentureDeck v1.0.0',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 50)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, {bool isDestructive = false}) {
    return Text(
      title,
      style: AppTypography.titleSmall.copyWith(
        color: isDestructive ? AppColors.error : AppColors.primary,
      ),
    );
  }

  void _showSignOutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Sign Out?'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await AuthService.instance.signOut();
              if (context.mounted) {
                context.go('/login');
              }
            },
            child: const Text(
              'Sign Out',
              style: TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Delete Account?'),
        content: const Text(
          'This action is permanent and cannot be undone. All your data will be deleted.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              // TODO: Delete account
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

/// Settings item widget
class _SettingsItem extends StatelessWidget {
  const _SettingsItem({
    required this.icon,
    required this.title,
    this.subtitle,
    this.onTap,
    this.showChevron = true,
    this.iconColor,
    this.titleColor,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final VoidCallback? onTap;
  final bool showChevron;
  final Color? iconColor;
  final Color? titleColor;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Row(
          children: [
            Icon(icon, color: iconColor ?? AppColors.textSecondary, size: 22),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTypography.bodyMedium.copyWith(
                      color: titleColor ?? AppColors.textPrimary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (subtitle != null)
                    Text(
                      subtitle!,
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                ],
              ),
            ),
            if (showChevron && onTap != null)
              const Icon(Icons.chevron_right, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }
}
