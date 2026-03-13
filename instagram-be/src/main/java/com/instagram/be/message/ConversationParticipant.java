package com.instagram.be.message;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversation_participant")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE conversation_participant SET is_deleted = true WHERE id = ?")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class ConversationParticipant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfile user;

    @Column(name = "is_accepted", nullable = false)
    private boolean accepted = true;

    @Column(name = "last_read_at")
    private LocalDateTime lastReadAt;

    @Column(name = "last_deleted_at")
    private LocalDateTime lastDeletedAt;
}
