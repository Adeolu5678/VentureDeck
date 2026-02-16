/// VentureDeck Mobile - Milestones Provider
///
/// Riverpod providers for milestone state management.
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/data/models/milestone.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';

/// Milestones repository
class MilestonesRepository {
  MilestonesRepository({ConvexService? convexService})
    : _convex = convexService ?? ConvexService.instance;

  final ConvexService _convex;

  /// Get milestones for a project
  Future<List<Milestone>> getProjectMilestones(String projectId) async {
    try {
      final result = await _convex.query<List<dynamic>>('milestones:list', {
        'projectId': projectId,
      });
      return result
          .map((item) => _mapToMilestone(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Create a milestone
  Future<String?> createMilestone({
    required String projectId,
    required String title,
    String? description,
    DateTime? targetDate,
  }) async {
    try {
      final result = await _convex.mutation<String>('milestones:create', {
        'projectId': projectId,
        'title': title,
        'description': description ?? '',
        // Backend expects 'date' (number), Dart uses 'targetDate'
        'date':
            targetDate?.millisecondsSinceEpoch ??
            DateTime.now().millisecondsSinceEpoch,
      });
      return result;
    } catch (e) {
      return null;
    }
  }

  /// Update milestone status
  Future<bool> updateStatus(String milestoneId, MilestoneStatus status) async {
    try {
      // Backend expects 'pending', 'completed', 'verified'
      String statusStr = 'pending';
      if (status == MilestoneStatus.completed) statusStr = 'completed';
      // 'verified' is not in Dart enum yet? Enum has: inProgress, completed, overdue, pending.
      // Map appropriately.

      await _convex.mutation('milestones:updateStatus', {
        'id': milestoneId,
        'status': statusStr,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Mark milestone as complete
  Future<bool> markComplete(String milestoneId) async {
    try {
      // Backend uses updateStatus for completion
      await _convex.mutation('milestones:updateStatus', {
        'id': milestoneId,
        'status': 'completed',
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Delete a milestone
  Future<bool> deleteMilestone(String milestoneId) async {
    try {
      await _convex.mutation('milestones:remove', {'id': milestoneId});
      return true;
    } catch (e) {
      return false;
    }
  }

  Milestone _mapToMilestone(Map<String, dynamic> data) {
    return Milestone(
      id: data['_id'] as String,
      projectId: data['projectId'] as String,
      title: data['title'] as String,
      description: data['description'] as String?,
      status: _parseStatus(data['status'] as String?),
      targetDate: data['targetDate'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['targetDate'] as num).toInt(),
            )
          : null,
      completedAt: data['completedAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['completedAt'] as num).toInt(),
            )
          : null,
      orderIndex: (data['orderIndex'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.fromMillisecondsSinceEpoch(
        (data['createdAt'] as num).toInt(),
      ),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(
        (data['updatedAt'] as num).toInt(),
      ),
    );
  }

  MilestoneStatus _parseStatus(String? status) {
    switch (status) {
      case 'in_progress':
        return MilestoneStatus.inProgress;
      case 'completed':
        return MilestoneStatus.completed;
      case 'overdue':
        return MilestoneStatus.overdue;
      default:
        return MilestoneStatus.pending;
    }
  }
}

/// Repository provider
final milestonesRepositoryProvider = Provider<MilestonesRepository>((ref) {
  return MilestonesRepository();
});

/// Project milestones provider
final projectMilestonesProvider =
    FutureProvider.family<List<Milestone>, String>((ref, projectId) async {
      final repository = ref.watch(milestonesRepositoryProvider);
      return repository.getProjectMilestones(projectId);
    });

/// Milestones actions notifier
class MilestonesActionsNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  /// Create a new milestone
  Future<String?> createMilestone({
    required String projectId,
    required String title,
    String? description,
    DateTime? targetDate,
  }) async {
    final repository = ref.read(milestonesRepositoryProvider);
    final result = await repository.createMilestone(
      projectId: projectId,
      title: title,
      description: description,
      targetDate: targetDate,
    );
    if (result != null) {
      ref.invalidate(projectMilestonesProvider(projectId));
    }
    return result;
  }

  /// Mark milestone as complete
  Future<bool> markComplete(String milestoneId, String projectId) async {
    final repository = ref.read(milestonesRepositoryProvider);
    final success = await repository.markComplete(milestoneId);
    if (success) {
      ref.invalidate(projectMilestonesProvider(projectId));
    }
    return success;
  }

  /// Delete a milestone
  Future<bool> deleteMilestone(String milestoneId, String projectId) async {
    final repository = ref.read(milestonesRepositoryProvider);
    final success = await repository.deleteMilestone(milestoneId);
    if (success) {
      ref.invalidate(projectMilestonesProvider(projectId));
    }
    return success;
  }
}

/// Milestones actions provider
final milestonesActionsProvider =
    AsyncNotifierProvider<MilestonesActionsNotifier, void>(
      MilestonesActionsNotifier.new,
    );
