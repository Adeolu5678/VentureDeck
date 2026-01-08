/// VentureDeck Mobile - Project Model
///
/// Represents a startup project in the VentureDeck platform.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'project.freezed.dart';
part 'project.g.dart';

/// Project status
enum ProjectStatus {
  @JsonValue('draft')
  draft,
  @JsonValue('published')
  published,
  @JsonValue('funded')
  funded,
  @JsonValue('closed')
  closed,
}

/// Project stage for matching
enum ProjectStage {
  @JsonValue('idea')
  idea,
  @JsonValue('mvp')
  mvp,
  @JsonValue('seed')
  seed,
  @JsonValue('series-a')
  seriesA,
  @JsonValue('series-b')
  seriesB,
  @JsonValue('growth')
  growth,
}

/// Score breakdown for traction score calculation
@freezed
class ScoreBreakdown with _$ScoreBreakdown {
  const factory ScoreBreakdown({
    @Default(0) int milestones,
    @Default(0) int softCircles,
    @Default(0) int followers,
    @Default(0) int applications,
    @Default(0) int teamCompleteness,
    @Default(0) int pitchDeck,
    @Default(0) int legalDocs,
  }) = _ScoreBreakdown;

  factory ScoreBreakdown.fromJson(Map<String, dynamic> json) =>
      _$ScoreBreakdownFromJson(json);
}

/// Main Project model
@freezed
class Project with _$Project {
  const Project._();

  const factory Project({
    required String id,
    required String ownerId,
    String? workspaceId,
    required String title,
    required String tagline,
    required String description,
    required String industry,
    @Default([]) List<String> tags,
    required double fundingGoal,
    required double equityOffered,
    required ProjectStatus status,
    String? logoUrl,
    String? pitchDeckUrl,
    int? tractionScore,
    DateTime? scoreLastUpdated,
    ScoreBreakdown? scoreBreakdown,
    ProjectStage? stage,
    String? location,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Project;

  factory Project.fromJson(Map<String, dynamic> json) =>
      _$ProjectFromJson(json);

  /// Get formatted funding goal
  String get formattedFundingGoal {
    if (fundingGoal >= 1000000) {
      return '\$${(fundingGoal / 1000000).toStringAsFixed(1)}M';
    } else if (fundingGoal >= 1000) {
      return '\$${(fundingGoal / 1000).toStringAsFixed(0)}K';
    }
    return '\$${fundingGoal.toStringAsFixed(0)}';
  }

  /// Get formatted equity
  String get formattedEquity => '${equityOffered.toStringAsFixed(1)}%';

  /// Check if project is published
  bool get isPublished => status == ProjectStatus.published;

  /// Check if project is draft
  bool get isDraft => status == ProjectStatus.draft;

  /// Check if project is funded
  bool get isFunded => status == ProjectStatus.funded;

  /// Get stage display name
  String get stageDisplayName {
    switch (stage) {
      case ProjectStage.idea:
        return 'Idea Stage';
      case ProjectStage.mvp:
        return 'MVP';
      case ProjectStage.seed:
        return 'Seed';
      case ProjectStage.seriesA:
        return 'Series A';
      case ProjectStage.seriesB:
        return 'Series B';
      case ProjectStage.growth:
        return 'Growth';
      case null:
        return 'Unknown';
    }
  }

  /// Get status display name
  String get statusDisplayName {
    switch (status) {
      case ProjectStatus.draft:
        return 'Draft';
      case ProjectStatus.published:
        return 'Published';
      case ProjectStatus.funded:
        return 'Funded';
      case ProjectStatus.closed:
        return 'Closed';
    }
  }

  /// Get traction score level
  String get tractionLevel {
    final score = tractionScore ?? 0;
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Strong';
    if (score >= 40) return 'Good';
    if (score >= 20) return 'Building';
    return 'Starting';
  }
}
