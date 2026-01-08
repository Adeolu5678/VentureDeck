/// VentureDeck Mobile - Application Model
///
/// Represents an application to join a project.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'application.freezed.dart';
part 'application.g.dart';

/// Application status
enum ApplicationStatus {
  @JsonValue('pending')
  pending,
  @JsonValue('interviewing')
  interviewing,
  @JsonValue('accepted')
  accepted,
  @JsonValue('rejected')
  rejected,
}

/// Main Application model
@freezed
class Application with _$Application {
  const Application._();

  const factory Application({
    required String id,
    required String applicantId,
    required String projectId,
    required String role,
    required String message,
    required ApplicationStatus status,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Application;

  factory Application.fromJson(Map<String, dynamic> json) =>
      _$ApplicationFromJson(json);

  /// Check if application is pending
  bool get isPending => status == ApplicationStatus.pending;

  /// Check if application is accepted
  bool get isAccepted => status == ApplicationStatus.accepted;

  /// Check if application is rejected
  bool get isRejected => status == ApplicationStatus.rejected;

  /// Check if application is in interview stage
  bool get isInterviewing => status == ApplicationStatus.interviewing;

  /// Get status display name
  String get statusDisplayName {
    switch (status) {
      case ApplicationStatus.pending:
        return 'Pending Review';
      case ApplicationStatus.interviewing:
        return 'Interviewing';
      case ApplicationStatus.accepted:
        return 'Accepted';
      case ApplicationStatus.rejected:
        return 'Rejected';
    }
  }
}
