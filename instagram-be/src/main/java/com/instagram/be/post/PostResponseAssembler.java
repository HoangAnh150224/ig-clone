package com.instagram.be.post;

import com.instagram.be.comment.repository.CommentRepository;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostMediaRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.repository.PostTagRepository;
import com.instagram.be.post.repository.PostViewRepository;
import com.instagram.be.post.response.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
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
  private final PostRepository postRepository;

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
    boolean isSaved = false;
    boolean isOwner = viewerId != null && viewerId.equals(ownerId);

    boolean isFollowing = false;
    if (viewerId != null && !viewerId.equals(ownerId)) {
      isFollowing = followRepository.findByFollowerIdAndFollowingId(viewerId, ownerId)
        .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
        .orElse(false);
    }

    List<String> hashtagNames = post.getHashtags().stream().map(h -> h.getName()).toList();
    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing, hashtagNames);
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

    List<String> hashtagNames = post.getHashtags().stream().map(h -> h.getName()).toList();
    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing, hashtagNames);
  }

  /**
   * Single post with isLiked and isSaved resolved externally.
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

    List<String> hashtagNames = post.getHashtags().stream().map(h -> h.getName()).toList();
    return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
      isLiked, isSaved, isOwner, isFollowing, hashtagNames);
  }

  /**
   * List of posts — batch-loads all related data in bulk queries to prevent N+1.
   */
  public List<PostResponse> toResponseList(List<Post> posts, UUID viewerId,
                                           Set<UUID> likedIds, Set<UUID> savedIds) {
    if (posts.isEmpty()) return Collections.emptyList();

    Set<UUID> postIds = posts.stream().map(Post::getId).collect(Collectors.toSet());
    Set<UUID> ownerIds = posts.stream().map(p -> p.getUser().getId()).collect(Collectors.toSet());

    // Batch-load all related data in 6 queries instead of N*6
    Map<UUID, List<PostMedia>> mediaByPost = postMediaRepository.findByPostIds(postIds)
      .stream().collect(Collectors.groupingBy(pm -> pm.getPost().getId()));

    Map<UUID, List<PostTag>> tagsByPost = postTagRepository.findWithUserByPostIds(postIds)
      .stream().collect(Collectors.groupingBy(pt -> pt.getPost().getId()));

    Map<UUID, Long> likeCountByPost = toCountMap(postLikeRepository.countByPostIds(postIds));
    Map<UUID, Long> commentCountByPost = toCountMap(commentRepository.countByPostIds(postIds));
    Map<UUID, Long> viewCountByPost = toCountMap(postViewRepository.countByPostIds(postIds));

    Set<UUID> followedOwnerIds = (viewerId != null && !ownerIds.isEmpty())
      ? followRepository.findFollowedIds(viewerId, ownerIds)
      : Collections.emptySet();

    Map<UUID, List<String>> hashtagNamesByPost = new java.util.HashMap<>();
    postRepository.findHashtagNamesByPostIds(postIds).forEach(row ->
      hashtagNamesByPost.computeIfAbsent((UUID) row[0], k -> new java.util.ArrayList<>()).add((String) row[1]));

    return posts.stream().map(post -> {
      UUID postId = post.getId();
      UUID ownerId = post.getUser().getId();

      List<PostMedia> media = mediaByPost.getOrDefault(postId, Collections.emptyList());
      List<PostTag> tags = tagsByPost.getOrDefault(postId, Collections.emptyList());
      long likeCount = likeCountByPost.getOrDefault(postId, 0L);
      long commentCount = commentCountByPost.getOrDefault(postId, 0L);
      long viewCount = viewCountByPost.getOrDefault(postId, 0L);

      boolean isLiked = likedIds != null && likedIds.contains(postId);
      boolean isSaved = savedIds != null && savedIds.contains(postId);
      boolean isOwner = viewerId != null && viewerId.equals(ownerId);
      boolean isFollowing = viewerId != null && !viewerId.equals(ownerId) && followedOwnerIds.contains(ownerId);
      List<String> hashtagNames = hashtagNamesByPost.getOrDefault(postId, Collections.emptyList());

      return buildResponse(post, media, tags, likeCount, commentCount, viewCount,
        isLiked, isSaved, isOwner, isFollowing, hashtagNames);
    }).collect(Collectors.toList());
  }

  private Map<UUID, Long> toCountMap(List<Object[]> rows) {
    return rows.stream().collect(Collectors.toMap(
      row -> (UUID) row[0],
      row -> (Long) row[1]
    ));
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
                                     boolean isFollowing,
                                     List<String> hashtagNames) {
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
      hashtagNames,
      taggedUsers,
      List.of(),
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
