package com.instagram.be.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.request.LoginRequest;
import com.instagram.be.auth.request.RegisterRequest;
import com.instagram.be.auth.response.AuthResponse;
import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.auth.service.*;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.filter.GlobalRateLimitFilter;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.DuplicateResourceException;
import com.instagram.be.storage.CloudinaryService;
import com.instagram.be.userprofile.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable filters to simplify for now, or mock all filter dependencies
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private RegisterService registerService;
    @MockitoBean
    private LoginService loginService;
    @MockitoBean
    private LogoutService logoutService;
    @MockitoBean
    private GetMeService getMeService;
    @MockitoBean
    private ChangePasswordService changePasswordService;
    @MockitoBean
    private ForgotPasswordService forgotPasswordService;
    @MockitoBean
    private ResetPasswordService resetPasswordService;
    @MockitoBean
    private RefreshTokenService refreshTokenService;

    @MockitoBean
    private CloudinaryService cloudinaryService;
    @MockitoBean
    private JwtUtil jwtUtil;
    @MockitoBean
    private RateLimiter rateLimiter;
    @MockitoBean
    private StringRedisTemplate redisTemplate;
    @MockitoBean
    private GlobalRateLimitFilter globalRateLimitFilter;

    @Test
    void register_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setFullName("Test User");

        AuthResponse response = AuthResponse.of("token", "refresh-token", 3600, UUID.randomUUID(), "testuser", "test@example.com", "USER");

        when(registerService.execute(any())).thenReturn(response);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.data.accessToken").value("token"));
    }

    @Test
    void register_ExistingUsername() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setEmail("test@example.com");
        request.setPassword("password");

        when(registerService.execute(any())).thenThrow(new DuplicateResourceException("Username already exists"));

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.code").value(409))
                .andExpect(jsonPath("$.message").value("Username already exists"));
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("testuser");
        request.setPassword("password");

        AuthResponse response = AuthResponse.of("token", "refresh-token", 3600, UUID.randomUUID(), "testuser", "test@example.com", "USER");

        when(loginService.execute(any())).thenReturn(response);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.accessToken").value("token"));
    }

    @Test
    void login_InvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("testuser");
        request.setPassword("wrongpassword");

        when(loginService.execute(any())).thenThrow(new BusinessException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    @WithMockUser
    void getMe_Success() throws Exception {
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();
        MeResponse response = new MeResponse(userId, "testuser", "test@example.com", "Test User", null, null, null, null, null, null, null, false, false, false, null, UserRole.USER, null);

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(getMeService.execute(any())).thenReturn(response);

            mockMvc.perform(get("/auth/me"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.username").value("testuser"));
        }
    }

    @Test
    void getMe_NotAuthenticated() throws Exception {
        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.empty());

            mockMvc.perform(get("/auth/me"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value("ERROR"))
                    .andExpect(jsonPath("$.code").value(401));
        }
    }

    @Test
    void refresh_Success() throws Exception {
        var request = com.instagram.be.auth.request.RefreshTokenRequest.builder().refreshToken("valid-refresh-token").build();

        AuthResponse response = AuthResponse.of("new-access-token", "new-refresh-token", 900, UUID.randomUUID(), "testuser", "test@example.com", "USER");

        when(refreshTokenService.execute(any())).thenReturn(response);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.data.refreshToken").value("new-refresh-token"));
    }

    @Test
    void refresh_InvalidToken() throws Exception {
        var request = com.instagram.be.auth.request.RefreshTokenRequest.builder().refreshToken("invalid-token").build();

        when(refreshTokenService.execute(any())).thenThrow(new BusinessException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED));

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.message").value("Invalid or expired refresh token"));
    }

    @Test
    void logout_Success() throws Exception {
        mockMvc.perform(post("/auth/logout")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    @WithMockUser
    void changePassword_Success() throws Exception {
        var request = new com.instagram.be.auth.request.ChangePasswordRequest();
        request.setCurrentPassword("oldPass");
        request.setNewPassword("newPass123");

        UserContext context = UserContext.builder().userId(UUID.randomUUID()).build();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));

            mockMvc.perform(post("/auth/change-password")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.code").value(200));
        }
    }

    @Test
    void forgotPassword_Success() throws Exception {
        var request = new com.instagram.be.auth.request.ForgotPasswordRequest();
        request.setEmail("test@example.com");

        mockMvc.perform(post("/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    void resetPassword_Success() throws Exception {
        var request = new com.instagram.be.auth.request.ResetPasswordRequest();
        request.setEmail("test@example.com");
        request.setOtp("123456");
        request.setNewPassword("newPass123");

        mockMvc.perform(post("/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(200));
    }
}
