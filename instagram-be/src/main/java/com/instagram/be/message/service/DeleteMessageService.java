package com.instagram.be.message.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.message.Message;
import com.instagram.be.message.repository.MessageRepository;
import com.instagram.be.message.request.MessageActionRequest;
import com.instagram.be.message.response.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteMessageService extends BaseService<MessageActionRequest, Void> {

  private final MessageRepository messageRepository;
  private final SimpMessagingTemplate messagingTemplate;

  @Override
  @Transactional
  public Void execute(MessageActionRequest request) {
    return super.execute(request);
  }

  @Override
  protected Void doProcess(MessageActionRequest request) {
    UUID userId = request.getUserContext().getUserId();
    Message message = messageRepository.findById(request.getMessageId())
      .orElseThrow(() -> new NotFoundException("Message", request.getMessageId()));

    if (!message.getSender().getId().equals(userId)) {
      throw new BusinessException("You do not have permission to delete this message");
    }

    message.setDeleted(true);
    Message saved = messageRepository.save(message);

    // Push delete event via WebSocket
    MessageResponse response = MessageResponse.from(saved);
    messagingTemplate.convertAndSend("/topic/messages/" + message.getConversation().getId(), response);

    return null;
  }
}
