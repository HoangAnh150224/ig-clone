package com.instagram.be.message.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.message.ConversationParticipant;
import com.instagram.be.message.ConversationParticipantRepository;
import com.instagram.be.message.request.ConversationActionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteConversationService extends BaseService<ConversationActionRequest, Void> {

    private final ConversationParticipantRepository participantRepository;

    @Override
    @Transactional
    public Void execute(ConversationActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(ConversationActionRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UUID conversationId = request.getConversationId();

        ConversationParticipant participant = participantRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new NotFoundException("Conversation not found for this user"));

        participant.setLastDeletedAt(LocalDateTime.now());
        participantRepository.save(participant);

        return null;
    }
}
