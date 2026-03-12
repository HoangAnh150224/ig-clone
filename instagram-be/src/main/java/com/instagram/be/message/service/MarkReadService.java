package com.instagram.be.message.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.message.ConversationParticipantRepository;
import com.instagram.be.message.request.MessageActionRequest;
import com.instagram.be.message.response.ReadStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MarkReadService extends BaseService<MessageActionRequest, Void> {

    private final ConversationParticipantRepository participantRepository;
    private final SimpMessagingTemplate messagingTemplate;

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

        LocalDateTime now = LocalDateTime.now();
        participant.setLastReadAt(now);
        participantRepository.save(participant);

        // Notify other participants in the conversation that this user has read messages
        ReadStatusResponse status = new ReadStatusResponse(
                request.getConversationId(),
                userId,
                now
        );
        messagingTemplate.convertAndSend("/topic/messages/" + request.getConversationId(), status);

        return null;
    }
}
