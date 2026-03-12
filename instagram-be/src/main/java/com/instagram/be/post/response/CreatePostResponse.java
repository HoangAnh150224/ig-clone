package com.instagram.be.post.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreatePostResponse(UUID id, LocalDateTime createdAt) {
}
