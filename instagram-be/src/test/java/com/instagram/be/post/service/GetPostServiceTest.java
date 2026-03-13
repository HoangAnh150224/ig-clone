package com.instagram.be.post.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
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
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GetPostServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private PostAccessGuard postAccessGuard;
    @Mock
    private PostResponseAssembler assembler;
    @Mock
    private SavedPostRepository savedPostRepository;

    @InjectMocks
    private GetPostService getPostService;

    private UUID postId;
    private UUID userId;
    private Post post;
    private UserProfile user;

    @BeforeEach
    void setUp() {
        postId = UUID.randomUUID();
        userId = UUID.randomUUID();
        user = UserProfile.builder().id(userId).build();
        post = Post.builder().id(postId).user(user).build();
    }

    @Test
    @DisplayName("Should return post when user has access")
    void getPost_Success() {
        // Given
        UserContext userContext = new UserContext(userId, "testuser");
        PostActionRequest request = new PostActionRequest(userContext, postId);

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        doNothing().when(postAccessGuard).checkAccess(userId, userId);
        when(savedPostRepository.existsByUserIdAndPostId(userId, postId)).thenReturn(true);
        when(assembler.toResponse(post, userId, true)).thenReturn(new PostResponse());

        // When
        PostResponse response = getPostService.execute(request);

        // Then
        assertNotNull(response);
        verify(postAccessGuard).checkAccess(userId, userId);
        verify(assembler).toResponse(post, userId, true);
    }

    @Test
    @DisplayName("Should throw NotFoundException when post does not exist")
    void getPost_NotFound() {
        // Given
        UserContext userContext = new UserContext(userId, "testuser");
        PostActionRequest request = new PostActionRequest(userContext, postId);

        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> getPostService.execute(request));
        verify(postAccessGuard, never()).checkAccess(any(), any());
    }
}
