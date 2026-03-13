package com.instagram.be.comment.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.comment.Comment;
import com.instagram.be.comment.repository.CommentLikeRepository;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.CommentActionRequest;
import com.instagram.be.comment.response.CommentResponse;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PinCommentService extends BaseService<CommentActionRequest, CommentResponse> {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Override
    @Transactional
    public CommentResponse execute(CommentActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected CommentResponse doProcess(CommentActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new NotFoundException("Comment", request.getCommentId()));

        if (!comment.getPost().getUser().getId().equals(viewerId)) {
            throw new BusinessException("Only the post owner can pin comments");
        }

        // Unpin current pinned comment on this post
        commentRepository.findPinnedCommentId(comment.getPost().getId()).ifPresent(pinnedId -> {
            if (!pinnedId.equals(comment.getId())) {
                commentRepository.findById(pinnedId).ifPresent(pinned -> {
                    pinned.setPinned(false);
                    commentRepository.save(pinned);
                });
            }
        });

        comment.setPinned(!comment.isPinned());
        Comment saved = commentRepository.save(comment);

        long replyCount = commentRepository.countByParentCommentId(saved.getId());
        long likeCount = commentLikeRepository.countByCommentId(saved.getId());
        boolean isLiked = commentLikeRepository.existsByCommentIdAndUserId(saved.getId(), viewerId);
        return CommentResponse.of(saved, replyCount, likeCount, isLiked, true);
    }
}
