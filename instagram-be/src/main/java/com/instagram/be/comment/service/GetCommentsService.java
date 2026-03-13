package com.instagram.be.comment.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.comment.repository.CommentLikeRepository;
import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.comment.request.GetCommentsRequest;
import com.instagram.be.comment.response.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetCommentsService extends BaseService<GetCommentsRequest, PaginatedResponse<CommentResponse>> {

  private final CommentRepository commentRepository;
  private final CommentLikeRepository commentLikeRepository;

  @Override
  @Transactional(readOnly = true)
  public PaginatedResponse<CommentResponse> execute(GetCommentsRequest request) {
    return super.execute(request);
  }

  @Override
  protected PaginatedResponse<CommentResponse> doProcess(GetCommentsRequest request) {
    UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;
    PageRequest pageable = PageRequest.of(request.getPage(), request.getSize());

    Page<com.instagram.be.comment.Comment> page = request.getParentCommentId() == null
      ? commentRepository.findTopLevelByPostId(request.getPostId(), pageable)
      : commentRepository.findRepliesByParentId(request.getParentCommentId(), pageable);

    List<com.instagram.be.comment.Comment> comments = page.getContent();
    Set<UUID> commentIds = comments.stream().map(c -> c.getId()).collect(Collectors.toSet());

    Set<UUID> likedCommentIds = viewerId != null && !commentIds.isEmpty()
      ? commentRepository.findLikedCommentIds(viewerId, commentIds) : Set.of();

    // Batch-load reply counts and like counts to prevent N+1
    Map<UUID, Long> replyCountMap = toCountMap(commentRepository.countRepliesByParentIds(commentIds));
    Map<UUID, Long> likeCountMap = toCountMap(commentLikeRepository.countByCommentIds(commentIds));

    List<CommentResponse> responses = comments.stream().map(c -> {
      long replyCount = c.getParentComment() == null ? replyCountMap.getOrDefault(c.getId(), 0L) : 0L;
      long likeCount = likeCountMap.getOrDefault(c.getId(), 0L);
      boolean isLiked = likedCommentIds.contains(c.getId());
      boolean isOwner = viewerId != null && viewerId.equals(c.getUser().getId());
      return CommentResponse.of(c, replyCount, likeCount, isLiked, isOwner);
    }).collect(Collectors.toList());

    return new PaginatedResponse<>(responses, page.getNumber(), page.getSize(),
      page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast(), page.isEmpty());
  }

  private Map<UUID, Long> toCountMap(List<Object[]> rows) {
    return rows.stream().collect(Collectors.toMap(
      row -> (UUID) row[0],
      row -> (Long) row[1]
    ));
  }
}
