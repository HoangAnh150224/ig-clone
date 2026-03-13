package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.story.request.GetFeedStoriesRequest;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.story.Story;
import com.instagram.be.story.StoryRepository;
import com.instagram.be.story.StoryViewRepository;
import com.instagram.be.story.response.StoryFeedResponse;
import com.instagram.be.story.response.StoryItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetFeedStoriesService extends BaseService<GetFeedStoriesRequest, List<StoryFeedResponse>> {

    private final StoryRepository storyRepository;
    private final StoryViewRepository storyViewRepository;
    private final FollowRepository followRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StoryFeedResponse> execute(GetFeedStoriesRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<StoryFeedResponse> doProcess(GetFeedStoriesRequest request) {
        UUID viewerId = request.getUserContext().getUserId();

        // Get ACCEPTED follow targets + self
        var followingPage = followRepository.findFollowingByUserId(viewerId, FollowStatus.ACCEPTED,
                PageRequest.of(0, 1000));
        List<UUID> userIds = followingPage.getContent().stream()
                .map(f -> f.getFollowing().getId())
                .collect(Collectors.toList());
        userIds.add(viewerId);

        List<Story> stories = storyRepository.findActiveStoriesByUserIds(userIds, LocalDateTime.now());

        if (stories.isEmpty()) return List.of();

        // Batch-load viewed story IDs
        Set<UUID> allStoryIds = stories.stream().map(Story::getId).collect(Collectors.toSet());
        Set<UUID> viewedIds = storyViewRepository.findViewedStoryIds(viewerId, allStoryIds);

        // Group by user (preserving order: self first, then followed)
        Map<UUID, List<Story>> byUser = new LinkedHashMap<>();
        userIds.forEach(uid -> byUser.put(uid, new ArrayList<>()));
        stories.forEach(s -> byUser.computeIfAbsent(s.getUser().getId(), k -> new ArrayList<>()).add(s));

        return byUser.entrySet().stream()
                .filter(e -> !e.getValue().isEmpty())
                .map(e -> {
                    UUID ownerId = e.getKey();
                    List<Story> userStories = e.getValue();
                    var user = userStories.get(0).getUser();
                    boolean hasUnseen = userStories.stream().anyMatch(s -> !viewedIds.contains(s.getId()));
                    
                    List<StoryItemResponse> items = userStories.stream()
                            .map(s -> {
                                boolean seen = viewedIds.contains(s.getId());
                                if (ownerId.equals(viewerId)) {
                                    // Owner story: load preview viewers
                                    List<com.instagram.be.story.StoryView> views = storyViewRepository.findViewersByStoryId(s.getId());
                                    var previewViews = views.stream().limit(2)
                                            .map(com.instagram.be.story.response.StoryViewResponse::from)
                                            .collect(Collectors.toList());
                                    return StoryItemResponse.fromWithOwnerData(s, seen, views.size(), previewViews);
                                }
                                return StoryItemResponse.from(s, seen);
                            })
                            .collect(Collectors.toList());
                    return new StoryFeedResponse(user.getId(), user.getUsername(), user.getAvatarUrl(), hasUnseen, items);
                })
                .collect(Collectors.toList());
    }
}
