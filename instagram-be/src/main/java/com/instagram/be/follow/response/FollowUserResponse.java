package com.instagram.be.follow.response;

import com.instagram.be.userprofile.UserProfile;

import java.util.UUID;

public record FollowUserResponse(
        UUID id,
        String username,
        String fullName,
        String avatarUrl,
        boolean verified) {

    public static FollowUserResponse from(UserProfile user) {
        return new FollowUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.isVerified()
        );
    }
}
