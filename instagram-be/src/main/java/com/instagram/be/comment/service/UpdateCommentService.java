package com.instagram.be.comment.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.comment.Comment;
import com.instagram.be.comment.repository.CommentLikeRepository;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.UpdateCommentRequest;
import com.instagram.be.comment.response.CommentResponse;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateCommentService extends BaseService<UpdateCommentRequest, CommentResponse> {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;

    @Override
    @Transactional
    public CommentResponse execute(UpdateCommentRequest request) {
        return super.execute(request);
    }

    @Override
    protected CommentResponse doProcess(UpdateCommentRequest request) {
        UUID userId = request.getUserContext().getUserId();

        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new NotFoundException("Comment", request.getCommentId()));

        if (!comment.getPost().getId().equals(request.getPostId())) {
            throw new NotFoundException("Comment", request.getCommentId());
        }

        if (!comment.getUser().getId().equals(userId)) {
            throw new BusinessException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        Comment saved = commentRepository.save(comment);

        long replyCount = commentRepository.countByParentCommentId(saved.getId());
        long likeCount = commentLikeRepository.countByCommentId(saved.getId());
        boolean isLiked = commentLikeRepository.existsByCommentIdAndUserId(saved.getId(), userId);

        return CommentResponse.of(saved, replyCount, likeCount, isLiked, true);
    }
}
