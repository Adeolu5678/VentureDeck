// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

NotificationPreferences _$NotificationPreferencesFromJson(
  Map<String, dynamic> json,
) {
  return _NotificationPreferences.fromJson(json);
}

/// @nodoc
mixin _$NotificationPreferences {
  bool get email => throw _privateConstructorUsedError;
  bool get push => throw _privateConstructorUsedError;
  DigestFrequency get digestFrequency => throw _privateConstructorUsedError;
  int? get digestDay => throw _privateConstructorUsedError;

  /// Serializes this NotificationPreferences to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of NotificationPreferences
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $NotificationPreferencesCopyWith<NotificationPreferences> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $NotificationPreferencesCopyWith<$Res> {
  factory $NotificationPreferencesCopyWith(
    NotificationPreferences value,
    $Res Function(NotificationPreferences) then,
  ) = _$NotificationPreferencesCopyWithImpl<$Res, NotificationPreferences>;
  @useResult
  $Res call({
    bool email,
    bool push,
    DigestFrequency digestFrequency,
    int? digestDay,
  });
}

/// @nodoc
class _$NotificationPreferencesCopyWithImpl<
  $Res,
  $Val extends NotificationPreferences
>
    implements $NotificationPreferencesCopyWith<$Res> {
  _$NotificationPreferencesCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of NotificationPreferences
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? email = null,
    Object? push = null,
    Object? digestFrequency = null,
    Object? digestDay = freezed,
  }) {
    return _then(
      _value.copyWith(
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as bool,
            push: null == push
                ? _value.push
                : push // ignore: cast_nullable_to_non_nullable
                      as bool,
            digestFrequency: null == digestFrequency
                ? _value.digestFrequency
                : digestFrequency // ignore: cast_nullable_to_non_nullable
                      as DigestFrequency,
            digestDay: freezed == digestDay
                ? _value.digestDay
                : digestDay // ignore: cast_nullable_to_non_nullable
                      as int?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$NotificationPreferencesImplCopyWith<$Res>
    implements $NotificationPreferencesCopyWith<$Res> {
  factory _$$NotificationPreferencesImplCopyWith(
    _$NotificationPreferencesImpl value,
    $Res Function(_$NotificationPreferencesImpl) then,
  ) = __$$NotificationPreferencesImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    bool email,
    bool push,
    DigestFrequency digestFrequency,
    int? digestDay,
  });
}

/// @nodoc
class __$$NotificationPreferencesImplCopyWithImpl<$Res>
    extends
        _$NotificationPreferencesCopyWithImpl<
          $Res,
          _$NotificationPreferencesImpl
        >
    implements _$$NotificationPreferencesImplCopyWith<$Res> {
  __$$NotificationPreferencesImplCopyWithImpl(
    _$NotificationPreferencesImpl _value,
    $Res Function(_$NotificationPreferencesImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of NotificationPreferences
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? email = null,
    Object? push = null,
    Object? digestFrequency = null,
    Object? digestDay = freezed,
  }) {
    return _then(
      _$NotificationPreferencesImpl(
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as bool,
        push: null == push
            ? _value.push
            : push // ignore: cast_nullable_to_non_nullable
                  as bool,
        digestFrequency: null == digestFrequency
            ? _value.digestFrequency
            : digestFrequency // ignore: cast_nullable_to_non_nullable
                  as DigestFrequency,
        digestDay: freezed == digestDay
            ? _value.digestDay
            : digestDay // ignore: cast_nullable_to_non_nullable
                  as int?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$NotificationPreferencesImpl implements _NotificationPreferences {
  const _$NotificationPreferencesImpl({
    this.email = true,
    this.push = true,
    this.digestFrequency = DigestFrequency.daily,
    this.digestDay,
  });

  factory _$NotificationPreferencesImpl.fromJson(Map<String, dynamic> json) =>
      _$$NotificationPreferencesImplFromJson(json);

  @override
  @JsonKey()
  final bool email;
  @override
  @JsonKey()
  final bool push;
  @override
  @JsonKey()
  final DigestFrequency digestFrequency;
  @override
  final int? digestDay;

  @override
  String toString() {
    return 'NotificationPreferences(email: $email, push: $push, digestFrequency: $digestFrequency, digestDay: $digestDay)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$NotificationPreferencesImpl &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.push, push) || other.push == push) &&
            (identical(other.digestFrequency, digestFrequency) ||
                other.digestFrequency == digestFrequency) &&
            (identical(other.digestDay, digestDay) ||
                other.digestDay == digestDay));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, email, push, digestFrequency, digestDay);

  /// Create a copy of NotificationPreferences
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$NotificationPreferencesImplCopyWith<_$NotificationPreferencesImpl>
  get copyWith =>
      __$$NotificationPreferencesImplCopyWithImpl<
        _$NotificationPreferencesImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$NotificationPreferencesImplToJson(this);
  }
}

abstract class _NotificationPreferences implements NotificationPreferences {
  const factory _NotificationPreferences({
    final bool email,
    final bool push,
    final DigestFrequency digestFrequency,
    final int? digestDay,
  }) = _$NotificationPreferencesImpl;

  factory _NotificationPreferences.fromJson(Map<String, dynamic> json) =
      _$NotificationPreferencesImpl.fromJson;

  @override
  bool get email;
  @override
  bool get push;
  @override
  DigestFrequency get digestFrequency;
  @override
  int? get digestDay;

  /// Create a copy of NotificationPreferences
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$NotificationPreferencesImplCopyWith<_$NotificationPreferencesImpl>
  get copyWith => throw _privateConstructorUsedError;
}

PrivacySettings _$PrivacySettingsFromJson(Map<String, dynamic> json) {
  return _PrivacySettings.fromJson(json);
}

/// @nodoc
mixin _$PrivacySettings {
  ProfileVisibility get profileVisibility => throw _privateConstructorUsedError;

  /// Serializes this PrivacySettings to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrivacySettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrivacySettingsCopyWith<PrivacySettings> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrivacySettingsCopyWith<$Res> {
  factory $PrivacySettingsCopyWith(
    PrivacySettings value,
    $Res Function(PrivacySettings) then,
  ) = _$PrivacySettingsCopyWithImpl<$Res, PrivacySettings>;
  @useResult
  $Res call({ProfileVisibility profileVisibility});
}

/// @nodoc
class _$PrivacySettingsCopyWithImpl<$Res, $Val extends PrivacySettings>
    implements $PrivacySettingsCopyWith<$Res> {
  _$PrivacySettingsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrivacySettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? profileVisibility = null}) {
    return _then(
      _value.copyWith(
            profileVisibility: null == profileVisibility
                ? _value.profileVisibility
                : profileVisibility // ignore: cast_nullable_to_non_nullable
                      as ProfileVisibility,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PrivacySettingsImplCopyWith<$Res>
    implements $PrivacySettingsCopyWith<$Res> {
  factory _$$PrivacySettingsImplCopyWith(
    _$PrivacySettingsImpl value,
    $Res Function(_$PrivacySettingsImpl) then,
  ) = __$$PrivacySettingsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({ProfileVisibility profileVisibility});
}

/// @nodoc
class __$$PrivacySettingsImplCopyWithImpl<$Res>
    extends _$PrivacySettingsCopyWithImpl<$Res, _$PrivacySettingsImpl>
    implements _$$PrivacySettingsImplCopyWith<$Res> {
  __$$PrivacySettingsImplCopyWithImpl(
    _$PrivacySettingsImpl _value,
    $Res Function(_$PrivacySettingsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrivacySettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? profileVisibility = null}) {
    return _then(
      _$PrivacySettingsImpl(
        profileVisibility: null == profileVisibility
            ? _value.profileVisibility
            : profileVisibility // ignore: cast_nullable_to_non_nullable
                  as ProfileVisibility,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrivacySettingsImpl implements _PrivacySettings {
  const _$PrivacySettingsImpl({
    this.profileVisibility = ProfileVisibility.public,
  });

  factory _$PrivacySettingsImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrivacySettingsImplFromJson(json);

  @override
  @JsonKey()
  final ProfileVisibility profileVisibility;

  @override
  String toString() {
    return 'PrivacySettings(profileVisibility: $profileVisibility)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrivacySettingsImpl &&
            (identical(other.profileVisibility, profileVisibility) ||
                other.profileVisibility == profileVisibility));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, profileVisibility);

  /// Create a copy of PrivacySettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrivacySettingsImplCopyWith<_$PrivacySettingsImpl> get copyWith =>
      __$$PrivacySettingsImplCopyWithImpl<_$PrivacySettingsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$PrivacySettingsImplToJson(this);
  }
}

abstract class _PrivacySettings implements PrivacySettings {
  const factory _PrivacySettings({final ProfileVisibility profileVisibility}) =
      _$PrivacySettingsImpl;

  factory _PrivacySettings.fromJson(Map<String, dynamic> json) =
      _$PrivacySettingsImpl.fromJson;

  @override
  ProfileVisibility get profileVisibility;

  /// Create a copy of PrivacySettings
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrivacySettingsImplCopyWith<_$PrivacySettingsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InvestmentRange _$InvestmentRangeFromJson(Map<String, dynamic> json) {
  return _InvestmentRange.fromJson(json);
}

/// @nodoc
mixin _$InvestmentRange {
  double get min => throw _privateConstructorUsedError;
  double get max => throw _privateConstructorUsedError;

  /// Serializes this InvestmentRange to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InvestmentRange
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InvestmentRangeCopyWith<InvestmentRange> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InvestmentRangeCopyWith<$Res> {
  factory $InvestmentRangeCopyWith(
    InvestmentRange value,
    $Res Function(InvestmentRange) then,
  ) = _$InvestmentRangeCopyWithImpl<$Res, InvestmentRange>;
  @useResult
  $Res call({double min, double max});
}

/// @nodoc
class _$InvestmentRangeCopyWithImpl<$Res, $Val extends InvestmentRange>
    implements $InvestmentRangeCopyWith<$Res> {
  _$InvestmentRangeCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InvestmentRange
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? min = null, Object? max = null}) {
    return _then(
      _value.copyWith(
            min: null == min
                ? _value.min
                : min // ignore: cast_nullable_to_non_nullable
                      as double,
            max: null == max
                ? _value.max
                : max // ignore: cast_nullable_to_non_nullable
                      as double,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InvestmentRangeImplCopyWith<$Res>
    implements $InvestmentRangeCopyWith<$Res> {
  factory _$$InvestmentRangeImplCopyWith(
    _$InvestmentRangeImpl value,
    $Res Function(_$InvestmentRangeImpl) then,
  ) = __$$InvestmentRangeImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({double min, double max});
}

/// @nodoc
class __$$InvestmentRangeImplCopyWithImpl<$Res>
    extends _$InvestmentRangeCopyWithImpl<$Res, _$InvestmentRangeImpl>
    implements _$$InvestmentRangeImplCopyWith<$Res> {
  __$$InvestmentRangeImplCopyWithImpl(
    _$InvestmentRangeImpl _value,
    $Res Function(_$InvestmentRangeImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InvestmentRange
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? min = null, Object? max = null}) {
    return _then(
      _$InvestmentRangeImpl(
        min: null == min
            ? _value.min
            : min // ignore: cast_nullable_to_non_nullable
                  as double,
        max: null == max
            ? _value.max
            : max // ignore: cast_nullable_to_non_nullable
                  as double,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InvestmentRangeImpl implements _InvestmentRange {
  const _$InvestmentRangeImpl({required this.min, required this.max});

  factory _$InvestmentRangeImpl.fromJson(Map<String, dynamic> json) =>
      _$$InvestmentRangeImplFromJson(json);

  @override
  final double min;
  @override
  final double max;

  @override
  String toString() {
    return 'InvestmentRange(min: $min, max: $max)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InvestmentRangeImpl &&
            (identical(other.min, min) || other.min == min) &&
            (identical(other.max, max) || other.max == max));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, min, max);

  /// Create a copy of InvestmentRange
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InvestmentRangeImplCopyWith<_$InvestmentRangeImpl> get copyWith =>
      __$$InvestmentRangeImplCopyWithImpl<_$InvestmentRangeImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InvestmentRangeImplToJson(this);
  }
}

abstract class _InvestmentRange implements InvestmentRange {
  const factory _InvestmentRange({
    required final double min,
    required final double max,
  }) = _$InvestmentRangeImpl;

  factory _InvestmentRange.fromJson(Map<String, dynamic> json) =
      _$InvestmentRangeImpl.fromJson;

  @override
  double get min;
  @override
  double get max;

  /// Create a copy of InvestmentRange
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InvestmentRangeImplCopyWith<_$InvestmentRangeImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InvestorThesis _$InvestorThesisFromJson(Map<String, dynamic> json) {
  return _InvestorThesis.fromJson(json);
}

/// @nodoc
mixin _$InvestorThesis {
  List<String>? get preferredIndustries => throw _privateConstructorUsedError;
  List<String>? get preferredStages => throw _privateConstructorUsedError;
  String? get thesisDescription => throw _privateConstructorUsedError;
  String? get geographicPreference => throw _privateConstructorUsedError;
  int? get minTractionScore => throw _privateConstructorUsedError;

  /// Serializes this InvestorThesis to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InvestorThesis
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InvestorThesisCopyWith<InvestorThesis> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InvestorThesisCopyWith<$Res> {
  factory $InvestorThesisCopyWith(
    InvestorThesis value,
    $Res Function(InvestorThesis) then,
  ) = _$InvestorThesisCopyWithImpl<$Res, InvestorThesis>;
  @useResult
  $Res call({
    List<String>? preferredIndustries,
    List<String>? preferredStages,
    String? thesisDescription,
    String? geographicPreference,
    int? minTractionScore,
  });
}

/// @nodoc
class _$InvestorThesisCopyWithImpl<$Res, $Val extends InvestorThesis>
    implements $InvestorThesisCopyWith<$Res> {
  _$InvestorThesisCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InvestorThesis
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? preferredIndustries = freezed,
    Object? preferredStages = freezed,
    Object? thesisDescription = freezed,
    Object? geographicPreference = freezed,
    Object? minTractionScore = freezed,
  }) {
    return _then(
      _value.copyWith(
            preferredIndustries: freezed == preferredIndustries
                ? _value.preferredIndustries
                : preferredIndustries // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            preferredStages: freezed == preferredStages
                ? _value.preferredStages
                : preferredStages // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            thesisDescription: freezed == thesisDescription
                ? _value.thesisDescription
                : thesisDescription // ignore: cast_nullable_to_non_nullable
                      as String?,
            geographicPreference: freezed == geographicPreference
                ? _value.geographicPreference
                : geographicPreference // ignore: cast_nullable_to_non_nullable
                      as String?,
            minTractionScore: freezed == minTractionScore
                ? _value.minTractionScore
                : minTractionScore // ignore: cast_nullable_to_non_nullable
                      as int?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InvestorThesisImplCopyWith<$Res>
    implements $InvestorThesisCopyWith<$Res> {
  factory _$$InvestorThesisImplCopyWith(
    _$InvestorThesisImpl value,
    $Res Function(_$InvestorThesisImpl) then,
  ) = __$$InvestorThesisImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    List<String>? preferredIndustries,
    List<String>? preferredStages,
    String? thesisDescription,
    String? geographicPreference,
    int? minTractionScore,
  });
}

/// @nodoc
class __$$InvestorThesisImplCopyWithImpl<$Res>
    extends _$InvestorThesisCopyWithImpl<$Res, _$InvestorThesisImpl>
    implements _$$InvestorThesisImplCopyWith<$Res> {
  __$$InvestorThesisImplCopyWithImpl(
    _$InvestorThesisImpl _value,
    $Res Function(_$InvestorThesisImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InvestorThesis
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? preferredIndustries = freezed,
    Object? preferredStages = freezed,
    Object? thesisDescription = freezed,
    Object? geographicPreference = freezed,
    Object? minTractionScore = freezed,
  }) {
    return _then(
      _$InvestorThesisImpl(
        preferredIndustries: freezed == preferredIndustries
            ? _value._preferredIndustries
            : preferredIndustries // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        preferredStages: freezed == preferredStages
            ? _value._preferredStages
            : preferredStages // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        thesisDescription: freezed == thesisDescription
            ? _value.thesisDescription
            : thesisDescription // ignore: cast_nullable_to_non_nullable
                  as String?,
        geographicPreference: freezed == geographicPreference
            ? _value.geographicPreference
            : geographicPreference // ignore: cast_nullable_to_non_nullable
                  as String?,
        minTractionScore: freezed == minTractionScore
            ? _value.minTractionScore
            : minTractionScore // ignore: cast_nullable_to_non_nullable
                  as int?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InvestorThesisImpl implements _InvestorThesis {
  const _$InvestorThesisImpl({
    final List<String>? preferredIndustries,
    final List<String>? preferredStages,
    this.thesisDescription,
    this.geographicPreference,
    this.minTractionScore,
  }) : _preferredIndustries = preferredIndustries,
       _preferredStages = preferredStages;

  factory _$InvestorThesisImpl.fromJson(Map<String, dynamic> json) =>
      _$$InvestorThesisImplFromJson(json);

  final List<String>? _preferredIndustries;
  @override
  List<String>? get preferredIndustries {
    final value = _preferredIndustries;
    if (value == null) return null;
    if (_preferredIndustries is EqualUnmodifiableListView)
      return _preferredIndustries;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _preferredStages;
  @override
  List<String>? get preferredStages {
    final value = _preferredStages;
    if (value == null) return null;
    if (_preferredStages is EqualUnmodifiableListView) return _preferredStages;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? thesisDescription;
  @override
  final String? geographicPreference;
  @override
  final int? minTractionScore;

  @override
  String toString() {
    return 'InvestorThesis(preferredIndustries: $preferredIndustries, preferredStages: $preferredStages, thesisDescription: $thesisDescription, geographicPreference: $geographicPreference, minTractionScore: $minTractionScore)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InvestorThesisImpl &&
            const DeepCollectionEquality().equals(
              other._preferredIndustries,
              _preferredIndustries,
            ) &&
            const DeepCollectionEquality().equals(
              other._preferredStages,
              _preferredStages,
            ) &&
            (identical(other.thesisDescription, thesisDescription) ||
                other.thesisDescription == thesisDescription) &&
            (identical(other.geographicPreference, geographicPreference) ||
                other.geographicPreference == geographicPreference) &&
            (identical(other.minTractionScore, minTractionScore) ||
                other.minTractionScore == minTractionScore));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_preferredIndustries),
    const DeepCollectionEquality().hash(_preferredStages),
    thesisDescription,
    geographicPreference,
    minTractionScore,
  );

  /// Create a copy of InvestorThesis
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InvestorThesisImplCopyWith<_$InvestorThesisImpl> get copyWith =>
      __$$InvestorThesisImplCopyWithImpl<_$InvestorThesisImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InvestorThesisImplToJson(this);
  }
}

abstract class _InvestorThesis implements InvestorThesis {
  const factory _InvestorThesis({
    final List<String>? preferredIndustries,
    final List<String>? preferredStages,
    final String? thesisDescription,
    final String? geographicPreference,
    final int? minTractionScore,
  }) = _$InvestorThesisImpl;

  factory _InvestorThesis.fromJson(Map<String, dynamic> json) =
      _$InvestorThesisImpl.fromJson;

  @override
  List<String>? get preferredIndustries;
  @override
  List<String>? get preferredStages;
  @override
  String? get thesisDescription;
  @override
  String? get geographicPreference;
  @override
  int? get minTractionScore;

  /// Create a copy of InvestorThesis
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InvestorThesisImplCopyWith<_$InvestorThesisImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

User _$UserFromJson(Map<String, dynamic> json) {
  return _User.fromJson(json);
}

/// @nodoc
mixin _$User {
  String get id => throw _privateConstructorUsedError;
  String get clerkId => throw _privateConstructorUsedError;
  String get username => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  UserRole? get role => throw _privateConstructorUsedError;
  String? get displayName => throw _privateConstructorUsedError;
  String? get professionalBio => throw _privateConstructorUsedError;
  String? get location => throw _privateConstructorUsedError;
  String? get company => throw _privateConstructorUsedError;
  String? get website => throw _privateConstructorUsedError;
  String? get linkedin => throw _privateConstructorUsedError;
  String? get twitter => throw _privateConstructorUsedError;
  String? get linkedinUrl => throw _privateConstructorUsedError;
  String? get githubUrl => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;
  bool get isAdmin => throw _privateConstructorUsedError;
  List<String> get skills => throw _privateConstructorUsedError;
  List<String> get interests => throw _privateConstructorUsedError;
  List<String> get tags => throw _privateConstructorUsedError;
  NotificationPreferences? get notificationPreferences =>
      throw _privateConstructorUsedError;
  PrivacySettings? get privacySettings => throw _privateConstructorUsedError;
  InvestmentRange? get investmentRange => throw _privateConstructorUsedError;
  InvestorThesis? get investorThesis => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this User to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserCopyWith<User> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserCopyWith<$Res> {
  factory $UserCopyWith(User value, $Res Function(User) then) =
      _$UserCopyWithImpl<$Res, User>;
  @useResult
  $Res call({
    String id,
    String clerkId,
    String username,
    String email,
    String? firstName,
    String? lastName,
    String? avatarUrl,
    UserRole? role,
    String? displayName,
    String? professionalBio,
    String? location,
    String? company,
    String? website,
    String? linkedin,
    String? twitter,
    String? linkedinUrl,
    String? githubUrl,
    bool isVerified,
    bool isAdmin,
    List<String> skills,
    List<String> interests,
    List<String> tags,
    NotificationPreferences? notificationPreferences,
    PrivacySettings? privacySettings,
    InvestmentRange? investmentRange,
    InvestorThesis? investorThesis,
    DateTime createdAt,
    DateTime updatedAt,
  });

  $NotificationPreferencesCopyWith<$Res>? get notificationPreferences;
  $PrivacySettingsCopyWith<$Res>? get privacySettings;
  $InvestmentRangeCopyWith<$Res>? get investmentRange;
  $InvestorThesisCopyWith<$Res>? get investorThesis;
}

/// @nodoc
class _$UserCopyWithImpl<$Res, $Val extends User>
    implements $UserCopyWith<$Res> {
  _$UserCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? clerkId = null,
    Object? username = null,
    Object? email = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
    Object? role = freezed,
    Object? displayName = freezed,
    Object? professionalBio = freezed,
    Object? location = freezed,
    Object? company = freezed,
    Object? website = freezed,
    Object? linkedin = freezed,
    Object? twitter = freezed,
    Object? linkedinUrl = freezed,
    Object? githubUrl = freezed,
    Object? isVerified = null,
    Object? isAdmin = null,
    Object? skills = null,
    Object? interests = null,
    Object? tags = null,
    Object? notificationPreferences = freezed,
    Object? privacySettings = freezed,
    Object? investmentRange = freezed,
    Object? investorThesis = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            clerkId: null == clerkId
                ? _value.clerkId
                : clerkId // ignore: cast_nullable_to_non_nullable
                      as String,
            username: null == username
                ? _value.username
                : username // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            firstName: freezed == firstName
                ? _value.firstName
                : firstName // ignore: cast_nullable_to_non_nullable
                      as String?,
            lastName: freezed == lastName
                ? _value.lastName
                : lastName // ignore: cast_nullable_to_non_nullable
                      as String?,
            avatarUrl: freezed == avatarUrl
                ? _value.avatarUrl
                : avatarUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            role: freezed == role
                ? _value.role
                : role // ignore: cast_nullable_to_non_nullable
                      as UserRole?,
            displayName: freezed == displayName
                ? _value.displayName
                : displayName // ignore: cast_nullable_to_non_nullable
                      as String?,
            professionalBio: freezed == professionalBio
                ? _value.professionalBio
                : professionalBio // ignore: cast_nullable_to_non_nullable
                      as String?,
            location: freezed == location
                ? _value.location
                : location // ignore: cast_nullable_to_non_nullable
                      as String?,
            company: freezed == company
                ? _value.company
                : company // ignore: cast_nullable_to_non_nullable
                      as String?,
            website: freezed == website
                ? _value.website
                : website // ignore: cast_nullable_to_non_nullable
                      as String?,
            linkedin: freezed == linkedin
                ? _value.linkedin
                : linkedin // ignore: cast_nullable_to_non_nullable
                      as String?,
            twitter: freezed == twitter
                ? _value.twitter
                : twitter // ignore: cast_nullable_to_non_nullable
                      as String?,
            linkedinUrl: freezed == linkedinUrl
                ? _value.linkedinUrl
                : linkedinUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            githubUrl: freezed == githubUrl
                ? _value.githubUrl
                : githubUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            isVerified: null == isVerified
                ? _value.isVerified
                : isVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            isAdmin: null == isAdmin
                ? _value.isAdmin
                : isAdmin // ignore: cast_nullable_to_non_nullable
                      as bool,
            skills: null == skills
                ? _value.skills
                : skills // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            interests: null == interests
                ? _value.interests
                : interests // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            tags: null == tags
                ? _value.tags
                : tags // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            notificationPreferences: freezed == notificationPreferences
                ? _value.notificationPreferences
                : notificationPreferences // ignore: cast_nullable_to_non_nullable
                      as NotificationPreferences?,
            privacySettings: freezed == privacySettings
                ? _value.privacySettings
                : privacySettings // ignore: cast_nullable_to_non_nullable
                      as PrivacySettings?,
            investmentRange: freezed == investmentRange
                ? _value.investmentRange
                : investmentRange // ignore: cast_nullable_to_non_nullable
                      as InvestmentRange?,
            investorThesis: freezed == investorThesis
                ? _value.investorThesis
                : investorThesis // ignore: cast_nullable_to_non_nullable
                      as InvestorThesis?,
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

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $NotificationPreferencesCopyWith<$Res>? get notificationPreferences {
    if (_value.notificationPreferences == null) {
      return null;
    }

    return $NotificationPreferencesCopyWith<$Res>(
      _value.notificationPreferences!,
      (value) {
        return _then(_value.copyWith(notificationPreferences: value) as $Val);
      },
    );
  }

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PrivacySettingsCopyWith<$Res>? get privacySettings {
    if (_value.privacySettings == null) {
      return null;
    }

    return $PrivacySettingsCopyWith<$Res>(_value.privacySettings!, (value) {
      return _then(_value.copyWith(privacySettings: value) as $Val);
    });
  }

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $InvestmentRangeCopyWith<$Res>? get investmentRange {
    if (_value.investmentRange == null) {
      return null;
    }

    return $InvestmentRangeCopyWith<$Res>(_value.investmentRange!, (value) {
      return _then(_value.copyWith(investmentRange: value) as $Val);
    });
  }

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $InvestorThesisCopyWith<$Res>? get investorThesis {
    if (_value.investorThesis == null) {
      return null;
    }

    return $InvestorThesisCopyWith<$Res>(_value.investorThesis!, (value) {
      return _then(_value.copyWith(investorThesis: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$UserImplCopyWith<$Res> implements $UserCopyWith<$Res> {
  factory _$$UserImplCopyWith(
    _$UserImpl value,
    $Res Function(_$UserImpl) then,
  ) = __$$UserImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String clerkId,
    String username,
    String email,
    String? firstName,
    String? lastName,
    String? avatarUrl,
    UserRole? role,
    String? displayName,
    String? professionalBio,
    String? location,
    String? company,
    String? website,
    String? linkedin,
    String? twitter,
    String? linkedinUrl,
    String? githubUrl,
    bool isVerified,
    bool isAdmin,
    List<String> skills,
    List<String> interests,
    List<String> tags,
    NotificationPreferences? notificationPreferences,
    PrivacySettings? privacySettings,
    InvestmentRange? investmentRange,
    InvestorThesis? investorThesis,
    DateTime createdAt,
    DateTime updatedAt,
  });

  @override
  $NotificationPreferencesCopyWith<$Res>? get notificationPreferences;
  @override
  $PrivacySettingsCopyWith<$Res>? get privacySettings;
  @override
  $InvestmentRangeCopyWith<$Res>? get investmentRange;
  @override
  $InvestorThesisCopyWith<$Res>? get investorThesis;
}

/// @nodoc
class __$$UserImplCopyWithImpl<$Res>
    extends _$UserCopyWithImpl<$Res, _$UserImpl>
    implements _$$UserImplCopyWith<$Res> {
  __$$UserImplCopyWithImpl(_$UserImpl _value, $Res Function(_$UserImpl) _then)
    : super(_value, _then);

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? clerkId = null,
    Object? username = null,
    Object? email = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
    Object? role = freezed,
    Object? displayName = freezed,
    Object? professionalBio = freezed,
    Object? location = freezed,
    Object? company = freezed,
    Object? website = freezed,
    Object? linkedin = freezed,
    Object? twitter = freezed,
    Object? linkedinUrl = freezed,
    Object? githubUrl = freezed,
    Object? isVerified = null,
    Object? isAdmin = null,
    Object? skills = null,
    Object? interests = null,
    Object? tags = null,
    Object? notificationPreferences = freezed,
    Object? privacySettings = freezed,
    Object? investmentRange = freezed,
    Object? investorThesis = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$UserImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        clerkId: null == clerkId
            ? _value.clerkId
            : clerkId // ignore: cast_nullable_to_non_nullable
                  as String,
        username: null == username
            ? _value.username
            : username // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        firstName: freezed == firstName
            ? _value.firstName
            : firstName // ignore: cast_nullable_to_non_nullable
                  as String?,
        lastName: freezed == lastName
            ? _value.lastName
            : lastName // ignore: cast_nullable_to_non_nullable
                  as String?,
        avatarUrl: freezed == avatarUrl
            ? _value.avatarUrl
            : avatarUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        role: freezed == role
            ? _value.role
            : role // ignore: cast_nullable_to_non_nullable
                  as UserRole?,
        displayName: freezed == displayName
            ? _value.displayName
            : displayName // ignore: cast_nullable_to_non_nullable
                  as String?,
        professionalBio: freezed == professionalBio
            ? _value.professionalBio
            : professionalBio // ignore: cast_nullable_to_non_nullable
                  as String?,
        location: freezed == location
            ? _value.location
            : location // ignore: cast_nullable_to_non_nullable
                  as String?,
        company: freezed == company
            ? _value.company
            : company // ignore: cast_nullable_to_non_nullable
                  as String?,
        website: freezed == website
            ? _value.website
            : website // ignore: cast_nullable_to_non_nullable
                  as String?,
        linkedin: freezed == linkedin
            ? _value.linkedin
            : linkedin // ignore: cast_nullable_to_non_nullable
                  as String?,
        twitter: freezed == twitter
            ? _value.twitter
            : twitter // ignore: cast_nullable_to_non_nullable
                  as String?,
        linkedinUrl: freezed == linkedinUrl
            ? _value.linkedinUrl
            : linkedinUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        githubUrl: freezed == githubUrl
            ? _value.githubUrl
            : githubUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        isVerified: null == isVerified
            ? _value.isVerified
            : isVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        isAdmin: null == isAdmin
            ? _value.isAdmin
            : isAdmin // ignore: cast_nullable_to_non_nullable
                  as bool,
        skills: null == skills
            ? _value._skills
            : skills // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        interests: null == interests
            ? _value._interests
            : interests // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        tags: null == tags
            ? _value._tags
            : tags // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        notificationPreferences: freezed == notificationPreferences
            ? _value.notificationPreferences
            : notificationPreferences // ignore: cast_nullable_to_non_nullable
                  as NotificationPreferences?,
        privacySettings: freezed == privacySettings
            ? _value.privacySettings
            : privacySettings // ignore: cast_nullable_to_non_nullable
                  as PrivacySettings?,
        investmentRange: freezed == investmentRange
            ? _value.investmentRange
            : investmentRange // ignore: cast_nullable_to_non_nullable
                  as InvestmentRange?,
        investorThesis: freezed == investorThesis
            ? _value.investorThesis
            : investorThesis // ignore: cast_nullable_to_non_nullable
                  as InvestorThesis?,
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
class _$UserImpl extends _User {
  const _$UserImpl({
    required this.id,
    required this.clerkId,
    required this.username,
    required this.email,
    this.firstName,
    this.lastName,
    this.avatarUrl,
    this.role,
    this.displayName,
    this.professionalBio,
    this.location,
    this.company,
    this.website,
    this.linkedin,
    this.twitter,
    this.linkedinUrl,
    this.githubUrl,
    this.isVerified = false,
    this.isAdmin = false,
    final List<String> skills = const [],
    final List<String> interests = const [],
    final List<String> tags = const [],
    this.notificationPreferences,
    this.privacySettings,
    this.investmentRange,
    this.investorThesis,
    required this.createdAt,
    required this.updatedAt,
  }) : _skills = skills,
       _interests = interests,
       _tags = tags,
       super._();

  factory _$UserImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserImplFromJson(json);

  @override
  final String id;
  @override
  final String clerkId;
  @override
  final String username;
  @override
  final String email;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? avatarUrl;
  @override
  final UserRole? role;
  @override
  final String? displayName;
  @override
  final String? professionalBio;
  @override
  final String? location;
  @override
  final String? company;
  @override
  final String? website;
  @override
  final String? linkedin;
  @override
  final String? twitter;
  @override
  final String? linkedinUrl;
  @override
  final String? githubUrl;
  @override
  @JsonKey()
  final bool isVerified;
  @override
  @JsonKey()
  final bool isAdmin;
  final List<String> _skills;
  @override
  @JsonKey()
  List<String> get skills {
    if (_skills is EqualUnmodifiableListView) return _skills;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_skills);
  }

  final List<String> _interests;
  @override
  @JsonKey()
  List<String> get interests {
    if (_interests is EqualUnmodifiableListView) return _interests;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_interests);
  }

  final List<String> _tags;
  @override
  @JsonKey()
  List<String> get tags {
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tags);
  }

  @override
  final NotificationPreferences? notificationPreferences;
  @override
  final PrivacySettings? privacySettings;
  @override
  final InvestmentRange? investmentRange;
  @override
  final InvestorThesis? investorThesis;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'User(id: $id, clerkId: $clerkId, username: $username, email: $email, firstName: $firstName, lastName: $lastName, avatarUrl: $avatarUrl, role: $role, displayName: $displayName, professionalBio: $professionalBio, location: $location, company: $company, website: $website, linkedin: $linkedin, twitter: $twitter, linkedinUrl: $linkedinUrl, githubUrl: $githubUrl, isVerified: $isVerified, isAdmin: $isAdmin, skills: $skills, interests: $interests, tags: $tags, notificationPreferences: $notificationPreferences, privacySettings: $privacySettings, investmentRange: $investmentRange, investorThesis: $investorThesis, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.clerkId, clerkId) || other.clerkId == clerkId) &&
            (identical(other.username, username) ||
                other.username == username) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.professionalBio, professionalBio) ||
                other.professionalBio == professionalBio) &&
            (identical(other.location, location) ||
                other.location == location) &&
            (identical(other.company, company) || other.company == company) &&
            (identical(other.website, website) || other.website == website) &&
            (identical(other.linkedin, linkedin) ||
                other.linkedin == linkedin) &&
            (identical(other.twitter, twitter) || other.twitter == twitter) &&
            (identical(other.linkedinUrl, linkedinUrl) ||
                other.linkedinUrl == linkedinUrl) &&
            (identical(other.githubUrl, githubUrl) ||
                other.githubUrl == githubUrl) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified) &&
            (identical(other.isAdmin, isAdmin) || other.isAdmin == isAdmin) &&
            const DeepCollectionEquality().equals(other._skills, _skills) &&
            const DeepCollectionEquality().equals(
              other._interests,
              _interests,
            ) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
            (identical(
                  other.notificationPreferences,
                  notificationPreferences,
                ) ||
                other.notificationPreferences == notificationPreferences) &&
            (identical(other.privacySettings, privacySettings) ||
                other.privacySettings == privacySettings) &&
            (identical(other.investmentRange, investmentRange) ||
                other.investmentRange == investmentRange) &&
            (identical(other.investorThesis, investorThesis) ||
                other.investorThesis == investorThesis) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    clerkId,
    username,
    email,
    firstName,
    lastName,
    avatarUrl,
    role,
    displayName,
    professionalBio,
    location,
    company,
    website,
    linkedin,
    twitter,
    linkedinUrl,
    githubUrl,
    isVerified,
    isAdmin,
    const DeepCollectionEquality().hash(_skills),
    const DeepCollectionEquality().hash(_interests),
    const DeepCollectionEquality().hash(_tags),
    notificationPreferences,
    privacySettings,
    investmentRange,
    investorThesis,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserImplCopyWith<_$UserImpl> get copyWith =>
      __$$UserImplCopyWithImpl<_$UserImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserImplToJson(this);
  }
}

abstract class _User extends User {
  const factory _User({
    required final String id,
    required final String clerkId,
    required final String username,
    required final String email,
    final String? firstName,
    final String? lastName,
    final String? avatarUrl,
    final UserRole? role,
    final String? displayName,
    final String? professionalBio,
    final String? location,
    final String? company,
    final String? website,
    final String? linkedin,
    final String? twitter,
    final String? linkedinUrl,
    final String? githubUrl,
    final bool isVerified,
    final bool isAdmin,
    final List<String> skills,
    final List<String> interests,
    final List<String> tags,
    final NotificationPreferences? notificationPreferences,
    final PrivacySettings? privacySettings,
    final InvestmentRange? investmentRange,
    final InvestorThesis? investorThesis,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$UserImpl;
  const _User._() : super._();

  factory _User.fromJson(Map<String, dynamic> json) = _$UserImpl.fromJson;

  @override
  String get id;
  @override
  String get clerkId;
  @override
  String get username;
  @override
  String get email;
  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get avatarUrl;
  @override
  UserRole? get role;
  @override
  String? get displayName;
  @override
  String? get professionalBio;
  @override
  String? get location;
  @override
  String? get company;
  @override
  String? get website;
  @override
  String? get linkedin;
  @override
  String? get twitter;
  @override
  String? get linkedinUrl;
  @override
  String? get githubUrl;
  @override
  bool get isVerified;
  @override
  bool get isAdmin;
  @override
  List<String> get skills;
  @override
  List<String> get interests;
  @override
  List<String> get tags;
  @override
  NotificationPreferences? get notificationPreferences;
  @override
  PrivacySettings? get privacySettings;
  @override
  InvestmentRange? get investmentRange;
  @override
  InvestorThesis? get investorThesis;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserImplCopyWith<_$UserImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
