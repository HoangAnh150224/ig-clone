package com.instagram.be.post.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.GetPostListRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetLikersService extends BaseService<GetPostListRequest, PaginatedResponse<FollowUserResponse>> {

  private final PostRepository postRepository;
  private final PostLikeRepository postLikeRepository;
  private final FollowRepository followRepository;

  @Override
  @Transactional(readOnly = true)
  public PaginatedResponse<FollowUserResponse> execute(GetPostListRequest request) {
    return super.execute(request);
  }

  @Override
  protected PaginatedResponse<FollowUserResponse> doProcess(GetPostListRequest request) {
    UUID postId = request.getPostId();
    UUID viewerId = request.getUserContext() != null ? request.getUserContext().getUserId() : null;

    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new NotFoundException("Post", postId));

    boolean isOwner = viewerId != null && viewerId.equals(post.getUser().getId());
    if (post.isHideLikeCount() && !isOwner) {
      throw new BusinessException("Like count is hidden for this post");
    }

    var page = postLikeRepository.findWithUserByPostId(
      postId, PageRequest.of(request.getPage(), request.getSize()));

    Set<UUID> likerIds = page.getContent().stream()
      .map(l -> l.getUser().getId()).collect(Collectors.toSet());

    Set<UUID> followedLikerIds = (viewerId != null && !likerIds.isEmpty())
      ? followRepository.findFollowedIds(viewerId, likerIds)
      : Set.of();

    return PaginatedResponse.from(page.map(like ->
      FollowUserResponse.of(like.getUser(), followedLikerIds.contains(like.getUser().getId()))));
  }
}
