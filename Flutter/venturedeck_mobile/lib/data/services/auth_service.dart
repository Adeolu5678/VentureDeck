/// VentureDeck Mobile - Authentication Service
///
/// Handles Clerk authentication via OAuth flow.
/// Manages tokens and user session state.
library;

import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';
import 'package:logger/logger.dart';

/// Authentication state
enum AuthState { initial, loading, authenticated, unauthenticated, error }

/// Auth result containing tokens
class AuthResult {
  AuthResult({
    required this.accessToken,
    this.refreshToken,
    this.userId,
    this.expiresAt,
  });

  final String accessToken;
  final String? refreshToken;
  final String? userId;
  final DateTime? expiresAt;
}

/// Authentication service for Clerk
class AuthService {
  AuthService._internal();

  static final AuthService _instance = AuthService._internal();
  static AuthService get instance => _instance;

  final Logger _logger = Logger();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  // Storage keys
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userIdKey = 'user_id';
  static const String _expiresAtKey = 'expires_at';

  // State
  AuthState _state = AuthState.initial;
  AuthState get state => _state;

  String? _accessToken;
  String? get accessToken => _accessToken;

  String? _userId;
  String? get userId => _userId;

  // Stream controller for auth state changes
  final _stateController = StreamController<AuthState>.broadcast();
  Stream<AuthState> get stateStream => _stateController.stream;

  /// Get Clerk publishable key from environment
  String get _clerkPublishableKey {
    return dotenv.env['CLERK_PUBLISHABLE_KEY'] ?? '';
  }

  /// Get Clerk frontend API from publishable key
  String get _clerkFrontendApi {
    // Extract from publishable key: pk_test_XXX -> XXX.clerk.accounts.dev
    final key = _clerkPublishableKey;
    if (key.startsWith('pk_test_') || key.startsWith('pk_live_')) {
      final domain = key.substring(8);
      // The domain is base64 encoded in the key
      try {
        final decoded = utf8.decode(base64.decode(domain.split('.')[0]));
        return decoded;
      } catch (e) {
        _logger.w('Could not decode Clerk domain from key');
      }
    }
    return dotenv.env['CLERK_FRONTEND_API'] ?? '';
  }

  /// Initialize the auth service
  Future<void> initialize() async {
    _state = AuthState.loading;
    _stateController.add(_state);

    try {
      // Load stored tokens
      _accessToken = await _storage.read(key: _accessTokenKey);
      _userId = await _storage.read(key: _userIdKey);
      final expiresAtStr = await _storage.read(key: _expiresAtKey);

      if (_accessToken != null) {
        // Check if token is expired
        if (expiresAtStr != null) {
          final expiresAt = DateTime.parse(expiresAtStr);
          if (expiresAt.isBefore(DateTime.now())) {
            // Token expired, try to refresh
            await _refreshTokens();
          } else {
            _state = AuthState.authenticated;
          }
        } else {
          _state = AuthState.authenticated;
        }
      } else {
        _state = AuthState.unauthenticated;
      }
    } catch (e) {
      _logger.e('Error initializing auth: $e');
      _state = AuthState.unauthenticated;
    }

    _stateController.add(_state);
  }

  /// Sign in with Clerk OAuth
  Future<AuthResult?> signIn() async {
    _state = AuthState.loading;
    _stateController.add(_state);

    try {
      final frontendApi = _clerkFrontendApi;
      if (frontendApi.isEmpty) {
        throw Exception('Clerk frontend API not configured');
      }

      // Construct OAuth URL
      final authUrl = Uri.parse(
        'https://$frontendApi/oauth/authorize?'
        'client_id=mobile_app&'
        'redirect_uri=venturedeck://callback&'
        'response_type=code&'
        'scope=openid profile email',
      );

      // Launch OAuth flow
      final result = await FlutterWebAuth2.authenticate(
        url: authUrl.toString(),
        callbackUrlScheme: 'venturedeck',
      );

      // Parse callback URL
      final callbackUri = Uri.parse(result);
      final code = callbackUri.queryParameters['code'];

      if (code == null) {
        throw Exception('No authorization code received');
      }

      // Exchange code for tokens
      final tokens = await _exchangeCodeForTokens(code);

      if (tokens != null) {
        await _saveTokens(tokens);
        _state = AuthState.authenticated;
        _stateController.add(_state);
        return tokens;
      }

      _state = AuthState.error;
      _stateController.add(_state);
      return null;
    } catch (e) {
      _logger.e('Sign in error: $e');
      _state = AuthState.error;
      _stateController.add(_state);
      return null;
    }
  }

  /// Sign in with email (for development/testing)
  Future<bool> signInWithToken(String token, {String? userId}) async {
    _state = AuthState.loading;
    _stateController.add(_state);

    try {
      _accessToken = token;
      _userId = userId;

      await _storage.write(key: _accessTokenKey, value: token);
      if (userId != null) {
        await _storage.write(key: _userIdKey, value: userId);
      }

      _state = AuthState.authenticated;
      _stateController.add(_state);
      return true;
    } catch (e) {
      _logger.e('Sign in with token error: $e');
      _state = AuthState.error;
      _stateController.add(_state);
      return false;
    }
  }

  /// Sign out
  Future<void> signOut() async {
    _state = AuthState.loading;
    _stateController.add(_state);

    try {
      await _storage.delete(key: _accessTokenKey);
      await _storage.delete(key: _refreshTokenKey);
      await _storage.delete(key: _userIdKey);
      await _storage.delete(key: _expiresAtKey);

      _accessToken = null;
      _userId = null;

      _state = AuthState.unauthenticated;
      _stateController.add(_state);
    } catch (e) {
      _logger.e('Sign out error: $e');
      _state = AuthState.unauthenticated;
      _stateController.add(_state);
    }
  }

  /// Exchange authorization code for tokens
  Future<AuthResult?> _exchangeCodeForTokens(String code) async {
    // In a real implementation, this would call your backend
    // to exchange the code for tokens
    // For now, we'll simulate this
    if (kDebugMode) {
      _logger.i('Would exchange code for tokens: $code');
    }
    return null;
  }

  /// Refresh tokens
  Future<void> _refreshTokens() async {
    final refreshToken = await _storage.read(key: _refreshTokenKey);
    if (refreshToken == null) {
      _state = AuthState.unauthenticated;
      return;
    }

    // In a real implementation, this would call the token refresh endpoint
    if (kDebugMode) {
      _logger.i('Would refresh tokens');
    }

    _state = AuthState.unauthenticated;
  }

  /// Save tokens to secure storage
  Future<void> _saveTokens(AuthResult tokens) async {
    _accessToken = tokens.accessToken;
    _userId = tokens.userId;

    await _storage.write(key: _accessTokenKey, value: tokens.accessToken);
    if (tokens.refreshToken != null) {
      await _storage.write(key: _refreshTokenKey, value: tokens.refreshToken);
    }
    if (tokens.userId != null) {
      await _storage.write(key: _userIdKey, value: tokens.userId);
    }
    if (tokens.expiresAt != null) {
      await _storage.write(
        key: _expiresAtKey,
        value: tokens.expiresAt!.toIso8601String(),
      );
    }
  }

  /// Check if user is authenticated
  bool get isAuthenticated => _state == AuthState.authenticated;

  /// Dispose resources
  void dispose() {
    _stateController.close();
  }
}
