package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.request.LogoutRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LogoutService extends BaseService<LogoutRequest, Void> {

  private final JwtUtil jwtUtil;
  private final StringRedisTemplate redisTemplate;

  @Override
  protected Void doProcess(LogoutRequest request) {
    String token = request.getToken();
    if (token == null || token.isBlank()) {
      throw new AppValidationException("Token is required for logout");
    }

    long ttlSeconds = jwtUtil.getRemainingTtlSeconds(token);
    if (ttlSeconds > 0) {
      String jti = jwtUtil.extractJti(token);
      redisTemplate.opsForValue().set("blacklist:" + jti, "1", ttlSeconds, TimeUnit.SECONDS);
    }

    return null;
  }
}
