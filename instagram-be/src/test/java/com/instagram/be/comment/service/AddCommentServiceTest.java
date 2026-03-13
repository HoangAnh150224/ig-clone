package com.instagram.be.comment.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.comment.Comment;
import com.instagram.be.comment.repository.CommentLikeRepository;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.AddCommentRequest;
import com.instagram.be.comment.response.CommentResponse;
import com.instagram.be.events.CommentEvent;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
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
class AddCommentServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private CommentLikeRepository commentLikeRepository;
    @Mock
    private PostAccessGuard postAccessGuard;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private AddCommentService addCommentService;

    private UUID viewerId;
    private UUID postId;
    private UserProfile viewer;
    private UserProfile owner;
    private Post post;

    @BeforeEach
    void setUp() {
        viewerId = UUID.randomUUID();
        postId = UUID.randomUUID();
        viewer = UserProfile.builder().id(viewerId).username("viewer").build();
        owner = UserProfile.builder().id(UUID.randomUUID()).username("owner").build();
        post = Post.builder().id(postId).user(owner).build();
    }

    @Test
    void addComment_ShouldCreateCommentAndPublishEvent() {
        AddCommentRequest request = AddCommentRequest.builder()
                .userContext(UserContext.builder().userId(viewerId).build())
                .postId(postId)
                .content("Nice post")
                .build();

        Comment saved = Comment.builder().id(UUID.randomUUID()).post(post).user(viewer).content("Nice post").build();

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(userProfileRepository.getReferenceById(viewerId)).thenReturn(viewer);
        when(commentRepository.save(any(Comment.class))).thenReturn(saved);

        CommentResponse response = addCommentService.execute(request);

        assertNotNull(response);
        verify(postAccessGuard).checkAccess(owner.getId(), viewerId);
        verify(commentRepository).save(any(Comment.class));

        ArgumentCaptor<CommentEvent> captor = ArgumentCaptor.forClass(CommentEvent.class);
        verify(eventPublisher, times(1)).publishEvent(captor.capture());
        CommentEvent event = captor.getValue();
        assertEquals(owner, event.getTarget());
        assertEquals(viewer, event.getCommenter());
        assertEquals(post, event.getPost());
        assertEquals(saved, event.getComment());
    }

    @Test
    void addReply_ShouldPublishTwoEvents() {
        UUID parentId = UUID.randomUUID();
        Comment parent = Comment.builder()
                .id(parentId)
                .post(post)
                .user(UserProfile.builder().id(UUID.randomUUID()).username("parentUser").build())
                .build();

        AddCommentRequest request = AddCommentRequest.builder()
                .userContext(UserContext.builder().userId(viewerId).build())
                .postId(postId)
                .parentCommentId(parentId)
                .content("Reply")
                .build();

        Comment saved = Comment.builder().id(UUID.randomUUID()).post(post).user(viewer).content("Reply").parentComment(parent).build();

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(commentRepository.findById(parentId)).thenReturn(Optional.of(parent));
        when(userProfileRepository.getReferenceById(viewerId)).thenReturn(viewer);
        when(commentRepository.save(any(Comment.class))).thenReturn(saved);

        addCommentService.execute(request);

        ArgumentCaptor<CommentEvent> captor = ArgumentCaptor.forClass(CommentEvent.class);
        verify(eventPublisher, times(2)).publishEvent(captor.capture());
    }

    @Test
    void addComment_WithEmptyContent_ShouldThrow() {
        AddCommentRequest request = AddCommentRequest.builder()
                .userContext(UserContext.builder().userId(viewerId).build())
                .postId(postId)
                .content(" ")
                .build();

        assertThrows(AppValidationException.class, () -> addCommentService.execute(request));
    }

    @Test
    void addComment_ToNonExistingPost_ShouldThrow() {
        AddCommentRequest request = AddCommentRequest.builder()
                .userContext(UserContext.builder().userId(viewerId).build())
                .postId(postId)
                .content("Nice")
                .build();

        when(postRepository.findById(postId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> addCommentService.execute(request));
    }

    @Test
    void addReply_TooDeep_ShouldThrow() {
        UUID parentId = UUID.randomUUID();
        Comment parentOfParent = Comment.builder().id(UUID.randomUUID()).build();
        Comment parent = Comment.builder()
                .id(parentId)
                .post(post)
                .user(owner)
                .parentComment(parentOfParent)
                .build();

        AddCommentRequest request = AddCommentRequest.builder()
                .userContext(UserContext.builder().userId(viewerId).build())
                .postId(postId)
                .parentCommentId(parentId)
                .content("Reply")
                .build();

        when(postRepository.findById(postId)).thenReturn(Optional.of(post));
        when(commentRepository.findById(parentId)).thenReturn(Optional.of(parent));

        assertThrows(BusinessException.class, () -> addCommentService.execute(request));
    }
}

