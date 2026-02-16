/// VentureDeck Mobile - Analytics Repository
///
/// Data access layer for analytics.
library;

import 'package:venturedeck_mobile/data/models/analytics.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';

/// Repository for analytics operations
class AnalyticsRepository {
  AnalyticsRepository({ConvexService? convexService})
    : _convex = convexService ?? ConvexService.instance;

  final ConvexService _convex;

  /// Get analytics for a project
  Future<Analytics> getProjectAnalytics(String projectId, {int? days}) async {
    try {
      final result = await _convex.query<Map<String, dynamic>>(
        'analytics:getProjectAnalytics',
        {'projectId': projectId, if (days != null) 'days': days},
      );

      return Analytics.fromJson(result);
    } catch (e) {
      throw AnalyticsRepositoryException('Failed to fetch analytics: $e');
    }
  }
}

/// Exception for analytics repository errors
class AnalyticsRepositoryException implements Exception {
  AnalyticsRepositoryException(this.message);
  final String message;

  @override
  String toString() => message;
}
