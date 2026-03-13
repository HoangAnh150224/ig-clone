package com.instagram.be.post.request;

import com.instagram.be.base.request.PaginatedRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GetHashtagPostsRequest extends PaginatedRequest {
  private String hashtagName;
}
