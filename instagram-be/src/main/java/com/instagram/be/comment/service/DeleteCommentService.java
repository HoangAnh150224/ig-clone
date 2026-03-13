package com.instagram.be.comment.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.comment.Comment;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.CommentActionRequest;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteCommentService extends BaseService<CommentActionRequest, Void> {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public Void execute(CommentActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(CommentActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        Comment comment = commentRepository.findById(request.getCommentId())
                .orElseThrow(() -> new NotFoundException("Comment", request.getCommentId()));

        Post post = comment.getPost();
        boolean isCommentOwner = comment.getUser().getId().equals(viewerId);
        boolean isPostOwner = post.getUser().getId().equals(viewerId);

        if (!isCommentOwner && !isPostOwner) {
            throw new BusinessException("You do not have permission to delete this comment");
        }

        commentRepository.delete(comment);
        return null;
    }
}
