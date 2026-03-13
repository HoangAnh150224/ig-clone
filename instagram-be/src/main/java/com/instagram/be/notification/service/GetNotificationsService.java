package com.instagram.be.notification.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.notification.Notification;
import com.instagram.be.notification.repository.NotificationRepository;
import com.instagram.be.notification.request.GetNotificationsRequest;
import com.instagram.be.notification.response.NotificationResponse;
import com.instagram.be.post.PostMedia;
import com.instagram.be.post.repository.PostMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetNotificationsService extends BaseService<GetNotificationsRequest, PaginatedResponse<NotificationResponse>> {

  private final NotificationRepository notificationRepository;
  private final FollowRepository followRepository;
  private final PostMediaRepository postMediaRepository;

  @Override
  @Transactional(readOnly = true)
  public PaginatedResponse<NotificationResponse> execute(GetNotificationsRequest request) {
    return super.execute(request);
  }

  @Override
  protected PaginatedResponse<NotificationResponse> doProcess(GetNotificationsRequest request) {
    UUID userId = request.getUserContext().getUserId();
    PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());

    Page<Notification> page = notificationRepository.findByRecipientId(userId, pageRequest);
    List<Notification> notifications = page.getContent();

    // Batch-load follow statuses for all actors
    Set<UUID> actorIds = notifications.stream().map(n -> n.getActor().getId()).collect(Collectors.toSet());
    Set<UUID> followedActorIds = actorIds.isEmpty()
      ? Collections.emptySet()
      : followRepository.findFollowedIds(userId, actorIds);

    // Batch-load first media URL for all posts in notifications
    Set<UUID> postIds = notifications.stream()
      .filter(n -> n.getPost() != null)
      .map(n -> n.getPost().getId())
      .collect(Collectors.toSet());

    Map<UUID, String> thumbUrlByPost = Collections.emptyMap();
    if (!postIds.isEmpty()) {
      thumbUrlByPost = postMediaRepository.findByPostIds(postIds).stream()
        .collect(Collectors.toMap(
          pm -> pm.getPost().getId(),
          PostMedia::getUrl,
          (existing, replacement) -> existing  // keep first (lowest displayOrder)
        ));
    }

    final Map<UUID, String> thumbs = thumbUrlByPost;
    List<NotificationResponse> content = notifications.stream()
      .map(n -> {
        boolean isFollowingActor = followedActorIds.contains(n.getActor().getId());
        FollowUserResponse actorResponse = FollowUserResponse.of(n.getActor(), isFollowingActor, 0);
        String thumbUrl = n.getPost() != null ? thumbs.get(n.getPost().getId()) : null;

        return new NotificationResponse(
          n.getId(),
          n.getType(),
          actorResponse,
          n.getPost() != null ? n.getPost().getId() : null,
          thumbUrl,
          n.getComment() != null ? n.getComment().getId() : null,
          n.isRead(),
          n.getCreatedAt()
        );
      })
      .collect(Collectors.toList());

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
