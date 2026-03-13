package com.instagram.be.message.response;

import com.instagram.be.follow.response.FollowUserResponse;

import java.time.LocalDateTime;
import java.util.UUID;

public record ConversationResponse(
  UUID id,
  FollowUserResponse participant,
  boolean isOnline,
  LastMessageInfo lastMessage,
  long unreadCount,
  boolean isAccepted,
  LocalDateTime lastReadAt
) {
  public record LastMessageInfo(String content, String mediaType, LocalDateTime createdAt) {
  }
}
