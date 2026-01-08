/// VentureDeck Mobile - Edit Profile Screen
///
/// Screen for editing user profile information.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Edit profile screen
class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _displayNameController;
  late TextEditingController _usernameController;
  late TextEditingController _bioController;
  late TextEditingController _locationController;
  late TextEditingController _companyController;
  late TextEditingController _websiteController;
  late TextEditingController _linkedinController;
  late TextEditingController _twitterController;

  List<String> _skills = [];
  final _skillController = TextEditingController();
  bool _isLoading = false;
  bool _hasChanges = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(currentUserProvider).valueOrNull;

    _displayNameController = TextEditingController(
      text: user?.displayName ?? '',
    );
    _usernameController = TextEditingController(text: user?.username ?? '');
    _bioController = TextEditingController(text: user?.professionalBio ?? '');
    _locationController = TextEditingController(text: user?.location ?? '');
    _companyController = TextEditingController(text: user?.company ?? '');
    _websiteController = TextEditingController(text: user?.website ?? '');
    _linkedinController = TextEditingController(text: user?.linkedin ?? '');
    _twitterController = TextEditingController(text: user?.twitter ?? '');
    _skills = List.from(user?.skills ?? []);

    // Listen for changes
    for (final controller in [
      _displayNameController,
      _usernameController,
      _bioController,
      _locationController,
      _companyController,
      _websiteController,
      _linkedinController,
      _twitterController,
    ]) {
      controller.addListener(_onFieldChanged);
    }
  }

  void _onFieldChanged() {
    if (!_hasChanges) {
      setState(() => _hasChanges = true);
    }
  }

  @override
  void dispose() {
    _displayNameController.dispose();
    _usernameController.dispose();
    _bioController.dispose();
    _locationController.dispose();
    _companyController.dispose();
    _websiteController.dispose();
    _linkedinController.dispose();
    _twitterController.dispose();
    _skillController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      // TODO: Save profile via API
      await Future.delayed(const Duration(seconds: 1));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully')),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to update profile: $e')));
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _addSkill() {
    final skill = _skillController.text.trim();
    if (skill.isNotEmpty && !_skills.contains(skill)) {
      setState(() {
        _skills.add(skill);
        _hasChanges = true;
      });
      _skillController.clear();
    }
  }

  void _removeSkill(String skill) {
    setState(() {
      _skills.remove(skill);
      _hasChanges = true;
    });
  }

  Future<bool> _onWillPop() async {
    if (!_hasChanges) return true;

    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.backgroundCard,
        title: const Text('Discard changes?'),
        content: const Text(
          'You have unsaved changes. Do you want to discard them?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Discard'),
          ),
        ],
      ),
    );

    return result ?? false;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !_hasChanges,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldPop = await _onWillPop();
        if (shouldPop && context.mounted) {
          context.pop();
        }
      },
      child: Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: AppColors.backgroundGradient,
          ),
          child: SafeArea(
            child: Column(
              children: [
                // Header
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () async {
                          if (_hasChanges) {
                            final shouldPop = await _onWillPop();
                            if (shouldPop && context.mounted) {
                              context.pop();
                            }
                          } else {
                            context.pop();
                          }
                        },
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Text(
                        'Edit Profile',
                        style: AppTypography.headlineMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Spacer(),
                      PremiumButton(
                        label: 'Save',
                        size: PremiumButtonSize.small,
                        isLoading: _isLoading,
                        onPressed: _hasChanges && !_isLoading
                            ? _handleSave
                            : null,
                      ),
                    ],
                  ),
                ),

                // Form
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.lg,
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Avatar section
                          Center(
                            child: Stack(
                              children: [
                                Container(
                                  width: 100,
                                  height: 100,
                                  decoration: BoxDecoration(
                                    gradient: AppColors.primaryGradient,
                                    shape: BoxShape.circle,
                                    boxShadow: AppShadows.glow,
                                  ),
                                  child: Center(
                                    child: Text(
                                      _displayNameController.text.isNotEmpty
                                          ? _displayNameController.text[0]
                                                .toUpperCase()
                                          : '?',
                                      style: AppTypography.displaySmall
                                          .copyWith(
                                            color: AppColors.backgroundDark,
                                          ),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  right: 0,
                                  bottom: 0,
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: AppColors.backgroundCard,
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: AppColors.primary,
                                      ),
                                    ),
                                    child: const Icon(
                                      Icons.camera_alt,
                                      size: 16,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ).animate().fadeIn().scale(
                            begin: const Offset(0.9, 0.9),
                          ),

                          const SizedBox(height: AppSpacing.xl),

                          // Basic Info section
                          _buildSectionHeader('Basic Information'),
                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _displayNameController,
                            label: 'Display Name',
                            hint: 'Your full name',
                            prefixIcon: Icons.person_outline,
                            validator: (v) =>
                                v?.isEmpty ?? true ? 'Name is required' : null,
                          ).animate(delay: 100.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _usernameController,
                            label: 'Username',
                            hint: '@username',
                            prefixIcon: Icons.alternate_email,
                          ).animate(delay: 150.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _bioController,
                            label: 'Professional Bio',
                            hint: 'Tell us about yourself...',
                            prefixIcon: Icons.description_outlined,
                            maxLines: 4,
                          ).animate(delay: 200.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.xl),

                          // Location & Company section
                          _buildSectionHeader('Work'),
                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _companyController,
                            label: 'Company',
                            hint: 'Your company name',
                            prefixIcon: Icons.business_outlined,
                          ).animate(delay: 250.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _locationController,
                            label: 'Location',
                            hint: 'City, Country',
                            prefixIcon: Icons.location_on_outlined,
                          ).animate(delay: 300.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.xl),

                          // Skills section
                          _buildSectionHeader('Skills'),
                          const SizedBox(height: AppSpacing.md),

                          Row(
                            children: [
                              Expanded(
                                child: _buildTextField(
                                  controller: _skillController,
                                  label: '',
                                  hint: 'Add a skill',
                                  prefixIcon: Icons.psychology_outlined,
                                ),
                              ),
                              const SizedBox(width: AppSpacing.sm),
                              IconButton(
                                onPressed: _addSkill,
                                icon: Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: const BoxDecoration(
                                    color: AppColors.primary,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.add,
                                    color: AppColors.backgroundDark,
                                    size: 20,
                                  ),
                                ),
                              ),
                            ],
                          ).animate(delay: 350.ms).fadeIn().slideX(begin: -0.1),

                          if (_skills.isNotEmpty) ...[
                            const SizedBox(height: AppSpacing.md),
                            Wrap(
                              spacing: AppSpacing.sm,
                              runSpacing: AppSpacing.sm,
                              children: _skills.map((skill) {
                                return Chip(
                                  label: Text(skill),
                                  deleteIcon: const Icon(Icons.close, size: 16),
                                  onDeleted: () => _removeSkill(skill),
                                  backgroundColor:
                                      AppColors.backgroundCardLight,
                                  side: const BorderSide(color: AppColors.border),
                                );
                              }).toList(),
                            ),
                          ],

                          const SizedBox(height: AppSpacing.xl),

                          // Social Links section
                          _buildSectionHeader('Social Links'),
                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _websiteController,
                            label: 'Website',
                            hint: 'https://yourwebsite.com',
                            prefixIcon: Icons.language,
                            keyboardType: TextInputType.url,
                          ).animate(delay: 400.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _linkedinController,
                            label: 'LinkedIn',
                            hint: 'linkedin.com/in/username',
                            prefixIcon: Icons.link,
                            keyboardType: TextInputType.url,
                          ).animate(delay: 450.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.md),

                          _buildTextField(
                            controller: _twitterController,
                            label: 'Twitter / X',
                            hint: '@username',
                            prefixIcon: Icons.alternate_email,
                          ).animate(delay: 500.ms).fadeIn().slideX(begin: -0.1),

                          const SizedBox(height: AppSpacing.xxl),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: AppTypography.titleMedium.copyWith(color: AppColors.primary),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData prefixIcon,
    int maxLines = 1,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label.isNotEmpty) ...[
          Text(label, style: AppTypography.labelMedium),
          const SizedBox(height: AppSpacing.xs),
        ],
        PremiumCard(
          padding: EdgeInsets.zero,
          child: TextFormField(
            controller: controller,
            maxLines: maxLines,
            keyboardType: keyboardType,
            validator: validator,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
            ),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
              prefixIcon: Icon(
                prefixIcon,
                color: AppColors.textMuted,
                size: 20,
              ),
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: maxLines > 1 ? AppSpacing.md : AppSpacing.sm,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
