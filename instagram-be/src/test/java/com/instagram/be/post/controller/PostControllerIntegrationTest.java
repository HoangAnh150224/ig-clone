package com.instagram.be.post.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.auth.jwt.JwtUtil;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.filter.GlobalRateLimitFilter;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.exception.GlobalExceptionHandler;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.enums.PostType;
import com.instagram.be.post.request.CreatePostRequest;
import com.instagram.be.post.response.CreatePostResponse;
import com.instagram.be.post.response.FeedResponse;
import com.instagram.be.post.response.LikeResponse;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.post.service.*;
import com.instagram.be.storage.CloudinaryService;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PostController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class PostControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CreatePostService createPostService;
    @MockitoBean
    private GetPostService getPostService;
    @MockitoBean
    private UpdatePostService updatePostService;
    @MockitoBean
    private DeletePostService deletePostService;
    @MockitoBean
    private ArchivePostService archivePostService;
    @MockitoBean
    private LikePostService likePostService;
    @MockitoBean
    private ViewPostService viewPostService;
    @MockitoBean
    private SavePostService savePostService;
    @MockitoBean
    private GetLikersService getLikersService;
    @MockitoBean
    private GetSavedPostsService getSavedPostsService;
    @MockitoBean
    private GetFeedService getFeedService;
    @MockitoBean
    private GetUserPostsService getUserPostsService;
    @MockitoBean
    private GetArchivedPostsService getArchivedPostsService;
    @MockitoBean
    private GetTaggedPostsService getTaggedPostsService;
    @MockitoBean
    private GetExplorePostsService getExplorePostsService;
    @MockitoBean
    private GetHashtagPostsService getHashtagPostsService;

    @MockitoBean
    private RateLimiter rateLimiter;
    @MockitoBean
    private StringRedisTemplate redisTemplate;
    @MockitoBean
    private GlobalRateLimitFilter globalRateLimitFilter;
    @MockitoBean
    private CloudinaryService cloudinaryService;
    @MockitoBean
    private JwtUtil jwtUtil;

    @Test
    @WithMockUser
    void createPost_Success() throws Exception {
        CreatePostRequest request = new CreatePostRequest();
        request.setCaption("Test Caption");
        request.setMedia(List.of(new CreatePostRequest.MediaItem("url", "IMAGE")));
        
        CreatePostResponse response = new CreatePostResponse(UUID.randomUUID(), LocalDateTime.now());
        
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(createPostService.execute(any())).thenReturn(response);

            mockMvc.perform(post("/posts")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.code").value(201))
                    .andExpect(jsonPath("$.message").value("Post created"))
                    .andExpect(jsonPath("$.data.id").exists());
        }
    }

    @Test
    @WithMockUser
    void createPost_ValidationError() throws Exception {
        CreatePostRequest request = new CreatePostRequest();
        // Missing caption and media
        
        mockMvc.perform(post("/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    @WithMockUser
    void getPost_Success() throws Exception {
        UUID postId = UUID.randomUUID();
        PostResponse response = new PostResponse(postId, null, "Caption", null, null, false, false, false, null, List.of(), List.of(), List.of(), List.of(), 0, 0, 0, false, false, true, LocalDateTime.now(), LocalDateTime.now());

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(UserContext.builder().userId(UUID.randomUUID()).build()));
            when(getPostService.execute(any())).thenReturn(response);

            mockMvc.perform(get("/posts/{id}", postId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.id").value(postId.toString()));
        }
    }

    @Test
    @WithMockUser
    void getPost_NotFound() throws Exception {
        UUID postId = UUID.randomUUID();
        when(getPostService.execute(any())).thenThrow(new NotFoundException("Post", postId));

        mockMvc.perform(get("/posts/{id}", postId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("ERROR"))
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @WithMockUser
    void getFeed_Success() throws Exception {
        FeedResponse response = new FeedResponse(List.of(), null, false);
        
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(getFeedService.execute(any())).thenReturn(response);

            mockMvc.perform(get("/posts/feed"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.posts").isArray());
        }
    }

    @Test
    @WithMockUser
    void likePost_Success() throws Exception {
        UUID postId = UUID.randomUUID();
        LikeResponse response = new LikeResponse(true, 1L);
        
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(likePostService.execute(any())).thenReturn(response);

            mockMvc.perform(post("/posts/{id}/like", postId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value("SUCCESS"))
                    .andExpect(jsonPath("$.code").value(200))
                    .andExpect(jsonPath("$.data.liked").value(true))
                    .andExpect(jsonPath("$.data.likeCount").value(1));
        }
    }

    @Test
    @WithMockUser
    void likePost_NotFound() throws Exception {
        UUID postId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UserContext context = UserContext.builder().userId(userId).username("testuser").build();

        try (MockedStatic<SecurityUtils> mockedSecurityUtils = mockStatic(SecurityUtils.class)) {
            mockedSecurityUtils.when(SecurityUtils::getCurrentUserContext).thenReturn(Optional.of(context));
            when(likePostService.execute(any())).thenThrow(new NotFoundException("Post", postId));

            mockMvc.perform(post("/posts/{id}/like", postId))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value("ERROR"))
                    .andExpect(jsonPath("$.code").value(404));
        }
    }
}
