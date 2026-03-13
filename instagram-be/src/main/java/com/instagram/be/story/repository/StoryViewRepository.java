package com.instagram.be.story.repository;

import com.instagram.be.story.Story;
import com.instagram.be.story.StoryView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface StoryViewRepository extends JpaRepository<StoryView, UUID> {

    Optional<StoryView> findByStoryIdAndViewerId(UUID storyId, UUID viewerId);

    @Query("SELECT sv.story.id FROM StoryView sv WHERE sv.viewer.id = :viewerId AND sv.story.id IN :storyIds")
    Set<UUID> findViewedStoryIds(@Param("viewerId") UUID viewerId, @Param("storyIds") Set<UUID> storyIds);

    @Query("SELECT sv FROM StoryView sv JOIN FETCH sv.viewer WHERE sv.story.id = :storyId ORDER BY sv.createdAt DESC")
    List<StoryView> findViewersByStoryId(@Param("storyId") UUID storyId);

    @Query("SELECT sv FROM StoryView sv JOIN FETCH sv.viewer WHERE sv.story.id IN :storyIds ORDER BY sv.story.id, sv.createdAt DESC")
    List<StoryView> findViewersByStoryIds(@Param("storyIds") Set<UUID> storyIds);

    void deleteAllByStory(Story story);
}
