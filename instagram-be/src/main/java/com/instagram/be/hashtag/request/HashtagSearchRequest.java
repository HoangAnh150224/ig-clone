package com.instagram.be.hashtag.request;

import com.instagram.be.base.request.BaseRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class HashtagSearchRequest extends BaseRequest {

  private String q;
  private int limit = 10;
}
