package com.instagram.be.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.LoginRequest;
import com.instagram.be.auth.request.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AuthRepository authRepository;

    @MockBean private StringRedisTemplate redisTemplate;

    @BeforeEach
    void setUp() {
        authRepository.deleteAll();
        ValueOperations<String, String> valueOps = org.mockito.Mockito.mock(ValueOperations.class);
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get(anyString())).thenReturn(null);
        when(valueOps.increment(anyString())).thenReturn(1L);
        when(redisTemplate.hasKey(anyString())).thenReturn(false);
    }

    @Test
    void register_returns201_withValidRequest() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("integuser")
                .email("integ@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.username").value("integuser"));
    }

    @Test
    void register_returns409_onDuplicateUsername() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("dupuser")
                .email("dup@example.com")
                .password("password123")
                .build();
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        RegisterRequest duplicate = RegisterRequest.builder()
                .username("dupuser")
                .email("other@example.com")
                .password("password123")
                .build();
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict());
    }

    @Test
    void register_returns400_onBlankUsername() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("")
                .email("blank@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_returns400_onInvalidEmailFormat() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("emailtest")
                .email("not-an-email")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_returns200_withValidCredentialsByUsername() throws Exception {
        // First register
        RegisterRequest reg = RegisterRequest.builder()
                .username("logintest")
                .email("logintest@example.com")
                .password("password123")
                .build();
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)));

        LoginRequest login = LoginRequest.builder()
                .identifier("logintest")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.data.username").value("logintest"));
    }

    @Test
    void login_returns200_withValidCredentialsByEmail() throws Exception {
        RegisterRequest reg = RegisterRequest.builder()
                .username("emaillogin")
                .email("emaillogin@example.com")
                .password("password123")
                .build();
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)));

        LoginRequest login = LoginRequest.builder()
                .identifier("emaillogin@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("emaillogin@example.com"));
    }

    @Test
    void login_returns400_onWrongPassword() throws Exception {
        RegisterRequest reg = RegisterRequest.builder()
                .username("wrongpass")
                .email("wrongpass@example.com")
                .password("password123")
                .build();
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)));

        LoginRequest login = LoginRequest.builder()
                .identifier("wrongpass")
                .password("wrongpassword")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void login_returns400_onUnknownIdentifier() throws Exception {
        LoginRequest login = LoginRequest.builder()
                .identifier("nobody")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void logout_returns200_withValidBearerToken() throws Exception {
        // Register + login to get a token
        RegisterRequest reg = RegisterRequest.builder()
                .username("logouttest")
                .email("logouttest@example.com")
                .password("password123")
                .build();
        String regBody = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(regBody).at("/data/accessToken").asText();

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }

    @Test
    void logout_returns401_withNoAuthorizationHeader() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_returns401_withNoToken() throws Exception {
        mockMvc.perform(post("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_returns401_withBlacklistedToken() throws Exception {
        RegisterRequest reg = RegisterRequest.builder()
                .username("blacklisttest")
                .email("blacklist@example.com")
                .password("password123")
                .build();
        String regBody = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(regBody).at("/data/accessToken").asText();

        // Mock Redis to return blacklisted
        when(redisTemplate.hasKey(startsWith("blacklist:"))).thenReturn(true);

        mockMvc.perform(post("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }
}
