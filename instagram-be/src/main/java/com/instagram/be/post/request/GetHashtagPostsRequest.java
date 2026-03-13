package com.instagram.be.post.request;

import com.instagram.be.base.request.BaseRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class GetHashtagPostsRequest extends BaseRequest {
    private String hashtagName;
    private String cursor;
    private int size = 20;
}
