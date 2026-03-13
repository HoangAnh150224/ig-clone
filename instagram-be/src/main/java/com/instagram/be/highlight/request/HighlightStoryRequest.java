package com.instagram.be.highlight.request;

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
public class HighlightStoryRequest extends BaseRequest {

  private UUID highlightId;
  private UUID storyId;
}
