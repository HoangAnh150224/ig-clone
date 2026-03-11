package com.instagram.be.follow.response;

import com.instagram.be.follow.Follow;
import com.instagram.be.follow.enums.FollowStatus;

import java.util.UUID;

public record FollowResponse(
        UUID followerId,
        UUID followingId,
        FollowStatus status) {

    public static FollowResponse from(Follow follow) {
        return new FollowResponse(
                follow.getFollower().getId(),
                follow.getFollowing().getId(),
                follow.getStatus()
        );
    }
}
