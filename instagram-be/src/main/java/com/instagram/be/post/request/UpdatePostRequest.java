package com.instagram.be.post.request;

import com.instagram.be.base.request.BaseRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UpdatePostRequest extends BaseRequest {

  private UUID postId;
  private String caption;
  private String locationName;
  private Boolean commentsDisabled;
  private Boolean hideLikeCount;
}
