/// VentureDeck Mobile - Workspace Model
///
/// Represents a team workspace for collaboration.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'workspace.freezed.dart';
part 'workspace.g.dart';

/// Member role in workspace
@freezed
class WorkspaceMemberRole with _$WorkspaceMemberRole {
  const factory WorkspaceMemberRole({
    required String userId,
    required String role,
  }) = _WorkspaceMemberRole;

  factory WorkspaceMemberRole.fromJson(Map<String, dynamic> json) =>
      _$WorkspaceMemberRoleFromJson(json);
}

/// Main Workspace model
@freezed
class Workspace with _$Workspace {
  const Workspace._();

  const factory Workspace({
    required String id,
    required String projectId,
    required String name,
    required List<String> members,
    @Default([]) List<WorkspaceMemberRole> roles,
    String? inviteCode,
    String? ownerId,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Workspace;

  factory Workspace.fromJson(Map<String, dynamic> json) =>
      _$WorkspaceFromJson(json);

  /// Get member count
  int get memberCount => members.length;

  /// Check if user is a member
  bool hasMember(String userId) => members.contains(userId);

  /// Check if user is owner
  bool isOwner(String userId) => ownerId == userId;

  /// Get role for a user
  String? getRoleForUser(String userId) {
    final roleEntry = roles.where((r) => r.userId == userId).firstOrNull;
    return roleEntry?.role;
  }
}
