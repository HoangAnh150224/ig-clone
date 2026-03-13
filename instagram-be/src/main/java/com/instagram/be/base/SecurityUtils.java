package com.instagram.be.base;

import com.instagram.be.auth.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

public class SecurityUtils {

  private SecurityUtils() {
  }

  public static Optional<UserPrincipal> getCurrentPrincipal() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
      return Optional.of(principal);
    }
    return Optional.empty();
  }

  public static Optional<UserContext> getCurrentUserContext() {
    return getCurrentPrincipal().map(principal ->
      UserContext.builder()
        .userId(principal.getUserId())
        .username(principal.getUsername())
        .email(principal.getEmail())
        .roles(principal.getAuthorities().stream()
          .map(a -> a.getAuthority().replace("ROLE_", ""))
          .collect(Collectors.toSet()))
        .build()
    );
  }

  public static Optional<UUID> getCurrentUserId() {
    return getCurrentPrincipal().map(UserPrincipal::getUserId);
  }
}
