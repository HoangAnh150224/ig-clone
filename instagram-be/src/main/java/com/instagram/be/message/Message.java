package com.instagram.be.message;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.post.Post;
import com.instagram.be.post.enums.MediaType;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "message")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Message extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "conversation_id", nullable = false)
  private Conversation conversation;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sender_id", nullable = false)
  private UserProfile sender;

  @Column(name = "content", columnDefinition = "TEXT")
  private String content;

  @Column(name = "media_url", length = 500)
  private String mediaUrl;

  @Enumerated(EnumType.STRING)
  @Column(name = "media_type")
  private MediaType mediaType;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "shared_post_id")
  private Post sharedPost;

  @Column(name = "is_deleted", nullable = false)
  private boolean deleted = false;
}
