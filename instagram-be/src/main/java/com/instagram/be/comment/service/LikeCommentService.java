package com.instagram.be.comment.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.comment.Comment;
import com.instagram.be.comment.CommentLike;
import com.instagram.be.comment.repository.CommentLikeRepository;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.CommentActionRequest;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.response.LikeResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikeCommentService extends BaseService<CommentActionRequest, LikeResponse> {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public LikeResponse execute(CommentActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected LikeResponse doProcess(CommentActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        UUID commentId = request.getCommentId();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comment", commentId));

        boolean liked;
        var existing = commentLikeRepository.findByCommentIdAndUserId(commentId, viewerId);
        if (existing.isPresent()) {
            commentLikeRepository.delete(existing.get());
            liked = false;
        } else {
            UserProfile user = userProfileRepository.getReferenceById(viewerId);
            commentLikeRepository.save(CommentLike.builder().comment(comment).user(user).build());
            liked = true;
        }

        long likeCount = commentLikeRepository.countByCommentId(commentId);
        return new LikeResponse(liked, likeCount);
    }
}
