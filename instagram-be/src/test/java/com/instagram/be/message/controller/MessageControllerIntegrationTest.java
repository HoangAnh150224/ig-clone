package com.instagram.be.message.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.filter.GlobalRateLimitFilter;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.base.response.CursorResponse;
import com.instagram.be.exception.GlobalExceptionHandler;
import com.instagram.be.message.request.SendMessageRequest;
import com.instagram.be.message.response.ConversationResponse;
import com.instagram.be.message.response.MessageResponse;
import com.instagram.be.message.service.*;
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

@WebMvcTest(MessageController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class MessageControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GetConversationsService getConversationsService;
    @MockitoBean
    private GetMessageRequestsService getMessageRequestsService;
    @MockitoBean
    private GetMessagesService getMessagesService;
    @MockitoBean
    private SendMessageService sendMessageService;
    @MockitoBean
    private MarkReadService markReadService;
    @MockitoBean
    private AcceptMessageRequestService acceptMessageRequestService;
    @MockitoBean
    private DeleteMessageService deleteMessageService;
    @MockitoBean
    private DeleteConversationService deleteConversationService;

    // Security & filters mocks
    @MockitoBean private RateLimiter rateLimiter;
    @MockitoBean private StringRedisTemplate redisTemplate;
    @MockitoBean private GlobalRateLimitFilter globalRateLimitFilter;
    @MockitoBean private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void getConversations_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        ConversationResponse conv = new ConversationResponse(
                UUID.randomUUID(), null, false, null, 0, false, null
        );

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(getConversationsService.execute(any())).thenReturn(List.of(conv));

            mockMvc.perform(get("/messages"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.data").isArray());
        }
    }

    @Test
    @WithMockUser
    void getMessages_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();
        UUID conversationId = UUID.randomUUID();

        MessageResponse msg = new MessageResponse(
                UUID.randomUUID(), null, null, "Hello", null, null, null, false, LocalDateTime.now()
        );
        CursorResponse<MessageResponse> response = new CursorResponse<>(List.of(msg), null, false);

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(getMessagesService.execute(any())).thenReturn(response);

            mockMvc.perform(get("/messages/{conversationId}", conversationId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.data.content").isArray());
        }
    }

    @Test
    @WithMockUser
    void sendMessage_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        SendMessageRequest request = new SendMessageRequest();
        request.setRecipientId(UUID.randomUUID());
        request.setContent("Hi there");

        MessageResponse response = new MessageResponse(
                UUID.randomUUID(), null, null, "Hi there", null, null, null, false, LocalDateTime.now()
        );

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(sendMessageService.execute(any())).thenReturn(response);

            mockMvc.perform(post("/messages")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.data.content").value("Hi there"));
        }
    }
}
