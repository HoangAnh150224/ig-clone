package com.instagram.be.comment.repository;

import com.instagram.be.comment.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, UUID> {

  Optional<CommentLike> findByCommentIdAndUserId(UUID commentId, UUID userId);

  boolean existsByCommentIdAndUserId(UUID commentId, UUID userId);

  long countByCommentId(UUID commentId);

  @Query("SELECT cl.comment.id, COUNT(cl) FROM CommentLike cl WHERE cl.comment.id IN :commentIds GROUP BY cl.comment.id")
  List<Object[]> countByCommentIds(@Param("commentIds") Set<UUID> commentIds);
}
