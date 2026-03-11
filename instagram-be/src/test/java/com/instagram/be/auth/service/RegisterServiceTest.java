package com.instagram.be.auth.service;

import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.RegisterRequest;
import com.instagram.be.auth.response.AuthResponse;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegisterServiceTest {

    @Mock private AuthRepository authRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks private RegisterService registerService;

    private static final UUID USER_ID = UUID.randomUUID();
    private static final String USERNAME = "newuser";
    private static final String EMAIL = "new@example.com";
    private static final String RAW_PASSWORD = "password123";
    private static final String ENCODED_PASSWORD = "$2a$10$encodedHash";
    private static final String TOKEN = "jwt.token.here";

    @BeforeEach
    void setUp() {
        when(authRepository.existsByUsername(USERNAME)).thenReturn(false);
        when(authRepository.existsByEmail(EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(RAW_PASSWORD)).thenReturn(ENCODED_PASSWORD);

        UserProfile savedUser = UserProfile.builder()
                .username(USERNAME)
                .email(EMAIL)
                .passwordHash(ENCODED_PASSWORD)
                .role(UserRole.USER)
                .build();
        // Simulate saved user with ID
        when(authRepository.save(any(UserProfile.class))).thenAnswer(inv -> {
            UserProfile u = inv.getArgument(0);
            // Use reflection-free approach: return a new builder copy with a generated ID
            return UserProfile.builder()
                    .username(u.getUsername())
                    .email(u.getEmail())
                    .passwordHash(u.getPasswordHash())
                    .fullName(u.getFullName())
                    .role(u.getRole())
                    .build();
        });
        when(jwtUtil.generateToken(any(), anyString(), anyString(), anyString())).thenReturn(TOKEN);
        when(jwtUtil.getRemainingTtlSeconds(TOKEN)).thenReturn(86400L);
    }

    @Test
    void execute_success_createsUserAndReturnsAuthResponse() {
        RegisterRequest request = RegisterRequest.builder()
                .username(USERNAME)
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        AuthResponse response = registerService.execute(request);

        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo(TOKEN);
        assertThat(response.tokenType()).isEqualTo("Bearer");
        assertThat(response.username()).isEqualTo(USERNAME);
        assertThat(response.email()).isEqualTo(EMAIL);
        assertThat(response.role()).isEqualTo("USER");
        verify(authRepository).save(any(UserProfile.class));
    }

    @Test
    void execute_throwsDuplicateResourceException_whenUsernameExists() {
        when(authRepository.existsByUsername(USERNAME)).thenReturn(true);

        RegisterRequest request = RegisterRequest.builder()
                .username(USERNAME)
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        assertThatThrownBy(() -> registerService.execute(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Username already exists");
    }

    @Test
    void execute_throwsDuplicateResourceException_whenEmailExists() {
        when(authRepository.existsByEmail(EMAIL)).thenReturn(true);

        RegisterRequest request = RegisterRequest.builder()
                .username(USERNAME)
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        assertThatThrownBy(() -> registerService.execute(request))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    void execute_encodesPassword_neverStoresRawPassword() {
        RegisterRequest request = RegisterRequest.builder()
                .username(USERNAME)
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        registerService.execute(request);

        verify(passwordEncoder).encode(RAW_PASSWORD);
        verify(authRepository).save(argThat(user ->
                ENCODED_PASSWORD.equals(user.getPasswordHash()) &&
                !RAW_PASSWORD.equals(user.getPasswordHash())
        ));
    }
}
