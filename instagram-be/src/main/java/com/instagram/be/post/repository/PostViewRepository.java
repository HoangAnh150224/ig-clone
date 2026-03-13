package com.instagram.be.post.repository;

import com.instagram.be.post.PostView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PostViewRepository extends JpaRepository<PostView, UUID> {

  Optional<PostView> findByPostIdAndViewerId(UUID postId, UUID viewerId);

  long countByPostId(UUID postId);

  @Query("SELECT pv.post.id, COUNT(pv) FROM PostView pv WHERE pv.post.id IN :postIds GROUP BY pv.post.id")
  List<Object[]> countByPostIds(@Param("postIds") Set<UUID> postIds);
}
