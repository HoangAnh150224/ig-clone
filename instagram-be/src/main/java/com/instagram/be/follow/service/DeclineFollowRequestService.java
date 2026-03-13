package com.instagram.be.follow.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeclineFollowRequestService extends BaseService<FollowRequest, Void> {

  private final FollowRepository followRepository;

  @Override
  @Transactional
  public Void execute(FollowRequest request) {
    return super.execute(request);
  }

  @Override
  protected Void doProcess(FollowRequest request) {
    UUID currentUserId = request.getUserContext().getUserId();
    UUID requesterId = request.getTargetUserId();

    var follow = followRepository.findByFollowerIdAndFollowingId(requesterId, currentUserId)
      .filter(f -> f.getStatus() == FollowStatus.PENDING)
      .orElseThrow(() -> new NotFoundException("Follow request", requesterId));

    followRepository.delete(follow);

    return null;
  }
}
