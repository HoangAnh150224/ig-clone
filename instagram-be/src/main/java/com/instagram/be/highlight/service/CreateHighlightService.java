package com.instagram.be.highlight.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.highlight.Highlight;
import com.instagram.be.highlight.repository.HighlightRepository;
import com.instagram.be.highlight.request.CreateHighlightRequest;
import com.instagram.be.highlight.response.HighlightResponse;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateHighlightService extends BaseService<CreateHighlightRequest, HighlightResponse> {

  private final HighlightRepository highlightRepository;
  private final StoryRepository storyRepository;
  private final UserProfileRepository userProfileRepository;

  @Override
  @Transactional
  public HighlightResponse execute(CreateHighlightRequest request) {
    return super.execute(request);
  }

  @Override
  protected HighlightResponse doProcess(CreateHighlightRequest request) {
    if (request.getTitle() == null || request.getTitle().isBlank()) {
      throw new AppValidationException("Title is required");
    }

    UUID userId = request.getUserContext().getUserId();
    UserProfile user = userProfileRepository.getReferenceById(userId);

    Set<Story> stories = new HashSet<>();
    List<UUID> storyIds = request.getStoryIds();
    if (storyIds != null && !storyIds.isEmpty()) {
      for (UUID storyId : storyIds) {
        Story story = storyRepository.findById(storyId)
          .orElseThrow(() -> new AppValidationException("Story not found: " + storyId));
        if (!story.getUser().getId().equals(userId)) {
          throw new BusinessException("You can only add your own stories to highlights");
        }
        stories.add(story);
      }
    }

    Highlight highlight = Highlight.builder()
      .user(user)
      .title(request.getTitle())
      .coverUrl(request.getCoverUrl())
      .stories(stories)
      .build();

    return HighlightResponse.from(highlightRepository.save(highlight));
  }
}
