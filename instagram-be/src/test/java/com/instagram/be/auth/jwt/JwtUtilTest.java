package com.instagram.be.auth.jwt;

import com.instagram.be.config.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private static final String TEST_SECRET = "test-secret-key-for-unit-testing-must-be-at-least-32-chars";
    private static final UUID USER_ID = UUID.randomUUID();
    private static final String USERNAME = "testuser";
    private static final String EMAIL = "test@example.com";
    private static final String ROLE = "USER";

    @BeforeEach
    void setUp() {
        JwtProperties props = new JwtProperties();
        props.setSecret(TEST_SECRET);
        props.setExpirationMs(86400000L);
        jwtUtil = new JwtUtil(props);
    }

    @Test
    void generateToken_containsExpectedClaims() {
        String token = jwtUtil.generateToken(USER_ID, USERNAME, EMAIL, ROLE);

        assertThat(jwtUtil.extractUserId(token)).isEqualTo(USER_ID);
        assertThat(jwtUtil.extractUsername(token)).isEqualTo(USERNAME);
        assertThat(jwtUtil.extractEmail(token)).isEqualTo(EMAIL);
        assertThat(jwtUtil.extractRole(token)).isEqualTo(ROLE);
        assertThat(jwtUtil.extractJti(token)).isNotBlank();
    }

    @Test
    void isTokenValid_returnsTrue_forValidToken() {
        String token = jwtUtil.generateToken(USER_ID, USERNAME, EMAIL, ROLE);
        assertThat(jwtUtil.isTokenValid(token)).isTrue();
    }

    @Test
    void isTokenValid_returnsFalse_forExpiredToken() {
        JwtProperties props = new JwtProperties();
        props.setSecret(TEST_SECRET);
        props.setExpirationMs(-1000L); // 1 second in the past
        JwtUtil expiredJwtUtil = new JwtUtil(props);

        String token = expiredJwtUtil.generateToken(USER_ID, USERNAME, EMAIL, ROLE);
        assertThat(expiredJwtUtil.isTokenValid(token)).isFalse();
    }

    @Test
    void isTokenValid_returnsFalse_forTamperedToken() {
        String token = jwtUtil.generateToken(USER_ID, USERNAME, EMAIL, ROLE);
        String tamperedToken = token.substring(0, token.length() - 5) + "xxxxx";
        assertThat(jwtUtil.isTokenValid(tamperedToken)).isFalse();
    }

    @Test
    void getRemainingTtlSeconds_returnsPositiveValue() {
        String token = jwtUtil.generateToken(USER_ID, USERNAME, EMAIL, ROLE);
        assertThat(jwtUtil.getRemainingTtlSeconds(token)).isPositive();
    }

    @Test
    void extractJti_returnsUuidString() {
        String token = jwtUtil.generateToken(USER_ID, USERNAME, EMAIL, ROLE);
        String jti = jwtUtil.extractJti(token);
        assertThat(jti).isNotBlank();
        // Should be parseable as UUID
        UUID.fromString(jti);
    }
}
