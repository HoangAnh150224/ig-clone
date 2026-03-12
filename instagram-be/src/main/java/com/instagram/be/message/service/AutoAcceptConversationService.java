package com.instagram.be.message.service;

import com.instagram.be.message.ConversationParticipantRepository;
import com.instagram.be.message.ConversationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutoAcceptConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;

    /**
     * Flips recipientId's ConversationParticipant.accepted to true
     * in the direct conversation between senderId and recipientId.
     * No-op if no conversation exists or participant is already accepted.
     */
    @Transactional
    public void accept(UUID senderId, UUID recipientId) {
        conversationRepository.findDirectConversation(senderId, recipientId)
                .ifPresent(conv ->
                        participantRepository
                                .findByConversationIdAndUserId(conv.getId(), recipientId)
                                .filter(cp -> !cp.isAccepted())
                                .ifPresent(cp -> {
                                    cp.setAccepted(true);
                                    participantRepository.save(cp);
                                    log.debug("Auto-accepted message request: sender={} recipient={}", senderId, recipientId);
                                })
                );
    }
}
