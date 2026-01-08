// VentureDeck Mobile - Widget Tests

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:venturedeck_mobile/main.dart';

void main() {
  testWidgets('App renders home screen', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const ProviderScope(child: VentureDeckApp()));

    // Verify that the app title is displayed
    expect(find.text('VentureDeck'), findsOneWidget);
  });
}
