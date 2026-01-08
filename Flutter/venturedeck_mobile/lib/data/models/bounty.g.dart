// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bounty.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$BountySubmissionImpl _$$BountySubmissionImplFromJson(
  Map<String, dynamic> json,
) => _$BountySubmissionImpl(
  id: json['id'] as String,
  bountyId: json['bountyId'] as String,
  submitterId: json['submitterId'] as String,
  content: json['content'] as String,
  attachmentUrl: json['attachmentUrl'] as String?,
  isApproved: json['isApproved'] as bool? ?? false,
  feedback: json['feedback'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$$BountySubmissionImplToJson(
  _$BountySubmissionImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'bountyId': instance.bountyId,
  'submitterId': instance.submitterId,
  'content': instance.content,
  'attachmentUrl': instance.attachmentUrl,
  'isApproved': instance.isApproved,
  'feedback': instance.feedback,
  'createdAt': instance.createdAt.toIso8601String(),
};

_$BountyImpl _$$BountyImplFromJson(Map<String, dynamic> json) => _$BountyImpl(
  id: json['id'] as String,
  projectId: json['projectId'] as String,
  creatorId: json['creatorId'] as String,
  title: json['title'] as String,
  description: json['description'] as String,
  reward: (json['reward'] as num).toDouble(),
  type:
      $enumDecodeNullable(_$BountyTypeEnumMap, json['type']) ??
      BountyType.other,
  status:
      $enumDecodeNullable(_$BountyStatusEnumMap, json['status']) ??
      BountyStatus.open,
  skills:
      (json['skills'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  claimedById: json['claimedById'] as String?,
  claimedAt: json['claimedAt'] == null
      ? null
      : DateTime.parse(json['claimedAt'] as String),
  deadline: json['deadline'] == null
      ? null
      : DateTime.parse(json['deadline'] as String),
  completionNote: json['completionNote'] as String?,
  completedAt: json['completedAt'] == null
      ? null
      : DateTime.parse(json['completedAt'] as String),
  submissions:
      (json['submissions'] as List<dynamic>?)
          ?.map((e) => BountySubmission.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$$BountyImplToJson(_$BountyImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'projectId': instance.projectId,
      'creatorId': instance.creatorId,
      'title': instance.title,
      'description': instance.description,
      'reward': instance.reward,
      'type': _$BountyTypeEnumMap[instance.type]!,
      'status': _$BountyStatusEnumMap[instance.status]!,
      'skills': instance.skills,
      'claimedById': instance.claimedById,
      'claimedAt': instance.claimedAt?.toIso8601String(),
      'deadline': instance.deadline?.toIso8601String(),
      'completionNote': instance.completionNote,
      'completedAt': instance.completedAt?.toIso8601String(),
      'submissions': instance.submissions,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$BountyTypeEnumMap = {
  BountyType.development: 'development',
  BountyType.design: 'design',
  BountyType.marketing: 'marketing',
  BountyType.research: 'research',
  BountyType.content: 'content',
  BountyType.other: 'other',
};

const _$BountyStatusEnumMap = {
  BountyStatus.open: 'open',
  BountyStatus.claimed: 'claimed',
  BountyStatus.submitted: 'submitted',
  BountyStatus.completed: 'completed',
  BountyStatus.cancelled: 'cancelled',
};
