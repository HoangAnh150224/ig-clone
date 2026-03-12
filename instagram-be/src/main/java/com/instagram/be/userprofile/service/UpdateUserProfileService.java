package com.instagram.be.userprofile.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.request.UpdateUserProfileRequest;
import com.instagram.be.auth.response.MeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateUserProfileService extends BaseService<UpdateUserProfileRequest, MeResponse> {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public MeResponse execute(UpdateUserProfileRequest request) {
        return super.execute(request);
    }

    @Override
    protected MeResponse doProcess(UpdateUserProfileRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getWebsite() != null) user.setWebsite(request.getWebsite());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        
        user.setPrivateAccount(request.isPrivateAccount());
        user.setShowActivityStatus(request.isShowActivityStatus());
        if (request.getTagPermission() != null) user.setTagPermission(request.getTagPermission());

        UserProfile updated = userProfileRepository.save(user);
        return MeResponse.from(updated);
    }
}
