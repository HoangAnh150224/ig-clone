package com.instagram.be.block.service;

import com.instagram.be.base.request.PaginatedRequest;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetBlockedUsersService extends BaseService<PaginatedRequest, PaginatedResponse<FollowUserResponse>> {

    private final BlockRepository blockRepository;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<FollowUserResponse> execute(PaginatedRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<FollowUserResponse> doProcess(PaginatedRequest request) {
        UUID userId = request.getUserContext().getUserId();
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());

        Page<UserProfile> blockedUsers = blockRepository.findBlockedUsersByUserId(userId, pageRequest);

        return PaginatedResponse.from(
                blockedUsers.map(u -> FollowUserResponse.of(u, false))
        );
    }
}
