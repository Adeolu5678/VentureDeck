// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'bounty.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

BountySubmission _$BountySubmissionFromJson(Map<String, dynamic> json) {
  return _BountySubmission.fromJson(json);
}

/// @nodoc
mixin _$BountySubmission {
  String get id => throw _privateConstructorUsedError;
  String get bountyId => throw _privateConstructorUsedError;
  String get submitterId => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String? get attachmentUrl => throw _privateConstructorUsedError;
  bool get isApproved => throw _privateConstructorUsedError;
  String? get feedback => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this BountySubmission to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of BountySubmission
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BountySubmissionCopyWith<BountySubmission> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BountySubmissionCopyWith<$Res> {
  factory $BountySubmissionCopyWith(
    BountySubmission value,
    $Res Function(BountySubmission) then,
  ) = _$BountySubmissionCopyWithImpl<$Res, BountySubmission>;
  @useResult
  $Res call({
    String id,
    String bountyId,
    String submitterId,
    String content,
    String? attachmentUrl,
    bool isApproved,
    String? feedback,
    DateTime createdAt,
  });
}

/// @nodoc
class _$BountySubmissionCopyWithImpl<$Res, $Val extends BountySubmission>
    implements $BountySubmissionCopyWith<$Res> {
  _$BountySubmissionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of BountySubmission
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? bountyId = null,
    Object? submitterId = null,
    Object? content = null,
    Object? attachmentUrl = freezed,
    Object? isApproved = null,
    Object? feedback = freezed,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            bountyId: null == bountyId
                ? _value.bountyId
                : bountyId // ignore: cast_nullable_to_non_nullable
                      as String,
            submitterId: null == submitterId
                ? _value.submitterId
                : submitterId // ignore: cast_nullable_to_non_nullable
                      as String,
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            attachmentUrl: freezed == attachmentUrl
                ? _value.attachmentUrl
                : attachmentUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            isApproved: null == isApproved
                ? _value.isApproved
                : isApproved // ignore: cast_nullable_to_non_nullable
                      as bool,
            feedback: freezed == feedback
                ? _value.feedback
                : feedback // ignore: cast_nullable_to_non_nullable
                      as String?,
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
abstract class _$$BountySubmissionImplCopyWith<$Res>
    implements $BountySubmissionCopyWith<$Res> {
  factory _$$BountySubmissionImplCopyWith(
    _$BountySubmissionImpl value,
    $Res Function(_$BountySubmissionImpl) then,
  ) = __$$BountySubmissionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String bountyId,
    String submitterId,
    String content,
    String? attachmentUrl,
    bool isApproved,
    String? feedback,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$BountySubmissionImplCopyWithImpl<$Res>
    extends _$BountySubmissionCopyWithImpl<$Res, _$BountySubmissionImpl>
    implements _$$BountySubmissionImplCopyWith<$Res> {
  __$$BountySubmissionImplCopyWithImpl(
    _$BountySubmissionImpl _value,
    $Res Function(_$BountySubmissionImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of BountySubmission
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? bountyId = null,
    Object? submitterId = null,
    Object? content = null,
    Object? attachmentUrl = freezed,
    Object? isApproved = null,
    Object? feedback = freezed,
    Object? createdAt = null,
  }) {
    return _then(
      _$BountySubmissionImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        bountyId: null == bountyId
            ? _value.bountyId
            : bountyId // ignore: cast_nullable_to_non_nullable
                  as String,
        submitterId: null == submitterId
            ? _value.submitterId
            : submitterId // ignore: cast_nullable_to_non_nullable
                  as String,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        attachmentUrl: freezed == attachmentUrl
            ? _value.attachmentUrl
            : attachmentUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        isApproved: null == isApproved
            ? _value.isApproved
            : isApproved // ignore: cast_nullable_to_non_nullable
                  as bool,
        feedback: freezed == feedback
            ? _value.feedback
            : feedback // ignore: cast_nullable_to_non_nullable
                  as String?,
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
class _$BountySubmissionImpl implements _BountySubmission {
  const _$BountySubmissionImpl({
    required this.id,
    required this.bountyId,
    required this.submitterId,
    required this.content,
    this.attachmentUrl,
    this.isApproved = false,
    this.feedback,
    required this.createdAt,
  });

  factory _$BountySubmissionImpl.fromJson(Map<String, dynamic> json) =>
      _$$BountySubmissionImplFromJson(json);

  @override
  final String id;
  @override
  final String bountyId;
  @override
  final String submitterId;
  @override
  final String content;
  @override
  final String? attachmentUrl;
  @override
  @JsonKey()
  final bool isApproved;
  @override
  final String? feedback;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'BountySubmission(id: $id, bountyId: $bountyId, submitterId: $submitterId, content: $content, attachmentUrl: $attachmentUrl, isApproved: $isApproved, feedback: $feedback, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BountySubmissionImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.bountyId, bountyId) ||
                other.bountyId == bountyId) &&
            (identical(other.submitterId, submitterId) ||
                other.submitterId == submitterId) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.attachmentUrl, attachmentUrl) ||
                other.attachmentUrl == attachmentUrl) &&
            (identical(other.isApproved, isApproved) ||
                other.isApproved == isApproved) &&
            (identical(other.feedback, feedback) ||
                other.feedback == feedback) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    bountyId,
    submitterId,
    content,
    attachmentUrl,
    isApproved,
    feedback,
    createdAt,
  );

  /// Create a copy of BountySubmission
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BountySubmissionImplCopyWith<_$BountySubmissionImpl> get copyWith =>
      __$$BountySubmissionImplCopyWithImpl<_$BountySubmissionImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$BountySubmissionImplToJson(this);
  }
}

abstract class _BountySubmission implements BountySubmission {
  const factory _BountySubmission({
    required final String id,
    required final String bountyId,
    required final String submitterId,
    required final String content,
    final String? attachmentUrl,
    final bool isApproved,
    final String? feedback,
    required final DateTime createdAt,
  }) = _$BountySubmissionImpl;

  factory _BountySubmission.fromJson(Map<String, dynamic> json) =
      _$BountySubmissionImpl.fromJson;

  @override
  String get id;
  @override
  String get bountyId;
  @override
  String get submitterId;
  @override
  String get content;
  @override
  String? get attachmentUrl;
  @override
  bool get isApproved;
  @override
  String? get feedback;
  @override
  DateTime get createdAt;

  /// Create a copy of BountySubmission
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BountySubmissionImplCopyWith<_$BountySubmissionImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Bounty _$BountyFromJson(Map<String, dynamic> json) {
  return _Bounty.fromJson(json);
}

/// @nodoc
mixin _$Bounty {
  String get id => throw _privateConstructorUsedError;
  String get projectId => throw _privateConstructorUsedError;
  String get creatorId => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  double get reward => throw _privateConstructorUsedError;
  BountyType get type => throw _privateConstructorUsedError;
  BountyStatus get status => throw _privateConstructorUsedError;
  List<String> get skills => throw _privateConstructorUsedError;
  String? get claimedById => throw _privateConstructorUsedError;
  DateTime? get claimedAt => throw _privateConstructorUsedError;
  DateTime? get deadline => throw _privateConstructorUsedError;
  String? get completionNote => throw _privateConstructorUsedError;
  DateTime? get completedAt => throw _privateConstructorUsedError;
  List<BountySubmission> get submissions => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this Bounty to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Bounty
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BountyCopyWith<Bounty> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BountyCopyWith<$Res> {
  factory $BountyCopyWith(Bounty value, $Res Function(Bounty) then) =
      _$BountyCopyWithImpl<$Res, Bounty>;
  @useResult
  $Res call({
    String id,
    String projectId,
    String creatorId,
    String title,
    String description,
    double reward,
    BountyType type,
    BountyStatus status,
    List<String> skills,
    String? claimedById,
    DateTime? claimedAt,
    DateTime? deadline,
    String? completionNote,
    DateTime? completedAt,
    List<BountySubmission> submissions,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class _$BountyCopyWithImpl<$Res, $Val extends Bounty>
    implements $BountyCopyWith<$Res> {
  _$BountyCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Bounty
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? projectId = null,
    Object? creatorId = null,
    Object? title = null,
    Object? description = null,
    Object? reward = null,
    Object? type = null,
    Object? status = null,
    Object? skills = null,
    Object? claimedById = freezed,
    Object? claimedAt = freezed,
    Object? deadline = freezed,
    Object? completionNote = freezed,
    Object? completedAt = freezed,
    Object? submissions = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            projectId: null == projectId
                ? _value.projectId
                : projectId // ignore: cast_nullable_to_non_nullable
                      as String,
            creatorId: null == creatorId
                ? _value.creatorId
                : creatorId // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            reward: null == reward
                ? _value.reward
                : reward // ignore: cast_nullable_to_non_nullable
                      as double,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as BountyType,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as BountyStatus,
            skills: null == skills
                ? _value.skills
                : skills // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            claimedById: freezed == claimedById
                ? _value.claimedById
                : claimedById // ignore: cast_nullable_to_non_nullable
                      as String?,
            claimedAt: freezed == claimedAt
                ? _value.claimedAt
                : claimedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            deadline: freezed == deadline
                ? _value.deadline
                : deadline // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            completionNote: freezed == completionNote
                ? _value.completionNote
                : completionNote // ignore: cast_nullable_to_non_nullable
                      as String?,
            completedAt: freezed == completedAt
                ? _value.completedAt
                : completedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            submissions: null == submissions
                ? _value.submissions
                : submissions // ignore: cast_nullable_to_non_nullable
                      as List<BountySubmission>,
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
abstract class _$$BountyImplCopyWith<$Res> implements $BountyCopyWith<$Res> {
  factory _$$BountyImplCopyWith(
    _$BountyImpl value,
    $Res Function(_$BountyImpl) then,
  ) = __$$BountyImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String projectId,
    String creatorId,
    String title,
    String description,
    double reward,
    BountyType type,
    BountyStatus status,
    List<String> skills,
    String? claimedById,
    DateTime? claimedAt,
    DateTime? deadline,
    String? completionNote,
    DateTime? completedAt,
    List<BountySubmission> submissions,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class __$$BountyImplCopyWithImpl<$Res>
    extends _$BountyCopyWithImpl<$Res, _$BountyImpl>
    implements _$$BountyImplCopyWith<$Res> {
  __$$BountyImplCopyWithImpl(
    _$BountyImpl _value,
    $Res Function(_$BountyImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Bounty
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? projectId = null,
    Object? creatorId = null,
    Object? title = null,
    Object? description = null,
    Object? reward = null,
    Object? type = null,
    Object? status = null,
    Object? skills = null,
    Object? claimedById = freezed,
    Object? claimedAt = freezed,
    Object? deadline = freezed,
    Object? completionNote = freezed,
    Object? completedAt = freezed,
    Object? submissions = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$BountyImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        projectId: null == projectId
            ? _value.projectId
            : projectId // ignore: cast_nullable_to_non_nullable
                  as String,
        creatorId: null == creatorId
            ? _value.creatorId
            : creatorId // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        reward: null == reward
            ? _value.reward
            : reward // ignore: cast_nullable_to_non_nullable
                  as double,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as BountyType,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as BountyStatus,
        skills: null == skills
            ? _value._skills
            : skills // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        claimedById: freezed == claimedById
            ? _value.claimedById
            : claimedById // ignore: cast_nullable_to_non_nullable
                  as String?,
        claimedAt: freezed == claimedAt
            ? _value.claimedAt
            : claimedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        deadline: freezed == deadline
            ? _value.deadline
            : deadline // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        completionNote: freezed == completionNote
            ? _value.completionNote
            : completionNote // ignore: cast_nullable_to_non_nullable
                  as String?,
        completedAt: freezed == completedAt
            ? _value.completedAt
            : completedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        submissions: null == submissions
            ? _value._submissions
            : submissions // ignore: cast_nullable_to_non_nullable
                  as List<BountySubmission>,
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
class _$BountyImpl extends _Bounty {
  const _$BountyImpl({
    required this.id,
    required this.projectId,
    required this.creatorId,
    required this.title,
    required this.description,
    required this.reward,
    this.type = BountyType.other,
    this.status = BountyStatus.open,
    final List<String> skills = const [],
    this.claimedById,
    this.claimedAt,
    this.deadline,
    this.completionNote,
    this.completedAt,
    final List<BountySubmission> submissions = const [],
    required this.createdAt,
    required this.updatedAt,
  }) : _skills = skills,
       _submissions = submissions,
       super._();

  factory _$BountyImpl.fromJson(Map<String, dynamic> json) =>
      _$$BountyImplFromJson(json);

  @override
  final String id;
  @override
  final String projectId;
  @override
  final String creatorId;
  @override
  final String title;
  @override
  final String description;
  @override
  final double reward;
  @override
  @JsonKey()
  final BountyType type;
  @override
  @JsonKey()
  final BountyStatus status;
  final List<String> _skills;
  @override
  @JsonKey()
  List<String> get skills {
    if (_skills is EqualUnmodifiableListView) return _skills;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_skills);
  }

  @override
  final String? claimedById;
  @override
  final DateTime? claimedAt;
  @override
  final DateTime? deadline;
  @override
  final String? completionNote;
  @override
  final DateTime? completedAt;
  final List<BountySubmission> _submissions;
  @override
  @JsonKey()
  List<BountySubmission> get submissions {
    if (_submissions is EqualUnmodifiableListView) return _submissions;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_submissions);
  }

  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'Bounty(id: $id, projectId: $projectId, creatorId: $creatorId, title: $title, description: $description, reward: $reward, type: $type, status: $status, skills: $skills, claimedById: $claimedById, claimedAt: $claimedAt, deadline: $deadline, completionNote: $completionNote, completedAt: $completedAt, submissions: $submissions, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BountyImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.projectId, projectId) ||
                other.projectId == projectId) &&
            (identical(other.creatorId, creatorId) ||
                other.creatorId == creatorId) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.reward, reward) || other.reward == reward) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.status, status) || other.status == status) &&
            const DeepCollectionEquality().equals(other._skills, _skills) &&
            (identical(other.claimedById, claimedById) ||
                other.claimedById == claimedById) &&
            (identical(other.claimedAt, claimedAt) ||
                other.claimedAt == claimedAt) &&
            (identical(other.deadline, deadline) ||
                other.deadline == deadline) &&
            (identical(other.completionNote, completionNote) ||
                other.completionNote == completionNote) &&
            (identical(other.completedAt, completedAt) ||
                other.completedAt == completedAt) &&
            const DeepCollectionEquality().equals(
              other._submissions,
              _submissions,
            ) &&
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
    projectId,
    creatorId,
    title,
    description,
    reward,
    type,
    status,
    const DeepCollectionEquality().hash(_skills),
    claimedById,
    claimedAt,
    deadline,
    completionNote,
    completedAt,
    const DeepCollectionEquality().hash(_submissions),
    createdAt,
    updatedAt,
  );

  /// Create a copy of Bounty
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BountyImplCopyWith<_$BountyImpl> get copyWith =>
      __$$BountyImplCopyWithImpl<_$BountyImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BountyImplToJson(this);
  }
}

abstract class _Bounty extends Bounty {
  const factory _Bounty({
    required final String id,
    required final String projectId,
    required final String creatorId,
    required final String title,
    required final String description,
    required final double reward,
    final BountyType type,
    final BountyStatus status,
    final List<String> skills,
    final String? claimedById,
    final DateTime? claimedAt,
    final DateTime? deadline,
    final String? completionNote,
    final DateTime? completedAt,
    final List<BountySubmission> submissions,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$BountyImpl;
  const _Bounty._() : super._();

  factory _Bounty.fromJson(Map<String, dynamic> json) = _$BountyImpl.fromJson;

  @override
  String get id;
  @override
  String get projectId;
  @override
  String get creatorId;
  @override
  String get title;
  @override
  String get description;
  @override
  double get reward;
  @override
  BountyType get type;
  @override
  BountyStatus get status;
  @override
  List<String> get skills;
  @override
  String? get claimedById;
  @override
  DateTime? get claimedAt;
  @override
  DateTime? get deadline;
  @override
  String? get completionNote;
  @override
  DateTime? get completedAt;
  @override
  List<BountySubmission> get submissions;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of Bounty
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BountyImplCopyWith<_$BountyImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
