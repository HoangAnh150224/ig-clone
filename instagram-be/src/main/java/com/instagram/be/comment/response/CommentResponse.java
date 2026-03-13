package com.instagram.be.comment.response;

import com.instagram.be.comment.Comment;
import com.instagram.be.follow.response.FollowUserResponse;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponse(
  UUID id,
  String content,
  UUID parentCommentId,
  FollowUserResponse author,
  long replyCount,
  long likeCount,
  boolean isLiked,
  boolean isPinned,
  boolean isOwner,
  LocalDateTime createdAt
) {
  public static CommentResponse of(Comment comment, long replyCount, long likeCount,
                                   boolean isLiked, boolean isOwner) {
    return new CommentResponse(
      comment.getId(),
      comment.getContent(),
      comment.getParentComment() != null ? comment.getParentComment().getId() : null,
      FollowUserResponse.from(comment.getUser()),
      replyCount,
      likeCount,
      isLiked,
      comment.isPinned(),
      isOwner,
      comment.getCreatedAt()
    );
  }
}
