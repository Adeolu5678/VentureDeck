/// VentureDeck Mobile - Analytics Model
///
/// Analytics data for projects.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'analytics.freezed.dart';
part 'analytics.g.dart';

@freezed
class Analytics with _$Analytics {
  const factory Analytics({
    required List<AnalyticsSnapshot> snapshots,
    required AnalyticsRealtime realtime,
  }) = _Analytics;

  factory Analytics.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsFromJson(json);
}

@freezed
class AnalyticsSnapshot with _$AnalyticsSnapshot {
  const factory AnalyticsSnapshot({
    required DateTime date,
    required int views,
    required int uniqueViews,
  }) = _AnalyticsSnapshot;

  factory AnalyticsSnapshot.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsSnapshotFromJson(json);
}

@freezed
class AnalyticsRealtime with _$AnalyticsRealtime {
  const factory AnalyticsRealtime({
    required int todayViews,
    required int todayUniqueViews,
    required int totalFollowers,
    required int totalSoftCircle,
    required int softCircleCount,
    required int applicationCount,
    required int pendingApplications,
    required int tractionScore,
  }) = _AnalyticsRealtime;

  factory AnalyticsRealtime.fromJson(Map<String, dynamic> json) =>
      _$AnalyticsRealtimeFromJson(json);
}
