package com.instagram.be.follow.service;

import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.Follow;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowRequest;
import com.instagram.be.follow.response.FollowResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.service.CreateNotificationService;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FollowService extends BaseService<FollowRequest, FollowResponse> {

    private final FollowRepository followRepository;
    private final UserProfileRepository userProfileRepository;
    private final BlockRepository blockRepository;
    private final CreateNotificationService notificationService;

    @Override
    @Transactional
    public FollowResponse execute(FollowRequest request) {
        return super.execute(request);
    }

    @Override
    protected FollowResponse doProcess(FollowRequest request) {
        UUID followerId = request.getUserContext().getUserId();
        UUID followingId = request.getTargetUserId();

        if (followerId.equals(followingId)) {
            throw new BusinessException("You cannot follow yourself");
        }

        UserProfile follower = userProfileRepository.findById(followerId)
                .orElseThrow(() -> new NotFoundException("User", followerId));
        UserProfile target = userProfileRepository.findById(followingId)
                .orElseThrow(() -> new NotFoundException("User", followingId));

        if (blockRepository.existsBlockBetween(followerId, followingId)) {
            throw new NotFoundException("User", followingId);
        }

        // Toggle: unfollow if already present
        Optional<Follow> existing = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existing.isPresent()) {
            followRepository.delete(existing.get());
            return new FollowResponse(followerId, followingId, null);
        }

        FollowStatus status = target.isPrivateAccount() ? FollowStatus.PENDING : FollowStatus.ACCEPTED;

        Follow follow = Follow.builder()
                .follower(follower)
                .following(target)
                .status(status)
                .build();

        Follow saved = followRepository.save(follow);

        // Notify target
        NotificationType type = (status == FollowStatus.ACCEPTED) ? NotificationType.FOLLOW : NotificationType.FOLLOW_REQUEST;
        notificationService.create(target, follower, type, null, null);

        return FollowResponse.from(saved);
    }
}
