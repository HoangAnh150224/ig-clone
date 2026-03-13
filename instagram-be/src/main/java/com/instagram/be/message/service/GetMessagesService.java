package com.instagram.be.message.service;

import com.instagram.be.base.response.CursorResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.base.util.CursorUtils;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.message.ConversationParticipant;
import com.instagram.be.message.Message;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.repository.MessageRepository;
import com.instagram.be.message.request.GetMessagesRequest;
import com.instagram.be.message.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetMessagesService extends BaseService<GetMessagesRequest, CursorResponse<MessageResponse>> {

    private final MessageRepository messageRepository;
    private final ConversationParticipantRepository participantRepository;

    @Override
    @Transactional(readOnly = true)
    public CursorResponse<MessageResponse> execute(GetMessagesRequest request) {
        return super.execute(request);
    }

    @Override
    protected CursorResponse<MessageResponse> doProcess(GetMessagesRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UUID convId = request.getConversationId();
        int size = request.getSize() > 0 ? request.getSize() : 20;

        ConversationParticipant participant = participantRepository.findByConversationIdAndUserId(convId, userId)
                .orElseThrow(() -> new BusinessException("You are not a participant in this conversation"));

        PageRequest pageRequest = PageRequest.of(0, size + 1);
        List<Message> messages;

        if (request.getCursor() == null || request.getCursor().isBlank()) {
            messages = messageRepository.findFirstByConversationId(convId, participant.getLastDeletedAt(), pageRequest);
        } else {
            messages = messageRepository.findWithCursorByConversationId(
                    convId,
                    participant.getLastDeletedAt(),
                    CursorUtils.decodeTime(request.getCursor()),
                    CursorUtils.decodeId(request.getCursor()),
                    pageRequest);
        }

        boolean hasMore = messages.size() > size;
        if (hasMore) messages = messages.subList(0, size);

        String nextCursor = null;
        if (hasMore && !messages.isEmpty()) {
            Message last = messages.get(messages.size() - 1);
            nextCursor = CursorUtils.encode(last.getCreatedAt(), last.getId());
        }

        List<MessageResponse> content = messages.stream()
                .map(MessageResponse::from)
                .collect(Collectors.toList());

        return new CursorResponse<>(content, nextCursor, hasMore);
    }
}
