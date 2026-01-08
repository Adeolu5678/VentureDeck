/// VentureDeck Mobile - Projects Provider
///
/// Riverpod providers for project state management.
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/data/models/project.dart';
import 'package:venturedeck_mobile/data/repositories/projects_repository.dart';

/// Repository provider
final projectsRepositoryProvider = Provider<ProjectsRepository>((ref) {
  return ProjectsRepository();
});

/// My projects provider (for entrepreneurs)
final myProjectsProvider = FutureProvider<List<Project>>((ref) async {
  final repository = ref.watch(projectsRepositoryProvider);
  return repository.getMyProjects();
});

/// Published projects provider (for discovery)
final publishedProjectsProvider =
    FutureProvider.family<List<Project>, ProjectsFilter>((ref, filter) async {
      final repository = ref.watch(projectsRepositoryProvider);
      return repository.getPublishedProjects(
        industry: filter.industry,
        stage: filter.stage,
        minTractionScore: filter.minTractionScore,
        limit: filter.limit,
        offset: filter.offset,
      );
    });

/// Followed projects provider (for investors)
final followedProjectsProvider = FutureProvider<List<Project>>((ref) async {
  final repository = ref.watch(projectsRepositoryProvider);
  return repository.getFollowedProjects();
});

/// Single project provider
final projectProvider = FutureProvider.family<Project?, String>((
  ref,
  projectId,
) async {
  final repository = ref.watch(projectsRepositoryProvider);
  return repository.getProject(projectId);
});

/// Is following provider
final isFollowingProvider = FutureProvider.family<bool, String>((
  ref,
  projectId,
) async {
  final repository = ref.watch(projectsRepositoryProvider);
  return repository.isFollowing(projectId);
});

/// Search projects provider
final searchProjectsProvider = FutureProvider.family<List<Project>, String>((
  ref,
  query,
) async {
  if (query.isEmpty) return [];
  final repository = ref.watch(projectsRepositoryProvider);
  return repository.searchProjects(query);
});

/// Filter model for projects
class ProjectsFilter {
  const ProjectsFilter({
    this.industry,
    this.stage,
    this.minTractionScore,
    this.limit = 20,
    this.offset = 0,
  });

  final String? industry;
  final ProjectStage? stage;
  final int? minTractionScore;
  final int limit;
  final int offset;

  ProjectsFilter copyWith({
    String? industry,
    ProjectStage? stage,
    int? minTractionScore,
    int? limit,
    int? offset,
  }) {
    return ProjectsFilter(
      industry: industry ?? this.industry,
      stage: stage ?? this.stage,
      minTractionScore: minTractionScore ?? this.minTractionScore,
      limit: limit ?? this.limit,
      offset: offset ?? this.offset,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ProjectsFilter &&
        other.industry == industry &&
        other.stage == stage &&
        other.minTractionScore == minTractionScore &&
        other.limit == limit &&
        other.offset == offset;
  }

  @override
  int get hashCode {
    return Object.hash(industry, stage, minTractionScore, limit, offset);
  }
}

/// Current filter state provider
final projectsFilterProvider = StateProvider<ProjectsFilter>((ref) {
  return const ProjectsFilter();
});

/// Project actions notifier
class ProjectActionsNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  /// Create a new project
  Future<String?> createProject({
    required String title,
    required String tagline,
    required String description,
    required String industry,
    required double fundingGoal,
    required double equityOffered,
    List<String>? tags,
    ProjectStage? stage,
    String? location,
  }) async {
    state = const AsyncValue.loading();

    try {
      final repository = ref.read(projectsRepositoryProvider);
      final projectId = await repository.createProject(
        title: title,
        tagline: tagline,
        description: description,
        industry: industry,
        fundingGoal: fundingGoal,
        equityOffered: equityOffered,
        tags: tags,
        stage: stage,
        location: location,
      );

      // Refresh my projects list
      ref.invalidate(myProjectsProvider);

      state = const AsyncValue.data(null);
      return projectId;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return null;
    }
  }

  /// Update an existing project
  Future<bool> updateProject({
    required String projectId,
    String? title,
    String? tagline,
    String? description,
    String? industry,
    double? fundingGoal,
    double? equityOffered,
    List<String>? tags,
    ProjectStage? stage,
    String? location,
    ProjectStatus? status,
  }) async {
    state = const AsyncValue.loading();

    try {
      final repository = ref.read(projectsRepositoryProvider);
      await repository.updateProject(
        projectId: projectId,
        title: title,
        tagline: tagline,
        description: description,
        industry: industry,
        fundingGoal: fundingGoal,
        equityOffered: equityOffered,
        tags: tags,
        stage: stage,
        location: location,
        status: status,
      );

      // Refresh cached data
      ref.invalidate(projectProvider(projectId));
      ref.invalidate(myProjectsProvider);

      state = const AsyncValue.data(null);
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Delete a project
  Future<bool> deleteProject(String projectId) async {
    state = const AsyncValue.loading();

    try {
      final repository = ref.read(projectsRepositoryProvider);
      await repository.deleteProject(projectId);

      ref.invalidate(myProjectsProvider);

      state = const AsyncValue.data(null);
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Publish a project
  Future<bool> publishProject(String projectId) async {
    state = const AsyncValue.loading();

    try {
      final repository = ref.read(projectsRepositoryProvider);
      await repository.publishProject(projectId);

      ref.invalidate(projectProvider(projectId));
      ref.invalidate(myProjectsProvider);
      ref.invalidate(publishedProjectsProvider);

      state = const AsyncValue.data(null);
      return true;
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      return false;
    }
  }

  /// Follow a project
  Future<bool> followProject(String projectId) async {
    try {
      final repository = ref.read(projectsRepositoryProvider);
      await repository.followProject(projectId);

      ref.invalidate(isFollowingProvider(projectId));
      ref.invalidate(followedProjectsProvider);

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Unfollow a project
  Future<bool> unfollowProject(String projectId) async {
    try {
      final repository = ref.read(projectsRepositoryProvider);
      await repository.unfollowProject(projectId);

      ref.invalidate(isFollowingProvider(projectId));
      ref.invalidate(followedProjectsProvider);

      return true;
    } catch (e) {
      return false;
    }
  }
}

/// Project actions provider
final projectActionsProvider =
    AsyncNotifierProvider<ProjectActionsNotifier, void>(
      ProjectActionsNotifier.new,
    );
