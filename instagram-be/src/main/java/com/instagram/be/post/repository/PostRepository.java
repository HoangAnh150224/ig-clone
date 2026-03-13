package com.instagram.be.post.repository;

import com.instagram.be.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    long countByUserIdAndArchivedFalse(UUID userId);

    // User's posts (non-archived for non-owners)
    @Query("SELECT p FROM Post p JOIN FETCH p.user u WHERE p.user.id = :userId AND p.archived = false AND u.active = true ORDER BY p.createdAt DESC")
    Page<Post> findPublicByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    Page<Post> findAllByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.user.id = :userId AND p.archived = true ORDER BY p.createdAt DESC")
    Page<Post> findArchivedByUserId(@Param("userId") UUID userId, Pageable pageable);

    // Feed: cursor-based — posts from followed users, non-archived
    @Query("""
            SELECT p FROM Post p JOIN FETCH p.user u
            WHERE u.id IN :followedIds
              AND p.archived = false
              AND u.active = true
              AND (p.createdAt < :cursorTime
                   OR (p.createdAt = :cursorTime AND p.id < :cursorId))
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Post> findFeedPosts(@Param("followedIds") List<UUID> followedIds,
                             @Param("cursorTime") LocalDateTime cursorTime,
                             @Param("cursorId") UUID cursorId,
                             Pageable pageable);

    @Query("""
            SELECT p FROM Post p JOIN FETCH p.user u
            WHERE u.id IN :followedIds
              AND p.archived = false
              AND u.active = true
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Post> findFeedPostsFirst(@Param("followedIds") List<UUID> followedIds,
                                  Pageable pageable);

    // Reel feed (type filter)
    @Query("""
            SELECT p FROM Post p JOIN FETCH p.user u
            WHERE u.id IN :followedIds
              AND p.archived = false
              AND u.active = true
              AND p.type = com.instagram.be.post.enums.PostType.REEL
              AND (p.createdAt < :cursorTime
                   OR (p.createdAt = :cursorTime AND p.id < :cursorId))
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Post> findReelFeedPosts(@Param("followedIds") List<UUID> followedIds,
                                 @Param("cursorTime") LocalDateTime cursorTime,
                                 @Param("cursorId") UUID cursorId,
                                 Pageable pageable);

    @Query("""
            SELECT p FROM Post p JOIN FETCH p.user u
            WHERE u.id IN :followedIds
              AND p.archived = false
              AND u.active = true
              AND p.type = com.instagram.be.post.enums.PostType.REEL
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Post> findReelFeedPostsFirst(@Param("followedIds") List<UUID> followedIds,
                                      Pageable pageable);

    @Query("SELECT COUNT(p) FROM Post p JOIN p.hashtags h WHERE h.name = :name AND p.archived = false")
    long countByHashtagName(@Param("name") String name);

    // Explore: public posts ordered by like count (popular)
    @Query(value = """
            SELECT p FROM Post p JOIN FETCH p.user u
            WHERE p.archived = false AND u.privateAccount = false AND u.active = true
            ORDER BY p.createdAt DESC
            """,
            countQuery = "SELECT COUNT(p) FROM Post p JOIN p.user u WHERE p.archived = false AND u.privateAccount = false AND u.active = true")
    Page<Post> findExplore(Pageable pageable);

    // Posts by hashtag
    @Query(value = """
            SELECT p FROM Post p JOIN FETCH p.user u JOIN p.hashtags h
            WHERE h.name = :hashtagName AND p.archived = false AND u.privateAccount = false AND u.active = true
            ORDER BY p.createdAt DESC
            """,
            countQuery = "SELECT COUNT(p) FROM Post p JOIN p.user u JOIN p.hashtags h WHERE h.name = :hashtagName AND p.archived = false AND u.privateAccount = false AND u.active = true")
    Page<Post> findByHashtagName(@Param("hashtagName") String hashtagName, Pageable pageable);

    // Batch: liked post IDs
    @Query("SELECT pl.post.id FROM PostLike pl WHERE pl.user.id = :userId AND pl.post.id IN :postIds")
    Set<UUID> findLikedPostIds(@Param("userId") UUID userId, @Param("postIds") Set<UUID> postIds);
}
