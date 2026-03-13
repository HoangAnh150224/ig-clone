package com.instagram.be.post.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.events.LikeEvent;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.PostLike;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.post.response.LikeResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LikePostServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private PostLikeRepository postLikeRepository;
    @Mock
    private PostAccessGuard postAccessGuard;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private LikePostService likePostService;

    private PostActionRequest request;
    private UUID userId;
    private UUID postId;
    private Post post;
    private UserProfile author;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        postId = UUID.randomUUID();
        author = UserProfile.builder().id(UUID.randomUUID()).username("author").build();
        post = Post.builder().id(postId).user(author).build();

        request = new PostActionRequest();
        request.setPostId(postId);
        request.setUserContext(UserContext.builder().userId(userId).build());
    }

    @Test
    void likePost_Success() {
        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(postLikeRepository.findByPostIdAndUserId(postId, userId)).thenReturn(Optional.empty());
        when(userProfileRepository.getReferenceById(userId)).thenReturn(UserProfile.builder().id(userId).build());
        when(postLikeRepository.countByPostId(postId)).thenReturn(1L);

        LikeResponse response = likePostService.execute(request);

        assertTrue(response.liked());
        assertEquals(1L, response.likeCount());
        verify(postLikeRepository).save(any(PostLike.class));
        verify(eventPublisher).publishEvent(any(LikeEvent.class));
    }

    @Test
    void unlikePost_Success() {
        PostLike existingLike = PostLike.builder().build();
        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(postLikeRepository.findByPostIdAndUserId(postId, userId)).thenReturn(Optional.of(existingLike));
        when(postLikeRepository.countByPostId(postId)).thenReturn(0L);

        LikeResponse response = likePostService.execute(request);

        assertFalse(response.liked());
        assertEquals(0L, response.likeCount());
        verify(postLikeRepository).delete(existingLike);
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void likePost_PostNotFound() {
        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> likePostService.execute(request));
    }

    @Test
    void likePost_AccessDenied_ThrowsException() {
        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        doThrow(new NotFoundException("Post not found")).when(postAccessGuard).checkAccess(author.getId(), userId);

        NotFoundException exception = assertThrows(NotFoundException.class, () -> likePostService.execute(request));
        assertEquals("Post not found", exception.getMessage());

        verify(postLikeRepository, never()).save(any());
        verify(postLikeRepository, never()).delete(any());
        verify(eventPublisher, never()).publishEvent(any());
    }
}
