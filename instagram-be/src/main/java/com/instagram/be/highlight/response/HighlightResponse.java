package com.instagram.be.highlight.response;

import com.instagram.be.highlight.Highlight;

import java.util.UUID;

public record HighlightResponse(UUID id, String title, String coverUrl, int storiesCount) {

    public static HighlightResponse from(Highlight highlight) {
        return new HighlightResponse(
                highlight.getId(),
                highlight.getTitle(),
                highlight.getCoverUrl(),
                highlight.getStories().size()
        );
    }
}
