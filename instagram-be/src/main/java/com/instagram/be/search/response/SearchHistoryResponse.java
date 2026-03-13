package com.instagram.be.search.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.search.SearchHistory;

import java.time.LocalDateTime;
import java.util.UUID;

public record SearchHistoryResponse(
  UUID id,
  String type,
  FollowUserResponse searchedUser,
  String hashtagName,
  LocalDateTime createdAt) {

  public static SearchHistoryResponse from(SearchHistory history) {
    if (history.getSearchedUser() != null) {
      return new SearchHistoryResponse(
        history.getId(),
        "USER",
        FollowUserResponse.from(history.getSearchedUser()),
        null,
        history.getCreatedAt()
      );
    } else {
      return new SearchHistoryResponse(
        history.getId(),
        "HASHTAG",
        null,
        history.getHashtag() != null ? history.getHashtag().getName() : null,
        history.getCreatedAt()
      );
    }
  }
}
