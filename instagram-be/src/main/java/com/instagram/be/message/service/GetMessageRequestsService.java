package com.instagram.be.message.service;

import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.message.ConversationAssembler;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.response.ConversationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetMessageRequestsService extends BaseService<UserOnlyRequest, List<ConversationResponse>> {

    private final ConversationParticipantRepository participantRepository;
    private final ConversationAssembler assembler;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> execute(UserOnlyRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<ConversationResponse> doProcess(UserOnlyRequest request) {
        UUID userId = request.getUserContext().getUserId();
        return participantRepository.findRequestsByUserId(userId).stream()
                .map(cp -> assembler.assemble(cp, userId))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
