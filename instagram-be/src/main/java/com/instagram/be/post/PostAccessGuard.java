package com.instagram.be.post;

import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PostAccessGuard {

  private final BlockRepository blockRepository;
  private final FollowRepository followRepository;
  private final UserProfileRepository userProfileRepository;

  /**
   * Throws NotFoundException (not 403) when access is denied to prevent info leakage.
   * Allowed when: no block in either direction AND (public profile OR owner OR accepted follower).
   */
  public void checkAccess(UUID postOwnerId, UUID viewerId) {
    if (viewerId != null && blockRepository.existsBlockBetween(postOwnerId, viewerId)) {
      throw new NotFoundException("Post not found");
    }

    UserProfile owner = userProfileRepository.findById(postOwnerId)
      .orElseThrow(() -> new NotFoundException("Post not found"));

    if (!owner.isPrivateAccount()) return;

    boolean isOwner = viewerId != null && viewerId.equals(postOwnerId);
    if (isOwner) return;

    if (viewerId == null) throw new NotFoundException("Post not found");

    boolean isFollowing = followRepository
      .findByFollowerIdAndFollowingId(viewerId, postOwnerId)
      .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
      .orElse(false);

    if (!isFollowing) throw new NotFoundException("Post not found");
  }
}
