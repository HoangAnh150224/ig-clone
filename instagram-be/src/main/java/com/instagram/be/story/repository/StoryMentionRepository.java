package com.instagram.be.story.repository;

import com.instagram.be.story.Story;
import com.instagram.be.story.StoryMention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StoryMentionRepository extends JpaRepository<StoryMention, UUID> {
    void deleteAllByStory(Story story);
}
