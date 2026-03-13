package com.instagram.be.message;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.repository.MessageRepository;
import com.instagram.be.message.response.ConversationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ConversationAssembler {

  private final MessageRepository messageRepository;
  private final ConversationParticipantRepository participantRepository;
  private final StringRedisTemplate redisTemplate;

  public ConversationResponse assemble(ConversationParticipant myParticipant, UUID myUserId) {
    UUID convId = myParticipant.getConversation().getId();

    var otherOpt = participantRepository.findOtherParticipant(convId, myUserId);
    if (otherOpt.isEmpty()) return null;

    ConversationParticipant other = otherOpt.get();
    var otherUser = other.getUser();

    // Hide conversations with deactivated accounts (like Instagram)
    if (!otherUser.isActive()) return null;

    // Online status — only show if user allows it
    boolean isOnline = false;
    if (otherUser.isShowActivityStatus()) {
      isOnline = redisTemplate.hasKey("online:" + otherUser.getId());
    }

    // Last message after lastDeletedAt
    var latestList = messageRepository.findLatestByConversationId(convId, myParticipant.getLastDeletedAt(), PageRequest.of(0, 1));
    if (latestList.isEmpty() && myParticipant.getLastDeletedAt() != null) {
      return null; // Hide conversation if no new messages after delete
    }

    ConversationResponse.LastMessageInfo lastMessage = null;
    if (!latestList.isEmpty()) {
      var msg = latestList.get(0);
      lastMessage = new ConversationResponse.LastMessageInfo(
        msg.isDeleted() ? null : msg.getContent(),
        msg.getMediaType() != null ? msg.getMediaType().name() : null,
        msg.getCreatedAt()
      );
    }

    // Unread count (considering lastDeletedAt)
    LocalDateTime unreadSince = myParticipant.getLastReadAt() != null ? myParticipant.getLastReadAt() : myParticipant.getCreatedAt();
    long unreadCount = messageRepository.countUnread(convId, unreadSince, myParticipant.getLastDeletedAt());

    return new ConversationResponse(
      convId,
      FollowUserResponse.from(otherUser),
      isOnline,
      lastMessage,
      unreadCount,
      myParticipant.isAccepted(),
      other.getLastReadAt()
    );
  }
}
