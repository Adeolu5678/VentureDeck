/// VentureDeck Mobile - Bounties Repository
///
/// Data access layer for bounty operations via Convex.
library;

import 'package:venturedeck_mobile/data/models/bounty.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';

/// Repository for bounty operations
class BountiesRepository {
  BountiesRepository({ConvexService? convexService})
    : _convex = convexService ?? ConvexService.instance;

  final ConvexService _convex;

  /// Get all bounties for a project
  Future<List<Bounty>> getProjectBounties(String projectId) async {
    try {
      final result = await _convex.query<List<dynamic>>(
        'bounties:listByProject',
        {'projectId': projectId},
      );
      return result
          .map((item) => _mapToBounty(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw BountiesRepositoryException('Failed to fetch bounties: $e');
    }
  }

  /// Get open bounties (for discovery)
  Future<List<Bounty>> getOpenBounties({
    BountyType? type,
    int limit = 20,
  }) async {
    try {
      final result = await _convex.query<List<dynamic>>('bounties:listOpen', {
        if (type != null) 'type': type.name,
        'limit': limit,
      });
      return result
          .map((item) => _mapToBounty(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw BountiesRepositoryException('Failed to fetch open bounties: $e');
    }
  }

  /// Get bounties claimed by a user
  Future<List<Bounty>> getMyBounties() async {
    try {
      final result = await _convex.query<List<dynamic>>(
        'bounties:listMyClaimed',
      );
      return result
          .map((item) => _mapToBounty(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw BountiesRepositoryException('Failed to fetch claimed bounties: $e');
    }
  }

  /// Get a single bounty by ID
  Future<Bounty?> getBounty(String bountyId) async {
    try {
      final result = await _convex.query<Map<String, dynamic>?>(
        'bounties:get',
        {'id': bountyId},
      );
      if (result == null) return null;
      return _mapToBounty(result);
    } catch (e) {
      throw BountiesRepositoryException('Failed to fetch bounty: $e');
    }
  }

  /// Create a new bounty
  Future<String> createBounty({
    required String projectId,
    required String title,
    required String description,
    required double reward,
    BountyType type = BountyType.other,
    List<String> skills = const [],
    DateTime? deadline,
  }) async {
    try {
      final result = await _convex.mutation<String>('bounties:create', {
        'projectId': projectId,
        'title': title,
        'description': description,
        'reward': reward,
        'type': type.name,
        'skills': skills,
        if (deadline != null) 'deadline': deadline.millisecondsSinceEpoch,
      });
      return result;
    } catch (e) {
      throw BountiesRepositoryException('Failed to create bounty: $e');
    }
  }

  /// Claim a bounty
  Future<void> claimBounty(String bountyId) async {
    try {
      await _convex.mutation('bounties:claim', {'id': bountyId});
    } catch (e) {
      throw BountiesRepositoryException('Failed to claim bounty: $e');
    }
  }

  /// Submit work for a bounty
  Future<String> submitWork({
    required String bountyId,
    required String content,
    String? attachmentUrl,
  }) async {
    try {
      final result = await _convex.mutation<String>('bounties:submit', {
        'bountyId': bountyId,
        'content': content,
        if (attachmentUrl != null) 'attachmentUrl': attachmentUrl,
      });
      return result;
    } catch (e) {
      throw BountiesRepositoryException('Failed to submit work: $e');
    }
  }

  /// Approve a submission
  Future<void> approveSubmission(String submissionId) async {
    try {
      await _convex.mutation('bounties:approveSubmission', {
        'id': submissionId,
      });
    } catch (e) {
      throw BountiesRepositoryException('Failed to approve submission: $e');
    }
  }

  /// Reject a submission with feedback
  Future<void> rejectSubmission(String submissionId, String feedback) async {
    try {
      await _convex.mutation('bounties:rejectSubmission', {
        'id': submissionId,
        'feedback': feedback,
      });
    } catch (e) {
      throw BountiesRepositoryException('Failed to reject submission: $e');
    }
  }

  /// Cancel a bounty
  Future<void> cancelBounty(String bountyId) async {
    try {
      await _convex.mutation('bounties:cancel', {'id': bountyId});
    } catch (e) {
      throw BountiesRepositoryException('Failed to cancel bounty: $e');
    }
  }

  /// Map Convex data to Bounty model
  Bounty _mapToBounty(Map<String, dynamic> data) {
    return Bounty(
      id: data['_id'] as String,
      projectId: data['projectId'] as String,
      creatorId: data['creatorId'] as String,
      title: data['title'] as String,
      description: data['description'] as String,
      reward: (data['reward'] as num).toDouble(),
      type: _parseBountyType(data['type'] as String?),
      status: _parseBountyStatus(data['status'] as String?),
      skills: List<String>.from(data['skills'] as List? ?? []),
      claimedById: data['claimedById'] as String?,
      claimedAt: data['claimedAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['claimedAt'] as num).toInt(),
            )
          : null,
      deadline: data['deadline'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['deadline'] as num).toInt(),
            )
          : null,
      completionNote: data['completionNote'] as String?,
      completedAt: data['completedAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['completedAt'] as num).toInt(),
            )
          : null,
      submissions:
          (data['submissions'] as List?)
              ?.map((s) => BountySubmission.fromJson(s as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: DateTime.fromMillisecondsSinceEpoch(
        (data['createdAt'] as num).toInt(),
      ),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(
        (data['updatedAt'] as num).toInt(),
      ),
    );
  }

  BountyType _parseBountyType(String? type) {
    switch (type) {
      case 'development':
        return BountyType.development;
      case 'design':
        return BountyType.design;
      case 'marketing':
        return BountyType.marketing;
      case 'research':
        return BountyType.research;
      case 'content':
        return BountyType.content;
      default:
        return BountyType.other;
    }
  }

  BountyStatus _parseBountyStatus(String? status) {
    switch (status) {
      case 'open':
        return BountyStatus.open;
      case 'claimed':
        return BountyStatus.claimed;
      case 'submitted':
        return BountyStatus.submitted;
      case 'completed':
        return BountyStatus.completed;
      case 'cancelled':
        return BountyStatus.cancelled;
      default:
        return BountyStatus.open;
    }
  }
}

/// Exception for repository errors
class BountiesRepositoryException implements Exception {
  BountiesRepositoryException(this.message);
  final String message;

  @override
  String toString() => message;
}
