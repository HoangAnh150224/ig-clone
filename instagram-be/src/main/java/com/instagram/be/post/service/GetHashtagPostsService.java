package com.instagram.be.post.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.instagram.be.base.response.CursorResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.base.util.CursorUtils;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.GetHashtagPostsRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class GetHashtagPostsService extends BaseService<GetHashtagPostsRequest, CursorResponse<PostResponse>> {

    private static final long CACHE_TTL_MINUTES = 5;

    private final PostRepository postRepository;
    private final PostResponseAssembler postResponseAssembler;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public CursorResponse<PostResponse> execute(GetHashtagPostsRequest request) {
        return super.execute(request);
    }

    @Override
    protected CursorResponse<PostResponse> doProcess(GetHashtagPostsRequest request) {
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;
        String name = request.getHashtagName();
        int size = request.getSize() > 0 ? request.getSize() : 20;
        String cursorParam = request.getCursor();
        PageRequest pageRequest = PageRequest.of(0, size + 1);

        String cacheKey = "cache:hashtag:" + name + ":" + (cursorParam != null ? cursorParam : "first") + ":" + size;

        List<Post> posts = null;
        String cached = redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            try {
                List<UUID> cachedIds = objectMapper.readValue(cached, new TypeReference<>() {
                });
                posts = cachedIds.isEmpty() ? List.of() : postRepository.findByIds(cachedIds);
            } catch (Exception e) {
                log.warn("Failed to deserialize hashtag cache for '{}', falling back to DB: {}", name, e.getMessage());
                posts = null;
            }
        }

        if (posts == null) {
            if (cursorParam == null || cursorParam.isBlank()) {
                posts = postRepository.findByHashtagNameFirst(name, pageRequest);
            } else {
                posts = postRepository.findByHashtagNameWithCursor(
                        name,
                        CursorUtils.decodeTime(cursorParam),
                        CursorUtils.decodeId(cursorParam),
                        pageRequest);
            }

            try {
                List<UUID> ids = posts.stream().map(Post::getId).toList();
                redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(ids), CACHE_TTL_MINUTES, TimeUnit.MINUTES);
            } catch (Exception e) {
                log.warn("Failed to cache hashtag post IDs for '{}': {}", name, e.getMessage());
            }
        }

        boolean hasMore = posts.size() > size;
        if (hasMore) posts = posts.subList(0, size);

        String nextCursor = null;
        if (hasMore && !posts.isEmpty()) {
            Post last = posts.get(posts.size() - 1);
            nextCursor = CursorUtils.encode(last.getCreatedAt(), last.getId());
        }

        Set<UUID> likedIds = Collections.emptySet();
        Set<UUID> savedIds = Collections.emptySet();

        if (viewerId != null && !posts.isEmpty()) {
            Set<UUID> postIds = posts.stream().map(Post::getId).collect(Collectors.toSet());
            likedIds = postLikeRepository.findLikedPostIds(viewerId, postIds);
            savedIds = savedPostRepository.findSavedPostIds(viewerId, postIds);
        }

        List<PostResponse> content = postResponseAssembler.toResponseList(posts, viewerId, likedIds, savedIds);

        return new CursorResponse<>(content, nextCursor, hasMore);
    }
}
