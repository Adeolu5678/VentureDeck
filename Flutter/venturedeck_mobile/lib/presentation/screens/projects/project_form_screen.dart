/// VentureDeck Mobile - Create/Edit Project Screen
///
/// Form screen for creating or editing projects.
library;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/project.dart';
import 'package:venturedeck_mobile/domain/providers/projects_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';

/// Industries available for selection
const _industries = [
  'FinTech',
  'HealthTech',
  'EdTech',
  'CleanTech',
  'AI/ML',
  'E-commerce',
  'SaaS',
  'Marketplace',
  'Consumer',
  'Enterprise',
  'Gaming',
  'Media',
  'Real Estate',
  'Transportation',
  'Other',
];

/// Create/Edit project screen
class ProjectFormScreen extends ConsumerStatefulWidget {
  const ProjectFormScreen({super.key, this.projectId});

  final String? projectId;

  bool get isEditing => projectId != null;

  @override
  ConsumerState<ProjectFormScreen> createState() => _ProjectFormScreenState();
}

class _ProjectFormScreenState extends ConsumerState<ProjectFormScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleController = TextEditingController();
  final _taglineController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _fundingGoalController = TextEditingController();
  final _equityController = TextEditingController();
  final _locationController = TextEditingController();
  final _tagsController = TextEditingController();

  String? _selectedIndustry;
  ProjectStage? _selectedStage;
  bool _isLoading = false;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    if (widget.isEditing) {
      _loadProject();
    }
  }

  Future<void> _loadProject() async {
    if (widget.projectId == null) return;

    setState(() => _isLoading = true);

    try {
      final project = await ref.read(projectProvider(widget.projectId!).future);
      if (project != null && mounted) {
        _titleController.text = project.title;
        _taglineController.text = project.tagline;
        _descriptionController.text = project.description;
        _fundingGoalController.text = project.fundingGoal.toStringAsFixed(0);
        _equityController.text = project.equityOffered.toString();
        _locationController.text = project.location ?? '';
        _tagsController.text = project.tags.join(', ');
        _selectedIndustry = project.industry;
        _selectedStage = project.stage;
        _isInitialized = true;
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to load project: $e')));
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _taglineController.dispose();
    _descriptionController.dispose();
    _fundingGoalController.dispose();
    _equityController.dispose();
    _locationController.dispose();
    _tagsController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedIndustry == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an industry')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final tags = _tagsController.text
          .split(',')
          .map((t) => t.trim())
          .where((t) => t.isNotEmpty)
          .toList();

      final actions = ref.read(projectActionsProvider.notifier);

      if (widget.isEditing) {
        final success = await actions.updateProject(
          projectId: widget.projectId!,
          title: _titleController.text,
          tagline: _taglineController.text,
          description: _descriptionController.text,
          industry: _selectedIndustry!,
          fundingGoal: double.parse(_fundingGoalController.text),
          equityOffered: double.parse(_equityController.text),
          tags: tags,
          stage: _selectedStage,
          location: _locationController.text.isNotEmpty
              ? _locationController.text
              : null,
        );

        if (success && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Project updated successfully')),
          );
          context.pop();
        }
      } else {
        final projectId = await actions.createProject(
          title: _titleController.text,
          tagline: _taglineController.text,
          description: _descriptionController.text,
          industry: _selectedIndustry!,
          fundingGoal: double.parse(_fundingGoalController.text),
          equityOffered: double.parse(_equityController.text),
          tags: tags,
          stage: _selectedStage,
          location: _locationController.text.isNotEmpty
              ? _locationController.text
              : null,
        );

        if (projectId != null && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Project created successfully')),
          );
          context.pop();
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isEditing && !_isInitialized && _isLoading) {
      return Scaffold(
        body: Container(
          decoration: const BoxDecoration(
            gradient: AppColors.backgroundGradient,
          ),
          child: const Center(child: CircularProgressIndicator()),
        ),
      );
    }

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
                      widget.isEditing ? 'Edit Project' : 'Create Project',
                      style: AppTypography.headlineMedium.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
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
                        // Title
                        _buildLabel('Project Title'),
                        _buildTextField(
                          controller: _titleController,
                          hint: 'Enter project title',
                          validator: (v) =>
                              v?.isEmpty ?? true ? 'Title is required' : null,
                        ).animate().fadeIn().slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Tagline
                        _buildLabel('Tagline'),
                        _buildTextField(
                              controller: _taglineController,
                              hint: 'A brief one-line description',
                              validator: (v) => v?.isEmpty ?? true
                                  ? 'Tagline is required'
                                  : null,
                            )
                            .animate(delay: 50.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Description
                        _buildLabel('Description'),
                        _buildTextField(
                              controller: _descriptionController,
                              hint: 'Describe your project in detail...',
                              maxLines: 5,
                              validator: (v) => v?.isEmpty ?? true
                                  ? 'Description is required'
                                  : null,
                            )
                            .animate(delay: 100.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Industry dropdown
                        _buildLabel('Industry'),
                        _buildDropdown(
                              value: _selectedIndustry,
                              items: _industries,
                              hint: 'Select industry',
                              onChanged: (v) =>
                                  setState(() => _selectedIndustry = v),
                            )
                            .animate(delay: 150.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Stage dropdown
                        _buildLabel('Stage (Optional)'),
                        _buildStageDropdown()
                            .animate(delay: 200.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Funding & Equity row
                        Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      _buildLabel('Funding Goal (\$)'),
                                      _buildTextField(
                                        controller: _fundingGoalController,
                                        hint: '500000',
                                        keyboardType: TextInputType.number,
                                        inputFormatters: [
                                          FilteringTextInputFormatter
                                              .digitsOnly,
                                        ],
                                        validator: (v) {
                                          if (v?.isEmpty ?? true) {
                                            return 'Required';
                                          }
                                          final amount = double.tryParse(v!);
                                          if (amount == null || amount <= 0) {
                                            return 'Invalid amount';
                                          }
                                          return null;
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.md),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      _buildLabel('Equity (%)'),
                                      _buildTextField(
                                        controller: _equityController,
                                        hint: '10',
                                        keyboardType:
                                            const TextInputType.numberWithOptions(
                                              decimal: true,
                                            ),
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                            RegExp(r'[\d.]'),
                                          ),
                                        ],
                                        validator: (v) {
                                          if (v?.isEmpty ?? true) {
                                            return 'Required';
                                          }
                                          final equity = double.tryParse(v!);
                                          if (equity == null ||
                                              equity <= 0 ||
                                              equity > 100) {
                                            return 'Invalid %';
                                          }
                                          return null;
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            )
                            .animate(delay: 250.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Location
                        _buildLabel('Location (Optional)'),
                        _buildTextField(
                              controller: _locationController,
                              hint: 'e.g., San Francisco, CA',
                            )
                            .animate(delay: 300.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.lg),

                        // Tags
                        _buildLabel('Tags (comma separated)'),
                        _buildTextField(
                              controller: _tagsController,
                              hint: 'e.g., B2B, SaaS, AI',
                            )
                            .animate(delay: 350.ms)
                            .fadeIn()
                            .slideX(begin: -0.1, end: 0),

                        const SizedBox(height: AppSpacing.xl),

                        // Submit button
                        PremiumButton(
                              label: widget.isEditing
                                  ? 'Save Changes'
                                  : 'Create Project',
                              icon: widget.isEditing ? Icons.save : Icons.add,
                              variant: PremiumButtonVariant.gradient,
                              fullWidth: true,
                              isLoading: _isLoading,
                              onPressed: _isLoading ? null : _handleSubmit,
                            )
                            .animate(delay: 400.ms)
                            .fadeIn()
                            .slideY(begin: 0.2, end: 0),

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
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Text(text, style: AppTypography.labelMedium),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    int maxLines = 1,
    TextInputType? keyboardType,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
  }) {
    return PremiumCard(
      padding: EdgeInsets.zero,
      child: TextFormField(
        controller: controller,
        maxLines: maxLines,
        keyboardType: keyboardType,
        inputFormatters: inputFormatters,
        validator: validator,
        style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: AppTypography.bodyMedium.copyWith(
            color: AppColors.textMuted,
          ),
          filled: false,
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          errorBorder: InputBorder.none,
          focusedErrorBorder: InputBorder.none,
          contentPadding: const EdgeInsets.all(AppSpacing.md),
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String? value,
    required List<String> items,
    required String hint,
    required ValueChanged<String?> onChanged,
  }) {
    return PremiumCard(
      padding: EdgeInsets.zero,
      child: DropdownButtonFormField<String>(
        initialValue: value,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: AppTypography.bodyMedium.copyWith(
            color: AppColors.textMuted,
          ),
          filled: false,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
        ),
        dropdownColor: AppColors.backgroundCard,
        style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
        items: items.map((item) {
          return DropdownMenuItem(value: item, child: Text(item));
        }).toList(),
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildStageDropdown() {
    return PremiumCard(
      padding: EdgeInsets.zero,
      child: DropdownButtonFormField<ProjectStage>(
        initialValue: _selectedStage,
        decoration: InputDecoration(
          hintText: 'Select stage',
          hintStyle: AppTypography.bodyMedium.copyWith(
            color: AppColors.textMuted,
          ),
          filled: false,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
        ),
        dropdownColor: AppColors.backgroundCard,
        style: AppTypography.bodyMedium.copyWith(color: AppColors.textPrimary),
        items: ProjectStage.values.map((stage) {
          return DropdownMenuItem(
            value: stage,
            child: Text(_getStageDisplayName(stage)),
          );
        }).toList(),
        onChanged: (v) => setState(() => _selectedStage = v),
      ),
    );
  }

  String _getStageDisplayName(ProjectStage stage) {
    switch (stage) {
      case ProjectStage.idea:
        return 'Idea';
      case ProjectStage.mvp:
        return 'MVP';
      case ProjectStage.seed:
        return 'Seed';
      case ProjectStage.seriesA:
        return 'Series A';
      case ProjectStage.seriesB:
        return 'Series B';
      case ProjectStage.growth:
        return 'Growth';
    }
  }
}
