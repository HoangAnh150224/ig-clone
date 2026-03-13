package com.instagram.be.post;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.post.enums.PostType;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "post")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Post extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private UserProfile user;

  @Column(name = "caption", columnDefinition = "TEXT")
  private String caption;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private PostType type = PostType.POST;

  @Column(name = "music")
  private String music;

  @Column(name = "location_name")
  private String locationName;

  @Column(name = "is_archived", nullable = false)
  private boolean archived = false;

  @Column(name = "comments_disabled", nullable = false)
  private boolean commentsDisabled = false;

  @Column(name = "hide_like_count", nullable = false)
  private boolean hideLikeCount = false;

  @Column(name = "share_count", nullable = false)
  private int shareCount = 0;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
    name = "post_hashtag",
    joinColumns = @JoinColumn(name = "post_id"),
    inverseJoinColumns = @JoinColumn(name = "hashtag_id")
  )
  private Set<Hashtag> hashtags = new HashSet<>();
}
