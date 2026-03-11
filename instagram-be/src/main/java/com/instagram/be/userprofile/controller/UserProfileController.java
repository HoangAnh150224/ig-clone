package com.instagram.be.userprofile.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.userprofile.request.GetUserProfileRequest;
import com.instagram.be.userprofile.response.UserProfileResponse;
import com.instagram.be.userprofile.service.GetUserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final GetUserProfileService getUserProfileService;

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(
            @PathVariable UUID userId) {
        UserContext ctx = SecurityUtils.getCurrentUserContext().orElse(null);
        GetUserProfileRequest request = GetUserProfileRequest.builder()
                .targetUserId(userId)
                .userContext(ctx)
                .build();
        UserProfileResponse response = getUserProfileService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile retrieved", 200));
    }
}
