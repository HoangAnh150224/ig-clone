package com.instagram.be.base.util;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.UUID;

public class CursorUtils {

    private CursorUtils() {
    }

    public static String encode(LocalDateTime time, UUID id) {
        long epochMs = time.toInstant(ZoneOffset.UTC).toEpochMilli();
        String raw = epochMs + "_" + id;
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    public static LocalDateTime decodeTime(String cursor) {
        String[] parts = decode(cursor);
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(Long.parseLong(parts[0])), ZoneOffset.UTC);
    }

    public static UUID decodeId(String cursor) {
        String[] parts = decode(cursor);
        return UUID.fromString(parts[1]);
    }

    private static String[] decode(String cursor) {
        String raw = new String(Base64.getDecoder().decode(cursor), StandardCharsets.UTF_8);
        return raw.split("_", 2);
    }
}
