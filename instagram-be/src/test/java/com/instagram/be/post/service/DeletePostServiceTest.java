package com.instagram.be.post.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.service.ProfileCountCacheService;
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
class DeletePostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private ProfileCountCacheService profileCountCacheService;

    @InjectMocks
    private DeletePostService deletePostService;

    @Test
    @DisplayName("Should delete post when user is the owner")
    void deletePost_Success() {
        // Given
        UUID userId = UUID.randomUUID();
        UUID postId = UUID.randomUUID();

        UserContext userContext = UserContext.builder().userId(userId).username("testuser").build();
        PostActionRequest request = PostActionRequest.builder().userContext(userContext).postId(postId).build();

        UserProfile user = UserProfile.builder().id(userId).build();
        Post post = Post.builder().id(postId).user(user).build();

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        // When
        deletePostService.execute(request);

        // Then
        verify(postRepository, times(1)).delete(post);
        verify(profileCountCacheService, times(1)).evict(userId);
    }

    @Test
    @DisplayName("Should throw NotFoundException when post does not exist")
    void deletePost_PostNotFound() {
        // Given
        UUID userId = UUID.randomUUID();
        UUID postId = UUID.randomUUID();

        UserContext userContext = UserContext.builder().userId(userId).username("testuser").build();
        PostActionRequest request = PostActionRequest.builder().userContext(userContext).postId(postId).build();

        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(NotFoundException.class, () -> deletePostService.execute(request));
        verify(postRepository, never()).delete(any());
        verify(profileCountCacheService, never()).evict(any());
    }

    @Test
    @DisplayName("Should throw BusinessException when user is not the owner")
    void deletePost_NotOwner() {
        // Given
        UUID ownerId = UUID.randomUUID();
        UUID viewerId = UUID.randomUUID(); // Different user
        UUID postId = UUID.randomUUID();

        UserContext userContext = UserContext.builder().userId(viewerId).username("viewer").build();
        PostActionRequest request = PostActionRequest.builder().userContext(userContext).postId(postId).build();

        UserProfile owner = UserProfile.builder().id(ownerId).build();
        Post post = Post.builder().id(postId).user(owner).build();

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));

        // When & Then
        assertThrows(BusinessException.class, () -> deletePostService.execute(request));
        verify(postRepository, never()).delete(any());
        verify(profileCountCacheService, never()).evict(any());
    }
}
