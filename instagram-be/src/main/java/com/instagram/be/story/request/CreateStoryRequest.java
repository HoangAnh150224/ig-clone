package com.instagram.be.story.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.post.enums.MediaType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreateStoryRequest extends BaseRequest {
    private String mediaUrl;
    private MediaType mediaType;
    private boolean closeFriends;
}
