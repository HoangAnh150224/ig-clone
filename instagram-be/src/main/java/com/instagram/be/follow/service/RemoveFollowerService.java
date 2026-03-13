package com.instagram.be.follow.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.Follow;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RemoveFollowerService extends BaseService<FollowRequest, Void> {

    private final FollowRepository followRepository;

    @Override
    @Transactional
    public Void execute(FollowRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(FollowRequest request) {
        UUID currentUserId = request.getUserContext().getUserId();
        UUID followerToRemoveId = request.getTargetUserId();

        Follow follow = followRepository.findByFollowerIdAndFollowingId(followerToRemoveId, currentUserId)
                .orElseThrow(() -> new NotFoundException("Follow relationship", followerToRemoveId));

        followRepository.delete(follow);
        return null;
    }
}
