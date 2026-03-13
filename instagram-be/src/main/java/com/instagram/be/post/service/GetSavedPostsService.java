package com.instagram.be.post.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.request.GetPostListRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetSavedPostsService extends BaseService<GetPostListRequest, PaginatedResponse<PostResponse>> {

    private final SavedPostRepository savedPostRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostResponseAssembler assembler;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<PostResponse> execute(GetPostListRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<PostResponse> doProcess(GetPostListRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        var page = savedPostRepository.findSavedByUserId(viewerId,
                PageRequest.of(request.getPage(), request.getSize()));

        var posts = page.getContent().stream().map(sp -> sp.getPost()).toList();
        Set<UUID> postIds = posts.stream().map(p -> p.getId()).collect(Collectors.toSet());

        Set<UUID> likedIds = viewerId != null && !postIds.isEmpty()
                ? postLikeRepository.findLikedPostIds(viewerId, postIds) : Set.of();

        // All posts in this result are saved by definition
        var responses = assembler.toResponseList(posts, viewerId, likedIds, postIds);

        return new PaginatedResponse<>(responses, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast(), page.isEmpty());
    }
}
