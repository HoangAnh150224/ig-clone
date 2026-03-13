package com.instagram.be.follow.service;

import com.instagram.be.events.FollowEvent;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.block.repository.BlockRepository;
import com.instagram.be.message.service.AutoAcceptConversationService;
import com.instagram.be.userprofile.service.ProfileCountCacheService;
import com.instagram.be.follow.request.FollowRequest;
import com.instagram.be.base.UserContext;
import com.instagram.be.follow.Follow;
import com.instagram.be.follow.enums.FollowStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FollowServiceTest {

    @Mock
    private FollowRepository followRepository;
    @Mock
    private UserProfileRepository userProfileRepository;
    @Mock
    private BlockRepository blockRepository;
    @Mock
    private ApplicationEventPublisher eventPublisher;
    @Mock
    private AutoAcceptConversationService autoAcceptConversationService;
    @Mock
    private ProfileCountCacheService profileCountCacheService;

    @InjectMocks
    private FollowService followService;

    private UserProfile follower;
    private UserProfile target;
    private FollowRequest followRequest;
    private UserContext userContext;

    @BeforeEach
    void setUp() {
        UUID followerId = UUID.randomUUID();
        UUID targetId = UUID.randomUUID();

        userContext = UserContext.builder().userId(followerId).build();

        follower = UserProfile.builder().id(followerId).build();
        target = UserProfile.builder().id(targetId).privateAccount(false).build();

        followRequest = FollowRequest.builder()
                .userContext(userContext)
                .targetUserId(targetId)
                .build();
    }

    @Test
    void whenFollowPublicUser_shouldCreateAcceptedFollowAndPublishEvent() {
        when(userProfileRepository.findById(follower.getId())).thenReturn(Optional.of(follower));
        when(userProfileRepository.findById(target.getId())).thenReturn(Optional.of(target));
        when(blockRepository.existsBlockBetween(follower.getId(), target.getId())).thenReturn(false);
        when(followRepository.findByFollowerIdAndFollowingId(follower.getId(), target.getId())).thenReturn(Optional.empty());
        when(followRepository.save(any(Follow.class))).thenAnswer(invocation -> invocation.getArgument(0));

        followService.doProcess(followRequest);

        verify(followRepository).save(argThat(follow ->
                follow.getFollower().equals(follower) &&
                follow.getFollowing().equals(target) &&
                follow.getStatus().equals(FollowStatus.ACCEPTED)
        ));
        verify(eventPublisher).publishEvent(any(FollowEvent.class));
    }
}
