package com.instagram.be.message;

import com.instagram.be.base.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "conversation")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Conversation extends BaseEntity {
}
