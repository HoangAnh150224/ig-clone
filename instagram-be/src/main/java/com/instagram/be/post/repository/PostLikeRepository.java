package com.instagram.be.post.repository;

import com.instagram.be.post.PostLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, UUID> {

  Optional<PostLike> findByPostIdAndUserId(UUID postId, UUID userId);

  boolean existsByPostIdAndUserId(UUID postId, UUID userId);

  long countByPostId(UUID postId);

  @Query("SELECT pl.post.id FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id IN :postIds")
  Set<UUID> findLikedPostIds(@Param("userId") UUID userId, @Param("postIds") Set<UUID> postIds);

  @Query("SELECT pl.post.id, COUNT(pl) FROM PostLike pl WHERE pl.post.id IN :postIds GROUP BY pl.post.id")
  List<Object[]> countByPostIds(@Param("postIds") Set<UUID> postIds);

  @Query("SELECT pl FROM PostLike pl JOIN FETCH pl.user WHERE pl.post.id = :postId")
  Page<PostLike> findWithUserByPostId(@Param("postId") UUID postId, Pageable pageable);
}
