package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.base.util.CursorUtils;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.enums.PostType;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.GetPostListRequest;
import com.instagram.be.post.response.FeedResponse;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetFeedService extends BaseService<GetPostListRequest, FeedResponse> {

    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final PostResponseAssembler assembler;

    @Override
    @Transactional(readOnly = true)
    public FeedResponse execute(GetPostListRequest request) {
        return super.execute(request);
    }

    @Override
    protected FeedResponse doProcess(GetPostListRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        int size = Math.min(request.getSize(), 20);
        boolean reelOnly = PostType.REEL.equals(request.getTypeFilter());

        // Collect followed user IDs (ACCEPTED follows only)
        var followingPage = followRepository.findFollowingByUserId(viewerId, FollowStatus.ACCEPTED,
                PageRequest.of(0, 1000));
        List<UUID> followedIds = followingPage.getContent().stream()
                .map(f -> f.getFollowing().getId())
                .collect(Collectors.toList());
        followedIds.add(viewerId); // include own posts

        if (followedIds.isEmpty()) return new FeedResponse(List.of(), null, false);

        List<com.instagram.be.post.Post> posts;
        if (request.getCursor() == null || request.getCursor().isBlank()) {
            posts = reelOnly
                    ? postRepository.findReelFeedPostsFirst(followedIds, PageRequest.of(0, size + 1))
                    : postRepository.findFeedPostsFirst(followedIds, PageRequest.of(0, size + 1));
        } else {
            LocalDateTime cursorTime = CursorUtils.decodeTime(request.getCursor());
            UUID cursorId = CursorUtils.decodeId(request.getCursor());

            posts = reelOnly
                    ? postRepository.findReelFeedPosts(followedIds, cursorTime, cursorId, PageRequest.of(0, size + 1))
                    : postRepository.findFeedPosts(followedIds, cursorTime, cursorId, PageRequest.of(0, size + 1));
        }

        boolean hasMore = posts.size() > size;
        if (hasMore) posts = posts.subList(0, size);

        String nextCursor = null;
        if (hasMore && !posts.isEmpty()) {
            var last = posts.get(posts.size() - 1);
            nextCursor = CursorUtils.encode(last.getCreatedAt(), last.getId());
        }

        Set<UUID> postIds = posts.stream().map(p -> p.getId()).collect(Collectors.toSet());
        Set<UUID> likedIds = postIds.isEmpty() ? Set.of() : postLikeRepository.findLikedPostIds(viewerId, postIds);
        Set<UUID> savedIds = postIds.isEmpty() ? Set.of() : savedPostRepository.findSavedPostIds(viewerId, postIds);

        List<PostResponse> responses = assembler.toResponseList(posts, viewerId, likedIds, savedIds);
        return new FeedResponse(responses, nextCursor, hasMore);
    }

}

