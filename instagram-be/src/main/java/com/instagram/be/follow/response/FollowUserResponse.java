package com.instagram.be.follow.response;

import com.instagram.be.userprofile.UserProfile;

import java.util.UUID;

public record FollowUserResponse(
        UUID id,
        String username,
        String fullName,
        String avatarUrl,
        boolean verified,
        boolean isFollowing,
        long mutualCount,
        boolean active) {

    public static FollowUserResponse from(UserProfile user) {
        return new FollowUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.isVerified(),
                false,
                0,
                user.isActive()
        );
    }

    public static FollowUserResponse of(UserProfile user, boolean isFollowing) {
        return new FollowUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.isVerified(),
                isFollowing,
                0,
                user.isActive()
        );
    }

    public static FollowUserResponse of(UserProfile user, boolean isFollowing, long mutualCount) {
        return new FollowUserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.isVerified(),
                isFollowing,
                mutualCount,
                user.isActive()
        );
    }
}
