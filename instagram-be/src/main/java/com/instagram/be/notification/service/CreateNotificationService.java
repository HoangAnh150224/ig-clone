package com.instagram.be.notification.service;

import com.instagram.be.comment.Comment;
import com.instagram.be.notification.Notification;
import com.instagram.be.notification.repository.NotificationRepository;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.response.NotificationResponse;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CreateNotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void create(UserProfile recipient, UserProfile actor, NotificationType type, Post post, Comment comment) {
        // Don't notify yourself
        if (recipient.getId().equals(actor.getId())) {
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(type)
                .post(post)
                .comment(comment)
                .read(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationResponse response = NotificationResponse.from(saved);

        // Real-time push
        messagingTemplate.convertAndSendToUser(
                recipient.getId().toString(),
                "/queue/notifications",
                response
        );

        log.debug("Notification created: {} for user {}", type, recipient.getUsername());
    }
}
