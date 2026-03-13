package com.instagram.be.highlight.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.highlight.Highlight;
import com.instagram.be.highlight.HighlightRepository;
import com.instagram.be.highlight.request.HighlightActionRequest;
import com.instagram.be.story.response.StoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetHighlightStoriesService extends BaseService<HighlightActionRequest, List<StoryResponse>> {

    private final HighlightRepository highlightRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StoryResponse> execute(HighlightActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<StoryResponse> doProcess(HighlightActionRequest request) {
        Highlight highlight = highlightRepository.findByIdWithStories(request.getHighlightId())
                .orElseThrow(() -> new NotFoundException("Highlight", request.getHighlightId()));

        return highlight.getStories().stream()
                .map(StoryResponse::from)
                .toList();
    }
}
