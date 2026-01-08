// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'workspace.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$WorkspaceMemberRoleImpl _$$WorkspaceMemberRoleImplFromJson(
  Map<String, dynamic> json,
) => _$WorkspaceMemberRoleImpl(
  userId: json['userId'] as String,
  role: json['role'] as String,
);

Map<String, dynamic> _$$WorkspaceMemberRoleImplToJson(
  _$WorkspaceMemberRoleImpl instance,
) => <String, dynamic>{'userId': instance.userId, 'role': instance.role};

_$WorkspaceImpl _$$WorkspaceImplFromJson(
  Map<String, dynamic> json,
) => _$WorkspaceImpl(
  id: json['id'] as String,
  projectId: json['projectId'] as String,
  name: json['name'] as String,
  members: (json['members'] as List<dynamic>).map((e) => e as String).toList(),
  roles:
      (json['roles'] as List<dynamic>?)
          ?.map((e) => WorkspaceMemberRole.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  inviteCode: json['inviteCode'] as String?,
  ownerId: json['ownerId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$$WorkspaceImplToJson(_$WorkspaceImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'projectId': instance.projectId,
      'name': instance.name,
      'members': instance.members,
      'roles': instance.roles,
      'inviteCode': instance.inviteCode,
      'ownerId': instance.ownerId,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
