package com.instagram.be.post.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.request.GetPostListRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetUserPostsService extends BaseService<GetPostListRequest, PaginatedResponse<PostResponse>> {

    private final UserProfileRepository userProfileRepository;
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final SavedPostRepository savedPostRepository;
    private final PostAccessGuard postAccessGuard;
    private final PostResponseAssembler assembler;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<PostResponse> execute(GetPostListRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<PostResponse> doProcess(GetPostListRequest request) {
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

        UserProfile target = userProfileRepository.findByUsername(request.getTargetUsername())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.getTargetUsername()));
        UUID targetId = target.getId();

        postAccessGuard.checkAccess(targetId, viewerId);

        boolean isOwner = viewerId != null && viewerId.equals(targetId);
        PageRequest pageable = PageRequest.of(request.getPage(), request.getSize());

        Page<com.instagram.be.post.Post> page = isOwner
                ? postRepository.findAllByUserId(targetId, pageable)
                : postRepository.findPublicByUserId(targetId, pageable);

        List<com.instagram.be.post.Post> posts = page.getContent();
        Set<UUID> postIds = posts.stream().map(p -> p.getId()).collect(Collectors.toSet());

        Set<UUID> likedIds = viewerId != null && !postIds.isEmpty()
                ? postLikeRepository.findLikedPostIds(viewerId, postIds) : Set.of();
        Set<UUID> savedIds = viewerId != null && !postIds.isEmpty()
                ? savedPostRepository.findSavedPostIds(viewerId, postIds) : Set.of();

        List<PostResponse> responses = assembler.toResponseList(posts, viewerId, likedIds, savedIds);
        return new PaginatedResponse<>(responses, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast(), page.isEmpty());
    }
}
