/// VentureDeck Mobile - Conversations Repository
///
/// Data access layer for messaging operations via Convex.
library;

import 'package:venturedeck_mobile/data/models/conversation.dart';
import 'package:venturedeck_mobile/data/services/convex_service.dart';

/// Repository for conversation and messaging operations
class ConversationsRepository {
  ConversationsRepository({ConvexService? convexService})
    : _convex = convexService ?? ConvexService.instance;

  final ConvexService _convex;

  /// Get all conversations for current user
  Future<List<Conversation>> getConversations() async {
    try {
      final result = await _convex.query<List<dynamic>>('conversations:list');
      return result
          .map((item) => _mapToConversation(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ConversationsRepositoryException(
        'Failed to fetch conversations: $e',
      );
    }
  }

  /// Get a single conversation by ID
  Future<Conversation?> getConversation(String conversationId) async {
    try {
      final result = await _convex.query<Map<String, dynamic>?>(
        'conversations:get',
        {'id': conversationId},
      );
      if (result == null) return null;
      return _mapToConversation(result);
    } catch (e) {
      throw ConversationsRepositoryException(
        'Failed to fetch conversation: $e',
      );
    }
  }

  /// Get messages for a conversation
  Future<List<Message>> getMessages(
    String conversationId, {
    int limit = 50,
  }) async {
    try {
      final result = await _convex.query<List<dynamic>>('messages:list', {
        'conversationId': conversationId,
        'limit': limit,
      });
      return result
          .map((item) => _mapToMessage(item as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw ConversationsRepositoryException('Failed to fetch messages: $e');
    }
  }

  /// Send a message
  Future<String> sendMessage({
    required String conversationId,
    required String content,
    MessageType type = MessageType.text,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final result = await _convex.mutation<String>('messages:send', {
        'conversationId': conversationId,
        'content': content,
        'type': type.name,
        if (metadata != null) 'metadata': metadata,
      });
      return result;
    } catch (e) {
      throw ConversationsRepositoryException('Failed to send message: $e');
    }
  }

  /// Create or get a conversation with a user
  Future<String> getOrCreateConversation(String otherUserId) async {
    try {
      final result = await _convex.mutation<String>(
        'conversations:getOrCreate',
        {'otherUserId': otherUserId},
      );
      return result;
    } catch (e) {
      throw ConversationsRepositoryException(
        'Failed to create conversation: $e',
      );
    }
  }

  /// Mark conversation as read
  Future<void> markAsRead(String conversationId) async {
    try {
      await _convex.mutation('conversations:markRead', {'id': conversationId});
    } catch (e) {
      throw ConversationsRepositoryException('Failed to mark as read: $e');
    }
  }

  /// Delete a message
  Future<void> deleteMessage(String messageId) async {
    try {
      await _convex.mutation('messages:delete', {'id': messageId});
    } catch (e) {
      throw ConversationsRepositoryException('Failed to delete message: $e');
    }
  }

  /// Subscribe to conversations list (real-time)
  Stream<List<Conversation>> subscribeToConversations() {
    return _convex
        .subscribe<List<dynamic>>('conversations:list')
        .map(
          (data) => data
              .map((item) => _mapToConversation(item as Map<String, dynamic>))
              .toList(),
        );
  }

  /// Subscribe to messages in a conversation (real-time)
  Stream<List<Message>> subscribeToMessages(String conversationId) {
    return _convex
        .subscribe<List<dynamic>>('messages:list', {
          'conversationId': conversationId,
        })
        .map(
          (data) => data
              .map((item) => _mapToMessage(item as Map<String, dynamic>))
              .toList(),
        );
  }

  /// Get unread count
  Future<int> getUnreadCount() async {
    try {
      final result = await _convex.query<int>('conversations:unreadCount');
      return result;
    } catch (e) {
      return 0;
    }
  }

  /// Map Convex data to Conversation model
  Conversation _mapToConversation(Map<String, dynamic> data) {
    return Conversation(
      id: data['_id'] as String,
      participantIds: List<String>.from(data['participantIds'] as List),
      lastMessageId: data['lastMessageId'] as String?,
      lastMessageText: data['lastMessageText'] as String?,
      lastMessageAt: data['lastMessageAt'] != null
          ? DateTime.fromMillisecondsSinceEpoch(
              (data['lastMessageAt'] as num).toInt(),
            )
          : null,
      unreadCount: (data['unreadCount'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.fromMillisecondsSinceEpoch(
        (data['createdAt'] as num).toInt(),
      ),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(
        (data['updatedAt'] as num).toInt(),
      ),
    );
  }

  /// Map Convex data to Message model
  Message _mapToMessage(Map<String, dynamic> data) {
    return Message(
      id: data['_id'] as String,
      conversationId: data['conversationId'] as String,
      senderId: data['senderId'] as String,
      content: data['content'] as String,
      type: _parseMessageType(data['type'] as String?),
      metadata: data['metadata'] as Map<String, dynamic>?,
      isRead: data['isRead'] as bool? ?? false,
      createdAt: DateTime.fromMillisecondsSinceEpoch(
        (data['createdAt'] as num).toInt(),
      ),
    );
  }

  MessageType _parseMessageType(String? type) {
    switch (type) {
      case 'text':
        return MessageType.text;
      case 'image':
        return MessageType.image;
      case 'file':
        return MessageType.file;
      case 'system':
        return MessageType.system;
      default:
        return MessageType.text;
    }
  }
}

/// Exception for repository errors
class ConversationsRepositoryException implements Exception {
  ConversationsRepositoryException(this.message);
  final String message;

  @override
  String toString() => message;
}
