package com.instagram.be.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
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

    @Query("SELECT m FROM Message m " +
            "WHERE m.conversation.id = :convId " +
            "AND m.deleted = false " +
            "AND (:afterDate IS NULL OR m.createdAt > :afterDate) " +
            "ORDER BY m.createdAt DESC")
    List<Message> findLatestByConversationId(@Param("convId") UUID convId, @Param("afterDate") LocalDateTime afterDate, Pageable pageable);

    @Query("SELECT COUNT(m) FROM Message m " +
            "WHERE m.conversation.id = :convId " +
            "AND m.deleted = false " +
            "AND m.createdAt > :since " +
            "AND (:afterDate IS NULL OR m.createdAt > :afterDate)")
    long countUnread(@Param("convId") UUID convId, @Param("since") LocalDateTime since, @Param("afterDate") LocalDateTime afterDate);
}
