package com.instagram.be.follow.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowListRequest;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetFollowersService extends BaseService<FollowListRequest, PaginatedResponse<FollowUserResponse>> {

    private final FollowRepository followRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    protected PaginatedResponse<FollowUserResponse> doProcess(FollowListRequest request) {
        UUID targetId = request.getTargetUserId();

        if (!userProfileRepository.existsById(targetId)) {
            throw new NotFoundException("User", targetId);
        }

        Page<FollowUserResponse> page = followRepository
                .findFollowersByUserId(targetId, FollowStatus.ACCEPTED, request.toPageable())
                .map(follow -> FollowUserResponse.from(follow.getFollower()));

        return PaginatedResponse.from(page);
    }
}
