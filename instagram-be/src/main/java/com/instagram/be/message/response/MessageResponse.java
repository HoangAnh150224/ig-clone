package com.instagram.be.message.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.message.Message;
import com.instagram.be.post.Post;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID conversationId,
        FollowUserResponse sender,
        String content,
        String mediaUrl,
        String mediaType,
        SharedPostInfo sharedPost,
        boolean deleted,
        LocalDateTime createdAt
) {
    public static MessageResponse from(Message message) {
        SharedPostInfo sharedPostInfo = (!message.isDeleted() && message.getSharedPost() != null)
                ? SharedPostInfo.from(message.getSharedPost())
                : null;

        return new MessageResponse(
                message.getId(),
                message.getConversation().getId(),
                FollowUserResponse.from(message.getSender()),
                message.isDeleted() ? null : message.getContent(),
                message.isDeleted() ? null : message.getMediaUrl(),
                message.getMediaType() != null ? message.getMediaType().name() : null,
                sharedPostInfo,
                message.isDeleted(),
                message.getCreatedAt()
        );
    }

    public record SharedPostInfo(
            UUID id,
            String type,
            String caption,
            FollowUserResponse author
    ) {
        public static SharedPostInfo from(Post post) {
            return new SharedPostInfo(
                    post.getId(),
                    post.getType().name(),
                    post.getCaption(),
                    FollowUserResponse.from(post.getUser())
            );
        }
    }
}
