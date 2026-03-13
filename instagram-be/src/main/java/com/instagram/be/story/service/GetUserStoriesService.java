package com.instagram.be.story.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.exception.BusinessException;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.follow.enums.FollowStatus;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.story.StoryRepository;
import com.instagram.be.story.StoryViewRepository;
import com.instagram.be.story.request.GetUserStoriesRequest;
import com.instagram.be.story.response.StoryItemResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetUserStoriesService extends BaseService<GetUserStoriesRequest, List<StoryItemResponse>> {

    private final UserProfileRepository userProfileRepository;
    private final StoryRepository storyRepository;
    private final StoryViewRepository storyViewRepository;
    private final FollowRepository followRepository;
    private final BlockRepository blockRepository;

    @Override
    @Transactional(readOnly = true)
    public List<StoryItemResponse> execute(GetUserStoriesRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<StoryItemResponse> doProcess(GetUserStoriesRequest request) {
        UUID viewerId = request.getUserContext().getUserId();

        UserProfile target = userProfileRepository.findByUsername(request.getTargetUsername())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.getTargetUsername()));

        if (!target.isActive()) {
            throw new NotFoundException("User not found: " + request.getTargetUsername());
        }

        UUID targetId = target.getId();

        if (!targetId.equals(viewerId) && blockRepository.existsBlockBetween(viewerId, targetId)) {
            throw new NotFoundException("User not found: " + request.getTargetUsername());
        }

        boolean isOwner = targetId.equals(viewerId);
        boolean isFollowing = followRepository.findByFollowerIdAndFollowingId(viewerId, targetId)
                .map(f -> f.getStatus() == FollowStatus.ACCEPTED)
                .orElse(false);

        if (!isOwner && target.isPrivateAccount() && !isFollowing) {
            throw new BusinessException("This account is private");
        }

        var stories = storyRepository.findActiveStoriesByUserId(targetId, LocalDateTime.now());

        if (stories.isEmpty()) return List.of();

        Set<UUID> allIds = stories.stream().map(s -> s.getId()).collect(Collectors.toSet());
        Set<UUID> viewedIds = storyViewRepository.findViewedStoryIds(viewerId, allIds);

        return stories.stream()
                .map(s -> {
                    boolean seen = viewedIds.contains(s.getId());
                    if (isOwner) {
                        var views = storyViewRepository.findViewersByStoryId(s.getId());
                        var previewViews = views.stream().limit(2)
                                .map(com.instagram.be.story.response.StoryViewResponse::from)
                                .collect(Collectors.toList());
                        return StoryItemResponse.fromWithOwnerData(s, seen, views.size(), previewViews);
                    }
                    return StoryItemResponse.from(s, seen);
                })
                .collect(Collectors.toList());
    }
}
