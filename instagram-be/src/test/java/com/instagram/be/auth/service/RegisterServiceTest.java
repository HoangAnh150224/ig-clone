package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.RegisterRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.exception.DuplicateResourceException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterServiceTest {

    @Mock
    private AuthRepository authRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private RateLimiter rateLimiter;

    @InjectMocks
    private RegisterService registerService;

    private RegisterRequest request;

    @BeforeEach
    void setUp() {
        request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setFullName("Test User");
        request.setUserContext(UserContext.builder().ipAddress("127.0.0.1").build());
    }

    @Test
    void register_Success() {
        UserProfile user = UserProfile.builder()
                .id(UUID.randomUUID())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash("hashed")
                .role(UserRole.USER)
                .build();

        when(authRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(authRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(authRepository.save(any(UserProfile.class))).thenReturn(user);
        when(jwtUtil.generateToken(any(), any(), any(), any())).thenReturn("token");
        when(jwtUtil.getRemainingTtlSeconds(anyString())).thenReturn(3600L);

        AuthResponse response = registerService.execute(request);

        assertNotNull(response);
        assertEquals("token", response.accessToken());
        assertEquals(request.getUsername(), response.username());
        verify(authRepository).save(any(UserProfile.class));
    }

    @Test
    void register_UsernameExists() {
        when(authRepository.existsByUsername(request.getUsername())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> registerService.execute(request));
    }

    @Test
    void register_EmailExists() {
        when(authRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(authRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> registerService.execute(request));
    }

    @Test
    void register_PasswordEncodingFailure() {
        when(authRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(authRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenThrow(new RuntimeException("Encoding failed"));

        assertThrows(RuntimeException.class, () -> registerService.execute(request));
    }
}
