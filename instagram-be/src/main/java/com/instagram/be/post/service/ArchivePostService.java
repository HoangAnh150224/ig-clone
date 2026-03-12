package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostRepository;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArchivePostService extends BaseService<PostActionRequest, PostResponse> {

    private final PostRepository postRepository;
    private final PostResponseAssembler assembler;
    private final SavedPostRepository savedPostRepository;

    @Override
    @Transactional
    public PostResponse execute(PostActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected PostResponse doProcess(PostActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new NotFoundException("Post", request.getPostId()));

        if (!post.getUser().getId().equals(viewerId)) {
            throw new BusinessException("You do not have permission to archive this post");
        }

        post.setArchived(!post.isArchived());
        Post saved = postRepository.save(post);
        boolean isSaved = savedPostRepository.existsByUserIdAndPostId(viewerId, saved.getId());
        return assembler.toResponse(saved, viewerId, isSaved);
    }
}
