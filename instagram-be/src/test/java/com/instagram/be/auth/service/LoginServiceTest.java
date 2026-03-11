package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.LoginRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.UserContext;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock private AuthRepository authRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private StringRedisTemplate redisTemplate;
    @Mock private ValueOperations<String, String> valueOperations;

    @InjectMocks private LoginService loginService;

    private static final UUID USER_ID = UUID.randomUUID();
    private static final String USERNAME = "testuser";
    private static final String EMAIL = "test@example.com";
    private static final String RAW_PASSWORD = "password123";
    private static final String ENCODED_PASSWORD = "$2a$10$encodedHash";
    private static final String TOKEN = "jwt.token.here";
    private static final String IP = "127.0.0.1";
    private static final String RATE_KEY = "rate:login:" + IP;

    private UserProfile activeUser;

    @BeforeEach
    void setUp() {
        activeUser = UserProfile.builder()
                .username(USERNAME)
                .email(EMAIL)
                .passwordHash(ENCODED_PASSWORD)
                .role(UserRole.USER)
                .build();

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(jwtUtil.generateToken(any(), anyString(), anyString(), anyString())).thenReturn(TOKEN);
        when(jwtUtil.getRemainingTtlSeconds(TOKEN)).thenReturn(86400L);
    }

    private LoginRequest buildRequest() {
        LoginRequest request = LoginRequest.builder()
                .identifier(USERNAME)
                .password(RAW_PASSWORD)
                .build();
        request.setUserContext(UserContext.builder().ipAddress(IP).build());
        return request;
    }

    @Test
    void execute_success_returnsAuthResponseAndClearsRateLimit() {
        when(valueOperations.get(RATE_KEY)).thenReturn(null);
        when(authRepository.findByUsername(USERNAME)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(RAW_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);

        AuthResponse response = loginService.execute(buildRequest());

        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo(TOKEN);
        assertThat(response.username()).isEqualTo(USERNAME);
        verify(redisTemplate).delete(RATE_KEY);
    }

    @Test
    void execute_throwsBusinessException_onWrongPassword() {
        when(valueOperations.get(RATE_KEY)).thenReturn(null);
        when(authRepository.findByUsername(USERNAME)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(RAW_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);
        when(valueOperations.increment(RATE_KEY)).thenReturn(1L);

        assertThatThrownBy(() -> loginService.execute(buildRequest()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    void execute_throwsBusinessException_onUnknownIdentifier() {
        when(valueOperations.get(RATE_KEY)).thenReturn(null);
        when(authRepository.findByUsername(USERNAME)).thenReturn(Optional.empty());
        when(authRepository.findByEmail(USERNAME)).thenReturn(Optional.empty());
        when(valueOperations.increment(RATE_KEY)).thenReturn(1L);

        assertThatThrownBy(() -> loginService.execute(buildRequest()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Invalid credentials");
    }

    @Test
    void execute_throwsBusinessException_withTooManyRequests_whenRateLimitExceeded() {
        when(valueOperations.get(RATE_KEY)).thenReturn("5");

        assertThatThrownBy(() -> loginService.execute(buildRequest()))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> assertThat(((BusinessException) ex).getHttpStatus())
                        .isEqualTo(HttpStatus.TOO_MANY_REQUESTS));
    }

    @Test
    void execute_incrementsRateLimitCounter_onFailedAttempt() {
        when(valueOperations.get(RATE_KEY)).thenReturn("2");
        when(authRepository.findByUsername(USERNAME)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(RAW_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);
        when(valueOperations.increment(RATE_KEY)).thenReturn(3L);

        assertThatThrownBy(() -> loginService.execute(buildRequest()))
                .isInstanceOf(BusinessException.class);

        verify(valueOperations).increment(RATE_KEY);
    }

    @Test
    void execute_throwsBusinessException_whenAccountIsInactive() {
        UserProfile inactiveUser = UserProfile.builder()
                .username(USERNAME)
                .email(EMAIL)
                .passwordHash(ENCODED_PASSWORD)
                .role(UserRole.USER)
                .active(false)
                .build();

        when(valueOperations.get(RATE_KEY)).thenReturn(null);
        when(authRepository.findByUsername(USERNAME)).thenReturn(Optional.of(inactiveUser));
        when(passwordEncoder.matches(RAW_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);

        assertThatThrownBy(() -> loginService.execute(buildRequest()))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Account is inactive");
    }
}
