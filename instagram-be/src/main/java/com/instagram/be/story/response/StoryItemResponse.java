package com.instagram.be.story.response;

import com.instagram.be.story.Story;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StoryItemResponse(
        UUID id,
        String mediaUrl,
        String mediaType,
        boolean seen,
        LocalDateTime createdAt,
        int viewCount,
        List<StoryViewResponse> views
) {

    public static StoryItemResponse from(Story story, boolean seen) {
        return new StoryItemResponse(
                story.getId(),
                story.getMediaUrl(),
                story.getMediaType().name(),
                seen,
                story.getCreatedAt(),
                0,
                List.of()
        );
    }

    public static StoryItemResponse fromWithOwnerData(Story story, boolean seen, int viewCount, List<StoryViewResponse> views) {
        return new StoryItemResponse(
                story.getId(),
                story.getMediaUrl(),
                story.getMediaType().name(),
                seen,
                story.getCreatedAt(),
                viewCount,
                views
        );
    }
}
