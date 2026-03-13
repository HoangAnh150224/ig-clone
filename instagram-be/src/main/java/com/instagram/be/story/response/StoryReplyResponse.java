package com.instagram.be.story.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.story.StoryReply;

import java.time.LocalDateTime;
import java.util.UUID;

public record StoryReplyResponse(UUID id, String text, FollowUserResponse sender, LocalDateTime createdAt) {

  public static StoryReplyResponse from(StoryReply reply) {
    return new StoryReplyResponse(
      reply.getId(),
      reply.getText(),
      FollowUserResponse.from(reply.getUser()),
      reply.getCreatedAt()
    );
  }
}
