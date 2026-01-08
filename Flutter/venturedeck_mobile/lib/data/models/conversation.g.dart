// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'conversation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ConversationImpl _$$ConversationImplFromJson(Map<String, dynamic> json) =>
    _$ConversationImpl(
      id: json['id'] as String,
      participantIds: (json['participantIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      workspaceId: json['workspaceId'] as String?,
      projectId: json['projectId'] as String?,
      applicationId: json['applicationId'] as String?,
      type: $enumDecodeNullable(_$ConversationTypeEnumMap, json['type']),
      name: json['name'] as String?,
      visibility: $enumDecodeNullable(
        _$ConversationVisibilityEnumMap,
        json['visibility'],
      ),
      isClosed: json['isClosed'] as bool? ?? false,
      creatorId: json['creatorId'] as String?,
      archivedBy:
          (json['archivedBy'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      lastMessageId: json['lastMessageId'] as String?,
      lastMessageText: json['lastMessageText'] as String?,
      lastMessageAt: json['lastMessageAt'] == null
          ? null
          : DateTime.parse(json['lastMessageAt'] as String),
      unreadCount: (json['unreadCount'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ConversationImplToJson(_$ConversationImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'participantIds': instance.participantIds,
      'workspaceId': instance.workspaceId,
      'projectId': instance.projectId,
      'applicationId': instance.applicationId,
      'type': _$ConversationTypeEnumMap[instance.type],
      'name': instance.name,
      'visibility': _$ConversationVisibilityEnumMap[instance.visibility],
      'isClosed': instance.isClosed,
      'creatorId': instance.creatorId,
      'archivedBy': instance.archivedBy,
      'lastMessageId': instance.lastMessageId,
      'lastMessageText': instance.lastMessageText,
      'lastMessageAt': instance.lastMessageAt?.toIso8601String(),
      'unreadCount': instance.unreadCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$ConversationTypeEnumMap = {
  ConversationType.direct: 'direct',
  ConversationType.workspaceGeneral: 'workspace_general',
  ConversationType.interview: 'interview',
  ConversationType.customChat: 'custom_chat',
};

const _$ConversationVisibilityEnumMap = {
  ConversationVisibility.public: 'public',
  ConversationVisibility.private: 'private',
};

_$MessageImpl _$$MessageImplFromJson(Map<String, dynamic> json) =>
    _$MessageImpl(
      id: json['id'] as String,
      conversationId: json['conversationId'] as String,
      senderId: json['senderId'] as String,
      content: json['content'] as String,
      type:
          $enumDecodeNullable(_$MessageTypeEnumMap, json['type']) ??
          MessageType.text,
      imageUrl: json['imageUrl'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
      isRead: json['isRead'] as bool? ?? false,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$MessageImplToJson(_$MessageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'conversationId': instance.conversationId,
      'senderId': instance.senderId,
      'content': instance.content,
      'type': _$MessageTypeEnumMap[instance.type]!,
      'imageUrl': instance.imageUrl,
      'metadata': instance.metadata,
      'isRead': instance.isRead,
      'createdAt': instance.createdAt.toIso8601String(),
    };

const _$MessageTypeEnumMap = {
  MessageType.text: 'text',
  MessageType.image: 'image',
  MessageType.file: 'file',
  MessageType.system: 'system',
};

_$ConversationWithDetailsImpl _$$ConversationWithDetailsImplFromJson(
  Map<String, dynamic> json,
) => _$ConversationWithDetailsImpl(
  conversation: Conversation.fromJson(
    json['conversation'] as Map<String, dynamic>,
  ),
  lastMessage: json['lastMessage'] == null
      ? null
      : Message.fromJson(json['lastMessage'] as Map<String, dynamic>),
  otherUserName: json['otherUserName'] as String?,
  otherUserAvatarUrl: json['otherUserAvatarUrl'] as String?,
  unreadCount: (json['unreadCount'] as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$$ConversationWithDetailsImplToJson(
  _$ConversationWithDetailsImpl instance,
) => <String, dynamic>{
  'conversation': instance.conversation,
  'lastMessage': instance.lastMessage,
  'otherUserName': instance.otherUserName,
  'otherUserAvatarUrl': instance.otherUserAvatarUrl,
  'unreadCount': instance.unreadCount,
};
