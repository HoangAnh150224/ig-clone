package com.instagram.be.config.event;

import com.instagram.be.auth.security.UserPrincipal;
import com.instagram.be.message.service.PresenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

  private final PresenceService presenceService;

  @EventListener
  public void handleWebSocketConnectListener(SessionConnectedEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    UsernamePasswordAuthenticationToken user = (UsernamePasswordAuthenticationToken) headerAccessor.getUser();

    if (user != null && user.getPrincipal() instanceof UserPrincipal principal) {
      UUID userId = principal.getUserId();
      log.debug("WebSocket Connected: User {} ({})", principal.getUsername(), userId);
      presenceService.setOnline(userId);
    }
  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    UsernamePasswordAuthenticationToken user = (UsernamePasswordAuthenticationToken) headerAccessor.getUser();

    if (user != null && user.getPrincipal() instanceof UserPrincipal principal) {
      UUID userId = principal.getUserId();
      log.debug("WebSocket Disconnected: User {} ({})", principal.getUsername(), userId);
      presenceService.setOffline(userId);
    }
  }
}
