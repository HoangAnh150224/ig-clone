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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private AuthRepository authRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private StringRedisTemplate redisTemplate;
    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private LoginService loginService;

    private UserProfile user;
    private LoginRequest request;

    @BeforeEach
    void setUp() {
        user = UserProfile.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .role(UserRole.USER)
                .active(true)
                .build();

        request = new LoginRequest();
        request.setIdentifier("testuser");
        request.setPassword("password");
        request.setUserContext(UserContext.builder().ipAddress("127.0.0.1").build());
    }

    @Test
    void login_Success() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername(request.getIdentifier())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(any(), any(), any(), any())).thenReturn("token");
        when(jwtUtil.getRemainingTtlSeconds(anyString())).thenReturn(3600L);

        AuthResponse response = loginService.execute(request);

        assertNotNull(response);
        assertEquals("token", response.accessToken());
        assertEquals("testuser", response.username());
        verify(redisTemplate).delete(anyString());
    }

    @Test
    void login_Success_WithEmail() {
        request.setIdentifier("test@example.com");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername("test@example.com")).thenReturn(Optional.empty());
        when(authRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(any(), any(), any(), any())).thenReturn("token");
        when(jwtUtil.getRemainingTtlSeconds(anyString())).thenReturn(3600L);

        AuthResponse response = loginService.execute(request);

        assertNotNull(response);
        assertEquals("test@example.com", response.email());
    }

    @Test
    void login_Success_InactiveUser() {
        user.setActive(false);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername(request.getIdentifier())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(any(), any(), any(), any())).thenReturn("token");
        when(jwtUtil.getRemainingTtlSeconds(anyString())).thenReturn(3600L);

        AuthResponse response = loginService.execute(request);

        assertTrue(user.isActive());
        verify(authRepository).save(user);
        assertNotNull(response);
    }

    @Test
    void login_UserNotFound() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername(request.getIdentifier())).thenReturn(Optional.empty());
        when(authRepository.findByEmail(request.getIdentifier())).thenReturn(Optional.empty());
        when(valueOperations.increment(anyString())).thenReturn(1L);

        assertThrows(BusinessException.class, () -> loginService.execute(request));
        verify(redisTemplate).expire(anyString(), anyLong(), eq(TimeUnit.MINUTES));
    }

    @Test
    void login_UserNotFound_ByEmail() {
        request.setIdentifier("nonexistent@example.com");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername("nonexistent@example.com")).thenReturn(Optional.empty());
        when(authRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());
        when(valueOperations.increment(anyString())).thenReturn(1L);

        assertThrows(BusinessException.class, () -> loginService.execute(request));
        verify(authRepository).findByUsername("nonexistent@example.com");
        verify(authRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void login_InvalidCredentials() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername(request.getIdentifier())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(false);
        when(valueOperations.increment(anyString())).thenReturn(1L);

        assertThrows(BusinessException.class, () -> loginService.execute(request));
        verify(redisTemplate).expire(anyString(), anyLong(), eq(TimeUnit.MINUTES));
    }

    @Test
    void login_PasswordEncoder_ThrowsException() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn(null);
        when(authRepository.findByUsername(request.getIdentifier())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenThrow(new RuntimeException("Encoder failure"));

        assertThrows(RuntimeException.class, () -> loginService.execute(request));
    }

    @Test
    void login_RateLimited() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get(anyString())).thenReturn("5");

        BusinessException exception = assertThrows(BusinessException.class, () -> loginService.execute(request));
        assertTrue(exception.getMessage().contains("Too many login attempts"));
    }
}
