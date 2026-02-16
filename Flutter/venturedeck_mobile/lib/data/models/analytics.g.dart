// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AnalyticsImpl _$$AnalyticsImplFromJson(Map<String, dynamic> json) =>
    _$AnalyticsImpl(
      snapshots: (json['snapshots'] as List<dynamic>)
          .map((e) => AnalyticsSnapshot.fromJson(e as Map<String, dynamic>))
          .toList(),
      realtime: AnalyticsRealtime.fromJson(
        json['realtime'] as Map<String, dynamic>,
      ),
    );

Map<String, dynamic> _$$AnalyticsImplToJson(_$AnalyticsImpl instance) =>
    <String, dynamic>{
      'snapshots': instance.snapshots,
      'realtime': instance.realtime,
    };

_$AnalyticsSnapshotImpl _$$AnalyticsSnapshotImplFromJson(
  Map<String, dynamic> json,
) => _$AnalyticsSnapshotImpl(
  date: DateTime.parse(json['date'] as String),
  views: (json['views'] as num).toInt(),
  uniqueViews: (json['uniqueViews'] as num).toInt(),
);

Map<String, dynamic> _$$AnalyticsSnapshotImplToJson(
  _$AnalyticsSnapshotImpl instance,
) => <String, dynamic>{
  'date': instance.date.toIso8601String(),
  'views': instance.views,
  'uniqueViews': instance.uniqueViews,
};

_$AnalyticsRealtimeImpl _$$AnalyticsRealtimeImplFromJson(
  Map<String, dynamic> json,
) => _$AnalyticsRealtimeImpl(
  todayViews: (json['todayViews'] as num).toInt(),
  todayUniqueViews: (json['todayUniqueViews'] as num).toInt(),
  totalFollowers: (json['totalFollowers'] as num).toInt(),
  totalSoftCircle: (json['totalSoftCircle'] as num).toInt(),
  softCircleCount: (json['softCircleCount'] as num).toInt(),
  applicationCount: (json['applicationCount'] as num).toInt(),
  pendingApplications: (json['pendingApplications'] as num).toInt(),
  tractionScore: (json['tractionScore'] as num).toInt(),
);

Map<String, dynamic> _$$AnalyticsRealtimeImplToJson(
  _$AnalyticsRealtimeImpl instance,
) => <String, dynamic>{
  'todayViews': instance.todayViews,
  'todayUniqueViews': instance.todayUniqueViews,
  'totalFollowers': instance.totalFollowers,
  'totalSoftCircle': instance.totalSoftCircle,
  'softCircleCount': instance.softCircleCount,
  'applicationCount': instance.applicationCount,
  'pendingApplications': instance.pendingApplications,
  'tractionScore': instance.tractionScore,
};
