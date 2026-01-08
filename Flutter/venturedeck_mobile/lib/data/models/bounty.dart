/// VentureDeck Mobile - Bounty Model
///
/// Represents bounties/tasks that can be claimed and completed.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'bounty.freezed.dart';
part 'bounty.g.dart';

/// Bounty status
enum BountyStatus {
  @JsonValue('open')
  open,
  @JsonValue('claimed')
  claimed,
  @JsonValue('submitted')
  submitted,
  @JsonValue('completed')
  completed,
  @JsonValue('cancelled')
  cancelled,
}

/// Bounty type
enum BountyType {
  @JsonValue('development')
  development,
  @JsonValue('design')
  design,
  @JsonValue('marketing')
  marketing,
  @JsonValue('research')
  research,
  @JsonValue('content')
  content,
  @JsonValue('other')
  other,
}

/// Submission model for bounty work
@freezed
class BountySubmission with _$BountySubmission {
  const factory BountySubmission({
    required String id,
    required String bountyId,
    required String submitterId,
    required String content,
    String? attachmentUrl,
    @Default(false) bool isApproved,
    String? feedback,
    required DateTime createdAt,
  }) = _BountySubmission;

  factory BountySubmission.fromJson(Map<String, dynamic> json) =>
      _$BountySubmissionFromJson(json);
}

/// Main Bounty model
@freezed
class Bounty with _$Bounty {
  const Bounty._();

  const factory Bounty({
    required String id,
    required String projectId,
    required String creatorId,
    required String title,
    required String description,
    required double reward,
    @Default(BountyType.other) BountyType type,
    @Default(BountyStatus.open) BountyStatus status,
    @Default([]) List<String> skills,
    String? claimedById,
    DateTime? claimedAt,
    DateTime? deadline,
    String? completionNote,
    DateTime? completedAt,
    @Default([]) List<BountySubmission> submissions,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Bounty;

  factory Bounty.fromJson(Map<String, dynamic> json) => _$BountyFromJson(json);

  /// Check if bounty is open for claiming
  bool get isOpen => status == BountyStatus.open;

  /// Check if bounty has been claimed
  bool get isClaimed => status == BountyStatus.claimed;

  /// Check if work has been submitted
  bool get isSubmitted => status == BountyStatus.submitted;

  /// Check if bounty is completed
  bool get isCompleted => status == BountyStatus.completed;

  /// Format reward for display
  String get formattedReward {
    if (reward >= 1000) {
      return '\$${(reward / 1000).toStringAsFixed(1)}K';
    }
    return '\$${reward.toStringAsFixed(0)}';
  }

  /// Get status display text
  String get statusText {
    switch (status) {
      case BountyStatus.open:
        return 'Open';
      case BountyStatus.claimed:
        return 'In Progress';
      case BountyStatus.submitted:
        return 'Under Review';
      case BountyStatus.completed:
        return 'Completed';
      case BountyStatus.cancelled:
        return 'Cancelled';
    }
  }

  /// Get type display text
  String get typeText {
    switch (type) {
      case BountyType.development:
        return 'Development';
      case BountyType.design:
        return 'Design';
      case BountyType.marketing:
        return 'Marketing';
      case BountyType.research:
        return 'Research';
      case BountyType.content:
        return 'Content';
      case BountyType.other:
        return 'Other';
    }
  }

  /// Check if user can claim this bounty
  bool canClaim(String userId) => isOpen && creatorId != userId;

  /// Check if user can submit to this bounty
  bool canSubmit(String userId) => isClaimed && claimedById == userId;
}
