package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.request.LogoutRequest;
import com.instagram.be.exception.AppValidationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LogoutServiceTest {

    @Mock private JwtUtil jwtUtil;
    @Mock private StringRedisTemplate redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;

    @InjectMocks private LogoutService logoutService;

    private static final String TOKEN = "valid.jwt.token";
    private static final String JTI = "test-jti-uuid";

    @Test
    void execute_blacklistsJtiWithCorrectTtl() {
        when(jwtUtil.getRemainingTtlSeconds(TOKEN)).thenReturn(3600L);
        when(jwtUtil.extractJti(TOKEN)).thenReturn(JTI);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        LogoutRequest request = LogoutRequest.builder().token(TOKEN).build();
        logoutService.execute(request);

        verify(valueOperations).set("blacklist:" + JTI, "1", 3600L, TimeUnit.SECONDS);
    }

    @Test
    void execute_noOp_whenTokenAlreadyExpired() {
        when(jwtUtil.getRemainingTtlSeconds(TOKEN)).thenReturn(0L);

        LogoutRequest request = LogoutRequest.builder().token(TOKEN).build();
        logoutService.execute(request);

        verify(redisTemplate, never()).opsForValue();
    }

    @Test
    void execute_throwsAppValidationException_whenTokenIsNull() {
        LogoutRequest request = LogoutRequest.builder().token(null).build();

        assertThatThrownBy(() -> logoutService.execute(request))
                .isInstanceOf(AppValidationException.class)
                .hasMessageContaining("Token is required");
    }
}
