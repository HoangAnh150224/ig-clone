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

import java.util.List;
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

        List<NotificationResponse> content = page.getContent().stream()
                .map(n -> {
                    boolean isFollowingActor = followRepository.existsByFollowerIdAndFollowingId(userId, n.getActor().getId());
                    FollowUserResponse actorResponse = FollowUserResponse.of(n.getActor(), isFollowingActor, 0);

                    String thumbUrl = null;
                    if (n.getPost() != null) {
                        List<PostMedia> media = postMediaRepository.findByPostIdOrderByDisplayOrderAsc(n.getPost().getId());
                        if (!media.isEmpty()) {
                            thumbUrl = media.get(0).getUrl();
                        }
                    }

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
