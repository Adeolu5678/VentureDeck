// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'conversation.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Conversation _$ConversationFromJson(Map<String, dynamic> json) {
  return _Conversation.fromJson(json);
}

/// @nodoc
mixin _$Conversation {
  String get id => throw _privateConstructorUsedError;
  List<String> get participantIds => throw _privateConstructorUsedError;
  String? get workspaceId => throw _privateConstructorUsedError;
  String? get projectId => throw _privateConstructorUsedError;
  String? get applicationId => throw _privateConstructorUsedError;
  ConversationType? get type => throw _privateConstructorUsedError;
  String? get name => throw _privateConstructorUsedError;
  ConversationVisibility? get visibility => throw _privateConstructorUsedError;
  bool get isClosed => throw _privateConstructorUsedError;
  String? get creatorId => throw _privateConstructorUsedError;
  List<String> get archivedBy => throw _privateConstructorUsedError;
  String? get lastMessageId => throw _privateConstructorUsedError;
  String? get lastMessageText => throw _privateConstructorUsedError;
  DateTime? get lastMessageAt => throw _privateConstructorUsedError;
  int get unreadCount => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this Conversation to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Conversation
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ConversationCopyWith<Conversation> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ConversationCopyWith<$Res> {
  factory $ConversationCopyWith(
    Conversation value,
    $Res Function(Conversation) then,
  ) = _$ConversationCopyWithImpl<$Res, Conversation>;
  @useResult
  $Res call({
    String id,
    List<String> participantIds,
    String? workspaceId,
    String? projectId,
    String? applicationId,
    ConversationType? type,
    String? name,
    ConversationVisibility? visibility,
    bool isClosed,
    String? creatorId,
    List<String> archivedBy,
    String? lastMessageId,
    String? lastMessageText,
    DateTime? lastMessageAt,
    int unreadCount,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class _$ConversationCopyWithImpl<$Res, $Val extends Conversation>
    implements $ConversationCopyWith<$Res> {
  _$ConversationCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Conversation
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? participantIds = null,
    Object? workspaceId = freezed,
    Object? projectId = freezed,
    Object? applicationId = freezed,
    Object? type = freezed,
    Object? name = freezed,
    Object? visibility = freezed,
    Object? isClosed = null,
    Object? creatorId = freezed,
    Object? archivedBy = null,
    Object? lastMessageId = freezed,
    Object? lastMessageText = freezed,
    Object? lastMessageAt = freezed,
    Object? unreadCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            participantIds: null == participantIds
                ? _value.participantIds
                : participantIds // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            workspaceId: freezed == workspaceId
                ? _value.workspaceId
                : workspaceId // ignore: cast_nullable_to_non_nullable
                      as String?,
            projectId: freezed == projectId
                ? _value.projectId
                : projectId // ignore: cast_nullable_to_non_nullable
                      as String?,
            applicationId: freezed == applicationId
                ? _value.applicationId
                : applicationId // ignore: cast_nullable_to_non_nullable
                      as String?,
            type: freezed == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as ConversationType?,
            name: freezed == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String?,
            visibility: freezed == visibility
                ? _value.visibility
                : visibility // ignore: cast_nullable_to_non_nullable
                      as ConversationVisibility?,
            isClosed: null == isClosed
                ? _value.isClosed
                : isClosed // ignore: cast_nullable_to_non_nullable
                      as bool,
            creatorId: freezed == creatorId
                ? _value.creatorId
                : creatorId // ignore: cast_nullable_to_non_nullable
                      as String?,
            archivedBy: null == archivedBy
                ? _value.archivedBy
                : archivedBy // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            lastMessageId: freezed == lastMessageId
                ? _value.lastMessageId
                : lastMessageId // ignore: cast_nullable_to_non_nullable
                      as String?,
            lastMessageText: freezed == lastMessageText
                ? _value.lastMessageText
                : lastMessageText // ignore: cast_nullable_to_non_nullable
                      as String?,
            lastMessageAt: freezed == lastMessageAt
                ? _value.lastMessageAt
                : lastMessageAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            unreadCount: null == unreadCount
                ? _value.unreadCount
                : unreadCount // ignore: cast_nullable_to_non_nullable
                      as int,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ConversationImplCopyWith<$Res>
    implements $ConversationCopyWith<$Res> {
  factory _$$ConversationImplCopyWith(
    _$ConversationImpl value,
    $Res Function(_$ConversationImpl) then,
  ) = __$$ConversationImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    List<String> participantIds,
    String? workspaceId,
    String? projectId,
    String? applicationId,
    ConversationType? type,
    String? name,
    ConversationVisibility? visibility,
    bool isClosed,
    String? creatorId,
    List<String> archivedBy,
    String? lastMessageId,
    String? lastMessageText,
    DateTime? lastMessageAt,
    int unreadCount,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class __$$ConversationImplCopyWithImpl<$Res>
    extends _$ConversationCopyWithImpl<$Res, _$ConversationImpl>
    implements _$$ConversationImplCopyWith<$Res> {
  __$$ConversationImplCopyWithImpl(
    _$ConversationImpl _value,
    $Res Function(_$ConversationImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Conversation
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? participantIds = null,
    Object? workspaceId = freezed,
    Object? projectId = freezed,
    Object? applicationId = freezed,
    Object? type = freezed,
    Object? name = freezed,
    Object? visibility = freezed,
    Object? isClosed = null,
    Object? creatorId = freezed,
    Object? archivedBy = null,
    Object? lastMessageId = freezed,
    Object? lastMessageText = freezed,
    Object? lastMessageAt = freezed,
    Object? unreadCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$ConversationImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        participantIds: null == participantIds
            ? _value._participantIds
            : participantIds // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        workspaceId: freezed == workspaceId
            ? _value.workspaceId
            : workspaceId // ignore: cast_nullable_to_non_nullable
                  as String?,
        projectId: freezed == projectId
            ? _value.projectId
            : projectId // ignore: cast_nullable_to_non_nullable
                  as String?,
        applicationId: freezed == applicationId
            ? _value.applicationId
            : applicationId // ignore: cast_nullable_to_non_nullable
                  as String?,
        type: freezed == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as ConversationType?,
        name: freezed == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String?,
        visibility: freezed == visibility
            ? _value.visibility
            : visibility // ignore: cast_nullable_to_non_nullable
                  as ConversationVisibility?,
        isClosed: null == isClosed
            ? _value.isClosed
            : isClosed // ignore: cast_nullable_to_non_nullable
                  as bool,
        creatorId: freezed == creatorId
            ? _value.creatorId
            : creatorId // ignore: cast_nullable_to_non_nullable
                  as String?,
        archivedBy: null == archivedBy
            ? _value._archivedBy
            : archivedBy // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        lastMessageId: freezed == lastMessageId
            ? _value.lastMessageId
            : lastMessageId // ignore: cast_nullable_to_non_nullable
                  as String?,
        lastMessageText: freezed == lastMessageText
            ? _value.lastMessageText
            : lastMessageText // ignore: cast_nullable_to_non_nullable
                  as String?,
        lastMessageAt: freezed == lastMessageAt
            ? _value.lastMessageAt
            : lastMessageAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        unreadCount: null == unreadCount
            ? _value.unreadCount
            : unreadCount // ignore: cast_nullable_to_non_nullable
                  as int,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ConversationImpl extends _Conversation {
  const _$ConversationImpl({
    required this.id,
    required final List<String> participantIds,
    this.workspaceId,
    this.projectId,
    this.applicationId,
    this.type,
    this.name,
    this.visibility,
    this.isClosed = false,
    this.creatorId,
    final List<String> archivedBy = const [],
    this.lastMessageId,
    this.lastMessageText,
    this.lastMessageAt,
    this.unreadCount = 0,
    required this.createdAt,
    required this.updatedAt,
  }) : _participantIds = participantIds,
       _archivedBy = archivedBy,
       super._();

  factory _$ConversationImpl.fromJson(Map<String, dynamic> json) =>
      _$$ConversationImplFromJson(json);

  @override
  final String id;
  final List<String> _participantIds;
  @override
  List<String> get participantIds {
    if (_participantIds is EqualUnmodifiableListView) return _participantIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_participantIds);
  }

  @override
  final String? workspaceId;
  @override
  final String? projectId;
  @override
  final String? applicationId;
  @override
  final ConversationType? type;
  @override
  final String? name;
  @override
  final ConversationVisibility? visibility;
  @override
  @JsonKey()
  final bool isClosed;
  @override
  final String? creatorId;
  final List<String> _archivedBy;
  @override
  @JsonKey()
  List<String> get archivedBy {
    if (_archivedBy is EqualUnmodifiableListView) return _archivedBy;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_archivedBy);
  }

  @override
  final String? lastMessageId;
  @override
  final String? lastMessageText;
  @override
  final DateTime? lastMessageAt;
  @override
  @JsonKey()
  final int unreadCount;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'Conversation(id: $id, participantIds: $participantIds, workspaceId: $workspaceId, projectId: $projectId, applicationId: $applicationId, type: $type, name: $name, visibility: $visibility, isClosed: $isClosed, creatorId: $creatorId, archivedBy: $archivedBy, lastMessageId: $lastMessageId, lastMessageText: $lastMessageText, lastMessageAt: $lastMessageAt, unreadCount: $unreadCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ConversationImpl &&
            (identical(other.id, id) || other.id == id) &&
            const DeepCollectionEquality().equals(
              other._participantIds,
              _participantIds,
            ) &&
            (identical(other.workspaceId, workspaceId) ||
                other.workspaceId == workspaceId) &&
            (identical(other.projectId, projectId) ||
                other.projectId == projectId) &&
            (identical(other.applicationId, applicationId) ||
                other.applicationId == applicationId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.visibility, visibility) ||
                other.visibility == visibility) &&
            (identical(other.isClosed, isClosed) ||
                other.isClosed == isClosed) &&
            (identical(other.creatorId, creatorId) ||
                other.creatorId == creatorId) &&
            const DeepCollectionEquality().equals(
              other._archivedBy,
              _archivedBy,
            ) &&
            (identical(other.lastMessageId, lastMessageId) ||
                other.lastMessageId == lastMessageId) &&
            (identical(other.lastMessageText, lastMessageText) ||
                other.lastMessageText == lastMessageText) &&
            (identical(other.lastMessageAt, lastMessageAt) ||
                other.lastMessageAt == lastMessageAt) &&
            (identical(other.unreadCount, unreadCount) ||
                other.unreadCount == unreadCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    const DeepCollectionEquality().hash(_participantIds),
    workspaceId,
    projectId,
    applicationId,
    type,
    name,
    visibility,
    isClosed,
    creatorId,
    const DeepCollectionEquality().hash(_archivedBy),
    lastMessageId,
    lastMessageText,
    lastMessageAt,
    unreadCount,
    createdAt,
    updatedAt,
  );

  /// Create a copy of Conversation
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ConversationImplCopyWith<_$ConversationImpl> get copyWith =>
      __$$ConversationImplCopyWithImpl<_$ConversationImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ConversationImplToJson(this);
  }
}

abstract class _Conversation extends Conversation {
  const factory _Conversation({
    required final String id,
    required final List<String> participantIds,
    final String? workspaceId,
    final String? projectId,
    final String? applicationId,
    final ConversationType? type,
    final String? name,
    final ConversationVisibility? visibility,
    final bool isClosed,
    final String? creatorId,
    final List<String> archivedBy,
    final String? lastMessageId,
    final String? lastMessageText,
    final DateTime? lastMessageAt,
    final int unreadCount,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$ConversationImpl;
  const _Conversation._() : super._();

  factory _Conversation.fromJson(Map<String, dynamic> json) =
      _$ConversationImpl.fromJson;

  @override
  String get id;
  @override
  List<String> get participantIds;
  @override
  String? get workspaceId;
  @override
  String? get projectId;
  @override
  String? get applicationId;
  @override
  ConversationType? get type;
  @override
  String? get name;
  @override
  ConversationVisibility? get visibility;
  @override
  bool get isClosed;
  @override
  String? get creatorId;
  @override
  List<String> get archivedBy;
  @override
  String? get lastMessageId;
  @override
  String? get lastMessageText;
  @override
  DateTime? get lastMessageAt;
  @override
  int get unreadCount;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of Conversation
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ConversationImplCopyWith<_$ConversationImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Message _$MessageFromJson(Map<String, dynamic> json) {
  return _Message.fromJson(json);
}

/// @nodoc
mixin _$Message {
  String get id => throw _privateConstructorUsedError;
  String get conversationId => throw _privateConstructorUsedError;
  String get senderId => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  MessageType get type => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  Map<String, dynamic>? get metadata => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this Message to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Message
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MessageCopyWith<Message> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MessageCopyWith<$Res> {
  factory $MessageCopyWith(Message value, $Res Function(Message) then) =
      _$MessageCopyWithImpl<$Res, Message>;
  @useResult
  $Res call({
    String id,
    String conversationId,
    String senderId,
    String content,
    MessageType type,
    String? imageUrl,
    Map<String, dynamic>? metadata,
    bool isRead,
    DateTime createdAt,
  });
}

/// @nodoc
class _$MessageCopyWithImpl<$Res, $Val extends Message>
    implements $MessageCopyWith<$Res> {
  _$MessageCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Message
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? conversationId = null,
    Object? senderId = null,
    Object? content = null,
    Object? type = null,
    Object? imageUrl = freezed,
    Object? metadata = freezed,
    Object? isRead = null,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            conversationId: null == conversationId
                ? _value.conversationId
                : conversationId // ignore: cast_nullable_to_non_nullable
                      as String,
            senderId: null == senderId
                ? _value.senderId
                : senderId // ignore: cast_nullable_to_non_nullable
                      as String,
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as MessageType,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            metadata: freezed == metadata
                ? _value.metadata
                : metadata // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            isRead: null == isRead
                ? _value.isRead
                : isRead // ignore: cast_nullable_to_non_nullable
                      as bool,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$MessageImplCopyWith<$Res> implements $MessageCopyWith<$Res> {
  factory _$$MessageImplCopyWith(
    _$MessageImpl value,
    $Res Function(_$MessageImpl) then,
  ) = __$$MessageImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String conversationId,
    String senderId,
    String content,
    MessageType type,
    String? imageUrl,
    Map<String, dynamic>? metadata,
    bool isRead,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$MessageImplCopyWithImpl<$Res>
    extends _$MessageCopyWithImpl<$Res, _$MessageImpl>
    implements _$$MessageImplCopyWith<$Res> {
  __$$MessageImplCopyWithImpl(
    _$MessageImpl _value,
    $Res Function(_$MessageImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Message
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? conversationId = null,
    Object? senderId = null,
    Object? content = null,
    Object? type = null,
    Object? imageUrl = freezed,
    Object? metadata = freezed,
    Object? isRead = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$MessageImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        conversationId: null == conversationId
            ? _value.conversationId
            : conversationId // ignore: cast_nullable_to_non_nullable
                  as String,
        senderId: null == senderId
            ? _value.senderId
            : senderId // ignore: cast_nullable_to_non_nullable
                  as String,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as MessageType,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        metadata: freezed == metadata
            ? _value._metadata
            : metadata // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        isRead: null == isRead
            ? _value.isRead
            : isRead // ignore: cast_nullable_to_non_nullable
                  as bool,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$MessageImpl extends _Message {
  const _$MessageImpl({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    this.type = MessageType.text,
    this.imageUrl,
    final Map<String, dynamic>? metadata,
    this.isRead = false,
    required this.createdAt,
  }) : _metadata = metadata,
       super._();

  factory _$MessageImpl.fromJson(Map<String, dynamic> json) =>
      _$$MessageImplFromJson(json);

  @override
  final String id;
  @override
  final String conversationId;
  @override
  final String senderId;
  @override
  final String content;
  @override
  @JsonKey()
  final MessageType type;
  @override
  final String? imageUrl;
  final Map<String, dynamic>? _metadata;
  @override
  Map<String, dynamic>? get metadata {
    final value = _metadata;
    if (value == null) return null;
    if (_metadata is EqualUnmodifiableMapView) return _metadata;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  @JsonKey()
  final bool isRead;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'Message(id: $id, conversationId: $conversationId, senderId: $senderId, content: $content, type: $type, imageUrl: $imageUrl, metadata: $metadata, isRead: $isRead, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MessageImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.conversationId, conversationId) ||
                other.conversationId == conversationId) &&
            (identical(other.senderId, senderId) ||
                other.senderId == senderId) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            const DeepCollectionEquality().equals(other._metadata, _metadata) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    conversationId,
    senderId,
    content,
    type,
    imageUrl,
    const DeepCollectionEquality().hash(_metadata),
    isRead,
    createdAt,
  );

  /// Create a copy of Message
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MessageImplCopyWith<_$MessageImpl> get copyWith =>
      __$$MessageImplCopyWithImpl<_$MessageImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MessageImplToJson(this);
  }
}

abstract class _Message extends Message {
  const factory _Message({
    required final String id,
    required final String conversationId,
    required final String senderId,
    required final String content,
    final MessageType type,
    final String? imageUrl,
    final Map<String, dynamic>? metadata,
    final bool isRead,
    required final DateTime createdAt,
  }) = _$MessageImpl;
  const _Message._() : super._();

  factory _Message.fromJson(Map<String, dynamic> json) = _$MessageImpl.fromJson;

  @override
  String get id;
  @override
  String get conversationId;
  @override
  String get senderId;
  @override
  String get content;
  @override
  MessageType get type;
  @override
  String? get imageUrl;
  @override
  Map<String, dynamic>? get metadata;
  @override
  bool get isRead;
  @override
  DateTime get createdAt;

  /// Create a copy of Message
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MessageImplCopyWith<_$MessageImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ConversationWithDetails _$ConversationWithDetailsFromJson(
  Map<String, dynamic> json,
) {
  return _ConversationWithDetails.fromJson(json);
}

/// @nodoc
mixin _$ConversationWithDetails {
  Conversation get conversation => throw _privateConstructorUsedError;
  Message? get lastMessage => throw _privateConstructorUsedError;
  String? get otherUserName => throw _privateConstructorUsedError;
  String? get otherUserAvatarUrl => throw _privateConstructorUsedError;
  int get unreadCount => throw _privateConstructorUsedError;

  /// Serializes this ConversationWithDetails to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ConversationWithDetailsCopyWith<ConversationWithDetails> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ConversationWithDetailsCopyWith<$Res> {
  factory $ConversationWithDetailsCopyWith(
    ConversationWithDetails value,
    $Res Function(ConversationWithDetails) then,
  ) = _$ConversationWithDetailsCopyWithImpl<$Res, ConversationWithDetails>;
  @useResult
  $Res call({
    Conversation conversation,
    Message? lastMessage,
    String? otherUserName,
    String? otherUserAvatarUrl,
    int unreadCount,
  });

  $ConversationCopyWith<$Res> get conversation;
  $MessageCopyWith<$Res>? get lastMessage;
}

/// @nodoc
class _$ConversationWithDetailsCopyWithImpl<
  $Res,
  $Val extends ConversationWithDetails
>
    implements $ConversationWithDetailsCopyWith<$Res> {
  _$ConversationWithDetailsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? conversation = null,
    Object? lastMessage = freezed,
    Object? otherUserName = freezed,
    Object? otherUserAvatarUrl = freezed,
    Object? unreadCount = null,
  }) {
    return _then(
      _value.copyWith(
            conversation: null == conversation
                ? _value.conversation
                : conversation // ignore: cast_nullable_to_non_nullable
                      as Conversation,
            lastMessage: freezed == lastMessage
                ? _value.lastMessage
                : lastMessage // ignore: cast_nullable_to_non_nullable
                      as Message?,
            otherUserName: freezed == otherUserName
                ? _value.otherUserName
                : otherUserName // ignore: cast_nullable_to_non_nullable
                      as String?,
            otherUserAvatarUrl: freezed == otherUserAvatarUrl
                ? _value.otherUserAvatarUrl
                : otherUserAvatarUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            unreadCount: null == unreadCount
                ? _value.unreadCount
                : unreadCount // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ConversationCopyWith<$Res> get conversation {
    return $ConversationCopyWith<$Res>(_value.conversation, (value) {
      return _then(_value.copyWith(conversation: value) as $Val);
    });
  }

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $MessageCopyWith<$Res>? get lastMessage {
    if (_value.lastMessage == null) {
      return null;
    }

    return $MessageCopyWith<$Res>(_value.lastMessage!, (value) {
      return _then(_value.copyWith(lastMessage: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ConversationWithDetailsImplCopyWith<$Res>
    implements $ConversationWithDetailsCopyWith<$Res> {
  factory _$$ConversationWithDetailsImplCopyWith(
    _$ConversationWithDetailsImpl value,
    $Res Function(_$ConversationWithDetailsImpl) then,
  ) = __$$ConversationWithDetailsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    Conversation conversation,
    Message? lastMessage,
    String? otherUserName,
    String? otherUserAvatarUrl,
    int unreadCount,
  });

  @override
  $ConversationCopyWith<$Res> get conversation;
  @override
  $MessageCopyWith<$Res>? get lastMessage;
}

/// @nodoc
class __$$ConversationWithDetailsImplCopyWithImpl<$Res>
    extends
        _$ConversationWithDetailsCopyWithImpl<
          $Res,
          _$ConversationWithDetailsImpl
        >
    implements _$$ConversationWithDetailsImplCopyWith<$Res> {
  __$$ConversationWithDetailsImplCopyWithImpl(
    _$ConversationWithDetailsImpl _value,
    $Res Function(_$ConversationWithDetailsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? conversation = null,
    Object? lastMessage = freezed,
    Object? otherUserName = freezed,
    Object? otherUserAvatarUrl = freezed,
    Object? unreadCount = null,
  }) {
    return _then(
      _$ConversationWithDetailsImpl(
        conversation: null == conversation
            ? _value.conversation
            : conversation // ignore: cast_nullable_to_non_nullable
                  as Conversation,
        lastMessage: freezed == lastMessage
            ? _value.lastMessage
            : lastMessage // ignore: cast_nullable_to_non_nullable
                  as Message?,
        otherUserName: freezed == otherUserName
            ? _value.otherUserName
            : otherUserName // ignore: cast_nullable_to_non_nullable
                  as String?,
        otherUserAvatarUrl: freezed == otherUserAvatarUrl
            ? _value.otherUserAvatarUrl
            : otherUserAvatarUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        unreadCount: null == unreadCount
            ? _value.unreadCount
            : unreadCount // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ConversationWithDetailsImpl implements _ConversationWithDetails {
  const _$ConversationWithDetailsImpl({
    required this.conversation,
    this.lastMessage,
    this.otherUserName,
    this.otherUserAvatarUrl,
    this.unreadCount = 0,
  });

  factory _$ConversationWithDetailsImpl.fromJson(Map<String, dynamic> json) =>
      _$$ConversationWithDetailsImplFromJson(json);

  @override
  final Conversation conversation;
  @override
  final Message? lastMessage;
  @override
  final String? otherUserName;
  @override
  final String? otherUserAvatarUrl;
  @override
  @JsonKey()
  final int unreadCount;

  @override
  String toString() {
    return 'ConversationWithDetails(conversation: $conversation, lastMessage: $lastMessage, otherUserName: $otherUserName, otherUserAvatarUrl: $otherUserAvatarUrl, unreadCount: $unreadCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ConversationWithDetailsImpl &&
            (identical(other.conversation, conversation) ||
                other.conversation == conversation) &&
            (identical(other.lastMessage, lastMessage) ||
                other.lastMessage == lastMessage) &&
            (identical(other.otherUserName, otherUserName) ||
                other.otherUserName == otherUserName) &&
            (identical(other.otherUserAvatarUrl, otherUserAvatarUrl) ||
                other.otherUserAvatarUrl == otherUserAvatarUrl) &&
            (identical(other.unreadCount, unreadCount) ||
                other.unreadCount == unreadCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    conversation,
    lastMessage,
    otherUserName,
    otherUserAvatarUrl,
    unreadCount,
  );

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ConversationWithDetailsImplCopyWith<_$ConversationWithDetailsImpl>
  get copyWith =>
      __$$ConversationWithDetailsImplCopyWithImpl<
        _$ConversationWithDetailsImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ConversationWithDetailsImplToJson(this);
  }
}

abstract class _ConversationWithDetails implements ConversationWithDetails {
  const factory _ConversationWithDetails({
    required final Conversation conversation,
    final Message? lastMessage,
    final String? otherUserName,
    final String? otherUserAvatarUrl,
    final int unreadCount,
  }) = _$ConversationWithDetailsImpl;

  factory _ConversationWithDetails.fromJson(Map<String, dynamic> json) =
      _$ConversationWithDetailsImpl.fromJson;

  @override
  Conversation get conversation;
  @override
  Message? get lastMessage;
  @override
  String? get otherUserName;
  @override
  String? get otherUserAvatarUrl;
  @override
  int get unreadCount;

  /// Create a copy of ConversationWithDetails
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ConversationWithDetailsImplCopyWith<_$ConversationWithDetailsImpl>
  get copyWith => throw _privateConstructorUsedError;
}
