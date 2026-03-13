package com.instagram.be.comment.repository;

import com.instagram.be.comment.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    long countByPostId(UUID postId);

    long countByParentCommentId(UUID parentCommentId);

    @Query("SELECT c.id FROM Comment c WHERE c.post.id = :postId AND c.pinned = true")
    java.util.Optional<UUID> findPinnedCommentId(@Param("postId") UUID postId);

    // Top-level: parentComment is null, pinned first
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.post.id = :postId AND c.parentComment IS NULL ORDER BY c.pinned DESC, c.createdAt DESC")
    Page<Comment> findTopLevelByPostId(@Param("postId") UUID postId, Pageable pageable);

    // Replies: parentComment matches
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.parentComment.id = :parentId ORDER BY c.createdAt ASC")
    Page<Comment> findRepliesByParentId(@Param("parentId") UUID parentId, Pageable pageable);

    @Query("SELECT cl.comment.id FROM CommentLike cl WHERE cl.user.id = :userId AND cl.comment.id IN :commentIds")
    Set<UUID> findLikedCommentIds(@Param("userId") UUID userId, @Param("commentIds") Set<UUID> commentIds);
}
