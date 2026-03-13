package com.instagram.be.follow.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowListRequest;
import com.instagram.be.follow.response.FollowUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetFollowRequestsService extends BaseService<FollowListRequest, PaginatedResponse<FollowUserResponse>> {

    private final FollowRepository followRepository;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<FollowUserResponse> execute(FollowListRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<FollowUserResponse> doProcess(FollowListRequest request) {
        UUID userId = request.getUserContext().getUserId();
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());

        var page = followRepository.findFollowersByUserId(userId, FollowStatus.PENDING, pageRequest);

        List<FollowUserResponse> content = page.getContent().stream()
                .map(f -> FollowUserResponse.from(f.getFollower()))
                .toList();

        return new PaginatedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        );
    }
}
