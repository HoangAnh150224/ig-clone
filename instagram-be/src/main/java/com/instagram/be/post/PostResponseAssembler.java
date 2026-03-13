package com.instagram.be.post;

import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostMediaRepository;
import com.instagram.be.post.repository.PostTagRepository;
import com.instagram.be.post.repository.PostViewRepository;
import com.instagram.be.post.response.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Assembles PostResponse objects from Post entities.
 * Use {@link #toResponse} for single posts (individual loads).
 * Use {@link #toResponseList} for lists (batch loads to prevent N+1).
 */
@Component
@RequiredArgsConstructor
public class PostResponseAssembler {

  private final PostMediaRepository postMediaRepository;
  private final PostTagRepository postTagRepository;
  private final PostLikeRepository postLikeRepository;
  private final PostViewRepository postViewRepository;
  private final CommentRepository commentRepository;
  private final FollowRepository followRepository;

  /**
   * Single post — safe for GetPostService, not for lists.
   */
  public PostResponse toResponse(Post post, UUID viewerId) {
    UUID postId = post.getId();
    UUID ownerId = post.getUser().getId();

    var media = postMediaRepository.findByPostIdOrderByDisplayOrderAsc(postId);
    var tags = postTagRepository.findWithUserByPostId(postId);
    long likeCount = postLikeRepository.countByPostId(postId);
    long commentCount = commentRepository.countByPostId(postId);
    long viewCount = postViewRepository.countByPostId(postId);

    boolean isLiked = viewerId != null && postLikeRepository.existsByPostIdAndUserId(postId, viewerId);
    boolean isSaved = false; // SavedPostRepository is injected via list method; single uses flag
    boolean isOwner = viewerId != null && viewerId.equals(ownerId);

    boolean isFollowing = false;
    if (viewerId != null && !viewerId.equals(ownerId)) {
      isFollowing = followRepository.findByFollowerIdAndFollowingId(viewerId, ownerId)
        .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
        .orElse(false);
    }

    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing);
  }

  /**
   * Single post with isSaved resolved externally.
   */
  public PostResponse toResponse(Post post, UUID viewerId, boolean isSaved) {
    UUID postId = post.getId();
    UUID ownerId = post.getUser().getId();

    var media = postMediaRepository.findByPostIdOrderByDisplayOrderAsc(postId);
    var tags = postTagRepository.findWithUserByPostId(postId);
    long likeCount = postLikeRepository.countByPostId(postId);
    long commentCount = commentRepository.countByPostId(postId);
    long viewCount = postViewRepository.countByPostId(postId);

    boolean isLiked = viewerId != null && postLikeRepository.existsByPostIdAndUserId(postId, viewerId);
    boolean isOwner = viewerId != null && viewerId.equals(ownerId);

    boolean isFollowing = false;
    if (viewerId != null && !viewerId.equals(ownerId)) {
      isFollowing = followRepository.findByFollowerIdAndFollowingId(viewerId, ownerId)
        .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
        .orElse(false);
    }

    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing);
  }

  /**
   * Single post with isLiked and isSaved resolved externally (for use inside page.map).
   */
  public PostResponse toResponse(Post post, UUID viewerId, boolean isLiked, boolean isSaved) {
    UUID postId = post.getId();
    UUID ownerId = post.getUser().getId();

    var media = postMediaRepository.findByPostIdOrderByDisplayOrderAsc(postId);
    var tags = postTagRepository.findWithUserByPostId(postId);
    long likeCount = postLikeRepository.countByPostId(postId);
    long commentCount = commentRepository.countByPostId(postId);
    long viewCount = postViewRepository.countByPostId(postId);

    boolean isOwner = viewerId != null && viewerId.equals(ownerId);
    boolean isFollowing = false;
    if (viewerId != null && !viewerId.equals(ownerId)) {
      isFollowing = followRepository.findByFollowerIdAndFollowingId(viewerId, ownerId)
        .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
        .orElse(false);
    }

    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing);
  }

  /**
   * List of posts — batch-loads liked/saved sets to prevent N+1.
   */
  public List<PostResponse> toResponseList(List<Post> posts, UUID viewerId,
                                           Set<UUID> likedIds, Set<UUID> savedIds) {
    return posts.stream()
      .map(post -> toResponseWithContext(post, viewerId, likedIds, savedIds))
      .collect(Collectors.toList());
  }

  private PostResponse toResponseWithContext(Post post, UUID viewerId,
                                             Set<UUID> likedIds, Set<UUID> savedIds) {
    UUID postId = post.getId();
    UUID ownerId = post.getUser().getId();

    var media = postMediaRepository.findByPostIdOrderByDisplayOrderAsc(postId);
    var tags = postTagRepository.findWithUserByPostId(postId);
    long likeCount = postLikeRepository.countByPostId(postId);
    long commentCount = commentRepository.countByPostId(postId);
    long viewCount = postViewRepository.countByPostId(postId);

    boolean isLiked = likedIds != null && likedIds.contains(postId);
    boolean isSaved = savedIds != null && savedIds.contains(postId);
    boolean isOwner = viewerId != null && viewerId.equals(ownerId);

    boolean isFollowing = false;
    if (viewerId != null && !viewerId.equals(ownerId)) {
      isFollowing = followRepository.findByFollowerIdAndFollowingId(viewerId, ownerId)
        .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
        .orElse(false);
    }

    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing);
  }

  private PostResponse buildResponse(Post post,
                                     List<PostMedia> media,
                                     List<PostTag> tags,
                                     long likeCount,
                                     long commentCount,
                                     long viewCount,
                                     boolean isLiked,
                                     boolean isSaved,
                                     boolean isOwner,
                                     boolean isFollowing) {
    var author = new PostResponse.AuthorInfo(
      post.getUser().getId(),
      post.getUser().getUsername(),
      post.getUser().getFullName(),
      post.getUser().getAvatarUrl(),
      post.getUser().isVerified(),
      isFollowing
    );

    var mediaList = media.stream()
      .map(m -> new PostResponse.MediaInfo(m.getUrl(), m.getMediaType().name(), m.getDisplayOrder()))
      .collect(Collectors.toList());

    var hashtags = post.getHashtags().stream()
      .map(h -> h.getName())
      .collect(Collectors.toList());

    var taggedUsers = tags.stream()
      .map(t -> new PostResponse.TaggedUserInfo(
        t.getTaggedUser().getId(),
        t.getTaggedUser().getUsername(),
        t.getTaggedUser().getAvatarUrl()))
      .collect(Collectors.toList());

    return new PostResponse(
      post.getId(),
      post.getType(),
      post.getCaption(),
      post.getLocationName(),
      post.getMusic(),
      post.isHideLikeCount(),
      post.isCommentsDisabled(),
      post.isArchived(),
      author,
      mediaList,
      hashtags,
      taggedUsers,
      List.of(),  // skippedTagIds not stored per-response
      likeCount,
      commentCount,
      viewCount,
      isLiked,
      isSaved,
      isOwner,
      post.getCreatedAt(),
      post.getUpdatedAt()
    );
  }
}
