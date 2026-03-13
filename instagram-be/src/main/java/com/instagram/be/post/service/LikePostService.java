package com.instagram.be.post.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.notification.service.CreateNotificationService;
import com.instagram.be.post.Post;
import com.instagram.be.post.PostAccessGuard;
import com.instagram.be.post.PostLike;
import com.instagram.be.post.repository.PostLikeRepository;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.post.request.PostActionRequest;
import com.instagram.be.post.response.LikeResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikePostService extends BaseService<PostActionRequest, LikeResponse> {

  private final PostRepository postRepository;
  private final PostLikeRepository postLikeRepository;
  private final PostAccessGuard postAccessGuard;
  private final UserProfileRepository userProfileRepository;
  private final CreateNotificationService notificationService;

  @Override
  @Transactional
  public LikeResponse execute(PostActionRequest request) {
    return super.execute(request);
  }

  @Override
  protected LikeResponse doProcess(PostActionRequest request) {
    UUID viewerId = request.getUserContext().getUserId();
    UUID postId = request.getPostId();

    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new NotFoundException("Post", postId));

    postAccessGuard.checkAccess(post.getUser().getId(), viewerId);

    boolean liked;
    var existing = postLikeRepository.findByPostIdAndUserId(postId, viewerId);
    if (existing.isPresent()) {
      postLikeRepository.delete(existing.get());
      liked = false;
    } else {
      UserProfile user = userProfileRepository.getReferenceById(viewerId);
      postLikeRepository.save(PostLike.builder().post(post).user(user).build());
      liked = true;

      // Notify owner
      notificationService.create(post.getUser(), user, NotificationType.LIKE, post, null);
    }

    long likeCount = postLikeRepository.countByPostId(postId);
    return new LikeResponse(liked, likeCount);
  }
}
