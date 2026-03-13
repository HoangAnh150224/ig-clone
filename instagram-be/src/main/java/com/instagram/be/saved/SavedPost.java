package com.instagram.be.saved;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "saved_post")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE saved_post SET is_deleted = true WHERE id = ?")
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
