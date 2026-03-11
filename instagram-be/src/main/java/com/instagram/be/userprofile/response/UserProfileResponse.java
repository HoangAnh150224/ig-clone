package com.instagram.be.userprofile.response;

import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.UserRole;

import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String username,
        String fullName,
        String bio,
        String avatarUrl,
        String website,
        boolean verified,
        boolean privateAccount,
        UserRole role,
        long followersCount,
        long followingCount,
        // Social context — computed relative to the viewer
        boolean isFollowing,
        boolean isPending,
        boolean canViewContent) {

    public static UserProfileResponse of(UserProfile user,
                                          long followersCount,
                                          long followingCount,
                                          boolean isFollowing,
                                          boolean isPending,
                                          boolean canViewContent) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getWebsite(),
                user.isVerified(),
                user.isPrivateAccount(),
                user.getRole(),
                followersCount,
                followingCount,
                isFollowing,
                isPending,
                canViewContent
        );
    }
}
