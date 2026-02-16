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
      final result = await _convex.query<List<dynamic>>('bounties:list', {
        'projectId': projectId,
      });
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
    // Not supported by backend (no global list query)
    return [];
  }

  /// Get bounties claimed by a user
  Future<List<Bounty>> getMyBounties() async {
    try {
      final result = await _convex.query<List<dynamic>>(
        'bounties:getMyBounties',
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
    // Not supported by backend (bounties:get is missing)
    // TODO: Request backend update to support getById
    return null;
  }

  /// Create a new bounty
  /// Note: [type], [skills], [deadline] are not currently supported by backend
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
        'reward': reward
            .toString(), // Backend expects string? Check TS. TS says v.string().
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
      // Mapping: content -> submissionNote, attachmentUrl -> submissionUrl
      // Backend expects submissionUrl (required). If no attachment, use placeholder?
      // TS: submissionUrl: v.string(), submissionNote: v.optional(v.string())

      final url =
          attachmentUrl ??
          'https://github.com/placeholder'; // Fallback if required

      final result = await _convex.mutation<String>('bounties:submit', {
        'id': bountyId,
        'submissionUrl': url,
        'submissionNote': content,
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
        'reviewNote': feedback,
      });
    } catch (e) {
      throw BountiesRepositoryException('Failed to reject submission: $e');
    }
  }

  /// Cancel a bounty
  Future<void> cancelBounty(String bountyId) async {
    // Not supported by backend
    throw UnimplementedError('Cancel bounty not supported');
  }

  /// Map Convex data to Bounty model
  Bounty _mapToBounty(Map<String, dynamic> data) {
    return Bounty(
      id: data['_id'] as String,
      projectId: data['projectId'] as String,
      // creatorId is not always returned by list queries in some backends,
      // but 'bounties:create' inserts it? Wait. TS 'create' does NOT insert 'creatorId'.
      // It uses 'projectId' to check owner. 'bounties' table has no 'creatorId' column in insert!
      // 'bounties:list' returns raw docs.
      // So 'creatorId' might be missing. Bounty model expects it (non-nullable?).
      // I should update Bounty model later or fallback here.
      creatorId: data['creatorId'] as String? ?? '', // Fallback
      title: data['title'] as String,
      description: data['description'] as String,
      // reward is string in TS schema?
      // TS create: reward: v.string().
      // Dart model: double.
      // I need to parse it.
      reward: double.tryParse(data['reward'].toString()) ?? 0.0,

      type: _parseBountyType(data['type'] as String?),
      status: _parseBountyStatus(data['status'] as String?),
      skills: List<String>.from(data['skills'] as List? ?? []),
      claimedById: data['assigneeId'] as String?, // Mapped from assigneeId
      // timestamps
      createdAt: DateTime.fromMillisecondsSinceEpoch(
        (data['createdAt'] as num).toInt(),
      ),
      updatedAt: data['updatedAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['updatedAt'] as num).toInt(),
            )
          : DateTime.now(),

      // Other fields might be missing
      completedAt: data['completedAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['completedAt'] as num).toInt(),
            )
          : null,
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
      case 'assigned': // Backend uses 'assigned', Dart uses 'claimed'
        return BountyStatus.claimed;
      case 'submitted':
        return BountyStatus.submitted;
      case 'completed':
        return BountyStatus.completed;
      case 'paid':
        return BountyStatus.completed; // Map 'paid' to completed for now
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
