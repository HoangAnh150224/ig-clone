package com.instagram.be.story.repository;

import com.instagram.be.story.Story;
import com.instagram.be.story.StoryReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StoryReplyRepository extends JpaRepository<StoryReply, UUID> {
  void deleteAllByStory(Story story);

  @Query("SELECT r FROM StoryReply r JOIN FETCH r.user WHERE r.story.id = :storyId ORDER BY r.createdAt ASC")
  List<StoryReply> findRepliesByStoryId(@Param("storyId") UUID storyId);
}
