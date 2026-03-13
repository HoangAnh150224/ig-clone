package com.instagram.be.favorite.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.favorite.FavoritePost;
import com.instagram.be.favorite.repository.FavoritePostRepository;
import com.instagram.be.favorite.request.FavoriteRequest;
import com.instagram.be.favorite.response.FavoriteResponse;
import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ToggleFavoritePostService extends BaseService<FavoriteRequest, FavoriteResponse> {

  private final FavoritePostRepository favoritePostRepository;
  private final PostRepository postRepository;
  private final UserProfileRepository userProfileRepository;

  @Override
  @Transactional
  public FavoriteResponse execute(FavoriteRequest request) {
    return super.execute(request);
  }

  @Override
  protected FavoriteResponse doProcess(FavoriteRequest request) {
    UUID userId = request.getUserContext().getUserId();
    UUID postId = request.getTargetId();

    Optional<FavoritePost> existing = favoritePostRepository.findByUserIdAndPostId(userId, postId);
    if (existing.isPresent()) {
      favoritePostRepository.delete(existing.get());
      return new FavoriteResponse(false);
    }

    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new NotFoundException("Post", postId));
    UserProfile user = userProfileRepository.getReferenceById(userId);

    favoritePostRepository.save(FavoritePost.builder().user(user).post(post).build());
    return new FavoriteResponse(true);
  }
}
