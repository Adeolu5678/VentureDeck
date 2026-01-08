/// VentureDeck Mobile - App Constants
library;

/// API related constants
abstract final class ApiConstants {
  static const Duration timeout = Duration(seconds: 30);
  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Content types
  static const String contentTypeJson = 'application/json';
  static const String acceptJson = 'application/json';
}

/// Storage keys for local persistence
abstract final class StorageKeys {
  static const String authToken = 'auth_token';
  static const String refreshToken = 'refresh_token';
  static const String userId = 'user_id';
  static const String userEmail = 'user_email';
  static const String onboardingComplete = 'onboarding_complete';
  static const String themeMode = 'theme_mode';
  static const String lastSyncTime = 'last_sync_time';
}

/// Route paths for navigation
abstract final class RoutePaths {
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String projects = '/projects';
  static const String projectDetail = '/projects/:id';
  static const String investors = '/investors';
  static const String investorDetail = '/investors/:id';
  static const String profile = '/profile';
  static const String settings = '/settings';
  static const String notifications = '/notifications';
  static const String search = '/search';
  static const String messages = '/messages';
  static const String chat = '/messages/:conversationId';
}

/// Animation durations
abstract final class AnimationDurations {
  static const Duration fast = Duration(milliseconds: 150);
  static const Duration normal = Duration(milliseconds: 300);
  static const Duration slow = Duration(milliseconds: 500);
  static const Duration splash = Duration(milliseconds: 2000);
}

/// Asset paths
abstract final class AssetPaths {
  static const String imagesPath = 'assets/images';
  static const String iconsPath = 'assets/icons';
  static const String fontsPath = 'assets/fonts';

  // Logos
  static const String logo = '$imagesPath/logo.png';
  static const String logoLight = '$imagesPath/logo_light.png';

  // Placeholder images
  static const String placeholderUser = '$imagesPath/placeholder_user.png';
  static const String placeholderProject =
      '$imagesPath/placeholder_project.png';
}

/// App configuration
abstract final class AppConfig {
  static const String appName = 'VentureDeck';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 50;

  // Validation
  static const int minPasswordLength = 8;
  static const int maxDescriptionLength = 500;
  static const int maxTitleLength = 100;

  // File upload limits
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
}
