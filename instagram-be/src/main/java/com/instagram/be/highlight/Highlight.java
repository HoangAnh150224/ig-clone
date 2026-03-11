package com.instagram.be.highlight;

import com.instagram.be.base.BaseEntity;
import com.instagram.be.story.Story;
import com.instagram.be.userprofile.UserProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "highlight")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Highlight extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserProfile user;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "highlight_story",
            joinColumns = @JoinColumn(name = "highlight_id"),
            inverseJoinColumns = @JoinColumn(name = "story_id")
    )
    private Set<Story> stories = new HashSet<>();
}
