package com.instagram.be.favorite.service;

import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.favorite.FavoriteUserRepository;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.response.FollowUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetFavoriteUsersService extends BaseService<UserOnlyRequest, List<FollowUserResponse>> {

    private final FavoriteUserRepository favoriteUserRepository;
    private final FollowRepository followRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FollowUserResponse> execute(UserOnlyRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<FollowUserResponse> doProcess(UserOnlyRequest request) {
        UUID userId = request.getUserContext().getUserId();
        return favoriteUserRepository.findByUserId(userId).stream()
                .map(fu -> {
                    boolean isFollowing = followRepository.existsByFollowerIdAndFollowingId(userId, fu.getFavorite().getId());
                    return FollowUserResponse.of(fu.getFavorite(), isFollowing);
                })
                .toList();
    }
}
