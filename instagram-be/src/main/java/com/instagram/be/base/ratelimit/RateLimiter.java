package com.instagram.be.base.ratelimit;

import com.instagram.be.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RateLimiter {

    private final StringRedisTemplate redisTemplate;

    /**
     * Increments counter every call. Throws 429 if limit exceeded.
     */
    public void check(String key, int maxAttempts, long ttlMinutes) {
        String count = redisTemplate.opsForValue().get(key);
        if (count != null && Integer.parseInt(count) >= maxAttempts) {
            throw new BusinessException("Too many requests. Try again later.", HttpStatus.TOO_MANY_REQUESTS);
        }
        Long n = redisTemplate.opsForValue().increment(key);
        if (Long.valueOf(1).equals(n)) {
            redisTemplate.expire(key, ttlMinutes, TimeUnit.MINUTES);
        }
    }
}
