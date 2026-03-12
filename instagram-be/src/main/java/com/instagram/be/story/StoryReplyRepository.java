package com.instagram.be.story;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface StoryReplyRepository extends JpaRepository<StoryReply, UUID> {
}
