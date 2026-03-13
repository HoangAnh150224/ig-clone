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
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetFollowingService extends BaseService<FollowListRequest, PaginatedResponse<FollowUserResponse>> {

  private final FollowRepository followRepository;
  private final UserProfileRepository userProfileRepository;

  @Override
  @Transactional(readOnly = true)
  public PaginatedResponse<FollowUserResponse> execute(FollowListRequest request) {
    return super.execute(request);
  }

  @Override
  protected PaginatedResponse<FollowUserResponse> doProcess(FollowListRequest request) {
    UUID targetId = request.getTargetUserId();
    UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

    if (!userProfileRepository.existsById(targetId)) {
      throw new NotFoundException("User", targetId);
    }

    Page<FollowUserResponse> page = followRepository
      .findFollowingByUserId(targetId, FollowStatus.ACCEPTED, request.toPageable())
      .map(follow -> {
        boolean isFollowing = false;
        if (viewerId != null) {
          isFollowing = followRepository.existsByFollowerIdAndFollowingId(viewerId, follow.getFollowing().getId());
        }
        return FollowUserResponse.of(follow.getFollowing(), isFollowing);
      });

    return PaginatedResponse.from(page);
  }
}
