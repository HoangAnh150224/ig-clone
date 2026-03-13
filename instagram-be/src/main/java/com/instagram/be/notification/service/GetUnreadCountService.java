package com.instagram.be.notification.service;

import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUnreadCountService extends BaseService<UserOnlyRequest, Long> {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public Long execute(UserOnlyRequest request) {
        return super.execute(request);
    }

    @Override
    protected Long doProcess(UserOnlyRequest request) {
        UUID userId = request.getUserContext().getUserId();
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }
}
