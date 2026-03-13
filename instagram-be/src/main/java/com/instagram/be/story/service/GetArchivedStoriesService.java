package com.instagram.be.story.service;

import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.story.repository.StoryRepository;
import com.instagram.be.story.response.StoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetArchivedStoriesService extends BaseService<UserOnlyRequest, List<StoryResponse>> {

    private final StoryRepository storyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StoryResponse> execute(UserOnlyRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<StoryResponse> doProcess(UserOnlyRequest request) {
        UUID viewerId = request.getUserContext().getUserId();
        return storyRepository.findArchivedByUserId(viewerId).stream()
                .map(StoryResponse::from)
                .toList();
    }
}
