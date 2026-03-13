package com.instagram.be.message.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.message.request.ConversationActionRequest;
import com.instagram.be.message.request.GetMessagesRequest;
import com.instagram.be.message.request.MessageActionRequest;
import com.instagram.be.message.request.SendMessageRequest;
import com.instagram.be.message.response.ConversationResponse;
import com.instagram.be.message.response.MessageResponse;
import com.instagram.be.message.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final GetConversationsService getConversationsService;
    private final GetMessageRequestsService getMessageRequestsService;
    private final GetMessagesService getMessagesService;
    private final SendMessageService sendMessageService;
    private final MarkReadService markReadService;
    private final AcceptMessageRequestService acceptMessageRequestService;
    private final DeleteMessageService deleteMessageService;
    private final DeleteConversationService deleteConversationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations() {
        var request = UserOnlyRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .build();
        return ResponseEntity.ok(ApiResponse.success(getConversationsService.execute(request), "Conversations retrieved", 200));
    }

    @GetMapping("/requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getMessageRequests() {
        var request = UserOnlyRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .build();
        return ResponseEntity.ok(ApiResponse.success(getMessageRequestsService.execute(request), "Message requests retrieved", 200));
    }

    @GetMapping("/{conversationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<MessageResponse>>> getMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var request = GetMessagesRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .conversationId(conversationId)
                .page(page)
                .size(size)
                .build();
        return ResponseEntity.ok(ApiResponse.success(getMessagesService.execute(request), "Messages retrieved", 200));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(@RequestBody SendMessageRequest body) {
        var request = SendMessageRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .recipientId(body.getRecipientId())
                .content(body.getContent())
                .mediaUrl(body.getMediaUrl())
                .mediaType(body.getMediaType())
                .sharedPostId(body.getSharedPostId())
                .build();
        return ResponseEntity.ok(ApiResponse.success(sendMessageService.execute(request), "Message sent", 200));
    }

    @PostMapping("/{conversationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable UUID conversationId) {
        var request = MessageActionRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .conversationId(conversationId)
                .build();
        markReadService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read", 200));
    }

    @PostMapping("/{conversationId}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> acceptRequest(@PathVariable UUID conversationId) {
        var request = MessageActionRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .conversationId(conversationId)
                .build();
        acceptMessageRequestService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Request accepted", 200));
    }

    @DeleteMapping("/{conversationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(@PathVariable UUID conversationId) {
        var request = ConversationActionRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .conversationId(conversationId)
                .build();
        deleteConversationService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Conversation deleted", 200));
    }

    @DeleteMapping("/{conversationId}/{messageId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(
            @PathVariable UUID conversationId,
            @PathVariable UUID messageId) {
        var request = MessageActionRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .conversationId(conversationId)
                .messageId(messageId)
                .build();
        deleteMessageService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Message deleted", 200));
    }
}
