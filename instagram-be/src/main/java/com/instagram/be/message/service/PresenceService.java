package com.instagram.be.message.service;

import com.instagram.be.base.redis.RedisKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private static final Duration ONLINE_TTL = Duration.ofMinutes(5); // Heartbeat/TTL for safety
    private final StringRedisTemplate redisTemplate;

    public void setOnline(UUID userId) {
        String key = RedisKeys.online(userId);
        redisTemplate.opsForValue().set(key, "true", ONLINE_TTL);
    }

    public void setOffline(UUID userId) {
        String key = RedisKeys.online(userId);
        redisTemplate.delete(key);
    }

    public boolean isOnline(UUID userId) {
        String key = RedisKeys.online(userId);
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
