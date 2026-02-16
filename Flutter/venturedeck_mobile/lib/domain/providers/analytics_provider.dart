/// VentureDeck Mobile - Analytics Provider
///
/// Providers for analytics data.
library;

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/data/models/analytics.dart';
import 'package:venturedeck_mobile/data/repositories/analytics_repository.dart';

/// Analytics repository provider
final analyticsRepositoryProvider = Provider<AnalyticsRepository>((ref) {
  return AnalyticsRepository();
});

/// Project analytics provider
final projectAnalyticsProvider = FutureProvider.family<Analytics, String>((
  ref,
  projectId,
) async {
  final repository = ref.watch(analyticsRepositoryProvider);
  return repository.getProjectAnalytics(projectId);
});
