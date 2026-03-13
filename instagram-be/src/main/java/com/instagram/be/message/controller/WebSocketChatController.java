package com.instagram.be.message.controller;

import com.instagram.be.auth.security.UserPrincipal;
import com.instagram.be.base.UserContext;
import com.instagram.be.message.request.SendMessageRequest;
import com.instagram.be.message.service.SendMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.stream.Collectors;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketChatController {

    private final SendMessageService sendMessageService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest payload, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            log.error("WebSocket chat.send: Unauthorized");
            return;
        }

        UserContext ctx = UserContext.builder()
                .userId(principal.getUserId())
                .username(principal.getUsername())
                .email(principal.getEmail())
                .roles(principal.getAuthorities().stream()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .collect(Collectors.toSet()))
                .build();

        payload.setUserContext(ctx);

        log.debug("WebSocket chat.send from user: {} to: {}", principal.getUsername(), payload.getRecipientId());
        sendMessageService.execute(payload);
    }
}
