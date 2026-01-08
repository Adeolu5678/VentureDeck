/// VentureDeck Mobile - Conversations Provider
///
/// Riverpod providers for messaging state management.
library;

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:venturedeck_mobile/data/models/conversation.dart';
import 'package:venturedeck_mobile/data/repositories/conversations_repository.dart';

/// Repository provider
final conversationsRepositoryProvider = Provider<ConversationsRepository>((
  ref,
) {
  return ConversationsRepository();
});

/// Conversations list provider
final conversationsProvider = FutureProvider<List<Conversation>>((ref) async {
  final repository = ref.watch(conversationsRepositoryProvider);
  return repository.getConversations();
});

/// Real-time conversations stream provider
final conversationsStreamProvider = StreamProvider<List<Conversation>>((ref) {
  final repository = ref.watch(conversationsRepositoryProvider);
  return repository.subscribeToConversations();
});

/// Single conversation provider
final conversationProvider = FutureProvider.family<Conversation?, String>((
  ref,
  conversationId,
) async {
  final repository = ref.watch(conversationsRepositoryProvider);
  return repository.getConversation(conversationId);
});

/// Messages for a conversation
final messagesProvider = FutureProvider.family<List<Message>, String>((
  ref,
  conversationId,
) async {
  final repository = ref.watch(conversationsRepositoryProvider);
  return repository.getMessages(conversationId);
});

/// Real-time messages stream provider
final messagesStreamProvider = StreamProvider.family<List<Message>, String>((
  ref,
  conversationId,
) {
  final repository = ref.watch(conversationsRepositoryProvider);
  return repository.subscribeToMessages(conversationId);
});

/// Unread count provider
final unreadCountProvider = FutureProvider<int>((ref) async {
  final repository = ref.watch(conversationsRepositoryProvider);
  return repository.getUnreadCount();
});

/// Current chat state for managing typing, draft, etc.
class ChatState {
  const ChatState({
    this.draftMessage = '',
    this.isTyping = false,
    this.replyToMessage,
    this.selectedMessages = const [],
  });

  final String draftMessage;
  final bool isTyping;
  final Message? replyToMessage;
  final List<Message> selectedMessages;

  ChatState copyWith({
    String? draftMessage,
    bool? isTyping,
    Message? replyToMessage,
    bool clearReply = false,
    List<Message>? selectedMessages,
  }) {
    return ChatState(
      draftMessage: draftMessage ?? this.draftMessage,
      isTyping: isTyping ?? this.isTyping,
      replyToMessage: clearReply
          ? null
          : (replyToMessage ?? this.replyToMessage),
      selectedMessages: selectedMessages ?? this.selectedMessages,
    );
  }
}

/// Chat state provider for each conversation
final chatStateProvider = StateProvider.family<ChatState, String>(
  (ref, conversationId) => const ChatState(),
);

/// Messaging actions notifier
class MessagingActionsNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  /// Send a message
  Future<bool> sendMessage({
    required String conversationId,
    required String content,
    MessageType type = MessageType.text,
    Map<String, dynamic>? metadata,
  }) async {
    if (content.trim().isEmpty) return false;

    try {
      final repository = ref.read(conversationsRepositoryProvider);
      await repository.sendMessage(
        conversationId: conversationId,
        content: content.trim(),
        type: type,
        metadata: metadata,
      );

      // Clear draft
      ref.read(chatStateProvider(conversationId).notifier).state = ref
          .read(chatStateProvider(conversationId))
          .copyWith(draftMessage: '', clearReply: true);

      // Refresh messages
      ref.invalidate(messagesProvider(conversationId));
      ref.invalidate(conversationsProvider);

      return true;
    } catch (e) {
      return false;
    }
  }

  /// Start or get a conversation with a user
  Future<String?> getOrCreateConversation(String otherUserId) async {
    try {
      final repository = ref.read(conversationsRepositoryProvider);
      final conversationId = await repository.getOrCreateConversation(
        otherUserId,
      );

      ref.invalidate(conversationsProvider);

      return conversationId;
    } catch (e) {
      return null;
    }
  }

  /// Mark conversation as read
  Future<void> markAsRead(String conversationId) async {
    try {
      final repository = ref.read(conversationsRepositoryProvider);
      await repository.markAsRead(conversationId);

      ref.invalidate(unreadCountProvider);
      ref.invalidate(conversationsProvider);
    } catch (e) {
      // Silently fail
    }
  }

  /// Delete a message
  Future<bool> deleteMessage(String conversationId, String messageId) async {
    try {
      final repository = ref.read(conversationsRepositoryProvider);
      await repository.deleteMessage(messageId);

      ref.invalidate(messagesProvider(conversationId));

      return true;
    } catch (e) {
      return false;
    }
  }
}

/// Messaging actions provider
final messagingActionsProvider =
    AsyncNotifierProvider<MessagingActionsNotifier, void>(
      MessagingActionsNotifier.new,
    );

/// Participant info provider (for displaying user names in chat)
final participantInfoProvider =
    FutureProvider.family<Map<String, dynamic>?, String>((ref, userId) async {
      // This would fetch user info from the users repository
      // For now, return null - will be connected later
      return null;
    });
