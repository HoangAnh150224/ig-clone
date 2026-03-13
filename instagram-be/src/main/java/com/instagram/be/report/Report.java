package com.instagram.be.report;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "report")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Report extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "reporter_id", nullable = false)
  private UserProfile reporter;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @Column(name = "reason")
  private String reason;
}
