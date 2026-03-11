package com.instagram.be.auth.response;

import java.util.UUID;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        UUID userId,
        String username,
        String email,
        String role) {

    public static AuthResponse of(String accessToken, long expiresIn, UUID userId,
                                   String username, String email, String role) {
        return new AuthResponse(accessToken, "Bearer", expiresIn, userId, username, email, role);
    }
}
