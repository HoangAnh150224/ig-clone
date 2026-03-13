package com.instagram.be.comment.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.comment.Comment;
import com.instagram.be.comment.repository.CommentLikeRepository;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.AddCommentRequest;
import com.instagram.be.comment.response.CommentResponse;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.service.CreateNotificationService;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddCommentService extends BaseService<AddCommentRequest, CommentResponse> {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostAccessGuard postAccessGuard;
    private final UserProfileRepository userProfileRepository;
    private final CreateNotificationService notificationService;

    @Override
    @Transactional
    public CommentResponse execute(AddCommentRequest request) {
        return super.execute(request);
    }

    @Override
    protected CommentResponse doProcess(AddCommentRequest request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new AppValidationException("Comment content cannot be empty");
        }

        UUID viewerId = request.getUserContext().getUserId();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new NotFoundException("Post", request.getPostId()));

        if (post.isCommentsDisabled()) {
            throw new BusinessException("Comments are disabled for this post");
        }

        postAccessGuard.checkAccess(post.getUser().getId(), viewerId);

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new NotFoundException("Comment", request.getParentCommentId()));
            // Enforce max depth 1
            if (parentComment.getParentComment() != null) {
                throw new BusinessException("Cannot reply to a reply");
            }
        }

        UserProfile user = userProfileRepository.getReferenceById(viewerId);
        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .content(request.getContent())
                .parentComment(parentComment)
                .build();

        Comment saved = commentRepository.save(comment);

        // Notify post owner
        notificationService.create(post.getUser(), user, NotificationType.COMMENT, post, saved);

        // If reply, notify parent comment owner as well
        if (parentComment != null) {
            notificationService.create(parentComment.getUser(), user, NotificationType.COMMENT, post, saved);
        }

        long replyCount = 0;
        long likeCount = 0;
        return CommentResponse.of(saved, replyCount, likeCount, false, true);
    }
}
