// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ScoreBreakdownImpl _$$ScoreBreakdownImplFromJson(Map<String, dynamic> json) =>
    _$ScoreBreakdownImpl(
      milestones: (json['milestones'] as num?)?.toInt() ?? 0,
      softCircles: (json['softCircles'] as num?)?.toInt() ?? 0,
      followers: (json['followers'] as num?)?.toInt() ?? 0,
      applications: (json['applications'] as num?)?.toInt() ?? 0,
      teamCompleteness: (json['teamCompleteness'] as num?)?.toInt() ?? 0,
      pitchDeck: (json['pitchDeck'] as num?)?.toInt() ?? 0,
      legalDocs: (json['legalDocs'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$ScoreBreakdownImplToJson(
  _$ScoreBreakdownImpl instance,
) => <String, dynamic>{
  'milestones': instance.milestones,
  'softCircles': instance.softCircles,
  'followers': instance.followers,
  'applications': instance.applications,
  'teamCompleteness': instance.teamCompleteness,
  'pitchDeck': instance.pitchDeck,
  'legalDocs': instance.legalDocs,
};

_$ProjectImpl _$$ProjectImplFromJson(Map<String, dynamic> json) =>
    _$ProjectImpl(
      id: json['id'] as String,
      ownerId: json['ownerId'] as String,
      workspaceId: json['workspaceId'] as String?,
      title: json['title'] as String,
      tagline: json['tagline'] as String,
      description: json['description'] as String,
      industry: json['industry'] as String,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
          const [],
      fundingGoal: (json['fundingGoal'] as num).toDouble(),
      equityOffered: (json['equityOffered'] as num).toDouble(),
      status: $enumDecode(_$ProjectStatusEnumMap, json['status']),
      logoUrl: json['logoUrl'] as String?,
      pitchDeckUrl: json['pitchDeckUrl'] as String?,
      tractionScore: (json['tractionScore'] as num?)?.toInt(),
      scoreLastUpdated: json['scoreLastUpdated'] == null
          ? null
          : DateTime.parse(json['scoreLastUpdated'] as String),
      scoreBreakdown: json['scoreBreakdown'] == null
          ? null
          : ScoreBreakdown.fromJson(
              json['scoreBreakdown'] as Map<String, dynamic>,
            ),
      stage: $enumDecodeNullable(_$ProjectStageEnumMap, json['stage']),
      location: json['location'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ProjectImplToJson(_$ProjectImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'ownerId': instance.ownerId,
      'workspaceId': instance.workspaceId,
      'title': instance.title,
      'tagline': instance.tagline,
      'description': instance.description,
      'industry': instance.industry,
      'tags': instance.tags,
      'fundingGoal': instance.fundingGoal,
      'equityOffered': instance.equityOffered,
      'status': _$ProjectStatusEnumMap[instance.status]!,
      'logoUrl': instance.logoUrl,
      'pitchDeckUrl': instance.pitchDeckUrl,
      'tractionScore': instance.tractionScore,
      'scoreLastUpdated': instance.scoreLastUpdated?.toIso8601String(),
      'scoreBreakdown': instance.scoreBreakdown,
      'stage': _$ProjectStageEnumMap[instance.stage],
      'location': instance.location,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$ProjectStatusEnumMap = {
  ProjectStatus.draft: 'draft',
  ProjectStatus.published: 'published',
  ProjectStatus.funded: 'funded',
  ProjectStatus.closed: 'closed',
};

const _$ProjectStageEnumMap = {
  ProjectStage.idea: 'idea',
  ProjectStage.mvp: 'mvp',
  ProjectStage.seed: 'seed',
  ProjectStage.seriesA: 'series-a',
  ProjectStage.seriesB: 'series-b',
  ProjectStage.growth: 'growth',
};
