/// VentureDeck Mobile - Projects Repository
///
/// Data access layer for project operations via Convex.
library;

import 'package:venturedeck_mobile/data/models/project.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';

/// Repository for project data operations
class ProjectsRepository {
  ProjectsRepository({ConvexService? convexService})
    : _convex = convexService ?? ConvexService.instance;

  final ConvexService _convex;

  /// Get all published projects
  /// [stage] is currently ignored by the backend
  Future<List<Project>> getPublishedProjects({
    String? industry,
    String? search,
    ProjectStage? stage,
    int? minTractionScore,
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final result = await _convex
          .query<Map<String, dynamic>>('projects:list', {
            if (industry != null) 'industry': industry,
            if (search != null && search.isNotEmpty) 'search': search,
            'limit': limit,
            'offset': offset,
          });

      final projects = result['projects'] as List;
      return projects
          .map((item) => _mapToProject(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ProjectsRepositoryException('Failed to fetch projects: $e');
    }
  }

  /// Get projects owned by current user
  Future<List<Project>> getMyProjects() async {
    try {
      final result = await _convex.query<List<dynamic>>(
        'projects:getMyProjects',
      );
      return result
          .map((item) => _mapToProject(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ProjectsRepositoryException('Failed to fetch my projects: $e');
    }
  }

  /// Get a single project by ID
  Future<Project?> getProject(String projectId) async {
    try {
      final result = await _convex.query<Map<String, dynamic>?>(
        'projects:get',
        {'id': projectId},
      );

      if (result == null) return null;
      return _mapToProject(result);
    } catch (e) {
      throw ProjectsRepositoryException('Failed to fetch project: $e');
    }
  }

  /// Create a new project
  /// Note: [tags], [stage], [location] are not currently supported by the backend
  Future<String> createProject({
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
    try {
      final result = await _convex.mutation<String>('projects:create', {
        'title': title,
        'tagline': tagline,
        'description': description,
        'industry': industry,
        'fundingGoal': fundingGoal,
        'equityOffered': equityOffered,
        // 'logoUrl': logoUrl, // TODO: Add support for logo/pitch deck
        // 'pitchDeckUrl': pitchDeckUrl,
      });

      return result;
    } catch (e) {
      throw ProjectsRepositoryException('Failed to create project: $e');
    }
  }

  /// Update an existing project
  Future<void> updateProject({
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
    try {
      String? statusString;
      if (status != null) {
        statusString = status == ProjectStatus.draft
            ? 'draft'
            : status == ProjectStatus.published
            ? 'published'
            : status == ProjectStatus.funded
            ? 'funded'
            : status == ProjectStatus.closed
            ? 'closed'
            : null;
      }

      await _convex.mutation('projects:update', {
        'id': projectId,
        if (title != null) 'title': title,
        if (tagline != null) 'tagline': tagline,
        if (description != null) 'description': description,
        if (industry != null) 'industry': industry,
        if (fundingGoal != null) 'fundingGoal': fundingGoal,
        if (equityOffered != null) 'equityOffered': equityOffered,
        if (statusString != null) 'status': statusString,
      });
    } catch (e) {
      throw ProjectsRepositoryException('Failed to update project: $e');
    }
  }

  /// Delete a project
  Future<void> deleteProject(String projectId) async {
    // Not supported by backend
    throw UnimplementedError('Delete project is not supported by the backend');
  }

  /// Publish a project
  Future<void> publishProject(String projectId) async {
    try {
      await _convex.mutation('projects:update', {
        'id': projectId,
        'status': 'published',
      });
    } catch (e) {
      throw ProjectsRepositoryException('Failed to publish project: $e');
    }
  }

  /// Follow a project (for investors)
  Future<void> followProject(String projectId) async {
    try {
      await _convex.mutation('project_followers:follow', {
        'projectId': projectId,
      });
    } catch (e) {
      throw ProjectsRepositoryException('Failed to follow project: $e');
    }
  }

  /// Unfollow a project
  Future<void> unfollowProject(String projectId) async {
    try {
      await _convex.mutation('project_followers:unfollow', {
        'projectId': projectId,
      });
    } catch (e) {
      throw ProjectsRepositoryException('Failed to unfollow project: $e');
    }
  }

  /// Check if current user is following a project
  Future<bool> isFollowing(String projectId) async {
    try {
      final result = await _convex.query<bool>(
        'project_followers:isFollowing',
        {'projectId': projectId},
      );
      return result;
    } catch (e) {
      return false;
    }
  }

  /// Get projects followed by current user
  Future<List<Project>> getFollowedProjects() async {
    try {
      final result = await _convex.query<List<dynamic>>(
        'project_followers:getFollowedProjects',
      );
      return result
          .map((item) => _mapToProject(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ProjectsRepositoryException(
        'Failed to fetch followed projects: $e',
      );
    }
  }

  /// Search projects
  Future<List<Project>> searchProjects(String query) async {
    try {
      final result = await _convex.query<Map<String, dynamic>>(
        'projects:list',
        {'search': query, 'limit': 50},
      );

      final projects = result['projects'] as List;
      return projects
          .map((item) => _mapToProject(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ProjectsRepositoryException('Failed to search projects: $e');
    }
  }

  /// Subscribe to project updates (real-time)
  Stream<Project?> subscribeToProject(String projectId) {
    return _convex
        .subscribe<Map<String, dynamic>?>('projects:get', {'id': projectId})
        .map((data) => data != null ? _mapToProject(data) : null);
  }

  /// Map Convex data to Project model
  Project _mapToProject(Map<String, dynamic> data) {
    return Project(
      id: data['_id'] as String,
      ownerId: data['ownerId'] as String,
      workspaceId: data['workspaceId'] as String?,
      title: data['title'] as String,
      tagline: data['tagline'] as String,
      description: data['description'] as String,
      industry: data['industry'] as String,
      tags: List<String>.from(data['tags'] as List? ?? []),
      fundingGoal: (data['fundingGoal'] as num).toDouble(),
      equityOffered: (data['equityOffered'] as num).toDouble(),
      status: _parseProjectStatus(data['status'] as String?),
      logoUrl: data['logoUrl'] as String?,
      pitchDeckUrl: data['pitchDeckUrl'] as String?,
      tractionScore: data['tractionScore'] as int?,
      scoreLastUpdated: data['scoreLastUpdated'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['scoreLastUpdated'] as num).toInt(),
            )
          : null,
      stage: _parseProjectStage(data['stage'] as String?),
      location: data['location'] as String?,
      createdAt: DateTime.fromMillisecondsSinceEpoch(
        (data['createdAt'] as num).toInt(),
      ),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(
        (data['updatedAt'] as num).toInt(),
      ),
    );
  }

  ProjectStatus _parseProjectStatus(String? status) {
    switch (status) {
      case 'draft':
        return ProjectStatus.draft;
      case 'published':
        return ProjectStatus.published;
      case 'funded':
        return ProjectStatus.funded;
      case 'closed':
        return ProjectStatus.closed;
      default:
        return ProjectStatus.draft;
    }
  }

  ProjectStage? _parseProjectStage(String? stage) {
    switch (stage) {
      case 'idea':
        return ProjectStage.idea;
      case 'mvp':
        return ProjectStage.mvp;
      case 'seed':
        return ProjectStage.seed;
      case 'series-a':
        return ProjectStage.seriesA;
      case 'series-b':
        return ProjectStage.seriesB;
      case 'growth':
        return ProjectStage.growth;
      default:
        return null;
    }
  }
}

/// Exception for repository errors
class ProjectsRepositoryException implements Exception {
  ProjectsRepositoryException(this.message);
  final String message;

  @override
  String toString() => message;
}
