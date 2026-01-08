// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$NotificationPreferencesImpl _$$NotificationPreferencesImplFromJson(
  Map<String, dynamic> json,
) => _$NotificationPreferencesImpl(
  email: json['email'] as bool? ?? true,
  push: json['push'] as bool? ?? true,
  digestFrequency:
      $enumDecodeNullable(_$DigestFrequencyEnumMap, json['digestFrequency']) ??
      DigestFrequency.daily,
  digestDay: (json['digestDay'] as num?)?.toInt(),
);

Map<String, dynamic> _$$NotificationPreferencesImplToJson(
  _$NotificationPreferencesImpl instance,
) => <String, dynamic>{
  'email': instance.email,
  'push': instance.push,
  'digestFrequency': _$DigestFrequencyEnumMap[instance.digestFrequency]!,
  'digestDay': instance.digestDay,
};

const _$DigestFrequencyEnumMap = {
  DigestFrequency.daily: 'daily',
  DigestFrequency.weekly: 'weekly',
  DigestFrequency.never: 'never',
};

_$PrivacySettingsImpl _$$PrivacySettingsImplFromJson(
  Map<String, dynamic> json,
) => _$PrivacySettingsImpl(
  profileVisibility:
      $enumDecodeNullable(
        _$ProfileVisibilityEnumMap,
        json['profileVisibility'],
      ) ??
      ProfileVisibility.public,
);

Map<String, dynamic> _$$PrivacySettingsImplToJson(
  _$PrivacySettingsImpl instance,
) => <String, dynamic>{
  'profileVisibility': _$ProfileVisibilityEnumMap[instance.profileVisibility]!,
};

const _$ProfileVisibilityEnumMap = {
  ProfileVisibility.public: 'public',
  ProfileVisibility.private: 'private',
};

_$InvestmentRangeImpl _$$InvestmentRangeImplFromJson(
  Map<String, dynamic> json,
) => _$InvestmentRangeImpl(
  min: (json['min'] as num).toDouble(),
  max: (json['max'] as num).toDouble(),
);

Map<String, dynamic> _$$InvestmentRangeImplToJson(
  _$InvestmentRangeImpl instance,
) => <String, dynamic>{'min': instance.min, 'max': instance.max};

_$InvestorThesisImpl _$$InvestorThesisImplFromJson(Map<String, dynamic> json) =>
    _$InvestorThesisImpl(
      preferredIndustries: (json['preferredIndustries'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      preferredStages: (json['preferredStages'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      thesisDescription: json['thesisDescription'] as String?,
      geographicPreference: json['geographicPreference'] as String?,
      minTractionScore: (json['minTractionScore'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$InvestorThesisImplToJson(
  _$InvestorThesisImpl instance,
) => <String, dynamic>{
  'preferredIndustries': instance.preferredIndustries,
  'preferredStages': instance.preferredStages,
  'thesisDescription': instance.thesisDescription,
  'geographicPreference': instance.geographicPreference,
  'minTractionScore': instance.minTractionScore,
};

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
  id: json['id'] as String,
  clerkId: json['clerkId'] as String,
  username: json['username'] as String,
  email: json['email'] as String,
  firstName: json['firstName'] as String?,
  lastName: json['lastName'] as String?,
  avatarUrl: json['avatarUrl'] as String?,
  role: $enumDecodeNullable(_$UserRoleEnumMap, json['role']),
  displayName: json['displayName'] as String?,
  professionalBio: json['professionalBio'] as String?,
  location: json['location'] as String?,
  company: json['company'] as String?,
  website: json['website'] as String?,
  linkedin: json['linkedin'] as String?,
  twitter: json['twitter'] as String?,
  linkedinUrl: json['linkedinUrl'] as String?,
  githubUrl: json['githubUrl'] as String?,
  isVerified: json['isVerified'] as bool? ?? false,
  isAdmin: json['isAdmin'] as bool? ?? false,
  skills:
      (json['skills'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  interests:
      (json['interests'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  tags:
      (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  notificationPreferences: json['notificationPreferences'] == null
      ? null
      : NotificationPreferences.fromJson(
          json['notificationPreferences'] as Map<String, dynamic>,
        ),
  privacySettings: json['privacySettings'] == null
      ? null
      : PrivacySettings.fromJson(
          json['privacySettings'] as Map<String, dynamic>,
        ),
  investmentRange: json['investmentRange'] == null
      ? null
      : InvestmentRange.fromJson(
          json['investmentRange'] as Map<String, dynamic>,
        ),
  investorThesis: json['investorThesis'] == null
      ? null
      : InvestorThesis.fromJson(json['investorThesis'] as Map<String, dynamic>),
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'clerkId': instance.clerkId,
      'username': instance.username,
      'email': instance.email,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'avatarUrl': instance.avatarUrl,
      'role': _$UserRoleEnumMap[instance.role],
      'displayName': instance.displayName,
      'professionalBio': instance.professionalBio,
      'location': instance.location,
      'company': instance.company,
      'website': instance.website,
      'linkedin': instance.linkedin,
      'twitter': instance.twitter,
      'linkedinUrl': instance.linkedinUrl,
      'githubUrl': instance.githubUrl,
      'isVerified': instance.isVerified,
      'isAdmin': instance.isAdmin,
      'skills': instance.skills,
      'interests': instance.interests,
      'tags': instance.tags,
      'notificationPreferences': instance.notificationPreferences,
      'privacySettings': instance.privacySettings,
      'investmentRange': instance.investmentRange,
      'investorThesis': instance.investorThesis,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$UserRoleEnumMap = {
  UserRole.entrepreneur: 'entrepreneur',
  UserRole.investor: 'investor',
};
