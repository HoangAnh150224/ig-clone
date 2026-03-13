package com.instagram.be.message.repository;

import com.instagram.be.message.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("""
            SELECT conv FROM Conversation conv WHERE conv.id IN (
                SELECT cp.conversation.id
                FROM ConversationParticipant cp
                WHERE cp.user.id IN :participantIds
                GROUP BY cp.conversation.id
                HAVING COUNT(DISTINCT cp.user.id) = :participantCount
            ) AND (
                SELECT COUNT(cp2.id)
                FROM ConversationParticipant cp2
                WHERE cp2.conversation.id = conv.id
            ) = :participantCount
            """)
    Optional<Conversation> findConversationByExactParticipants(
            @Param("participantIds") List<UUID> participantIds,
            @Param("participantCount") long participantCount
    );
}
