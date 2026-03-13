package com.instagram.be.story;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StoryRepository extends JpaRepository<Story, UUID> {

    @Query("""
            SELECT s FROM Story s JOIN FETCH s.user u
            WHERE u.id IN :userIds
              AND s.archived = false
              AND s.expiresAt > :now
            ORDER BY s.createdAt ASC
            """)
    List<Story> findActiveStoriesByUserIds(@Param("userIds") List<UUID> userIds,
                                           @Param("now") LocalDateTime now);

    @Query("SELECT s FROM Story s JOIN FETCH s.user WHERE s.user.id = :userId AND s.archived = false AND s.expiresAt > :now ORDER BY s.createdAt ASC")
    List<Story> findActiveStoriesByUserId(@Param("userId") UUID userId, @Param("now") LocalDateTime now);

    @Query("SELECT s FROM Story s WHERE s.archived = false AND s.expiresAt < :now")
    List<Story> findExpiredStories(@Param("now") LocalDateTime now);

    @Query("SELECT s FROM Story s JOIN FETCH s.user WHERE s.user.id = :userId AND s.archived = true ORDER BY s.createdAt DESC")
    List<Story> findArchivedByUserId(@Param("userId") UUID userId);
}
