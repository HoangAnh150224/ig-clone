package com.instagram.be.highlight.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.highlight.Highlight;
import com.instagram.be.highlight.repository.HighlightRepository;
import com.instagram.be.highlight.request.CreateHighlightRequest;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateHighlightServiceTest {

    @Mock
    private HighlightRepository highlightRepository;
    @Mock
    private StoryRepository storyRepository;
    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private CreateHighlightService createHighlightService;

    private UserContext userContext;
    private UUID userId;
    private CreateHighlightRequest request;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        userContext = new UserContext(userId, "testuser");
        request = new CreateHighlightRequest();
        request.setUserContext(userContext);
    }

    @Test
    @DisplayName("Should create highlight successfully")
    void createHighlight_Success() {
        // Given
        request.setTitle("My Highlight");
        UUID storyId = UUID.randomUUID();
        request.setStoryIds(List.of(storyId));

        UserProfile user = UserProfile.builder().id(userId).build();
        Story story = Story.builder().id(storyId).user(user).build();

        when(userProfileRepository.getReferenceById(userId)).thenReturn(user);
        when(storyRepository.findById(storyId)).thenReturn(Optional.of(story));
        when(highlightRepository.save(any(Highlight.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        createHighlightService.execute(request);

        // Then
        verify(highlightRepository).save(any(Highlight.class));
    }

    @Test
    @DisplayName("Should throw validation exception when title is missing")
    void createHighlight_NoTitle_ThrowsException() {
        // Given
        request.setTitle("");

        // When & Then
        assertThrows(AppValidationException.class, () -> createHighlightService.execute(request));
        verify(highlightRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw business exception when adding another user's story")
    void createHighlight_OtherUserStory_ThrowsException() {
        // Given
        request.setTitle("My Highlight");
        UUID storyId = UUID.randomUUID();
        request.setStoryIds(List.of(storyId));

        UserProfile storyOwner = UserProfile.builder().id(UUID.randomUUID()).build();
        Story story = Story.builder().id(storyId).user(storyOwner).build();

        when(userProfileRepository.getReferenceById(userId)).thenReturn(new UserProfile());
        when(storyRepository.findById(storyId)).thenReturn(Optional.of(story));

        // When & Then
        assertThrows(BusinessException.class, () -> createHighlightService.execute(request));
        verify(highlightRepository, never()).save(any());
    }
}
