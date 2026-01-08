/// VentureDeck Mobile - Conversation & Message Models
///
/// Represents conversations and messages in the VentureDeck platform.
library;

import 'package:freezed_annotation/freezed_annotation.dart';

part 'conversation.freezed.dart';
part 'conversation.g.dart';

/// Conversation type
enum ConversationType {
  @JsonValue('direct')
  direct,
  @JsonValue('workspace_general')
  workspaceGeneral,
  @JsonValue('interview')
  interview,
  @JsonValue('custom_chat')
  customChat,
}

/// Conversation visibility
enum ConversationVisibility {
  @JsonValue('public')
  public,
  @JsonValue('private')
  private,
}

/// Message type
enum MessageType {
  @JsonValue('text')
  text,
  @JsonValue('image')
  image,
  @JsonValue('file')
  file,
  @JsonValue('system')
  system,
}

/// Main Conversation model
@freezed
class Conversation with _$Conversation {
  const Conversation._();

  const factory Conversation({
    required String id,
    required List<String> participantIds,
    String? workspaceId,
    String? projectId,
    String? applicationId,
    ConversationType? type,
    String? name,
    ConversationVisibility? visibility,
    @Default(false) bool isClosed,
    String? creatorId,
    @Default([]) List<String> archivedBy,
    String? lastMessageId,
    String? lastMessageText,
    DateTime? lastMessageAt,
    @Default(0) int unreadCount,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _Conversation;

  factory Conversation.fromJson(Map<String, dynamic> json) =>
      _$ConversationFromJson(json);

  /// Check if this is a direct message conversation
  bool get isDirect => type == ConversationType.direct;

  /// Check if this is a workspace conversation
  bool get isWorkspace => type == ConversationType.workspaceGeneral;

  /// Get display name with fallback
  String getDisplayName(String? otherUserName) {
    if (name != null && name!.isNotEmpty) return name!;
    if (otherUserName != null) return otherUserName;
    if (isDirect) return 'Direct Message';
    if (isWorkspace) return 'Team Chat';
    return 'Conversation';
  }
}

/// Message model
@freezed
class Message with _$Message {
  const Message._();

  const factory Message({
    required String id,
    required String conversationId,
    required String senderId,
    required String content,
    @Default(MessageType.text) MessageType type,
    String? imageUrl,
    Map<String, dynamic>? metadata,
    @Default(false) bool isRead,
    required DateTime createdAt,
  }) = _Message;

  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);

  /// Check if message has image
  bool get hasImage => imageUrl != null && imageUrl!.isNotEmpty;

  /// Check if message is from a specific user
  bool isFromUser(String userId) => senderId == userId;

  /// Check if this is a system message
  bool get isSystem => type == MessageType.system;
}

/// Conversation with last message for list display
@freezed
class ConversationWithDetails with _$ConversationWithDetails {
  const factory ConversationWithDetails({
    required Conversation conversation,
    Message? lastMessage,
    String? otherUserName,
    String? otherUserAvatarUrl,
    @Default(0) int unreadCount,
  }) = _ConversationWithDetails;

  factory ConversationWithDetails.fromJson(Map<String, dynamic> json) =>
      _$ConversationWithDetailsFromJson(json);
}
