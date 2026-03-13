package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.PostView;
import com.instagram.be.post.repository.PostViewRepository;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ViewPostService extends BaseService<PostActionRequest, Void> {

    private final PostRepository postRepository;
    private final PostViewRepository postViewRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public Void execute(PostActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(PostActionRequest request) {
        UUID postId = request.getPostId();
        UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

        // Only track authenticated views
        if (viewerId == null) return null;

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", postId));

        postViewRepository.findByPostIdAndViewerId(postId, viewerId).orElseGet(() -> {
            UserProfile viewer = userProfileRepository.getReferenceById(viewerId);
            return postViewRepository.save(PostView.builder().post(post).viewer(viewer).build());
        });

        return null;
    }
}
