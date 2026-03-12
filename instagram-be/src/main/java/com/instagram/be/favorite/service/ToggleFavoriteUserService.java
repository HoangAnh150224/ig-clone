package com.instagram.be.favorite.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.favorite.FavoriteUser;
import com.instagram.be.favorite.FavoriteUserRepository;
import com.instagram.be.favorite.request.FavoriteRequest;
import com.instagram.be.favorite.response.FavoriteResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ToggleFavoriteUserService extends BaseService<FavoriteRequest, FavoriteResponse> {

    private final FavoriteUserRepository favoriteUserRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public FavoriteResponse execute(FavoriteRequest request) {
        return super.execute(request);
    }

    @Override
    protected FavoriteResponse doProcess(FavoriteRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UUID targetId = request.getTargetId();

        Optional<FavoriteUser> existing = favoriteUserRepository.findByUserIdAndFavoriteId(userId, targetId);
        if (existing.isPresent()) {
            favoriteUserRepository.delete(existing.get());
            return new FavoriteResponse(false);
        }

        UserProfile user = userProfileRepository.getReferenceById(userId);
        UserProfile target = userProfileRepository.findById(targetId)
                .orElseThrow(() -> new NotFoundException("User", targetId));

        favoriteUserRepository.save(FavoriteUser.builder().user(user).favorite(target).build());
        return new FavoriteResponse(true);
    }
}
