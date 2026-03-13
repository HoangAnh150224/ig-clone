package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.story.Story;
import com.instagram.be.story.StoryReply;
import com.instagram.be.story.repository.StoryReplyRepository;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.request.StoryActionRequest;
import com.instagram.be.story.response.StoryReplyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetStoryRepliesService extends BaseService<StoryActionRequest, List<StoryReplyResponse>> {

  private final StoryRepository storyRepository;
  private final StoryReplyRepository storyReplyRepository;

  @Override
  @Transactional(readOnly = true)
  public List<StoryReplyResponse> execute(StoryActionRequest request) {
    return super.execute(request);
  }

  @Override
  protected List<StoryReplyResponse> doProcess(StoryActionRequest request) {
    UUID viewerId = request.getUserContext().getUserId();
    Story story = storyRepository.findById(request.getStoryId())
      .orElseThrow(() -> new NotFoundException("Story", request.getStoryId()));

    // Restriction: Only story owner can fetch replies
    if (!story.getUser().getId().equals(viewerId)) {
      throw new BusinessException("You do not have permission to view replies for this story");
    }

    List<StoryReply> replies = storyReplyRepository.findRepliesByStoryId(request.getStoryId());

    return replies.stream()
      .map(StoryReplyResponse::from)
      .collect(Collectors.toList());
  }
}
