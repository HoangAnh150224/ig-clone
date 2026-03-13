package com.instagram.be.notification.response;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.notification.Notification;
import com.instagram.be.notification.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        NotificationType type,
        FollowUserResponse actor,
        UUID postId,
        String postThumbnailUrl,
        UUID commentId,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getType(),
                FollowUserResponse.from(n.getActor()),
                n.getPost() != null ? n.getPost().getId() : null,
                null, // ThumbnailUrl needs to be fetched separately if needed
                n.getComment() != null ? n.getComment().getId() : null,
                n.isRead(),
                n.getCreatedAt()
        );
    }
}
