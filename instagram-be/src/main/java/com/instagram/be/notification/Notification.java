package com.instagram.be.notification;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.comment.Comment;
import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "notification")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Notification extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "recipient_id", nullable = false)
  private UserProfile recipient;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "actor_id", nullable = false)
  private UserProfile actor;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private NotificationType type;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id")
  private Post post;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "comment_id")
  private Comment comment;

  @Column(name = "is_read", nullable = false)
  private boolean read = false;
}
