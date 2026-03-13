package com.instagram.be.userprofile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.auth.security.UserDetailsServiceImpl;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.highlight.service.GetUserHighlightsService;
import com.instagram.be.storage.CloudinaryService;
import com.instagram.be.userprofile.response.UserProfileResponse;
import com.instagram.be.userprofile.service.DeactivateAccountService;
import com.instagram.be.userprofile.service.GetSuggestionsService;
import com.instagram.be.userprofile.service.GetUserProfileService;
import com.instagram.be.userprofile.service.UpdateUserProfileService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserProfileController.class)
class UserProfileControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CloudinaryService cloudinaryService;
    @MockitoBean
    private GetUserProfileService getUserProfileService;
    @MockitoBean
    private UpdateUserProfileService updateUserProfileService;
    @MockitoBean
    private GetUserHighlightsService getUserHighlightsService;
    @MockitoBean
    private GetSuggestionsService getSuggestionsService;
    @MockitoBean
    private DeactivateAccountService deactivateAccountService;

    // Required by SecurityConfig
    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;
    @MockitoBean
    private JwtUtil jwtUtil;
    @MockitoBean
    private StringRedisTemplate redisTemplate;
    @MockitoBean
    private com.instagram.be.base.ratelimit.RateLimiter rateLimiter;

    private MockedStatic<SecurityUtils> mockedSecurityUtils;
    private UserContext mockUserContext;

    @BeforeEach
    void setUp() {
        mockedSecurityUtils = mockStatic(SecurityUtils.class);
        mockUserContext = UserContext.builder()
                .userId(UUID.randomUUID())
                .username("testuser")
                .build();
    }

    @AfterEach
    void tearDown() {
        mockedSecurityUtils.close();
    }

    @Test
    @DisplayName("GET /users/{username} - Should return profile when authenticated")
    @WithMockUser // This handles the @PreAuthorize("isAuthenticated()")
    void getUserProfile_Authenticated_ReturnsProfile() throws Exception {
        // Arrange
        String username = "targetuser";
        com.instagram.be.userprofile.UserProfile mockUser = com.instagram.be.userprofile.UserProfile.builder()
                .id(UUID.randomUUID())
                .username(username)
                .fullName("Target User")
                .build();
        
        UserProfileResponse mockResponse = UserProfileResponse.of(
                mockUser, 100L, 50L, 10L, false, false, true, true
        );

        mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(mockUserContext));
        when(getUserProfileService.execute(any())).thenReturn(mockResponse);

        // Act & Assert
        mockMvc.perform(get("/users/{username}", username)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Profile retrieved"))
                .andExpect(jsonPath("$.data.username").value(username))
                .andExpect(jsonPath("$.data.fullName").value("Target User"))
                .andExpect(jsonPath("$.data.followersCount").value(100));
    }

    @Test
    @DisplayName("GET /users/{username} - Should return 401 when not authenticated")
    void getUserProfile_NotAuthenticated_Returns401() throws Exception {
        // Act & Assert
        // No @WithMockUser here
        mockMvc.perform(get("/users/{username}", "anyuser")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /users/suggestions - Should return list of suggestions")
    @WithMockUser
    void getSuggestions_ReturnsList() throws Exception {
        // Arrange
        mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(mockUserContext));
        // We can add more mocks for getSuggestionsService if needed

        // Act & Assert
        mockMvc.perform(get("/users/suggestions")
                        .param("limit", "5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Suggestions retrieved"));
    }
}
