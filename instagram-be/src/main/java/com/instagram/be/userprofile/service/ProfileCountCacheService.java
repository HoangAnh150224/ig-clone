package com.instagram.be.userprofile.service;

import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.post.repository.PostRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileCountCacheService {

    private final PostRepository postRepository;
    private final FollowRepository followRepository;

    @Cacheable(value = "profileCounts", key = "#userId.toString()")
    public ProfileCounts getCounts(UUID userId) {
        long posts = postRepository.countByUserIdAndArchivedFalse(userId);
        long followers = followRepository.countByFollowingIdAndStatus(userId, FollowStatus.ACCEPTED);
        long following = followRepository.countByFollowerIdAndStatus(userId, FollowStatus.ACCEPTED);
        return new ProfileCounts(posts, followers, following);
    }

    @CacheEvict(value = "profileCounts", key = "#userId.toString()")
    public void evict(UUID userId) {
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileCounts {
        private long posts;
        private long followers;
        private long following;
    }
}
