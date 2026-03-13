package com.instagram.be.story.response;

import java.util.List;
import java.util.UUID;

public record StoryFeedResponse(
  UUID userId,
  String username,
  String avatarUrl,
  boolean hasUnseenStory,
  List<StoryItemResponse> stories
) {
}
