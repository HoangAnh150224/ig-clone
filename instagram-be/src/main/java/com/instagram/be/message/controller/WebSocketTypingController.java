package com.instagram.be.message.controller;

import com.instagram.be.auth.security.UserPrincipal;
import com.instagram.be.message.request.TypingStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketTypingController {

  private final SimpMessagingTemplate messagingTemplate;

  @MessageMapping("/chat.typing")
  public void handleTyping(@Payload TypingStatus status, Authentication authentication) {
    if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
      status.setUsername(principal.getUsername());
      UUID recipientId = status.getRecipientId();

      log.debug("WebSocket chat.typing from: {} to: {} is: {}",
        principal.getUsername(), recipientId, status.isTyping());

      messagingTemplate.convertAndSendToUser(
        recipientId.toString(),
        "/queue/typing",
        status
      );
    }
  }
}
