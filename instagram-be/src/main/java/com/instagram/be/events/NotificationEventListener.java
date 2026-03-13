package com.instagram.be.events;

import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.service.CreateNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {
    private final CreateNotificationService createNotificationService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleFollowEvent(FollowEvent event) {
        createNotificationService.create(event.getTarget(), event.getFollower(), event.getType(), null, null);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleLikeEvent(LikeEvent event) {
        createNotificationService.create(event.getTarget(), event.getLiker(), NotificationType.LIKE, event.getPost(), null);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCommentEvent(CommentEvent event) {
        createNotificationService.create(event.getTarget(), event.getCommenter(), NotificationType.COMMENT, event.getPost(), event.getComment());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCommentLikeEvent(CommentLikeEvent event) {
        createNotificationService.create(event.getTarget(), event.getLiker(), NotificationType.LIKE, event.getPost(), event.getComment());
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleStoryLikeEvent(StoryLikeEvent event) {
        createNotificationService.create(event.getTarget(), event.getLiker(), NotificationType.LIKE, null, null);
    }
}
