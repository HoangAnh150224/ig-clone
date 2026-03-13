package com.instagram.be.message.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReadStatusResponse(
        UUID conversationId,
        UUID userId,
        LocalDateTime readAt
) {
}
