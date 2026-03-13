package com.instagram.be.auth.service;

import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.GetMeRequest;
import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.base.UserContext;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.enums.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetMeServiceTest {

    @Mock
    private AuthRepository authRepository;

    @InjectMocks
    private GetMeService getMeService;

    @Test
    void getMe_Success() {
        UUID userId = UUID.randomUUID();
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .role(UserRole.USER)
                .build();

        GetMeRequest request = GetMeRequest.builder()
                .userContext(UserContext.builder().userId(userId).build())
                .build();

        when(authRepository.findById(userId)).thenReturn(Optional.of(user));

        MeResponse response = getMeService.execute(request);

        assertNotNull(response);
        assertEquals("testuser", response.username());
    }

    @Test
    void getMe_UserNotFound() {
        UUID userId = UUID.randomUUID();
        GetMeRequest request = GetMeRequest.builder()
                .userContext(UserContext.builder().userId(userId).build())
                .build();

        when(authRepository.findById(userId)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> getMeService.execute(request));
        assertEquals("User not found", exception.getMessage());
    }
}
