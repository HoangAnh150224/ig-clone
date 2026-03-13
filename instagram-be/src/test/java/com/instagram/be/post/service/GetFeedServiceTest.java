package com.instagram.be.post.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.base.util.CursorUtils;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.GetPostListRequest;
import com.instagram.be.post.response.FeedResponse;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetFeedServiceTest {

    @Mock
    private PostRepository postRepository;
    @Mock
    private FollowRepository followRepository;
    @Mock
    private PostLikeRepository postLikeRepository;
    @Mock
    private SavedPostRepository savedPostRepository;
    @Mock
    private PostResponseAssembler assembler;

    @InjectMocks
    private GetFeedService getFeedService;

    @Test
    void getFeed_Success() {
        UUID viewerId = UUID.randomUUID();
        GetPostListRequest request = GetPostListRequest.builder()
                .size(10)
                .userContext(UserContext.builder().userId(viewerId).build())
                .build();

        when(followRepository.findFollowingByUserId(any(), any(), any())).thenReturn(new PageImpl<>(List.of()));
        when(postRepository.findFeedPostsFirst(anyList(), any(Pageable.class))).thenReturn(List.of());
        when(assembler.toResponseList(anyList(), any(), anySet(), anySet())).thenReturn(List.of());

        FeedResponse response = getFeedService.execute(request);

        assertNotNull(response);
        assertTrue(response.posts().isEmpty());
    }

    @Test
    void getFeed_NoFollowing_ReturnsOwnPosts() {
        UUID viewerId = UUID.randomUUID();
        GetPostListRequest request = GetPostListRequest.builder()
                .size(10)
                .userContext(UserContext.builder().userId(viewerId).build())
                .build();

        // No following
        when(followRepository.findFollowingByUserId(eq(viewerId), any(), any())).thenReturn(new PageImpl<>(List.of()));

        // Should only query for viewer's own posts
        when(postRepository.findFeedPostsFirst(argThat(list -> list.size() == 1 && list.contains(viewerId)), any(Pageable.class)))
                .thenReturn(List.of());

        when(assembler.toResponseList(anyList(), any(), anySet(), anySet())).thenReturn(List.of());

        FeedResponse response = getFeedService.execute(request);

        assertNotNull(response);
        assertTrue(response.posts().isEmpty());
    }

    @Test
    void getFeed_WithCursor_Success() {
        UUID viewerId = UUID.randomUUID();
        LocalDateTime cursorTime = LocalDateTime.of(2023, 1, 1, 0, 0);
        UUID cursorId = UUID.randomUUID();
        String cursor = CursorUtils.encode(cursorTime, cursorId);

        GetPostListRequest request = GetPostListRequest.builder()
                .size(10)
                .cursor(cursor)
                .userContext(UserContext.builder().userId(viewerId).build())
                .build();

        when(followRepository.findFollowingByUserId(any(), any(), any())).thenReturn(new PageImpl<>(List.of()));
        when(postRepository.findFeedPosts(anyList(), eq(cursorTime), eq(cursorId), any(Pageable.class)))
                .thenReturn(List.of());
        when(assembler.toResponseList(anyList(), any(), anySet(), anySet())).thenReturn(List.of());

        FeedResponse response = getFeedService.execute(request);

        assertNotNull(response);
        assertFalse(response.hasMore());
        assertNull(response.nextCursor());
    }

    @Test
    void getFeed_Pagination_ReturnsNextCursor() {
        UUID viewerId = UUID.randomUUID();
        int size = 2;
        GetPostListRequest request = GetPostListRequest.builder()
                .size(size)
                .userContext(UserContext.builder().userId(viewerId).build())
                .build();

        LocalDateTime now = LocalDateTime.now();
        Post p1 = Post.builder().id(UUID.randomUUID()).createdAt(now.minusMinutes(1)).build();
        Post p2 = Post.builder().id(UUID.randomUUID()).createdAt(now.minusMinutes(2)).build();
        Post p3 = Post.builder().id(UUID.randomUUID()).createdAt(now.minusMinutes(3)).build();

        // Mocking 3 posts when 2 requested (size + 1 = 3)
        when(followRepository.findFollowingByUserId(any(), any(), any())).thenReturn(new PageImpl<>(List.of()));
        when(postRepository.findFeedPostsFirst(anyList(), any(Pageable.class)))
                .thenReturn(List.of(p1, p2, p3));

        when(assembler.toResponseList(anyList(), any(), anySet(), anySet()))
                .thenReturn(List.of(mock(PostResponse.class), mock(PostResponse.class)));

        FeedResponse response = getFeedService.execute(request);

        assertNotNull(response);
        assertEquals(2, response.posts().size());
        assertTrue(response.hasMore());
        assertNotNull(response.nextCursor());

        String expectedCursor = CursorUtils.encode(p2.getCreatedAt(), p2.getId());
        assertEquals(expectedCursor, response.nextCursor());
    }
}
