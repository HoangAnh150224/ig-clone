package com.instagram.be.message.repository;

import com.instagram.be.message.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

  @Query("""
    SELECT c FROM Conversation c
    WHERE c.id IN (
        SELECT cp1.conversation.id FROM ConversationParticipant cp1
        WHERE cp1.user.id = :userA
    )
    AND c.id IN (
        SELECT cp2.conversation.id FROM ConversationParticipant cp2
        WHERE cp2.user.id = :userB
    )
    """)
  Optional<Conversation> findDirectConversation(@Param("userA") UUID userA, @Param("userB") UUID userB);
}
