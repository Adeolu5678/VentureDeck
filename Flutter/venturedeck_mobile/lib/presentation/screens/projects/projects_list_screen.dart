/// VentureDeck Mobile - Projects List Screen
///
/// Screen showing user's projects or all published projects.
library;

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:venturedeck_mobile/core/theme/app_theme.dart';
import 'package:venturedeck_mobile/data/models/project.dart';
import 'package:venturedeck_mobile/domain/providers/auth_provider.dart';
import 'package:venturedeck_mobile/domain/providers/projects_provider.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_button.dart';
import 'package:venturedeck_mobile/presentation/widgets/premium_card.dart';
import 'package:venturedeck_mobile/presentation/widgets/project_card.dart';

/// Filter tabs for projects
enum ProjectFilterTab { all, published, draft, funded }

/// Projects list screen
class ProjectsListScreen extends ConsumerStatefulWidget {
  const ProjectsListScreen({super.key});

  @override
  ConsumerState<ProjectsListScreen> createState() => _ProjectsListScreenState();
}

class _ProjectsListScreenState extends ConsumerState<ProjectsListScreen> {
  ProjectFilterTab _selectedTab = ProjectFilterTab.all;

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(currentUserProvider).valueOrNull;
    final isEntrepreneur = user?.isEntrepreneur ?? false;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: () async {
              if (isEntrepreneur) {
                ref.invalidate(myProjectsProvider);
              } else {
                ref.invalidate(publishedProjectsProvider);
              }
            },
            color: AppColors.primary,
            backgroundColor: AppColors.backgroundCard,
            child: CustomScrollView(
              slivers: [
                // Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          isEntrepreneur ? 'My Projects' : 'Explore Projects',
                          style: AppTypography.headlineMedium.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        if (isEntrepreneur)
                          PremiumButton(
                            label: 'New',
                            icon: Icons.add,
                            size: PremiumButtonSize.small,
                            onPressed: () => context.push('/projects/new'),
                          ),
                      ],
                    ),
                  ),
                ),

                // Filter chips
                if (isEntrepreneur)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.lg,
                      ),
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: ProjectFilterTab.values.map((tab) {
                            return Padding(
                              padding: const EdgeInsets.only(
                                right: AppSpacing.sm,
                              ),
                              child: _FilterChip(
                                label: _getTabLabel(tab),
                                isSelected: _selectedTab == tab,
                                onTap: () => setState(() => _selectedTab = tab),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ),

                const SliverToBoxAdapter(
                  child: SizedBox(height: AppSpacing.lg),
                ),

                // Projects list
                if (isEntrepreneur)
                  _MyProjectsList(filterTab: _selectedTab)
                else
                  const _ExploreProjectsList(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getTabLabel(ProjectFilterTab tab) {
    switch (tab) {
      case ProjectFilterTab.all:
        return 'All';
      case ProjectFilterTab.published:
        return 'Published';
      case ProjectFilterTab.draft:
        return 'Draft';
      case ProjectFilterTab.funded:
        return 'Funded';
    }
  }
}

/// My projects list (for entrepreneurs)
class _MyProjectsList extends ConsumerWidget {
  const _MyProjectsList({required this.filterTab});

  final ProjectFilterTab filterTab;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final projectsAsync = ref.watch(myProjectsProvider);

    return projectsAsync.when(
      data: (projects) {
        // Filter projects based on selected tab
        final filteredProjects = _filterProjects(projects, filterTab);

        if (filteredProjects.isEmpty) {
          return SliverFillRemaining(
            hasScrollBody: false,
            child: _buildEmptyState(context, filterTab),
          );
        }

        return SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate((context, index) {
              final project = filteredProjects[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: ProjectCard(project: project, showActions: true)
                    .animate(delay: Duration(milliseconds: 50 * index))
                    .fadeIn()
                    .slideY(begin: 0.1, end: 0),
              );
            }, childCount: filteredProjects.length),
          ),
        );
      },
      loading: () => const SliverFillRemaining(
        hasScrollBody: false,
        child: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
          ),
        ),
      ),
      error: (error, _) => SliverFillRemaining(
        hasScrollBody: false,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.error),
              const SizedBox(height: AppSpacing.md),
              Text('Failed to load projects', style: AppTypography.titleMedium),
              const SizedBox(height: AppSpacing.sm),
              Text(
                error.toString(),
                style: AppTypography.bodySmall,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.lg),
              PremiumButton(
                label: 'Retry',
                onPressed: () => ref.invalidate(myProjectsProvider),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Project> _filterProjects(List<Project> projects, ProjectFilterTab tab) {
    switch (tab) {
      case ProjectFilterTab.all:
        return projects;
      case ProjectFilterTab.published:
        return projects
            .where((p) => p.status == ProjectStatus.published)
            .toList();
      case ProjectFilterTab.draft:
        return projects.where((p) => p.status == ProjectStatus.draft).toList();
      case ProjectFilterTab.funded:
        return projects.where((p) => p.status == ProjectStatus.funded).toList();
    }
  }

  Widget _buildEmptyState(BuildContext context, ProjectFilterTab tab) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: PremiumCard(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.rocket_launch_outlined,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: AppSpacing.lg),
            Text(
              tab == ProjectFilterTab.all
                  ? 'No Projects Yet'
                  : 'No ${_getTabLabel(tab)} Projects',
              style: AppTypography.titleLarge.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              tab == ProjectFilterTab.all
                  ? 'Create your first project to start your journey'
                  : 'Projects with this status will appear here',
              style: AppTypography.bodyMedium,
              textAlign: TextAlign.center,
            ),
            if (tab == ProjectFilterTab.all) ...[
              const SizedBox(height: AppSpacing.xl),
              PremiumButton(
                label: 'Create Project',
                icon: Icons.add,
                variant: PremiumButtonVariant.gradient,
                onPressed: () => context.push('/projects/new'),
              ),
            ],
          ],
        ),
      ).animate().fadeIn().scale(begin: const Offset(0.95, 0.95)),
    );
  }

  String _getTabLabel(ProjectFilterTab tab) {
    switch (tab) {
      case ProjectFilterTab.all:
        return 'All';
      case ProjectFilterTab.published:
        return 'Published';
      case ProjectFilterTab.draft:
        return 'Draft';
      case ProjectFilterTab.funded:
        return 'Funded';
    }
  }
}

