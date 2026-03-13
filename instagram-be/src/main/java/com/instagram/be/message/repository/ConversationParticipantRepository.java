package com.instagram.be.message.repository;

import com.instagram.be.message.ConversationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, UUID> {

    @Query("""
            SELECT cp FROM ConversationParticipant cp
            JOIN FETCH cp.conversation c
            WHERE cp.user.id = :userId AND cp.accepted = true
            ORDER BY c.updatedAt DESC
            """)
    List<ConversationParticipant> findAcceptedByUserId(@Param("userId") UUID userId);

    @Query("""
            SELECT cp FROM ConversationParticipant cp
            JOIN FETCH cp.conversation c
            WHERE cp.user.id = :userId AND cp.accepted = false
            ORDER BY c.updatedAt DESC
            """)
    List<ConversationParticipant> findRequestsByUserId(@Param("userId") UUID userId);

    Optional<ConversationParticipant> findByConversationIdAndUserId(UUID conversationId, UUID userId);

    @Query("SELECT cp FROM ConversationParticipant cp JOIN FETCH cp.user WHERE cp.conversation.id = :convId AND cp.user.id != :userId")
    Optional<ConversationParticipant> findOtherParticipant(@Param("convId") UUID convId, @Param("userId") UUID userId);

    long countByConversationIdAndAcceptedFalseAndUserIdNot(UUID conversationId, UUID userId);
}
