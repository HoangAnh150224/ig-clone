package com.instagram.be.story.response;

import com.instagram.be.story.Story;

import java.time.LocalDateTime;
import java.util.UUID;

public record StoryItemResponse(UUID id, String mediaUrl, String mediaType, LocalDateTime createdAt) {

    public static StoryItemResponse from(Story story) {
        return new StoryItemResponse(
                story.getId(),
                story.getMediaUrl(),
                story.getMediaType().name(),
                story.getCreatedAt()
        );
    }
}
