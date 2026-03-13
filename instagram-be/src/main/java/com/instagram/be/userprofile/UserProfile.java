package com.instagram.be.userprofile;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.userprofile.enums.Gender;
import com.instagram.be.userprofile.enums.TagPermission;
import com.instagram.be.userprofile.enums.UserRole;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.elasticsearch.annotations.Document;
import com.instagram.be.userprofile.listener.UserProfileElasticsearchListener;

@Entity
@Table(name = "user_profile")
@EntityListeners(UserProfileElasticsearchListener.class)
@Document(indexName = "users")
@SQLRestriction("is_deleted = false")
@SQLDelete(sql = "UPDATE user_profile SET is_deleted = true WHERE id = ?")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class UserProfile extends BaseEntity {

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role = UserRole.USER;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "website")
    private String website;

    @Column(name = "pronouns", length = 50)
    private String pronouns;

    @Column(name = "profile_category", length = 100)
    private String profileCategory;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "is_verified", nullable = false)
    private boolean verified = false;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "is_private", nullable = false)
    private boolean privateAccount = false;

    @Builder.Default
    @Column(name = "show_activity_status", nullable = false)
    private boolean showActivityStatus = true;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "tag_permission", nullable = false)
    private TagPermission tagPermission = TagPermission.EVERYONE;

    @Column(name = "notifications_paused", nullable = false)
    private boolean notificationsPaused = false;
}
