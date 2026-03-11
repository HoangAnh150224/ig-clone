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

        // Idempotent: return existing follow if already present
        Optional<Follow> existing = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existing.isPresent()) {
            return FollowResponse.from(existing.get());
        }

        FollowStatus status = target.isPrivateAccount() ? FollowStatus.PENDING : FollowStatus.ACCEPTED;

        Follow follow = Follow.builder()
                .follower(follower)
                .following(target)
                .status(status)
                .build();

        return FollowResponse.from(followRepository.save(follow));
    }
}
