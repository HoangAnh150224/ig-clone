package com.instagram.be.comment.request;

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
public class GetCommentsRequest extends BaseRequest {

    private UUID postId;
    private UUID parentCommentId;
    private int page = 0;
    private int size = 20;
}
