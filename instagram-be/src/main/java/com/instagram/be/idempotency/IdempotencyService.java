package com.instagram.be.idempotency;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IdempotencyService {

    private static final Duration TTL = Duration.ofHours(24);

    private final Map<String, Instant> store = new ConcurrentHashMap<>();

    public boolean tryStart(String key) {
        cleanupExpired();
        Instant now = Instant.now();
        Instant existing = store.putIfAbsent(key, now);
        if (existing == null) {
            return true;
        }
        if (existing.plus(TTL).isBefore(now)) {
            store.replace(key, existing, now);
            return true;
        }
        return false;
    }

    private void cleanupExpired() {
        Instant now = Instant.now();
        store.entrySet().removeIf(entry -> entry.getValue().plus(TTL).isBefore(now));
    }
}

