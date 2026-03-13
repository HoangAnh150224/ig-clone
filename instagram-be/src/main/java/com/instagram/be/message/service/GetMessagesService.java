package com.instagram.be.message.service;

import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.message.ConversationParticipant;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.repository.MessageRepository;
import com.instagram.be.message.request.GetMessagesRequest;
import com.instagram.be.message.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetMessagesService extends BaseService<GetMessagesRequest, PaginatedResponse<MessageResponse>> {

    private final MessageRepository messageRepository;
    private final ConversationParticipantRepository participantRepository;

    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<MessageResponse> execute(GetMessagesRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<MessageResponse> doProcess(GetMessagesRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UUID convId = request.getConversationId();

        ConversationParticipant participant = participantRepository.findByConversationIdAndUserId(convId, userId)
                .orElseThrow(() -> new BusinessException("You are not a participant in this conversation"));

        var page = messageRepository.findByConversationId(convId,
                participant.getLastDeletedAt(),
                PageRequest.of(request.getPage(), request.getSize()));

        return PaginatedResponse.from(page.map(MessageResponse::from));
    }
}
