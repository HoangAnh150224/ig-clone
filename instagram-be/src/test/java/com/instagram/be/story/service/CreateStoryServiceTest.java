package com.instagram.be.story.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.request.CreateStoryRequest;
import com.instagram.be.story.response.StoryResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateStoryServiceTest {

    @Mock
    private StoryRepository storyRepository;
    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private CreateStoryService createStoryService;

    private UserContext userContext;
    private UUID userId;
    private CreateStoryRequest request;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        userContext = new UserContext(userId, "testuser");
        request = new CreateStoryRequest();
        request.setUserContext(userContext);
    }

    @Test
    @DisplayName("Should create story successfully")
    void createStory_Success() {
        // Given
        request.setMediaUrl("http://example.com/story.jpg");
        request.setMediaType("IMAGE");

        when(userProfileRepository.getReferenceById(userId)).thenReturn(new UserProfile());
        when(storyRepository.save(any(Story.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        StoryResponse response = createStoryService.execute(request);

        // Then
        assertNotNull(response);
        verify(storyRepository).save(any(Story.class));
    }

    @Test
    @DisplayName("Should throw validation exception when media URL is null or blank")
    void createStory_NoMediaUrl_ShouldThrowException() {
        // Given
        request.setMediaUrl("");

        // When & Then
        assertThrows(AppValidationException.class, () -> createStoryService.execute(request));
        verify(storyRepository, never()).save(any());
    }
}
