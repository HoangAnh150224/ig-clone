package com.instagram.be.message.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.message.*;
import com.instagram.be.message.request.SendMessageRequest;
import com.instagram.be.message.response.MessageResponse;
import com.instagram.be.post.enums.MediaType;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SendMessageService extends BaseService<SendMessageRequest, MessageResponse> {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final FollowRepository followRepository;
    private final UserProfileRepository userProfileRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final AutoAcceptConversationService autoAcceptConversationService;

    @Override
    @Transactional
    public MessageResponse execute(SendMessageRequest request) {
        return super.execute(request);
    }

    @Override
    protected MessageResponse doProcess(SendMessageRequest request) {
        if ((request.getContent() == null || request.getContent().isBlank())
                && request.getMediaUrl() == null) {
            throw new AppValidationException("Message must have content or media");
        }

        UUID senderId = request.getUserContext().getUserId();
        UUID recipientId = request.getRecipientId();

        UserProfile sender = userProfileRepository.findById(senderId)
                .orElseThrow(() -> new IllegalStateException("Sender not found"));
        UserProfile recipient = userProfileRepository.findById(recipientId)
                .orElseThrow(() -> new IllegalStateException("Recipient not found"));

        // Find or create conversation
        Conversation conversation = conversationRepository
                .findDirectConversation(senderId, recipientId)
                .orElseGet(() -> {
                    Conversation conv = conversationRepository.save(Conversation.builder().build());

                    // Auto-accept if sender follows recipient
                    boolean senderFollowsRecipient = followRepository
                            .findByFollowerIdAndFollowingId(senderId, recipientId)
                            .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
                            .orElse(false);

                    participantRepository.save(ConversationParticipant.builder()
                            .conversation(conv).user(sender).accepted(true).build());
                    participantRepository.save(ConversationParticipant.builder()
                            .conversation(conv).user(recipient).accepted(senderFollowsRecipient).build());

                    return conv;
                });

        // Trigger 1: if sender is replying to a message request, auto-accept their participant row
        // (recipientId is the original sender; senderId is the one who had accepted=false)
        autoAcceptConversationService.accept(recipientId, senderId);

        MediaType mediaType = request.getMediaType() != null
                ? MediaType.valueOf(request.getMediaType().toUpperCase()) : null;

        Message message = messageRepository.save(Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(request.getContent())
                .mediaUrl(request.getMediaUrl())
                .mediaType(mediaType)
                .build());

        MessageResponse response = MessageResponse.from(message);

        // WebSocket push to conversation topic
        messagingTemplate.convertAndSend("/topic/messages/" + conversation.getId(), response);

        // WebSocket push to recipient's private queue for notifications/updates
        messagingTemplate.convertAndSendToUser(
                recipientId.toString(),
                "/queue/messages",
                response
        );

        return response;
    }
}
