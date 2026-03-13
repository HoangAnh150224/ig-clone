package com.instagram.be.hashtag;

import com.instagram.be.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "hashtag")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Hashtag extends BaseEntity {

  @Column(name = "name", nullable = false, unique = true, length = 100)
  private String name;
}
