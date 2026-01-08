/// VentureDeck Mobile - Bounties Provider
///
/// Riverpod providers for bounty state management.
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/data/models/bounty.dart';
import 'package:venturedeck_mobile/data/repositories/bounties_repository.dart';

/// Repository provider
final bountiesRepositoryProvider = Provider<BountiesRepository>((ref) {
  return BountiesRepository();
});

/// Open bounties provider (for discovery)
final openBountiesProvider = FutureProvider<List<Bounty>>((ref) async {
  final repository = ref.watch(bountiesRepositoryProvider);
  return repository.getOpenBounties();
});

/// Filtered open bounties by type
final filteredBountiesProvider =
    FutureProvider.family<List<Bounty>, BountyType?>((ref, type) async {
      final repository = ref.watch(bountiesRepositoryProvider);
      return repository.getOpenBounties(type: type);
    });

/// Project bounties provider
final projectBountiesProvider = FutureProvider.family<List<Bounty>, String>((
  ref,
  projectId,
) async {
  final repository = ref.watch(bountiesRepositoryProvider);
  return repository.getProjectBounties(projectId);
});

/// My claimed bounties provider
final myBountiesProvider = FutureProvider<List<Bounty>>((ref) async {
  final repository = ref.watch(bountiesRepositoryProvider);
  return repository.getMyBounties();
});

/// Single bounty provider
final bountyProvider = FutureProvider.family<Bounty?, String>((
  ref,
  bountyId,
) async {
  final repository = ref.watch(bountiesRepositoryProvider);
  return repository.getBounty(bountyId);
});

/// Bounty actions notifier
class BountyActionsNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  /// Create a new bounty
  Future<String?> createBounty({
    required String projectId,
    required String title,
    required String description,
    required double reward,
    BountyType type = BountyType.other,
    List<String> skills = const [],
    DateTime? deadline,
  }) async {
    try {
      final repository = ref.read(bountiesRepositoryProvider);
      final bountyId = await repository.createBounty(
        projectId: projectId,
        title: title,
        description: description,
        reward: reward,
        type: type,
        skills: skills,
        deadline: deadline,
      );

      ref.invalidate(projectBountiesProvider(projectId));
      ref.invalidate(openBountiesProvider);

      return bountyId;
    } catch (e) {
      return null;
    }
  }

  /// Claim a bounty
  Future<bool> claimBounty(String bountyId, String projectId) async {
    try {
      final repository = ref.read(bountiesRepositoryProvider);
      await repository.claimBounty(bountyId);

      ref.invalidate(bountyProvider(bountyId));
      ref.invalidate(projectBountiesProvider(projectId));
      ref.invalidate(openBountiesProvider);
      ref.invalidate(myBountiesProvider);

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Submit work for a bounty
  Future<bool> submitWork({
    required String bountyId,
    required String projectId,
    required String content,
    String? attachmentUrl,
  }) async {
    try {
      final repository = ref.read(bountiesRepositoryProvider);
      await repository.submitWork(
        bountyId: bountyId,
        content: content,
        attachmentUrl: attachmentUrl,
      );

      ref.invalidate(bountyProvider(bountyId));
      ref.invalidate(projectBountiesProvider(projectId));
      ref.invalidate(myBountiesProvider);

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Approve a submission
  Future<bool> approveSubmission(
    String submissionId,
    String bountyId,
    String projectId,
  ) async {
    try {
      final repository = ref.read(bountiesRepositoryProvider);
      await repository.approveSubmission(submissionId);

      ref.invalidate(bountyProvider(bountyId));
      ref.invalidate(projectBountiesProvider(projectId));

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Reject a submission
  Future<bool> rejectSubmission(
    String submissionId,
    String feedback,
    String bountyId,
    String projectId,
  ) async {
    try {
      final repository = ref.read(bountiesRepositoryProvider);
      await repository.rejectSubmission(submissionId, feedback);

      ref.invalidate(bountyProvider(bountyId));
      ref.invalidate(projectBountiesProvider(projectId));

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Cancel a bounty
  Future<bool> cancelBounty(String bountyId, String projectId) async {
    try {
      final repository = ref.read(bountiesRepositoryProvider);
      await repository.cancelBounty(bountyId);

      ref.invalidate(bountyProvider(bountyId));
      ref.invalidate(projectBountiesProvider(projectId));
      ref.invalidate(openBountiesProvider);

      return true;
    } catch (e) {
      return false;
    }
  }
}

/// Bounty actions provider
final bountyActionsProvider =
    AsyncNotifierProvider<BountyActionsNotifier, void>(
      BountyActionsNotifier.new,
    );
