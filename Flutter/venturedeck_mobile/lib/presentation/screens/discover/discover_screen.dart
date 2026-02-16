/// VentureDeck Mobile - Discover Screen
///
/// Project discovery and search screen for investors.
library;

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/domain/providers/projects_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/project_card.dart';

/// Discover screen for browsing projects
class DiscoverScreen extends ConsumerStatefulWidget {
  const DiscoverScreen({super.key});

  @override
  ConsumerState<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends ConsumerState<DiscoverScreen> {
  final _searchController = TextEditingController();
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    final filter = ref.read(projectsFilterProvider);
    if (filter.search != null) {
      _searchController.text = filter.search!;
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    _debounce?.cancel();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () {
      ref.read(projectsFilterProvider.notifier).update((state) {
        return state.copyWith(search: query.isEmpty ? null : query);
      });
    });
  }

  void _onIndustrySelected(String industry) {
    ref.read(projectsFilterProvider.notifier).update((state) {
      if (state.industry == industry) {
        return state.copyWith(industry: null); // Toggle off
      }
      return state.copyWith(industry: industry);
    });
  }

  @override
  Widget build(BuildContext context) {
    final filter = ref.watch(projectsFilterProvider);
    final projectsAsync = ref.watch(publishedProjectsProvider(filter));

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
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Discover',
                        style: AppTypography.headlineMedium.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ).animate().fadeIn().slideX(begin: -0.1, end: 0),
                      const SizedBox(height: AppSpacing.sm),
                      Text(
                        'Find your next investment opportunity',
                        style: AppTypography.bodyMedium,
                      ).animate(delay: 50.ms).fadeIn(),
                    ],
                  ),
                ),
              ),

              // Search bar
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.backgroundCard,
                      borderRadius: AppRadius.radiusMd,
                      border: Border.all(color: AppColors.border),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: _onSearchChanged,
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textPrimary,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Search projects, industries, tags...',
                        hintStyle: AppTypography.bodyMedium.copyWith(
                          color: AppColors.textMuted,
                        ),
                        prefixIcon: const Icon(
                          Icons.search,
                          color: AppColors.textMuted,
                        ),
                        suffixIcon: IconButton(
                          icon: const Icon(
                            Icons.tune,
                            color: AppColors.textMuted,
                          ),
                          onPressed: () => _showFilters(context),
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md,
                          vertical: AppSpacing.md,
                        ),
                      ),
                    ),
                  ).animate(delay: 100.ms).fadeIn().slideY(begin: -0.1, end: 0),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),

              // Category chips
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Industries', style: AppTypography.titleSmall),
                      const SizedBox(height: AppSpacing.sm),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            _IndustryChip(
                              label: 'FinTech',
                              icon: Icons.account_balance_wallet,
                              isSelected: filter.industry == 'FinTech',
                              onTap: () => _onIndustrySelected('FinTech'),
                            ),
                            _IndustryChip(
                              label: 'HealthTech',
                              icon: Icons.medical_services,
                              isSelected: filter.industry == 'HealthTech',
                              onTap: () => _onIndustrySelected('HealthTech'),
                            ),
                            _IndustryChip(
                              label: 'EdTech',
                              icon: Icons.school,
                              isSelected: filter.industry == 'EdTech',
                              onTap: () => _onIndustrySelected('EdTech'),
                            ),
                            _IndustryChip(
                              label: 'CleanTech',
                              icon: Icons.eco,
                              isSelected: filter.industry == 'CleanTech',
                              onTap: () => _onIndustrySelected('CleanTech'),
                            ),
                            _IndustryChip(
                              label: 'AI/ML',
                              icon: Icons.psychology,
                              isSelected: filter.industry == 'AI/ML',
                              onTap: () => _onIndustrySelected('AI/ML'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ).animate(delay: 150.ms).fadeIn(),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

              // Featured/List section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.lg,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            filter.industry != null
                                ? '${filter.industry} Projects'
                                : 'All Projects',
                            style: AppTypography.titleMedium,
                          ),
                          if (filter.search != null || filter.industry != null)
                            TextButton(
                              onPressed: () {
                                _searchController.clear();
                                ref
                                        .read(projectsFilterProvider.notifier)
                                        .state =
                                    const ProjectsFilter();
                              },
                              child: Text(
                                'Clear Filters',
                                style: AppTypography.labelSmall.copyWith(
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.md)),

              // Projects List
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
                sliver: projectsAsync.when(
                  data: (projects) {
                    if (projects.isEmpty) {
                      return const SliverToBoxAdapter(child: _EmptyState());
                    }
                    return SliverList(
                      delegate: SliverChildBuilderDelegate((context, index) {
                        final project = projects[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: AppSpacing.md),
                          child:
                              ProjectCard(
                                    project: project,
                                    showActions: false, // Investor view
                                    onTap: () =>
                                        context.push('/projects/${project.id}'),
                                  )
                                  .animate(
                                    delay: Duration(milliseconds: 50 * index),
                                  )
                                  .fadeIn()
                                  .slideX(begin: 0.1, end: 0),
                        );
                      }, childCount: projects.length),
                    );
                  },
                  loading: () => const SliverToBoxAdapter(
                    child: Center(
                      child: Padding(
                        padding: EdgeInsets.all(AppSpacing.xl),
                        child: CircularProgressIndicator(),
                      ),
                    ),
                  ),
                  error: (error, _) => SliverToBoxAdapter(
                    child: Center(child: Text('Error: $error')),
                  ),
                ),
              ),

              // Bottom padding
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
    );
  }

  void _showFilters(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.backgroundCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Filter Projects', style: AppTypography.titleLarge),
            const SizedBox(height: AppSpacing.lg),
            Text(
              'More filters coming soon...',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }
}

/// Industry chip widget
class _IndustryChip extends StatelessWidget {
  const _IndustryChip({
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: AppSpacing.sm),
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primary.withValues(alpha: 0.1)
                : AppColors.backgroundCard,
            borderRadius: AppRadius.radiusMd,
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected ? AppColors.primary : AppColors.textMuted,
              ),
              const SizedBox(width: AppSpacing.xs),
              Text(
                label,
                style: AppTypography.labelSmall.copyWith(
                  color: isSelected
                      ? AppColors.primary
                      : AppColors.textSecondary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          children: [
            const Icon(Icons.search_off, size: 48, color: AppColors.textMuted),
            const SizedBox(height: AppSpacing.md),
            Text(
              'No projects found',
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
