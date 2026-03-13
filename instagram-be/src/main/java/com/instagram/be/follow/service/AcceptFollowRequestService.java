package com.instagram.be.follow.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.request.FollowRequest;
import com.instagram.be.follow.response.FollowResponse;
import com.instagram.be.message.service.AutoAcceptConversationService;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.service.CreateNotificationService;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AcceptFollowRequestService extends BaseService<FollowRequest, FollowResponse> {

  private final FollowRepository followRepository;
  private final UserProfileRepository userProfileRepository;
  private final CreateNotificationService notificationService;
  private final AutoAcceptConversationService autoAcceptConversationService;

  @Override
  @Transactional
  public FollowResponse execute(FollowRequest request) {
    return super.execute(request);
  }

  @Override
  protected FollowResponse doProcess(FollowRequest request) {
    UUID currentUserId = request.getUserContext().getUserId();
    UUID requesterId = request.getTargetUserId();

    var follow = followRepository.findByFollowerIdAndFollowingId(requesterId, currentUserId)
      .filter(f -> f.getStatus() == FollowStatus.PENDING)
      .orElseThrow(() -> new NotFoundException("Follow request", requesterId));

    follow.setStatus(FollowStatus.ACCEPTED);
    followRepository.save(follow);

    // Notify the requester that their request was accepted
    UserProfile currentUser = userProfileRepository.getReferenceById(currentUserId);
    UserProfile requester = userProfileRepository.getReferenceById(requesterId);
    notificationService.create(requester, currentUser, NotificationType.FOLLOW_ACCEPTED, null, null);

    // Auto-accept any pending message request from requester → current user
    autoAcceptConversationService.accept(requesterId, currentUserId);

    return FollowResponse.from(follow);
  }
}
