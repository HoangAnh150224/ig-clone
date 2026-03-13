package com.instagram.be.post.response;

import com.instagram.be.post.enums.PostType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PostResponse(
        UUID id,
        PostType type,
        String caption,
        String locationName,
        String music,
        boolean hideLikeCount,
        boolean commentsDisabled,
        boolean archived,
        AuthorInfo author,
        List<MediaInfo> media,
        List<String> hashtags,
        List<TaggedUserInfo> taggedUsers,
        List<UUID> skippedTagIds,
        long likeCount,
        long commentCount,
        long viewCount,
        boolean isLiked,
        boolean isSaved,
        boolean isOwner,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record AuthorInfo(UUID id, String username, String fullName, String avatarUrl, boolean verified,
                             boolean isFollowing) {
    }

    public record MediaInfo(String url, String mediaType, int displayOrder) {
    }

    public record TaggedUserInfo(UUID id, String username, String avatarUrl) {
    }
}
