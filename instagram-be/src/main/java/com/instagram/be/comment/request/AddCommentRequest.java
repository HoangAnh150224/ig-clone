package com.instagram.be.comment.request;

import com.instagram.be.base.request.BaseRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AddCommentRequest extends BaseRequest {

    private UUID postId;
    private UUID parentCommentId;
    @NotBlank
    @Size(max = 2200)
    private String content;
}
