package com.instagram.be.saved;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, UUID> {

    Optional<SavedPost> findByUserIdAndPostId(UUID userId, UUID postId);

    boolean existsByUserIdAndPostId(UUID userId, UUID postId);

    @Query("SELECT sp.post.id FROM SavedPost sp WHERE sp.user.id = :userId AND sp.post.id IN :postIds")
    Set<UUID> findSavedPostIds(@Param("userId") UUID userId, @Param("postIds") Set<UUID> postIds);

    @Query("SELECT sp FROM SavedPost sp JOIN FETCH sp.post p JOIN FETCH p.user WHERE sp.user.id = :userId AND p.archived = false ORDER BY sp.createdAt DESC")
    Page<SavedPost> findSavedByUserId(@Param("userId") UUID userId, Pageable pageable);
}
