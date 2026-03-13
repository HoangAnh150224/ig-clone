package com.instagram.be.block;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "block")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Block extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "blocker_id", nullable = false)
  private UserProfile blocker;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "blocked_id", nullable = false)
  private UserProfile blocked;
}
