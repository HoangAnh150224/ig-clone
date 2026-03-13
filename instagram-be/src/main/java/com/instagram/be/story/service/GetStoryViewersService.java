package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.StoryView;
import com.instagram.be.story.repository.StoryViewRepository;
import com.instagram.be.story.request.StoryActionRequest;
import com.instagram.be.story.response.StoryViewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetStoryViewersService extends BaseService<StoryActionRequest, List<StoryViewResponse>> {

    private final StoryRepository storyRepository;
    private final StoryViewRepository storyViewRepository;
    private final FollowRepository followRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StoryViewResponse> execute(StoryActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<StoryViewResponse> doProcess(StoryActionRequest request) {
        UUID userId = request.getUserContext().getUserId();
        Story story = storyRepository.findById(request.getStoryId())
                .orElseThrow(() -> new NotFoundException("Story", request.getStoryId()));

        if (!story.getUser().getId().equals(userId)) {
            throw new BusinessException("Only the owner can see the viewer list");
        }

        List<StoryView> views = storyViewRepository.findViewersByStoryId(request.getStoryId());

        return views.stream()
                .map(view -> {
                    boolean isFollowing = followRepository.existsByFollowerIdAndFollowingId(userId, view.getViewer().getId());
                    return StoryViewResponse.of(view, isFollowing);
                })
                .collect(Collectors.toList());
    }
}
