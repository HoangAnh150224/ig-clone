package com.instagram.be.post.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.hashtag.HashtagUpsertService;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.UpdatePostRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import com.instagram.be.userprofile.UserProfile;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UpdatePostServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private HashtagUpsertService hashtagUpsertService;
    @Mock
    private PostResponseAssembler assembler;
    @Mock
    private SavedPostRepository savedPostRepository;

    @InjectMocks
    private UpdatePostService updatePostService;

    private UserContext userContext;
    private UUID userId;
    private UUID postId;
    private UserProfile user;
    private Post post;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        postId = UUID.randomUUID();
        userContext = new UserContext(userId, "testuser");
        user = UserProfile.builder().id(userId).build();
        post = Post.builder().id(postId).user(user).caption("Original caption").build();
    }

    @Test
    @DisplayName("Should update post successfully")
    void updatePost_Success() {
        // Given
        UpdatePostRequest request = new UpdatePostRequest();
        request.setUserContext(userContext);
        request.setPostId(postId);
        request.setCaption("New caption with #hashtag");

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(hashtagUpsertService.upsertAll(anySet())).thenReturn(Set.of(new Hashtag()));
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(savedPostRepository.existsByUserIdAndPostId(userId, postId)).thenReturn(false);
        when(assembler.toResponse(any(Post.class), any(UUID.class), anyBoolean())).thenReturn(new PostResponse());

        // When
        PostResponse response = updatePostService.execute(request);

        // Then
        assertNotNull(response);
        verify(postRepository).save(any(Post.class));
        assertEquals("New caption with #hashtag", post.getCaption());
    }

    @Test
    @DisplayName("Should throw NotFoundException when post does not exist")
    void updatePost_PostNotFound() {
        // Given
        UpdatePostRequest request = new UpdatePostRequest();
        request.setUserContext(userContext);
        request.setPostId(postId);

        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> updatePostService.execute(request));
        verify(postRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BusinessException when user is not the owner")
    void updatePost_NotOwner() {
        // Given
        UUID otherUserId = UUID.randomUUID();
        UserContext otherUserContext = new UserContext(otherUserId, "otheruser");
        UpdatePostRequest request = new UpdatePostRequest();
        request.setUserContext(otherUserContext);
        request.setPostId(postId);

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        // When & Then
        assertThrows(BusinessException.class, () -> updatePostService.execute(request));
        verify(postRepository, never()).save(any());
    }
}
