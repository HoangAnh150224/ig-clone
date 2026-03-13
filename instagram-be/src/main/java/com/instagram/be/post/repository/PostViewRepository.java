package com.instagram.be.post.repository;

import com.instagram.be.post.PostView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostViewRepository extends JpaRepository<PostView, UUID> {

    Optional<PostView> findByPostIdAndViewerId(UUID postId, UUID viewerId);

    long countByPostId(UUID postId);
}
