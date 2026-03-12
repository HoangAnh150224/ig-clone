package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.post.response.SaveResponse;
import com.instagram.be.saved.SavedPost;
import com.instagram.be.saved.SavedPostRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SavePostService extends BaseService<PostActionRequest, SaveResponse> {

    private final PostRepository postRepository;
    private final SavedPostRepository savedPostRepository;
    private final UserProfileRepository userProfileRepository;
    private final PostAccessGuard postAccessGuard;

    @Override
    @Transactional
    public SaveResponse execute(PostActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected SaveResponse doProcess(PostActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        UUID postId = request.getPostId();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", postId));

        postAccessGuard.checkAccess(post.getUser().getId(), viewerId);

        var existing = savedPostRepository.findByUserIdAndPostId(viewerId, postId);
        if (existing.isPresent()) {
            savedPostRepository.delete(existing.get());
            return new SaveResponse(false);
        }

        UserProfile user = userProfileRepository.getReferenceById(viewerId);
        savedPostRepository.save(SavedPost.builder().user(user).post(post).build());
        return new SaveResponse(true);
    }
}
