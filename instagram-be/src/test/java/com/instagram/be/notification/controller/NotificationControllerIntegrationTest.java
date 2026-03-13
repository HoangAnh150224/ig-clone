package com.instagram.be.notification.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.filter.GlobalRateLimitFilter;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.base.response.CursorResponse;
import com.instagram.be.exception.GlobalExceptionHandler;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.response.NotificationResponse;
import com.instagram.be.notification.service.GetNotificationsService;
import com.instagram.be.notification.service.GetUnreadNotificationCountService;
import com.instagram.be.notification.service.MarkNotificationReadService;
import com.instagram.be.notification.service.MarkNotificationsReadService;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificationController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GetNotificationsService getNotificationsService;
    @MockitoBean
    private MarkNotificationReadService markNotificationReadService;
    @MockitoBean
    private MarkNotificationsReadService markNotificationsReadService;
    @MockitoBean
    private GetUnreadNotificationCountService getUnreadNotificationCountService;

    // Security & filters mocks
    @MockitoBean private RateLimiter rateLimiter;
    @MockitoBean private StringRedisTemplate redisTemplate;
    @MockitoBean private GlobalRateLimitFilter globalRateLimitFilter;
    @MockitoBean private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void getNotifications_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        NotificationResponse notif = new NotificationResponse(
                UUID.randomUUID(), NotificationType.LIKE, null, null, null, null, false, LocalDateTime.now()
        );
        CursorResponse<NotificationResponse> response = new CursorResponse<>(List.of(notif), null, false);

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(getNotificationsService.execute(any())).thenReturn(response);

            mockMvc.perform(get("/notifications"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.data.content").isArray());
        }
    }

    @Test
    @WithMockUser
    void markOneRead_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();
        UUID notifId = UUID.randomUUID();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));

            mockMvc.perform(patch("/notifications/{id}/read", notifId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.message").value("Notification marked as read"));
        }
    }

    @Test
    @WithMockUser
    void getUnreadCount_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(getUnreadNotificationCountService.execute(any())).thenReturn(5L);

            mockMvc.perform(get("/notifications/unread-count"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.data").value(5));
        }
    }
}
