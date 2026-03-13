package com.instagram.be.message.service;

import com.instagram.be.base.UserContext;
import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.message.Conversation;
import com.instagram.be.message.Message;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.repository.ConversationRepository;
import com.instagram.be.message.repository.MessageRepository;
import com.instagram.be.message.request.SendMessageRequest;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SendMessageServiceTest {

    @Mock
    private ConversationRepository conversationRepository;
    @Mock
    private ConversationParticipantRepository participantRepository;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private FollowRepository followRepository;
    @Mock
    private BlockRepository blockRepository;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private PostRepository postRepository;
    @Mock
    private SimpMessagingTemplate messagingTemplate;
    @Mock
    private AutoAcceptConversationService autoAcceptConversationService;

    @InjectMocks
    private SendMessageService sendMessageService;

    private UserProfile sender, recipient;
    private UserContext userContext;
    private UUID senderId, recipientId;

    @BeforeEach
    void setUp() {
        senderId = UUID.randomUUID();
        recipientId = UUID.randomUUID();

        sender = UserProfile.builder().id(senderId).username("sender").active(true).build();
        recipient = UserProfile.builder().id(recipientId).username("recipient").active(true).build();

        userContext = UserContext.builder().userId(senderId).build();
    }

    @Test
    void execute_whenNewConversation_shouldCreateConversation() {
        // Given
        SendMessageRequest request = SendMessageRequest.builder()
                .userContext(userContext)
                .recipientId(recipientId)
                .content("Hello!")
                .build();

        List<UUID> participantIds = List.of(senderId, recipientId);
        Conversation newConversation = Conversation.builder().id(UUID.randomUUID()).build();
        Message newMessage = Message.builder().conversation(newConversation).sender(sender).content("Hello!").build();

        // Mock repository calls
        when(userProfileRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(userProfileRepository.findById(recipientId)).thenReturn(Optional.of(recipient));
        when(blockRepository.existsBlockBetween(senderId, recipientId)).thenReturn(false);
        when(conversationRepository.findConversationByExactParticipants(participantIds, 2L)).thenReturn(Optional.empty());
        when(conversationRepository.save(any(Conversation.class))).thenReturn(newConversation);
        when(messageRepository.save(any(Message.class))).thenReturn(newMessage);

        // When
        sendMessageService.execute(request);

        // Then
        verify(conversationRepository, times(1)).findConversationByExactParticipants(participantIds, 2L);
        verify(conversationRepository, times(1)).save(any(Conversation.class));
        verify(participantRepository, times(2)).save(any());
        verify(messageRepository, times(1)).save(any(Message.class));
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/messages/" + newConversation.getId()), any(com.instagram.be.message.response.MessageResponse.class));
    }

    @Test
    void execute_whenConversationExists_shouldUseExistingConversation() {
        // Given
        SendMessageRequest request = SendMessageRequest.builder()
                .userContext(userContext)
                .recipientId(recipientId)
                .content("Hello again!")
                .build();

        List<UUID> participantIds = List.of(senderId, recipientId);
        Conversation existingConversation = Conversation.builder().id(UUID.randomUUID()).build();
        Message newMessage = Message.builder().conversation(existingConversation).sender(sender).content("Hello again!").build();

        // Mock repository calls
        when(userProfileRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(userProfileRepository.findById(recipientId)).thenReturn(Optional.of(recipient));
        when(blockRepository.existsBlockBetween(senderId, recipientId)).thenReturn(false);
        when(conversationRepository.findConversationByExactParticipants(participantIds, 2L)).thenReturn(Optional.of(existingConversation));
        when(messageRepository.save(any(Message.class))).thenReturn(newMessage);

        // When
        com.instagram.be.message.response.MessageResponse response = sendMessageService.execute(request);

        // Then
        verify(conversationRepository, times(1)).findConversationByExactParticipants(participantIds, 2L);
        verify(conversationRepository, never()).save(any(Conversation.class));
        verify(participantRepository, never()).save(any());
        verify(messageRepository, times(1)).save(any(Message.class));
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/messages/" + existingConversation.getId()), any(com.instagram.be.message.response.MessageResponse.class));
        assertEquals(existingConversation.getId().toString(), response.getConversationId());
    }
}
