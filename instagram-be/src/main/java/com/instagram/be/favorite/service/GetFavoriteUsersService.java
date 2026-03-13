package com.instagram.be.favorite.service;

import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.favorite.repository.FavoriteUserRepository;
import com.instagram.be.follow.repository.FollowRepository;
import com.instagram.be.follow.response.FollowUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
        var favorites = favoriteUserRepository.findByUserId(userId);

        Set<UUID> favoriteIds = favorites.stream()
                .map(fu -> fu.getFavorite().getId()).collect(Collectors.toSet());

        Set<UUID> followedIds = favoriteIds.isEmpty()
                ? Set.of()
                : followRepository.findFollowedIds(userId, favoriteIds);

        return favorites.stream()
                .map(fu -> FollowUserResponse.of(fu.getFavorite(), followedIds.contains(fu.getFavorite().getId())))
                .toList();
    }
}
