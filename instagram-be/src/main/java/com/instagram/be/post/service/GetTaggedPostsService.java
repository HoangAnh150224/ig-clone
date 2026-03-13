package com.instagram.be.post.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.PostResponseAssembler;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostTagRepository;
import com.instagram.be.post.request.GetPostListRequest;
import com.instagram.be.post.response.PostResponse;
import com.instagram.be.saved.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetTaggedPostsService extends BaseService<GetPostListRequest, PaginatedResponse<PostResponse>> {

  private final PostTagRepository postTagRepository;
  private final PostAccessGuard postAccessGuard;
  private final PostLikeRepository postLikeRepository;
  private final SavedPostRepository savedPostRepository;
  private final PostResponseAssembler assembler;

  @Override
  @Transactional(readOnly = true)
  public PaginatedResponse<PostResponse> execute(GetPostListRequest request) {
    return super.execute(request);
  }

  @Override
  protected PaginatedResponse<PostResponse> doProcess(GetPostListRequest request) {
    UUID targetUserId = request.getTargetUserId();
    UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

    postAccessGuard.checkAccess(targetUserId, viewerId);

    Page<com.instagram.be.post.PostTag> page = postTagRepository.findByTaggedUserIdAndNotArchived(
      targetUserId, PageRequest.of(request.getPage(), request.getSize()));

    List<com.instagram.be.post.Post> posts = page.getContent().stream()
      .map(t -> t.getPost())
      .toList();

    Set<UUID> postIds = posts.stream().map(p -> p.getId()).collect(Collectors.toSet());
    Set<UUID> likedIds = viewerId != null && !postIds.isEmpty()
      ? postLikeRepository.findLikedPostIds(viewerId, postIds) : Set.of();
    Set<UUID> savedIds = viewerId != null && !postIds.isEmpty()
      ? savedPostRepository.findSavedPostIds(viewerId, postIds) : Set.of();

    List<PostResponse> responses = assembler.toResponseList(posts, viewerId, likedIds, savedIds);
    return new PaginatedResponse<>(responses, page.getNumber(), page.getSize(),
      page.getTotalElements(), page.getTotalPages(), page.isFirst(), page.isLast(), page.isEmpty());
  }
}
