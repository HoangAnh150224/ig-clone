package com.instagram.be.userprofile.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.message.service.PresenceService;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.request.GetUserProfileRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetUserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private FollowRepository followRepository;
    @Mock
    private BlockRepository blockRepository;
    @Mock
    private ProfileCountCacheService profileCountCacheService;
    @Mock
    private PresenceService presenceService;

    @InjectMocks
    private GetUserProfileService getUserProfileService;

    private UserContext userContext;
    private UUID viewerId;
    private UserProfile targetUser;
    private GetUserProfileRequest request;

    @BeforeEach
    void setUp() {
        viewerId = UUID.randomUUID();
        userContext = new UserContext(viewerId, "viewer");
        targetUser = UserProfile.builder().id(UUID.randomUUID()).username("target").active(true).build();
        request = new GetUserProfileRequest("target");
        request.setUserContext(userContext);
    }

    @Test
    @DisplayName("Should return public profile successfully")
    void getProfile_Public() {
        // Given
        when(userProfileRepository.findByUsername("target")).thenReturn(Optional.of(targetUser));
        when(profileCountCacheService.getCounts(any())).thenReturn(new ProfileCountCacheService.ProfileCounts(10, 10, 10));

        // When
        getUserProfileService.execute(request);

        // Then
        verify(userProfileRepository).findByUsername("target");
    }

    @Test
    @DisplayName("Should throw NotFoundException if user is blocked")
    void getProfile_Blocked_ThrowsNotFound() {
        // Given
        when(userProfileRepository.findByUsername("target")).thenReturn(Optional.of(targetUser));
        when(blockRepository.existsBlockBetween(viewerId, targetUser.getId())).thenReturn(true);

        // When & Then
        assertThrows(NotFoundException.class, () -> getUserProfileService.execute(request));
    }
}
