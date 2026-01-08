/// VentureDeck Mobile - User Model
///
/// Represents a user in the VentureDeck platform.
/// Synced with Convex backend and Clerk authentication.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

/// User role in the platform
enum UserRole {
  @JsonValue('entrepreneur')
  entrepreneur,
  @JsonValue('investor')
  investor,
}

/// Profile visibility setting
enum ProfileVisibility {
  @JsonValue('public')
  public,
  @JsonValue('private')
  private,
}

/// Digest frequency for notifications
enum DigestFrequency {
  @JsonValue('daily')
  daily,
  @JsonValue('weekly')
  weekly,
  @JsonValue('never')
  never,
}

/// Notification preferences
@freezed
class NotificationPreferences with _$NotificationPreferences {
  const factory NotificationPreferences({
    @Default(true) bool email,
    @Default(true) bool push,
    @Default(DigestFrequency.daily) DigestFrequency digestFrequency,
    int? digestDay,
  }) = _NotificationPreferences;

  factory NotificationPreferences.fromJson(Map<String, dynamic> json) =>
      _$NotificationPreferencesFromJson(json);
}

/// Privacy settings
@freezed
class PrivacySettings with _$PrivacySettings {
  const factory PrivacySettings({
    @Default(ProfileVisibility.public) ProfileVisibility profileVisibility,
  }) = _PrivacySettings;

  factory PrivacySettings.fromJson(Map<String, dynamic> json) =>
      _$PrivacySettingsFromJson(json);
}

/// Investment range for investors
@freezed
class InvestmentRange with _$InvestmentRange {
  const factory InvestmentRange({required double min, required double max}) =
      _InvestmentRange;

  factory InvestmentRange.fromJson(Map<String, dynamic> json) =>
      _$InvestmentRangeFromJson(json);
}

/// Investor thesis for matching
@freezed
class InvestorThesis with _$InvestorThesis {
  const factory InvestorThesis({
    List<String>? preferredIndustries,
    List<String>? preferredStages,
    String? thesisDescription,
    String? geographicPreference,
    int? minTractionScore,
  }) = _InvestorThesis;

  factory InvestorThesis.fromJson(Map<String, dynamic> json) =>
      _$InvestorThesisFromJson(json);
}

/// Main User model
@freezed
class User with _$User {
  const User._();

  const factory User({
    required String id,
    required String clerkId,
    required String username,
    required String email,
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
    @Default(false) bool isVerified,
    @Default(false) bool isAdmin,
    @Default([]) List<String> skills,
    @Default([]) List<String> interests,
    @Default([]) List<String> tags,
    NotificationPreferences? notificationPreferences,
    PrivacySettings? privacySettings,
    InvestmentRange? investmentRange,
    InvestorThesis? investorThesis,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  /// Get display name with fallback
  String get fullName {
    if (displayName != null && displayName!.isNotEmpty) return displayName!;
    if (firstName != null || lastName != null) {
      return '${firstName ?? ''} ${lastName ?? ''}'.trim();
    }
    return username;
  }

  /// Get initials for avatar fallback
  String get initials {
    final name = fullName;
    final parts = name.split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  /// Check if user is an entrepreneur
  bool get isEntrepreneur => role == UserRole.entrepreneur;

  /// Check if user is an investor
  bool get isInvestor => role == UserRole.investor;

  /// Check if profile is complete
  bool get hasCompleteProfile =>
      role != null &&
      displayName != null &&
      professionalBio != null &&
      skills.isNotEmpty;
}
