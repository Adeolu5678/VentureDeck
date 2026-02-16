// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'analytics.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Analytics _$AnalyticsFromJson(Map<String, dynamic> json) {
  return _Analytics.fromJson(json);
}

/// @nodoc
mixin _$Analytics {
  List<AnalyticsSnapshot> get snapshots => throw _privateConstructorUsedError;
  AnalyticsRealtime get realtime => throw _privateConstructorUsedError;

  /// Serializes this Analytics to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Analytics
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AnalyticsCopyWith<Analytics> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AnalyticsCopyWith<$Res> {
  factory $AnalyticsCopyWith(Analytics value, $Res Function(Analytics) then) =
      _$AnalyticsCopyWithImpl<$Res, Analytics>;
  @useResult
  $Res call({List<AnalyticsSnapshot> snapshots, AnalyticsRealtime realtime});

  $AnalyticsRealtimeCopyWith<$Res> get realtime;
}

/// @nodoc
class _$AnalyticsCopyWithImpl<$Res, $Val extends Analytics>
    implements $AnalyticsCopyWith<$Res> {
  _$AnalyticsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Analytics
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? snapshots = null, Object? realtime = null}) {
    return _then(
      _value.copyWith(
            snapshots: null == snapshots
                ? _value.snapshots
                : snapshots // ignore: cast_nullable_to_non_nullable
                      as List<AnalyticsSnapshot>,
            realtime: null == realtime
                ? _value.realtime
                : realtime // ignore: cast_nullable_to_non_nullable
                      as AnalyticsRealtime,
          )
          as $Val,
    );
  }

  /// Create a copy of Analytics
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $AnalyticsRealtimeCopyWith<$Res> get realtime {
    return $AnalyticsRealtimeCopyWith<$Res>(_value.realtime, (value) {
      return _then(_value.copyWith(realtime: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$AnalyticsImplCopyWith<$Res>
    implements $AnalyticsCopyWith<$Res> {
  factory _$$AnalyticsImplCopyWith(
    _$AnalyticsImpl value,
    $Res Function(_$AnalyticsImpl) then,
  ) = __$$AnalyticsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<AnalyticsSnapshot> snapshots, AnalyticsRealtime realtime});

  @override
  $AnalyticsRealtimeCopyWith<$Res> get realtime;
}

/// @nodoc
class __$$AnalyticsImplCopyWithImpl<$Res>
    extends _$AnalyticsCopyWithImpl<$Res, _$AnalyticsImpl>
    implements _$$AnalyticsImplCopyWith<$Res> {
  __$$AnalyticsImplCopyWithImpl(
    _$AnalyticsImpl _value,
    $Res Function(_$AnalyticsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Analytics
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? snapshots = null, Object? realtime = null}) {
    return _then(
      _$AnalyticsImpl(
        snapshots: null == snapshots
            ? _value._snapshots
            : snapshots // ignore: cast_nullable_to_non_nullable
                  as List<AnalyticsSnapshot>,
        realtime: null == realtime
            ? _value.realtime
            : realtime // ignore: cast_nullable_to_non_nullable
                  as AnalyticsRealtime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AnalyticsImpl implements _Analytics {
  const _$AnalyticsImpl({
    required final List<AnalyticsSnapshot> snapshots,
    required this.realtime,
  }) : _snapshots = snapshots;

  factory _$AnalyticsImpl.fromJson(Map<String, dynamic> json) =>
      _$$AnalyticsImplFromJson(json);

  final List<AnalyticsSnapshot> _snapshots;
  @override
  List<AnalyticsSnapshot> get snapshots {
    if (_snapshots is EqualUnmodifiableListView) return _snapshots;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_snapshots);
  }

  @override
  final AnalyticsRealtime realtime;

  @override
  String toString() {
    return 'Analytics(snapshots: $snapshots, realtime: $realtime)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AnalyticsImpl &&
            const DeepCollectionEquality().equals(
              other._snapshots,
              _snapshots,
            ) &&
            (identical(other.realtime, realtime) ||
                other.realtime == realtime));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_snapshots),
    realtime,
  );

  /// Create a copy of Analytics
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AnalyticsImplCopyWith<_$AnalyticsImpl> get copyWith =>
      __$$AnalyticsImplCopyWithImpl<_$AnalyticsImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AnalyticsImplToJson(this);
  }
}

abstract class _Analytics implements Analytics {
  const factory _Analytics({
    required final List<AnalyticsSnapshot> snapshots,
    required final AnalyticsRealtime realtime,
  }) = _$AnalyticsImpl;

  factory _Analytics.fromJson(Map<String, dynamic> json) =
      _$AnalyticsImpl.fromJson;

  @override
  List<AnalyticsSnapshot> get snapshots;
  @override
  AnalyticsRealtime get realtime;

  /// Create a copy of Analytics
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AnalyticsImplCopyWith<_$AnalyticsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

AnalyticsSnapshot _$AnalyticsSnapshotFromJson(Map<String, dynamic> json) {
  return _AnalyticsSnapshot.fromJson(json);
}

/// @nodoc
mixin _$AnalyticsSnapshot {
  DateTime get date => throw _privateConstructorUsedError;
  int get views => throw _privateConstructorUsedError;
  int get uniqueViews => throw _privateConstructorUsedError;

  /// Serializes this AnalyticsSnapshot to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AnalyticsSnapshotCopyWith<AnalyticsSnapshot> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AnalyticsSnapshotCopyWith<$Res> {
  factory $AnalyticsSnapshotCopyWith(
    AnalyticsSnapshot value,
    $Res Function(AnalyticsSnapshot) then,
  ) = _$AnalyticsSnapshotCopyWithImpl<$Res, AnalyticsSnapshot>;
  @useResult
  $Res call({DateTime date, int views, int uniqueViews});
}

/// @nodoc
class _$AnalyticsSnapshotCopyWithImpl<$Res, $Val extends AnalyticsSnapshot>
    implements $AnalyticsSnapshotCopyWith<$Res> {
  _$AnalyticsSnapshotCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? views = null,
    Object? uniqueViews = null,
  }) {
    return _then(
      _value.copyWith(
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            views: null == views
                ? _value.views
                : views // ignore: cast_nullable_to_non_nullable
                      as int,
            uniqueViews: null == uniqueViews
                ? _value.uniqueViews
                : uniqueViews // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AnalyticsSnapshotImplCopyWith<$Res>
    implements $AnalyticsSnapshotCopyWith<$Res> {
  factory _$$AnalyticsSnapshotImplCopyWith(
    _$AnalyticsSnapshotImpl value,
    $Res Function(_$AnalyticsSnapshotImpl) then,
  ) = __$$AnalyticsSnapshotImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({DateTime date, int views, int uniqueViews});
}

/// @nodoc
class __$$AnalyticsSnapshotImplCopyWithImpl<$Res>
    extends _$AnalyticsSnapshotCopyWithImpl<$Res, _$AnalyticsSnapshotImpl>
    implements _$$AnalyticsSnapshotImplCopyWith<$Res> {
  __$$AnalyticsSnapshotImplCopyWithImpl(
    _$AnalyticsSnapshotImpl _value,
    $Res Function(_$AnalyticsSnapshotImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? date = null,
    Object? views = null,
    Object? uniqueViews = null,
  }) {
    return _then(
      _$AnalyticsSnapshotImpl(
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        views: null == views
            ? _value.views
            : views // ignore: cast_nullable_to_non_nullable
                  as int,
        uniqueViews: null == uniqueViews
            ? _value.uniqueViews
            : uniqueViews // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AnalyticsSnapshotImpl implements _AnalyticsSnapshot {
  const _$AnalyticsSnapshotImpl({
    required this.date,
    required this.views,
    required this.uniqueViews,
  });

  factory _$AnalyticsSnapshotImpl.fromJson(Map<String, dynamic> json) =>
      _$$AnalyticsSnapshotImplFromJson(json);

  @override
  final DateTime date;
  @override
  final int views;
  @override
  final int uniqueViews;

  @override
  String toString() {
    return 'AnalyticsSnapshot(date: $date, views: $views, uniqueViews: $uniqueViews)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AnalyticsSnapshotImpl &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.views, views) || other.views == views) &&
            (identical(other.uniqueViews, uniqueViews) ||
                other.uniqueViews == uniqueViews));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, date, views, uniqueViews);

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AnalyticsSnapshotImplCopyWith<_$AnalyticsSnapshotImpl> get copyWith =>
      __$$AnalyticsSnapshotImplCopyWithImpl<_$AnalyticsSnapshotImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AnalyticsSnapshotImplToJson(this);
  }
}

abstract class _AnalyticsSnapshot implements AnalyticsSnapshot {
  const factory _AnalyticsSnapshot({
    required final DateTime date,
    required final int views,
    required final int uniqueViews,
  }) = _$AnalyticsSnapshotImpl;

  factory _AnalyticsSnapshot.fromJson(Map<String, dynamic> json) =
      _$AnalyticsSnapshotImpl.fromJson;

  @override
  DateTime get date;
  @override
  int get views;
  @override
  int get uniqueViews;

  /// Create a copy of AnalyticsSnapshot
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AnalyticsSnapshotImplCopyWith<_$AnalyticsSnapshotImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

AnalyticsRealtime _$AnalyticsRealtimeFromJson(Map<String, dynamic> json) {
  return _AnalyticsRealtime.fromJson(json);
}

/// @nodoc
mixin _$AnalyticsRealtime {
  int get todayViews => throw _privateConstructorUsedError;
  int get todayUniqueViews => throw _privateConstructorUsedError;
  int get totalFollowers => throw _privateConstructorUsedError;
  int get totalSoftCircle => throw _privateConstructorUsedError;
  int get softCircleCount => throw _privateConstructorUsedError;
  int get applicationCount => throw _privateConstructorUsedError;
  int get pendingApplications => throw _privateConstructorUsedError;
  int get tractionScore => throw _privateConstructorUsedError;

  /// Serializes this AnalyticsRealtime to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AnalyticsRealtime
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AnalyticsRealtimeCopyWith<AnalyticsRealtime> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AnalyticsRealtimeCopyWith<$Res> {
  factory $AnalyticsRealtimeCopyWith(
    AnalyticsRealtime value,
    $Res Function(AnalyticsRealtime) then,
  ) = _$AnalyticsRealtimeCopyWithImpl<$Res, AnalyticsRealtime>;
  @useResult
  $Res call({
    int todayViews,
    int todayUniqueViews,
    int totalFollowers,
    int totalSoftCircle,
    int softCircleCount,
    int applicationCount,
    int pendingApplications,
    int tractionScore,
  });
}

/// @nodoc
class _$AnalyticsRealtimeCopyWithImpl<$Res, $Val extends AnalyticsRealtime>
    implements $AnalyticsRealtimeCopyWith<$Res> {
  _$AnalyticsRealtimeCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AnalyticsRealtime
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? todayViews = null,
    Object? todayUniqueViews = null,
    Object? totalFollowers = null,
    Object? totalSoftCircle = null,
    Object? softCircleCount = null,
    Object? applicationCount = null,
    Object? pendingApplications = null,
    Object? tractionScore = null,
  }) {
    return _then(
      _value.copyWith(
            todayViews: null == todayViews
                ? _value.todayViews
                : todayViews // ignore: cast_nullable_to_non_nullable
                      as int,
            todayUniqueViews: null == todayUniqueViews
                ? _value.todayUniqueViews
                : todayUniqueViews // ignore: cast_nullable_to_non_nullable
                      as int,
            totalFollowers: null == totalFollowers
                ? _value.totalFollowers
                : totalFollowers // ignore: cast_nullable_to_non_nullable
                      as int,
            totalSoftCircle: null == totalSoftCircle
                ? _value.totalSoftCircle
                : totalSoftCircle // ignore: cast_nullable_to_non_nullable
                      as int,
            softCircleCount: null == softCircleCount
                ? _value.softCircleCount
                : softCircleCount // ignore: cast_nullable_to_non_nullable
                      as int,
            applicationCount: null == applicationCount
                ? _value.applicationCount
                : applicationCount // ignore: cast_nullable_to_non_nullable
                      as int,
            pendingApplications: null == pendingApplications
                ? _value.pendingApplications
                : pendingApplications // ignore: cast_nullable_to_non_nullable
                      as int,
            tractionScore: null == tractionScore
                ? _value.tractionScore
                : tractionScore // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AnalyticsRealtimeImplCopyWith<$Res>
    implements $AnalyticsRealtimeCopyWith<$Res> {
  factory _$$AnalyticsRealtimeImplCopyWith(
    _$AnalyticsRealtimeImpl value,
    $Res Function(_$AnalyticsRealtimeImpl) then,
  ) = __$$AnalyticsRealtimeImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int todayViews,
    int todayUniqueViews,
    int totalFollowers,
    int totalSoftCircle,
    int softCircleCount,
    int applicationCount,
    int pendingApplications,
    int tractionScore,
  });
}

/// @nodoc
class __$$AnalyticsRealtimeImplCopyWithImpl<$Res>
    extends _$AnalyticsRealtimeCopyWithImpl<$Res, _$AnalyticsRealtimeImpl>
    implements _$$AnalyticsRealtimeImplCopyWith<$Res> {
  __$$AnalyticsRealtimeImplCopyWithImpl(
    _$AnalyticsRealtimeImpl _value,
    $Res Function(_$AnalyticsRealtimeImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AnalyticsRealtime
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? todayViews = null,
    Object? todayUniqueViews = null,
    Object? totalFollowers = null,
    Object? totalSoftCircle = null,
    Object? softCircleCount = null,
    Object? applicationCount = null,
    Object? pendingApplications = null,
    Object? tractionScore = null,
  }) {
    return _then(
      _$AnalyticsRealtimeImpl(
        todayViews: null == todayViews
            ? _value.todayViews
            : todayViews // ignore: cast_nullable_to_non_nullable
                  as int,
        todayUniqueViews: null == todayUniqueViews
            ? _value.todayUniqueViews
            : todayUniqueViews // ignore: cast_nullable_to_non_nullable
                  as int,
        totalFollowers: null == totalFollowers
            ? _value.totalFollowers
            : totalFollowers // ignore: cast_nullable_to_non_nullable
                  as int,
        totalSoftCircle: null == totalSoftCircle
            ? _value.totalSoftCircle
            : totalSoftCircle // ignore: cast_nullable_to_non_nullable
                  as int,
        softCircleCount: null == softCircleCount
            ? _value.softCircleCount
            : softCircleCount // ignore: cast_nullable_to_non_nullable
                  as int,
        applicationCount: null == applicationCount
            ? _value.applicationCount
            : applicationCount // ignore: cast_nullable_to_non_nullable
                  as int,
        pendingApplications: null == pendingApplications
            ? _value.pendingApplications
            : pendingApplications // ignore: cast_nullable_to_non_nullable
                  as int,
        tractionScore: null == tractionScore
            ? _value.tractionScore
            : tractionScore // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AnalyticsRealtimeImpl implements _AnalyticsRealtime {
  const _$AnalyticsRealtimeImpl({
    required this.todayViews,
    required this.todayUniqueViews,
    required this.totalFollowers,
    required this.totalSoftCircle,
    required this.softCircleCount,
    required this.applicationCount,
    required this.pendingApplications,
    required this.tractionScore,
  });

  factory _$AnalyticsRealtimeImpl.fromJson(Map<String, dynamic> json) =>
      _$$AnalyticsRealtimeImplFromJson(json);

  @override
  final int todayViews;
  @override
  final int todayUniqueViews;
  @override
  final int totalFollowers;
  @override
  final int totalSoftCircle;
  @override
  final int softCircleCount;
  @override
  final int applicationCount;
  @override
  final int pendingApplications;
  @override
  final int tractionScore;

  @override
  String toString() {
    return 'AnalyticsRealtime(todayViews: $todayViews, todayUniqueViews: $todayUniqueViews, totalFollowers: $totalFollowers, totalSoftCircle: $totalSoftCircle, softCircleCount: $softCircleCount, applicationCount: $applicationCount, pendingApplications: $pendingApplications, tractionScore: $tractionScore)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AnalyticsRealtimeImpl &&
            (identical(other.todayViews, todayViews) ||
                other.todayViews == todayViews) &&
            (identical(other.todayUniqueViews, todayUniqueViews) ||
                other.todayUniqueViews == todayUniqueViews) &&
            (identical(other.totalFollowers, totalFollowers) ||
                other.totalFollowers == totalFollowers) &&
            (identical(other.totalSoftCircle, totalSoftCircle) ||
                other.totalSoftCircle == totalSoftCircle) &&
            (identical(other.softCircleCount, softCircleCount) ||
                other.softCircleCount == softCircleCount) &&
            (identical(other.applicationCount, applicationCount) ||
                other.applicationCount == applicationCount) &&
            (identical(other.pendingApplications, pendingApplications) ||
                other.pendingApplications == pendingApplications) &&
            (identical(other.tractionScore, tractionScore) ||
                other.tractionScore == tractionScore));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    todayViews,
    todayUniqueViews,
    totalFollowers,
    totalSoftCircle,
    softCircleCount,
    applicationCount,
    pendingApplications,
    tractionScore,
  );

  /// Create a copy of AnalyticsRealtime
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AnalyticsRealtimeImplCopyWith<_$AnalyticsRealtimeImpl> get copyWith =>
      __$$AnalyticsRealtimeImplCopyWithImpl<_$AnalyticsRealtimeImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$AnalyticsRealtimeImplToJson(this);
  }
}

abstract class _AnalyticsRealtime implements AnalyticsRealtime {
  const factory _AnalyticsRealtime({
    required final int todayViews,
    required final int todayUniqueViews,
    required final int totalFollowers,
    required final int totalSoftCircle,
    required final int softCircleCount,
    required final int applicationCount,
    required final int pendingApplications,
    required final int tractionScore,
  }) = _$AnalyticsRealtimeImpl;

  factory _AnalyticsRealtime.fromJson(Map<String, dynamic> json) =
      _$AnalyticsRealtimeImpl.fromJson;

  @override
  int get todayViews;
  @override
  int get todayUniqueViews;
  @override
  int get totalFollowers;
  @override
  int get totalSoftCircle;
  @override
  int get softCircleCount;
  @override
  int get applicationCount;
  @override
  int get pendingApplications;
  @override
  int get tractionScore;

  /// Create a copy of AnalyticsRealtime
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AnalyticsRealtimeImplCopyWith<_$AnalyticsRealtimeImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
