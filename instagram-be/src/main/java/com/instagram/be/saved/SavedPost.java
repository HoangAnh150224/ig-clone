package com.instagram.be.saved;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "saved_post")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class SavedPost extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserProfile user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;
}
