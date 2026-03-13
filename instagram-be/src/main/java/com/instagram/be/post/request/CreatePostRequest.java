package com.instagram.be.post.request;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.post.enums.PostType;
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
    private String caption;
    private String locationName;
    private String music;
    private boolean hideLikeCount;
    private boolean commentsDisabled;
    private List<MediaItem> media;
    private List<UUID> taggedUserIds;

    public record MediaItem(String url, String mediaType) {
    }
}
