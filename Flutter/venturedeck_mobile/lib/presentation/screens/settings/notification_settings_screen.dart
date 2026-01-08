/// VentureDeck Mobile - Notification Settings Screen
///
/// Screen for managing notification preferences.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Notification settings screen
class NotificationSettingsScreen extends ConsumerStatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  ConsumerState<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState
    extends ConsumerState<NotificationSettingsScreen> {
  // Push notifications
  bool _pushEnabled = true;
  bool _pushMessages = true;
  bool _pushProjects = true;
  bool _pushMatches = true;
  bool _pushBounties = true;
  bool _pushMilestones = true;

  // Email notifications
  bool _emailEnabled = true;
  bool _emailDigest = true;
  bool _emailMessages = false;
  bool _emailMatches = true;

  bool _hasChanges = false;

  void _onChanged() {
    if (!_hasChanges) {
      setState(() => _hasChanges = true);
    }
  }

  Future<void> _handleSave() async {
    // TODO: Save notification preferences via API
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Notification settings saved')),
      );
      context.pop();
    }
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
                      'Notifications',
                      style: AppTypography.headlineMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    if (_hasChanges)
                      TextButton(
                        onPressed: _handleSave,
                        child: Text(
                          'Save',
                          style: AppTypography.labelMedium.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                  ],
                ),
              ),

              // Settings
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  children: [
                    // Push Notifications section
                    _buildSectionTitle('Push Notifications'),
                    const SizedBox(height: AppSpacing.md),
                    PremiumCard(
                      padding: EdgeInsets.zero,
                      child: Column(
                        children: [
                          _ToggleItem(
                            icon: Icons.notifications_active,
                            title: 'Enable Push Notifications',
                            subtitle: 'Receive notifications on this device',
                            value: _pushEnabled,
                            onChanged: (v) {
                              setState(() => _pushEnabled = v);
                              _onChanged();
                            },
                          ),
                          if (_pushEnabled) ...[
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.chat_bubble_outline,
                              title: 'New Messages',
                              subtitle: 'When you receive a new message',
                              value: _pushMessages,
                              onChanged: (v) {
                                setState(() => _pushMessages = v);
                                _onChanged();
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.rocket_launch_outlined,
                              title: 'Project Updates',
                              subtitle: 'Updates on projects you follow',
                              value: _pushProjects,
                              onChanged: (v) {
                                setState(() => _pushProjects = v);
                                _onChanged();
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.handshake_outlined,
                              title: 'New Matches',
                              subtitle: 'When AI finds a potential match',
                              value: _pushMatches,
                              onChanged: (v) {
                                setState(() => _pushMatches = v);
                                _onChanged();
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.paid_outlined,
                              title: 'Bounty Activity',
                              subtitle: 'Updates on your bounties',
                              value: _pushBounties,
                              onChanged: (v) {
                                setState(() => _pushBounties = v);
                                _onChanged();
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.flag_outlined,
                              title: 'Milestone Updates',
                              subtitle: 'When milestones are completed',
                              value: _pushMilestones,
                              onChanged: (v) {
                                setState(() => _pushMilestones = v);
                                _onChanged();
                              },
                            ),
                          ],
                        ],
                      ),
                    ).animate(delay: 100.ms).fadeIn().slideX(begin: -0.1),

                    const SizedBox(height: AppSpacing.xl),

                    // Email section
                    _buildSectionTitle('Email Notifications'),
                    const SizedBox(height: AppSpacing.md),
                    PremiumCard(
                      padding: EdgeInsets.zero,
                      child: Column(
                        children: [
                          _ToggleItem(
                            icon: Icons.email_outlined,
                            title: 'Enable Email Notifications',
                            subtitle: 'Receive updates via email',
                            value: _emailEnabled,
                            onChanged: (v) {
                              setState(() => _emailEnabled = v);
                              _onChanged();
                            },
                          ),
                          if (_emailEnabled) ...[
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.summarize_outlined,
                              title: 'Weekly Digest',
                              subtitle: 'Summary of activity each week',
                              value: _emailDigest,
                              onChanged: (v) {
                                setState(() => _emailDigest = v);
                                _onChanged();
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.chat_outlined,
                              title: 'Message Alerts',
                              subtitle: 'Email for each new message',
                              value: _emailMessages,
                              onChanged: (v) {
                                setState(() => _emailMessages = v);
                                _onChanged();
                              },
                            ),
                            const Divider(color: AppColors.border, height: 1),
                            _ToggleItem(
                              icon: Icons.auto_awesome,
                              title: 'Match Alerts',
                              subtitle: 'AI-powered match suggestions',
                              value: _emailMatches,
                              onChanged: (v) {
                                setState(() => _emailMatches = v);
                                _onChanged();
                              },
                            ),
                          ],
                        ],
                      ),
                    ).animate(delay: 200.ms).fadeIn().slideX(begin: -0.1),

                    const SizedBox(height: AppSpacing.xl),

                    // Info card
                    PremiumCard(
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.info_outline,
                              color: AppColors.primary,
                              size: 20,
                            ),
                          ),
                          const SizedBox(width: AppSpacing.md),
                          Expanded(
                            child: Text(
                              'You can also manage notification permissions in your device settings.',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ).animate(delay: 300.ms).fadeIn(),

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: AppTypography.titleSmall.copyWith(color: AppColors.primary),
    );
  }
}

/// Toggle item widget
class _ToggleItem extends StatelessWidget {
  const _ToggleItem({
    required this.icon,
    required this.title,
    this.subtitle,
    required this.value,
    required this.onChanged,
  });

  final IconData icon;
  final String title;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.textSecondary, size: 22),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTypography.bodyMedium.copyWith(
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
          Switch(
            value: value,
            onChanged: onChanged,
            activeThumbColor: AppColors.primary,
            activeTrackColor: AppColors.primary.withValues(alpha: 0.3),
          ),
        ],
      ),
    );
  }
}
