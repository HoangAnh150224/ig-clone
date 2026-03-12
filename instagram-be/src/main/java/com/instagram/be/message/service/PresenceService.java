package com.instagram.be.message.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private final StringRedisTemplate redisTemplate;
    private static final String ONLINE_KEY_PREFIX = "online:";
    private static final Duration ONLINE_TTL = Duration.ofMinutes(5); // Heartbeat/TTL for safety

    public void setOnline(UUID userId) {
        String key = ONLINE_KEY_PREFIX + userId.toString();
        redisTemplate.opsForValue().set(key, "true", ONLINE_TTL);
    }

    public void setOffline(UUID userId) {
        String key = ONLINE_KEY_PREFIX + userId.toString();
        redisTemplate.delete(key);
    }

    public boolean isOnline(UUID userId) {
        String key = ONLINE_KEY_PREFIX + userId.toString();
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
