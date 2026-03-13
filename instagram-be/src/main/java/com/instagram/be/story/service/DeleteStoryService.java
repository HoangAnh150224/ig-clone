package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryMentionRepository;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.repository.StoryReplyRepository;
import com.instagram.be.story.repository.StoryViewRepository;
import com.instagram.be.story.request.StoryActionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteStoryService extends BaseService<StoryActionRequest, Void> {

    private final StoryRepository storyRepository;
    private final StoryViewRepository storyViewRepository;
    private final StoryReplyRepository storyReplyRepository;
    private final StoryMentionRepository storyMentionRepository;

    @Override
    @Transactional
    public Void execute(StoryActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(StoryActionRequest request) {
        UUID userId = request.getUserContext().getUserId();
        Story story = storyRepository.findById(request.getStoryId())
                .orElseThrow(() -> new NotFoundException("Story", request.getStoryId()));

        if (!story.getUser().getId().equals(userId)) {
            throw new BusinessException("You do not have permission to delete this story");
        }

        storyViewRepository.deleteAllByStory(story);
        storyReplyRepository.deleteAllByStory(story);
        storyMentionRepository.deleteAllByStory(story);
        storyRepository.delete(story);
        return null;
    }
}
