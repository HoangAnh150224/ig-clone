package com.instagram.be.message.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.message.Message;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID conversationId,
        FollowUserResponse sender,
        String content,
        String mediaUrl,
        String mediaType,
        boolean deleted,
        LocalDateTime createdAt
) {
    public static MessageResponse from(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getConversation().getId(),
                FollowUserResponse.from(message.getSender()),
                message.isDeleted() ? null : message.getContent(),
                message.isDeleted() ? null : message.getMediaUrl(),
                message.getMediaType() != null ? message.getMediaType().name() : null,
                message.isDeleted(),
                message.getCreatedAt()
        );
    }
}
