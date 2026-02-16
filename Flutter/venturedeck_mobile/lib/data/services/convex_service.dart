/// VentureDeck Mobile - Convex Service
///
/// Handles communication with the Convex backend via WebSocket
/// and HTTP for queries and mutations.
library;

import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:logger/logger.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

/// Convex client for connecting to the Convex backend
class ConvexService {
  ConvexService._internal();

  static final ConvexService _instance = ConvexService._internal();
  static ConvexService get instance => _instance;

  final Logger _logger = Logger();

  WebSocketChannel? _channel;
  StreamSubscription<dynamic>? _subscription;

  final _subscriptions = <String, StreamController<dynamic>>{};
  final _pendingRequests = <int, Completer<dynamic>>{};
  int _requestId = 0;

  bool _isConnected = false;
  bool get isConnected => _isConnected;

  String? _authToken;

  /// Get the Convex URL from environment
  String get _convexUrl {
    final url = dotenv.env['CONVEX_URL'] ?? '';
    if (url.isEmpty) {
      throw Exception('CONVEX_URL not configured in .env file');
    }
    // Convert HTTP URL to WebSocket URL
    return url
        .replaceFirst('https://', 'wss://')
        .replaceFirst('http://', 'ws://');
  }

  /// Initialize connection to Convex
  Future<void> connect() async {
    if (_isConnected) return;

    try {
      final wsUrl = Uri.parse('$_convexUrl/sync');
      _channel = WebSocketChannel.connect(wsUrl);

      _subscription = _channel!.stream.listen(
        _handleMessage,
        onError: _handleError,
        onDone: _handleDisconnect,
      );

      _isConnected = true;
      _logger.i('Connected to Convex at $_convexUrl');

      // Authenticate if we have a token
      if (_authToken != null) {
        await authenticate(_authToken!);
      }
    } catch (e) {
      _logger.e('Failed to connect to Convex: $e');
      rethrow;
    }
  }

  /// Disconnect from Convex
  Future<void> disconnect() async {
    await _subscription?.cancel();
    await _channel?.sink.close();
    _isConnected = false;

    // Clean up subscriptions
    for (final controller in _subscriptions.values) {
      await controller.close();
    }
    _subscriptions.clear();

    // Reject pending requests
    for (final completer in _pendingRequests.values) {
      completer.completeError(Exception('Connection closed'));
    }
    _pendingRequests.clear();

    _logger.i('Disconnected from Convex');
  }

  /// Set authentication token
  Future<void> authenticate(String token) async {
    _authToken = token;
    if (_isConnected) {
      _send({'type': 'Authenticate', 'token': token});
    }
  }

  /// Clear authentication
  void clearAuth() {
    _authToken = null;
  }

  /// Execute a Convex query
  Future<T> query<T>(String functionPath, [Map<String, dynamic>? args]) async {
    _ensureConnected();

    final requestId = _requestId++;
    final completer = Completer<dynamic>();
    _pendingRequests[requestId] = completer;

    _send({
      'type': 'Query',
      'requestId': requestId,
      'path': functionPath,
      'args': args ?? {},
    });

    final result = await completer.future;
    return result as T;
  }

  /// Execute a Convex mutation
  Future<T> mutation<T>(
    String functionPath, [
    Map<String, dynamic>? args,
  ]) async {
    _ensureConnected();

    final requestId = _requestId++;
    final completer = Completer<dynamic>();
    _pendingRequests[requestId] = completer;

    _send({
      'type': 'Mutation',
      'requestId': requestId,
      'path': functionPath,
      'args': args ?? {},
    });

    final result = await completer.future;
    return result as T;
  }

  /// Subscribe to a Convex query for real-time updates
  Stream<T> subscribe<T>(String functionPath, [Map<String, dynamic>? args]) {
    _ensureConnected();

    final subscriptionKey = _generateSubscriptionKey(functionPath, args);

    if (_subscriptions.containsKey(subscriptionKey)) {
      return _subscriptions[subscriptionKey]!.stream as Stream<T>;
    }

    // ignore: close_sinks
    final controller = StreamController<dynamic>.broadcast(
      onCancel: () {
        _unsubscribe(subscriptionKey);
      },
    );

    _subscriptions[subscriptionKey] = controller;

    _send({
      'type': 'Subscribe',
      'subscriptionId': subscriptionKey,
      'path': functionPath,
      'args': args ?? {},
    });

    return controller.stream as Stream<T>;
  }

  void _unsubscribe(String subscriptionKey) {
    _send({'type': 'Unsubscribe', 'subscriptionId': subscriptionKey});
    _subscriptions.remove(subscriptionKey);
  }

  String _generateSubscriptionKey(String path, Map<String, dynamic>? args) {
    return '$path:${args?.hashCode ?? 0}';
  }

  void _ensureConnected() {
    if (!_isConnected) {
      throw Exception('Not connected to Convex. Call connect() first.');
    }
  }

  void _send(Map<String, dynamic> message) {
    final jsonMessage = jsonEncode(message);
    _channel?.sink.add(jsonMessage);

    if (kDebugMode) {
      _logger.d('Sent: $jsonMessage');
    }
  }

  void _handleMessage(dynamic message) {
    try {
      final data = jsonDecode(message as String) as Map<String, dynamic>;
      final type = data['type'] as String?;

      if (kDebugMode) {
        _logger.d('Received: $data');
      }

      switch (type) {
        case 'QueryResponse':
        case 'MutationResponse':
          _handleResponse(data);
        case 'SubscriptionUpdate':
          _handleSubscriptionUpdate(data);
        case 'Error':
          _handleErrorResponse(data);
        default:
          _logger.w('Unknown message type: $type');
      }
    } catch (e) {
      _logger.e('Error parsing message: $e');
    }
  }

  void _handleResponse(Map<String, dynamic> data) {
    final requestId = data['requestId'] as int?;
    if (requestId != null && _pendingRequests.containsKey(requestId)) {
      final completer = _pendingRequests.remove(requestId)!;
      if (data.containsKey('error')) {
        completer.completeError(Exception(data['error']));
      } else {
        completer.complete(data['value']);
      }
    }
  }

  void _handleSubscriptionUpdate(Map<String, dynamic> data) {
    final subscriptionId = data['subscriptionId'] as String?;
    if (subscriptionId != null && _subscriptions.containsKey(subscriptionId)) {
      _subscriptions[subscriptionId]!.add(data['value']);
    }
  }

  void _handleErrorResponse(Map<String, dynamic> data) {
    final requestId = data['requestId'] as int?;
    if (requestId != null && _pendingRequests.containsKey(requestId)) {
      final completer = _pendingRequests.remove(requestId)!;
      completer.completeError(Exception(data['message'] ?? 'Unknown error'));
    }
    _logger.e('Convex error: ${data['message']}');
  }

  void _handleError(dynamic error) {
    _logger.e('WebSocket error: $error');
    _isConnected = false;
  }

  void _handleDisconnect() {
    _logger.w('WebSocket disconnected');
    _isConnected = false;

    // Attempt to reconnect after a delay
    Future.delayed(const Duration(seconds: 5), () {
      if (!_isConnected) {
        connect();
      }
    });
  }
}

// Extension removed. Repositories should call query/mutation directly.
