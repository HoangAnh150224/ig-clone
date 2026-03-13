package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.request.StoryActionRequest;
import com.instagram.be.story.response.StoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArchiveStoryService extends BaseService<StoryActionRequest, StoryResponse> {

  private final StoryRepository storyRepository;

  @Override
  @Transactional
  public StoryResponse execute(StoryActionRequest request) {
    return super.execute(request);
  }

  @Override
  protected StoryResponse doProcess(StoryActionRequest request) {
    UUID userId = request.getUserContext().getUserId();
    Story story = storyRepository.findById(request.getStoryId())
      .orElseThrow(() -> new NotFoundException("Story", request.getStoryId()));

    if (!story.getUser().getId().equals(userId)) {
      throw new BusinessException("You do not have permission to archive this story");
    }

    story.setArchived(!story.isArchived());
    Story saved = storyRepository.save(story);
    return StoryResponse.from(saved);
  }
}
