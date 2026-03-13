package com.instagram.be.story.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryMentionRepository;
import com.instagram.be.story.repository.StoryReplyRepository;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.repository.StoryViewRepository;
import com.instagram.be.story.request.StoryActionRequest;
import com.instagram.be.userprofile.UserProfile;
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
class DeleteStoryServiceTest {

    @Mock
    private StoryRepository storyRepository;
    @Mock
    private StoryViewRepository storyViewRepository;
    @Mock
    private StoryReplyRepository storyReplyRepository;
    @Mock
    private StoryMentionRepository storyMentionRepository;

    @InjectMocks
    private DeleteStoryService deleteStoryService;

    private UserContext userContext;
    private UUID userId;
    private UUID storyId;
    private Story story;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        storyId = UUID.randomUUID();
        userContext = new UserContext(userId, "testuser");
        UserProfile user = UserProfile.builder().id(userId).build();
        story = Story.builder().id(storyId).user(user).build();
    }

    @Test
    @DisplayName("Should delete story and its related data when user is the owner")
    void deleteStory_Success() {
        // Given
        StoryActionRequest request = new StoryActionRequest(userContext, storyId);
        when(storyRepository.findById(storyId)).thenReturn(Optional.of(story));

        // When
        deleteStoryService.execute(request);

        // Then
        verify(storyViewRepository).deleteAllByStory(story);
        verify(storyReplyRepository).deleteAllByStory(story);
        verify(storyMentionRepository).deleteAllByStory(story);
        verify(storyRepository).delete(story);
    }

    @Test
    @DisplayName("Should throw NotFoundException when story does not exist")
    void deleteStory_NotFound() {
        // Given
        StoryActionRequest request = new StoryActionRequest(userContext, storyId);
        when(storyRepository.findById(storyId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> deleteStoryService.execute(request));
        verify(storyRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Should throw BusinessException when user is not the owner")
    void deleteStory_NotOwner() {
        // Given
        UUID otherUserId = UUID.randomUUID();
        UserContext otherUserContext = new UserContext(otherUserId, "otheruser");
        StoryActionRequest request = new StoryActionRequest(otherUserContext, storyId);

        when(storyRepository.findById(storyId)).thenReturn(Optional.of(story));

        // When & Then
        assertThrows(BusinessException.class, () -> deleteStoryService.execute(request));
        verify(storyRepository, never()).delete(any());
    }
}
