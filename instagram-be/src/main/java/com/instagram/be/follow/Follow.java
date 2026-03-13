package com.instagram.be.follow;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "follow")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Follow extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "follower_id", nullable = false)
  private UserProfile follower;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "following_id", nullable = false)
  private UserProfile following;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private FollowStatus status = FollowStatus.ACCEPTED;
}
