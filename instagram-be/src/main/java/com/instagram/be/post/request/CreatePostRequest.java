package com.instagram.be.post.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.post.enums.PostType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreatePostRequest extends BaseRequest {

    private PostType type;
    @NotBlank(message = "Caption is required")
    @Size(max = 2200)
    private String caption;
    private String locationName;
    private String music;
    private boolean hideLikeCount;
    private boolean commentsDisabled;
    @NotEmpty(message = "At least one media item is required")
    private List<MediaItem> media;
    private List<UUID> taggedUserIds;

    public record MediaItem(String url, String mediaType) {
    }
}
