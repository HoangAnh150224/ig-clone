package com.instagram.be.comment.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.comment.request.AddCommentRequest;
import com.instagram.be.comment.request.CommentActionRequest;
import com.instagram.be.comment.request.GetCommentsRequest;
import com.instagram.be.comment.response.CommentResponse;
import com.instagram.be.comment.service.*;
import com.instagram.be.post.response.LikeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final AddCommentService addCommentService;
    private final GetCommentsService getCommentsService;
    private final DeleteCommentService deleteCommentService;
    private final PinCommentService pinCommentService;
    private final LikeCommentService likeCommentService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<CommentResponse>>> getComments(
            @PathVariable UUID postId,
            @RequestParam(required = false) UUID parentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserContext ctx = SecurityUtils.getCurrentUserContext().orElse(null);
        GetCommentsRequest request = GetCommentsRequest.builder()
                .postId(postId).parentCommentId(parentId).page(page).size(size).userContext(ctx).build();
        return ResponseEntity.ok(ApiResponse.success(getCommentsService.execute(request), "Comments retrieved", 200));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable UUID postId,
            @RequestBody AddCommentRequest request) {
        request.setPostId(postId);
        request.setUserContext(currentUser());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(addCommentService.execute(request), "Comment added", 201));
    }

    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable UUID postId,
            @PathVariable UUID commentId) {
        CommentActionRequest request = CommentActionRequest.builder()
                .postId(postId).commentId(commentId).userContext(currentUser()).build();
        deleteCommentService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Comment deleted", 200));
    }

    @PostMapping("/{commentId}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LikeResponse>> likeComment(
            @PathVariable UUID postId,
            @PathVariable UUID commentId) {
        CommentActionRequest request = CommentActionRequest.builder()
                .postId(postId).commentId(commentId).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(likeCommentService.execute(request), "Like toggled", 200));
    }

    @PostMapping("/{commentId}/pin")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CommentResponse>> pinComment(
            @PathVariable UUID postId,
            @PathVariable UUID commentId) {
        CommentActionRequest request = CommentActionRequest.builder()
                .postId(postId).commentId(commentId).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(pinCommentService.execute(request), "Pin toggled", 200));
    }

    private UserContext currentUser() {
        return SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    }
}
