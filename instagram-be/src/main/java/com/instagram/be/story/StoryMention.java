package com.instagram.be.story;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "story_mention")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE story_mention SET is_deleted = true WHERE id = ?")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class StoryMention extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentioned_user_id", nullable = false)
    private UserProfile mentionedUser;
}
