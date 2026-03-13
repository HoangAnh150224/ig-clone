package com.instagram.be.message;

import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.message.repository.ConversationParticipantRepository;
import com.instagram.be.message.repository.MessageRepository;
import com.instagram.be.message.response.ConversationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ConversationAssembler {

  private final MessageRepository messageRepository;
  private final ConversationParticipantRepository participantRepository;
  private final StringRedisTemplate redisTemplate;

  /**
   * Batch assembly — resolves all other participants and Redis online status
   * in bulk before assembling, reducing queries from 3N to N+2.
   */
  public List<ConversationResponse> assembleAll(List<ConversationParticipant> myParticipants, UUID myUserId) {
    if (myParticipants.isEmpty()) return Collections.emptyList();

    Set<UUID> convIds = myParticipants.stream()
      .map(cp -> cp.getConversation().getId())
      .collect(Collectors.toSet());

    // Batch: 1 query for all other participants
    Map<UUID, ConversationParticipant> otherByConvId = participantRepository
      .findOtherParticipants(convIds, myUserId).stream()
      .collect(Collectors.toMap(cp -> cp.getConversation().getId(), cp -> cp));

    // Filter active others for Redis check
    List<ConversationParticipant> activeOthers = otherByConvId.values().stream()
      .filter(cp -> cp.getUser().isActive())
      .collect(Collectors.toList());

    // Batch: 1 Redis pipeline for all online checks
    Set<UUID> onlineUserIds = batchCheckOnline(activeOthers);

    return myParticipants.stream()
      .map(cp -> {
        ConversationParticipant other = otherByConvId.get(cp.getConversation().getId());
        if (other == null || !other.getUser().isActive()) return null;
        return assembleWithOther(cp, other, myUserId, onlineUserIds);
      })
      .filter(Objects::nonNull)
      .collect(Collectors.toList());
  }

  /**
   * Single-conversation assembly (used for create/accept flows).
   */
  public ConversationResponse assemble(ConversationParticipant myParticipant, UUID myUserId) {
    UUID convId = myParticipant.getConversation().getId();

    var otherOpt = participantRepository.findOtherParticipant(convId, myUserId);
    if (otherOpt.isEmpty()) return null;

    ConversationParticipant other = otherOpt.get();
    if (!other.getUser().isActive()) return null;

    boolean isOnline = other.getUser().isShowActivityStatus()
      && Boolean.TRUE.equals(redisTemplate.hasKey("online:" + other.getUser().getId()));

    return assembleWithOther(myParticipant, other, myUserId, isOnline ? Set.of(other.getUser().getId()) : Set.of());
  }

  private ConversationResponse assembleWithOther(ConversationParticipant myParticipant,
                                                 ConversationParticipant other,
                                                 UUID myUserId,
                                                 Set<UUID> onlineUserIds) {
    UUID convId = myParticipant.getConversation().getId();
    var otherUser = other.getUser();

    boolean isOnline = otherUser.isShowActivityStatus() && onlineUserIds.contains(otherUser.getId());

    var latestList = messageRepository.findLatestByConversationId(
      convId, myParticipant.getLastDeletedAt(), PageRequest.of(0, 1));
    if (latestList.isEmpty() && myParticipant.getLastDeletedAt() != null) {
      return null;
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

    LocalDateTime unreadSince = myParticipant.getLastReadAt() != null
      ? myParticipant.getLastReadAt()
      : myParticipant.getCreatedAt();
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

  private Set<UUID> batchCheckOnline(List<ConversationParticipant> others) {
    List<ConversationParticipant> showStatus = others.stream()
      .filter(cp -> cp.getUser().isShowActivityStatus())
      .collect(Collectors.toList());

    if (showStatus.isEmpty()) return Collections.emptySet();

    List<byte[]> keys = showStatus.stream()
      .map(cp -> ("online:" + cp.getUser().getId()).getBytes())
      .collect(Collectors.toList());

    // Pipeline all EXISTS checks in a single Redis round-trip
    List<Object> results = redisTemplate.executePipelined((RedisCallback<Object>) conn -> {
      for (byte[] key : keys) {
        conn.keyCommands().exists(key);
      }
      return null;
    });

    Set<UUID> onlineIds = new HashSet<>();
    for (int i = 0; i < showStatus.size(); i++) {
      if (Boolean.TRUE.equals(results.get(i))) {
        onlineIds.add(showStatus.get(i).getUser().getId());
      }
    }
    return onlineIds;
  }
}
