package com.instagram.be.message.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.request.MessageActionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AcceptMessageRequestService extends BaseService<MessageActionRequest, Void> {

    private final ConversationParticipantRepository participantRepository;

    @Override
    @Transactional
    public Void execute(MessageActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(MessageActionRequest request) {
        UUID userId = request.getUserContext().getUserId();
        var participant = participantRepository
                .findByConversationIdAndUserId(request.getConversationId(), userId)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));

        participant.setAccepted(true);
        participantRepository.save(participant);
        return null;
    }
}
