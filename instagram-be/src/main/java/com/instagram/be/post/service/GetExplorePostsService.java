package com.instagram.be.post.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.base.request.PaginatedRequest;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GetExplorePostsService extends BaseService<PaginatedRequest, PaginatedResponse<PostResponse>> {

    private static final long CACHE_TTL_MINUTES = 3;

    private final PostRepository postRepository;
    private final PostResponseAssembler postResponseAssembler;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<PostResponse> execute(PaginatedRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<PostResponse> doProcess(PaginatedRequest request) {
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;
        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 20;
        PageRequest pageRequest = PageRequest.of(page, size);

        String cacheKey = "cache:explore:" + page + ":" + size;

        List<Post> posts;
        long totalElements;

        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            try {
                List<UUID> cachedIds = objectMapper.readValue(cached, new TypeReference<>() {
                });
                posts = cachedIds.isEmpty() ? List.of() : postRepository.findByIds(cachedIds);
                totalElements = postRepository.countExplore();
            } catch (Exception e) {
                log.warn("Failed to deserialize explore cache, falling back to DB: {}", e.getMessage());
                posts = null;
                totalElements = 0;
                cached = null;
            }
        } else {
            posts = null;
            totalElements = 0;
        }

        if (cached == null || posts == null) {
            Page<Post> dbPage = postRepository.findExplore(pageRequest);
            posts = dbPage.getContent();
            totalElements = dbPage.getTotalElements();

            try {
                List<UUID> ids = posts.stream().map(Post::getId).toList();
                redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(ids), CACHE_TTL_MINUTES, TimeUnit.MINUTES);
            } catch (Exception e) {
                log.warn("Failed to cache explore IDs: {}", e.getMessage());
            }
        }

        Set<UUID> likedIds = Collections.emptySet();
        Set<UUID> savedIds = Collections.emptySet();

        if (viewerId != null && !posts.isEmpty()) {
            Set<UUID> postIds = posts.stream().map(Post::getId).collect(Collectors.toSet());
            likedIds = postLikeRepository.findLikedPostIds(viewerId, postIds);
            savedIds = savedPostRepository.findSavedPostIds(viewerId, postIds);
        }

        List<PostResponse> content = postResponseAssembler.toResponseList(posts, viewerId, likedIds, savedIds);

        int totalPages = size == 0 ? 1 : (int) Math.ceil((double) totalElements / size);
        boolean isFirst = page == 0;
        boolean isLast = page >= totalPages - 1;

        return new PaginatedResponse<>(
                content,
                page,
                size,
                totalElements,
                totalPages,
                isFirst,
                isLast,
                content.isEmpty()
        );
    }
}
