package com.instagram.be.auth.jwt;

import com.instagram.be.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private JwtUtil jwtUtil;

    private final String currentSecret = "G-KaPdSgVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A";
    private final String oldSecret = "C&F)J@NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3s6v9y$B&E)H+MbQeThWmZq4t7w";
    private final UUID userId = UUID.randomUUID();
    private final String username = "testuser";
    private final String email = "test@example.com";
    private final String role = "USER";

    @BeforeEach
    void setUp() {
        when(jwtProperties.getExpirationMs()).thenReturn(3600000L); // 1 hour
    }

    private String generateTokenWithSecret(String secret) {
        JwtProperties tempProps = new JwtProperties();
        tempProps.setSecrets(List.of(secret));
        tempProps.setExpirationMs(3600000L);
        JwtUtil tempUtil = new JwtUtil(tempProps);
        return tempUtil.generateToken(userId, username, email, role);
    }

    @Test
    @DisplayName("JWT Validation should succeed with current secret")
    void isTokenValid_WithCurrentSecret_ShouldSucceed() {
        when(jwtProperties.getSecrets()).thenReturn(List.of(currentSecret, oldSecret));

        String token = jwtUtil.generateToken(userId, username, email, role);

        assertTrue(jwtUtil.isTokenValid(token));
        assertEquals(userId, jwtUtil.extractUserId(token));
    }

    @Test
    @DisplayName("JWT Validation should succeed with old secret")
    void isTokenValid_WithOldSecret_ShouldSucceed() {
        // Simulate a token generated with the old secret
        String tokenGeneratedWithOldSecret = generateTokenWithSecret(oldSecret);

        // Configure the main JwtUtil to know about both secrets
        when(jwtProperties.getSecrets()).thenReturn(List.of(currentSecret, oldSecret));

        // The token should be valid because the old secret is in the verification list
        assertTrue(jwtUtil.isTokenValid(tokenGeneratedWithOldSecret));
        assertEquals(userId, jwtUtil.extractUserId(tokenGeneratedWithOldSecret));
    }

    @Test
    @DisplayName("JWT Validation should fail with an invalid secret")
    void isTokenValid_WithInvalidSecret_ShouldFail() {
        String invalidSecret = "invalid-secret-key-that-is-very-long-and-secure";
        String token = generateTokenWithSecret(invalidSecret);

        // Configure JwtUtil to not know about the invalid secret
        when(jwtProperties.getSecrets()).thenReturn(List.of(currentSecret, oldSecret));

        // The validation should fail by throwing a JwtException
        assertThrows(JwtException.class, () -> jwtUtil.extractAllClaims(token));
        assertFalse(jwtUtil.isTokenValid(token));
    }

    @Test
    @DisplayName("Newly generated tokens should use the current (first) secret")
    void generateToken_ShouldUseCurrentSecret() {
        when(jwtProperties.getSecrets()).thenReturn(List.of(currentSecret, oldSecret));

        String token = jwtUtil.generateToken(userId, username, email, role);

        // To verify which key was used, we can try to parse it with ONLY the current secret.
        JwtProperties tempProps = new JwtProperties();
        tempProps.setSecrets(List.of(currentSecret));
        JwtUtil tempUtil = new JwtUtil(tempProps);

        assertDoesNotThrow(() -> {
            Claims claims = tempUtil.extractAllClaims(token);
            assertEquals(userId.toString(), claims.getSubject());
        });
    }

    @Test
    @DisplayName("JWT Validation should fail if no secrets are configured")
    void isTokenValid_WithNoSecrets_ShouldFail() {
        when(jwtProperties.getSecrets()).thenReturn(List.of());

        String token = jwtUtil.generateToken(userId, username, email, role);
        
        assertThrows(IndexOutOfBoundsException.class, () -> jwtUtil.isTokenValid(token));
    }
}
