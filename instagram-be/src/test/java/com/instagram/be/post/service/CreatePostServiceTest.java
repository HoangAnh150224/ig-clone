package com.instagram.be.post.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.hashtag.HashtagUpsertService;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostMediaRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.repository.PostTagRepository;
import com.instagram.be.post.request.CreatePostRequest;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.service.ProfileCountCacheService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreatePostServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private PostMediaRepository postMediaRepository;
    @Mock
    private PostTagRepository postTagRepository;
    @Mock
    private HashtagUpsertService hashtagUpsertService;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private RateLimiter rateLimiter;
    @Mock
    private ProfileCountCacheService profileCountCacheService;

    @InjectMocks
    private CreatePostService createPostService;

    private UserContext userContext;
    private UUID userId;
    private CreatePostRequest request;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        userContext = UserContext.builder().userId(userId).username("testuser").build();
        request = new CreatePostRequest();
        request.setUserContext(userContext);
    }

    @Test
    @DisplayName("Should create post successfully")
    void createPost_Success() {
        // Given
        request.setMedia(List.of(new CreatePostRequest.MediaItem("url", "IMAGE")));
        request.setCaption("A new post");

        when(userProfileRepository.getReferenceById(userId)).thenReturn(new UserProfile());
        when(postRepository.save(any(Post.class))).thenReturn(new Post());

        // When
        createPostService.execute(request);

        // Then
        verify(rateLimiter).check(anyString(), anyInt(), anyInt());
        verify(postRepository).save(any(Post.class));
        verify(postMediaRepository).save(any());
        verify(profileCountCacheService).evict(userId);
    }

    @Test
    @DisplayName("Should throw validation exception when media is null or empty")
    void createPost_NoMedia_ShouldThrowException() {
        // Given
        request.setMedia(Collections.emptyList());

        // When & Then
        assertThrows(AppValidationException.class, () -> createPostService.execute(request));
        verify(postRepository, never()).save(any());
    }
}
