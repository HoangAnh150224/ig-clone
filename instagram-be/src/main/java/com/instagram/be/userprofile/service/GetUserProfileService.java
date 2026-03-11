package com.instagram.be.userprofile.service;

import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.request.GetUserProfileRequest;
import com.instagram.be.userprofile.response.UserProfileResponse;
import com.instagram.be.base.service.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUserProfileService extends BaseService<GetUserProfileRequest, UserProfileResponse> {

    private final UserProfileRepository userProfileRepository;
    private final FollowRepository followRepository;
    private final BlockRepository blockRepository;

    @Override
    protected UserProfileResponse doProcess(GetUserProfileRequest request) {
        UUID targetId = request.getTargetUserId();
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

        UserProfile target = userProfileRepository.findById(targetId)
                .orElseThrow(() -> new NotFoundException("User", targetId));

        // If either side has blocked the other, treat profile as not found
        if (viewerId != null && !viewerId.equals(targetId)) {
            if (blockRepository.existsBlockBetween(viewerId, targetId)) {
                throw new NotFoundException("User", targetId);
            }
        }

        long followersCount = followRepository.countByFollowingIdAndStatus(targetId, FollowStatus.ACCEPTED);
        long followingCount = followRepository.countByFollowerIdAndStatus(targetId, FollowStatus.ACCEPTED);

        boolean isFollowing = false;
        boolean isPending = false;

        if (viewerId != null && !viewerId.equals(targetId)) {
            Optional<com.instagram.be.follow.Follow> follow =
                    followRepository.findByFollowerIdAndFollowingId(viewerId, targetId);
            if (follow.isPresent()) {
                isFollowing = follow.get().getStatus() == FollowStatus.ACCEPTED;
                isPending = follow.get().getStatus() == FollowStatus.PENDING;
            }
        }

        boolean isOwner = viewerId != null && viewerId.equals(targetId);
        boolean canViewContent = !target.isPrivateAccount() || isFollowing || isOwner;

        return UserProfileResponse.of(target, followersCount, followingCount, isFollowing, isPending, canViewContent);
    }
}
