package com.instagram.be.story.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.story.StoryView;

import java.time.LocalDateTime;

public record StoryViewResponse(FollowUserResponse viewer, LocalDateTime viewedAt, boolean liked) {

  public static StoryViewResponse of(StoryView view, boolean isFollowing) {
    return new StoryViewResponse(
      FollowUserResponse.of(view.getViewer(), isFollowing),
      view.getCreatedAt(),
      view.isLiked()
    );
  }

  public static StoryViewResponse from(StoryView view) {
    return new StoryViewResponse(
      FollowUserResponse.from(view.getViewer()),
      view.getCreatedAt(),
      view.isLiked()
    );
  }
}
