package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.AppValidationException;
import com.instagram.be.story.Story;
import com.instagram.be.story.StoryRepository;
import com.instagram.be.story.request.CreateStoryRequest;
import com.instagram.be.story.response.StoryResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateStoryService extends BaseService<CreateStoryRequest, StoryResponse> {

    private final StoryRepository storyRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public StoryResponse execute(CreateStoryRequest request) {
        return super.execute(request);
    }

    @Override
    protected StoryResponse doProcess(CreateStoryRequest request) {
        if (request.getMediaUrl() == null || request.getMediaUrl().isBlank()) {
            throw new AppValidationException("Media URL is required for story");
        }

        UUID userId = request.getUserContext().getUserId();
        UserProfile user = userProfileRepository.getReferenceById(userId);

        Story story = Story.builder()
                .user(user)
                .mediaUrl(request.getMediaUrl())
                .mediaType(request.getMediaType())
                .closeFriends(request.isCloseFriends())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .archived(false)
                .build();

        Story saved = storyRepository.save(story);
        return StoryResponse.from(saved);
    }
}