/// Explore projects list (for investors)
class _ExploreProjectsList extends ConsumerWidget {
  const _ExploreProjectsList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(projectsFilterProvider);
    final projectsAsync = ref.watch(publishedProjectsProvider(filter));

    return projectsAsync.when(
      data: (projects) {
        if (projects.isEmpty) {
          return SliverFillRemaining(
            hasScrollBody: false,
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: PremiumCard(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.search_off,
                      size: 64,
                      color: AppColors.textMuted,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    Text(
                      'No Projects Found',
                      style: AppTypography.titleLarge.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    Text(
                      'Try adjusting your filters',
                      style: AppTypography.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ).animate().fadeIn().scale(begin: const Offset(0.95, 0.95)),
            ),
          );
        }

        return SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
          sliver: SliverList(
            delegate: SliverChildBuilderDelegate((context, index) {
              final project = projects[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.md),
                child: ProjectCard(project: project)
                    .animate(delay: Duration(milliseconds: 50 * index))
                    .fadeIn()
                    .slideY(begin: 0.1, end: 0),
              );
            }, childCount: projects.length),
          ),
        );
      },
      loading: () => const SliverFillRemaining(
        hasScrollBody: false,
        child: Center(
          child: CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
          ),
        ),
      ),
      error: (error, _) => SliverFillRemaining(
        hasScrollBody: false,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: AppColors.error),
              const SizedBox(height: AppSpacing.md),
              Text('Failed to load projects', style: AppTypography.titleMedium),
              const SizedBox(height: AppSpacing.lg),
              PremiumButton(
                label: 'Retry',
                onPressed: () => ref.invalidate(publishedProjectsProvider),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Filter chip widget
class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withValues(alpha: 0.2)
              : AppColors.backgroundCard,
          borderRadius: AppRadius.radiusFull,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.labelSmall.copyWith(
            color: isSelected ? AppColors.primary : AppColors.textSecondary,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
