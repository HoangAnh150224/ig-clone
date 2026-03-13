package com.instagram.be.post;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.post.enums.MediaType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "post_media")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class PostMedia extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id", nullable = false)
  private Post post;

  @Column(name = "url", nullable = false, length = 500)
  private String url;

  @Enumerated(EnumType.STRING)
  @Column(name = "media_type", nullable = false)
  private MediaType mediaType;

  @Column(name = "display_order", nullable = false)
  private int displayOrder = 0;
}
