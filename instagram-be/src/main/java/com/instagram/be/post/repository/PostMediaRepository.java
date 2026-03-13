package com.instagram.be.post.repository;

import com.instagram.be.post.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, UUID> {

    List<PostMedia> findByPostIdOrderByDisplayOrderAsc(UUID postId);

    @Query("SELECT pm FROM PostMedia pm WHERE pm.post.id IN :postIds ORDER BY pm.post.id, pm.displayOrder ASC")
    List<PostMedia> findByPostIds(@Param("postIds") Set<UUID> postIds);
}
