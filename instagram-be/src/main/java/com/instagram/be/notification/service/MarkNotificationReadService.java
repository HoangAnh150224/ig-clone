package com.instagram.be.notification.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.notification.Notification;
import com.instagram.be.notification.NotificationRepository;
import com.instagram.be.notification.request.NotificationActionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MarkNotificationReadService extends BaseService<NotificationActionRequest, Void> {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public Void execute(NotificationActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(NotificationActionRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UUID notificationId = request.getNotificationId();

        Notification notification = notificationRepository.findById(notificationId)
                .filter(n -> n.getRecipient().getId().equals(userId))
                .orElseThrow(() -> new NotFoundException("Notification", notificationId));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }

        return null;
    }
}
