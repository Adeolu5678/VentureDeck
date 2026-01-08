/// VentureDeck Mobile - Milestone Model
///
/// Represents project milestones for tracking progress.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'milestone.freezed.dart';
part 'milestone.g.dart';

/// Milestone status
enum MilestoneStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('in_progress')
  inProgress,
  @JsonValue('completed')
  completed,
  @JsonValue('overdue')
  overdue,
}

/// Main Milestone model
@freezed
class Milestone with _$Milestone {
  const Milestone._();

  const factory Milestone({
    required String id,
    required String projectId,
    required String title,
    String? description,
    @Default(MilestoneStatus.pending) MilestoneStatus status,
    DateTime? targetDate,
    DateTime? completedAt,
    @Default(0) int orderIndex,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Milestone;

  factory Milestone.fromJson(Map<String, dynamic> json) =>
      _$MilestoneFromJson(json);

  /// Check if milestone is pending
  bool get isPending => status == MilestoneStatus.pending;

  /// Check if milestone is in progress
  bool get isInProgress => status == MilestoneStatus.inProgress;

  /// Check if milestone is completed
  bool get isCompleted => status == MilestoneStatus.completed;

  /// Check if milestone is overdue
  bool get isOverdue {
    if (status == MilestoneStatus.overdue) return true;
    if (targetDate == null) return false;
    return !isCompleted && DateTime.now().isAfter(targetDate!);
  }

  /// Get status text
  String get statusText {
    switch (status) {
      case MilestoneStatus.pending:
        return 'Pending';
      case MilestoneStatus.inProgress:
        return 'In Progress';
      case MilestoneStatus.completed:
        return 'Completed';
      case MilestoneStatus.overdue:
        return 'Overdue';
    }
  }
}
