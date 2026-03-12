package com.instagram.be.post.service;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeletePostService extends BaseService<PostActionRequest, Void> {

    private final PostRepository postRepository;

    @Override
    @Transactional
    public Void execute(PostActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(PostActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new NotFoundException("Post", request.getPostId()));

        if (!post.getUser().getId().equals(viewerId)) {
            throw new BusinessException("You do not have permission to delete this post");
        }

        postRepository.delete(post);
        return null;
    }
}
