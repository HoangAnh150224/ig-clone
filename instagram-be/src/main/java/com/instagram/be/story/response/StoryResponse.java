package com.instagram.be.story.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.story.Story;

import java.time.LocalDateTime;
import java.util.UUID;

public record StoryResponse(
  UUID id,
  String mediaUrl,
  String mediaType,
  LocalDateTime expiresAt,
  boolean archived,
  boolean closeFriends,
  FollowUserResponse user,
  LocalDateTime createdAt
) {
  public static StoryResponse from(Story story) {
    return new StoryResponse(
      story.getId(),
      story.getMediaUrl(),
      story.getMediaType().name(),
      story.getExpiresAt(),
      story.isArchived(),
      story.isCloseFriends(),
      FollowUserResponse.from(story.getUser()),
      story.getCreatedAt()
    );
  }
}
