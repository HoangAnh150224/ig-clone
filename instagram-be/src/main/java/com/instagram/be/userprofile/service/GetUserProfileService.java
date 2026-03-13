package com.instagram.be.userprofile.service;

import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.post.PostRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.request.GetUserProfileRequest;
import com.instagram.be.userprofile.response.UserProfileResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.message.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUserProfileService extends BaseService<GetUserProfileRequest, UserProfileResponse> {

    private final UserProfileRepository userProfileRepository;
    private final FollowRepository followRepository;
    private final BlockRepository blockRepository;
    private final PostRepository postRepository;
    private final PresenceService presenceService;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse execute(GetUserProfileRequest request) {
        return super.execute(request);
    }

    @Override
    protected UserProfileResponse doProcess(GetUserProfileRequest request) {
        String targetUsername = request.getTargetUsername();
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

        UserProfile target = userProfileRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new NotFoundException("User not found: " + targetUsername));
        UUID targetId = target.getId();

        if (!target.isActive()) {
            throw new NotFoundException("User not found: " + targetUsername);
        }

        // If either side has blocked the other, treat profile as not found
        if (viewerId != null && !viewerId.equals(targetId)) {
            if (blockRepository.existsBlockBetween(viewerId, targetId)) {
                throw new NotFoundException("User", targetId);
            }
        }

        long followersCount = followRepository.countByFollowingIdAndStatus(targetId, FollowStatus.ACCEPTED);
        long followingCount = followRepository.countByFollowerIdAndStatus(targetId, FollowStatus.ACCEPTED);
        long postsCount = postRepository.countByUserIdAndArchivedFalse(targetId);

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

        boolean isOnline = false;
        if (target.isShowActivityStatus()) {
            isOnline = presenceService.isOnline(targetId);
        }

        return UserProfileResponse.of(target, followersCount, followingCount, postsCount, isFollowing, isPending, isOnline, canViewContent);
    }
}
