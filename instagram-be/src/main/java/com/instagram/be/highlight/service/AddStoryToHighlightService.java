package com.instagram.be.highlight.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.highlight.Highlight;
import com.instagram.be.highlight.HighlightRepository;
import com.instagram.be.highlight.request.HighlightStoryRequest;
import com.instagram.be.highlight.response.HighlightResponse;
import com.instagram.be.story.Story;
import com.instagram.be.story.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddStoryToHighlightService extends BaseService<HighlightStoryRequest, HighlightResponse> {

    private final HighlightRepository highlightRepository;
    private final StoryRepository storyRepository;

    @Override
    @Transactional
    public HighlightResponse execute(HighlightStoryRequest request) {
        return super.execute(request);
    }

    @Override
    protected HighlightResponse doProcess(HighlightStoryRequest request) {
        UUID userId = request.getUserContext().getUserId();

        Highlight highlight = highlightRepository.findById(request.getHighlightId())
                .orElseThrow(() -> new NotFoundException("Highlight", request.getHighlightId()));

        if (!highlight.getUser().getId().equals(userId)) {
            throw new BusinessException("You do not have permission to modify this highlight");
        }

        Story story = storyRepository.findById(request.getStoryId())
                .orElseThrow(() -> new NotFoundException("Story", request.getStoryId()));

        if (!story.getUser().getId().equals(userId)) {
            throw new BusinessException("You can only add your own stories to highlights");
        }

        highlight.getStories().add(story);
        return HighlightResponse.from(highlightRepository.save(highlight));
    }
}
