package com.instagram.be.message.repository;

import com.instagram.be.message.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m JOIN FETCH m.sender " +
            "LEFT JOIN FETCH m.sharedPost sp LEFT JOIN FETCH sp.user " +
            "WHERE m.conversation.id = :convId " +
            "AND m.deleted = false " +
            "AND (:afterDate IS NULL OR m.createdAt > :afterDate) " +
            "ORDER BY m.createdAt DESC")
    Page<Message> findByConversationId(@Param("convId") UUID convId, @Param("afterDate") LocalDateTime afterDate, Pageable pageable);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender " +
            "WHERE m.conversation.id = :convId " +
            "AND m.deleted = false " +
            "AND (:afterDate IS NULL OR m.createdAt > :afterDate) " +
            "ORDER BY m.createdAt DESC")
    List<Message> findLatestByConversationId(@Param("convId") UUID convId, @Param("afterDate") LocalDateTime afterDate, Pageable pageable);

    @Query("""
            SELECT m FROM Message m JOIN FETCH m.sender
            LEFT JOIN FETCH m.sharedPost sp LEFT JOIN FETCH sp.user
            WHERE m.conversation.id = :convId AND m.deleted = false
              AND (:afterDate IS NULL OR m.createdAt > :afterDate)
            ORDER BY m.createdAt DESC, m.id DESC
            """)
    List<Message> findFirstByConversationId(@Param("convId") UUID convId,
                                            @Nullable @Param("afterDate") LocalDateTime afterDate,
                                            Pageable pageable);

    @Query("""
            SELECT m FROM Message m JOIN FETCH m.sender
            LEFT JOIN FETCH m.sharedPost sp LEFT JOIN FETCH sp.user
            WHERE m.conversation.id = :convId AND m.deleted = false
              AND (:afterDate IS NULL OR m.createdAt > :afterDate)
              AND (m.createdAt < :cursorTime OR (m.createdAt = :cursorTime AND m.id < :cursorId))
            ORDER BY m.createdAt DESC, m.id DESC
            """)
    List<Message> findWithCursorByConversationId(@Param("convId") UUID convId,
                                                 @Nullable @Param("afterDate") LocalDateTime afterDate,
                                                 @Param("cursorTime") LocalDateTime cursorTime,
                                                 @Param("cursorId") UUID cursorId,
                                                 Pageable pageable);

    @Query("SELECT COUNT(m) FROM Message m " +
            "WHERE m.conversation.id = :convId " +
            "AND m.deleted = false " +
            "AND m.createdAt > :since " +
            "AND (:afterDate IS NULL OR m.createdAt > :afterDate)")
    long countUnread(@Param("convId") UUID convId, @Param("since") LocalDateTime since, @Param("afterDate") LocalDateTime afterDate);
}
