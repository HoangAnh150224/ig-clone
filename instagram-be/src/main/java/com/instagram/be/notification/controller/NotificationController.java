package com.instagram.be.notification.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.notification.request.GetNotificationsRequest;
import com.instagram.be.notification.request.NotificationActionRequest;
import com.instagram.be.notification.response.NotificationResponse;
import com.instagram.be.notification.service.GetNotificationsService;
import com.instagram.be.notification.service.MarkNotificationReadService;
import com.instagram.be.notification.service.MarkNotificationsReadService;
import com.instagram.be.notification.service.GetUnreadNotificationCountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final GetNotificationsService getNotificationsService;
    private final MarkNotificationReadService markNotificationReadService;
    private final MarkNotificationsReadService markNotificationsReadService;
    private final GetUnreadNotificationCountService getUnreadNotificationCountService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<NotificationResponse>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        
        GetNotificationsRequest request = GetNotificationsRequest.builder()
                .page(page)
                .size(size)
                .userContext(ctx)
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(
                getNotificationsService.execute(request), 
                "Notifications retrieved", 
                200));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markOneRead(@PathVariable("id") java.util.UUID id) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));

        NotificationActionRequest request = NotificationActionRequest.builder()
                .notificationId(id)
                .userContext(ctx)
                .build();
        markNotificationReadService.execute(request);

        return ResponseEntity.ok(ApiResponse.success(null, "Notification marked as read", 200));
    }

    @PostMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAllRead() {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
                
        UserOnlyRequest request = UserOnlyRequest.builder().userContext(ctx).build();
        markNotificationsReadService.execute(request);
        
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read", 200));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        UserOnlyRequest request = UserOnlyRequest.builder().userContext(ctx).build();
        return ResponseEntity.ok(ApiResponse.success(getUnreadNotificationCountService.execute(request), "Unread count retrieved", 200));
    }
}
