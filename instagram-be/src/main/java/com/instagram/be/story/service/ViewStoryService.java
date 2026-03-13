package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.story.Story;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.StoryView;
import com.instagram.be.story.repository.StoryViewRepository;
import com.instagram.be.story.request.StoryActionRequest;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ViewStoryService extends BaseService<StoryActionRequest, Void> {

    private final StoryRepository storyRepository;
    private final StoryViewRepository storyViewRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public Void execute(StoryActionRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(StoryActionRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        UUID storyId = request.getStoryId();

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new NotFoundException("Story", storyId));

        storyViewRepository.findByStoryIdAndViewerId(storyId, viewerId).orElseGet(() -> {
            UserProfile viewer = userProfileRepository.getReferenceById(viewerId);
            return storyViewRepository.save(StoryView.builder().story(story).viewer(viewer).build());
        });

        return null;
    }
}
