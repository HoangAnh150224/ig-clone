package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetPostService extends BaseService<PostActionRequest, PostResponse> {

    private final PostRepository postRepository;
    private final PostAccessGuard postAccessGuard;
    private final PostResponseAssembler assembler;
    private final SavedPostRepository savedPostRepository;

    @Override
    @Transactional(readOnly = true)
    public PostResponse execute(PostActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected PostResponse doProcess(PostActionRequest request) {
        UUID postId = request.getPostId();
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", postId));

        postAccessGuard.checkAccess(post.getUser().getId(), viewerId);

        boolean isSaved = viewerId != null && savedPostRepository.existsByUserIdAndPostId(viewerId, postId);

        return assembler.toResponse(post, viewerId, isSaved);
    }
}
