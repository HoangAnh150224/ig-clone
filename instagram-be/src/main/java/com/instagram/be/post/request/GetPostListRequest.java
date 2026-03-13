package com.instagram.be.post.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.post.enums.PostType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GetPostListRequest extends BaseRequest {

  // For single-post list queries (likers, comments via post)
  private UUID postId;

  // For user posts / archived / tagged
  private UUID targetUserId;
  private String targetUsername;

  // For feed
  private String cursor;
  private PostType typeFilter;

  // Offset pagination
  private int page = 0;
  private int size = 12;
}
