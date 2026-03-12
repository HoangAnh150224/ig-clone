package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.story.Story;
import com.instagram.be.story.StoryReply;
import com.instagram.be.story.StoryReplyRepository;
import com.instagram.be.story.StoryRepository;
import com.instagram.be.story.request.ReplyToStoryRequest;
import com.instagram.be.story.response.StoryReplyResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReplyToStoryService extends BaseService<ReplyToStoryRequest, StoryReplyResponse> {

    private final StoryRepository storyRepository;
    private final StoryReplyRepository storyReplyRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public StoryReplyResponse execute(ReplyToStoryRequest request) {
        return super.execute(request);
    }

    @Override
    protected StoryReplyResponse doProcess(ReplyToStoryRequest request) {
        if (request.getText() == null || request.getText().isBlank()) {
            throw new AppValidationException("Reply text cannot be empty");
        }

        UUID viewerId = request.getUserContext().getUserId();
        Story story = storyRepository.findById(request.getStoryId())
                .orElseThrow(() -> new NotFoundException("Story", request.getStoryId()));

        UserProfile user = userProfileRepository.getReferenceById(viewerId);
        StoryReply reply = StoryReply.builder()
                .story(story)
                .user(user)
                .text(request.getText())
                .build();

        return StoryReplyResponse.from(storyReplyRepository.save(reply));
    }
}
