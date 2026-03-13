package com.instagram.be.post.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.request.GetHashtagPostsRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetHashtagPostsService extends BaseService<GetHashtagPostsRequest, PaginatedResponse<PostResponse>> {

    private final PostRepository postRepository;
    private final PostResponseAssembler postResponseAssembler;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<PostResponse> execute(GetHashtagPostsRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<PostResponse> doProcess(GetHashtagPostsRequest request) {
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());

        Page<Post> page = postRepository.findByHashtagName(request.getHashtagName(), pageRequest);
        List<Post> posts = page.getContent();

        Set<UUID> likedIds = Collections.emptySet();
        Set<UUID> savedIds = Collections.emptySet();

        if (viewerId != null && !posts.isEmpty()) {
            Set<UUID> postIds = posts.stream().map(Post::getId).collect(Collectors.toSet());
            likedIds = postLikeRepository.findLikedPostIds(viewerId, postIds);
            savedIds = savedPostRepository.findSavedPostIds(viewerId, postIds);
        }

        List<PostResponse> content = postResponseAssembler.toResponseList(posts, viewerId, likedIds, savedIds);

        return new PaginatedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        );
    }
}
