package com.instagram.be.follow.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.Follow;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowListRequest;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetFollowersService extends BaseService<FollowListRequest, PaginatedResponse<FollowUserResponse>> {

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

    Page<Follow> followPage = followRepository
      .findFollowersByUserId(targetId, FollowStatus.ACCEPTED, request.toPageable());

    Set<UUID> followerIds = followPage.getContent().stream()
      .map(f -> f.getFollower().getId()).collect(Collectors.toSet());

    Set<UUID> followedByViewer = (viewerId != null && !followerIds.isEmpty())
      ? followRepository.findFollowedIds(viewerId, followerIds)
      : Set.of();

    Page<FollowUserResponse> page = followPage.map(follow ->
      FollowUserResponse.of(follow.getFollower(), followedByViewer.contains(follow.getFollower().getId())));

    return PaginatedResponse.from(page);
  }
}
