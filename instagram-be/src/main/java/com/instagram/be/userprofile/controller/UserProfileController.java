package com.instagram.be.userprofile.controller;

import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.highlight.request.GetUserHighlightsRequest;
import com.instagram.be.highlight.response.HighlightResponse;
import com.instagram.be.highlight.service.GetUserHighlightsService;
import com.instagram.be.storage.CloudinaryService;
import com.instagram.be.userprofile.enums.Gender;
import com.instagram.be.userprofile.enums.TagPermission;
import com.instagram.be.userprofile.request.DeactivateAccountRequest;
import com.instagram.be.userprofile.request.GetSuggestionsRequest;
import com.instagram.be.userprofile.request.GetUserProfileRequest;
import com.instagram.be.userprofile.request.UpdateUserProfileRequest;
import com.instagram.be.userprofile.response.UserProfileResponse;
import com.instagram.be.userprofile.service.DeactivateAccountService;
import com.instagram.be.userprofile.service.GetSuggestionsService;
import com.instagram.be.userprofile.service.GetUserProfileService;
import com.instagram.be.userprofile.service.UpdateUserProfileService;
import com.instagram.be.follow.response.FollowUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final CloudinaryService cloudinaryService;
    private final GetUserProfileService getUserProfileService;
    private final UpdateUserProfileService updateUserProfileService;
    private final GetUserHighlightsService getUserHighlightsService;
    private final GetSuggestionsService getSuggestionsService;
    private final DeactivateAccountService deactivateAccountService;

    @GetMapping("/suggestions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<FollowUserResponse>>> getSuggestions(
            @RequestParam(defaultValue = "5") int limit) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        GetSuggestionsRequest request = GetSuggestionsRequest.builder()
                .limit(limit)
                .userContext(ctx)
                .build();
        List<FollowUserResponse> response = getSuggestionsService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Suggestions retrieved", 200));
    }

    @GetMapping("/{username}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(
            @PathVariable String username) {
        UserContext ctx = SecurityUtils.getCurrentUserContext().orElse(null);
        GetUserProfileRequest request = GetUserProfileRequest.builder()
                .targetUsername(username)
                .userContext(ctx)
                .build();
        UserProfileResponse response = getUserProfileService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile retrieved", 200));
    }

    @GetMapping("/{username}/highlights")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<HighlightResponse>>> getUserHighlights(
            @PathVariable String username) {
        GetUserHighlightsRequest request = GetUserHighlightsRequest.builder()
                .targetUsername(username)
                .userContext(SecurityUtils.getCurrentUserContext().orElse(null))
                .build();
        List<HighlightResponse> response = getUserHighlightsService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Highlights retrieved", 200));
    }

    @PatchMapping(value = "/me", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MeResponse>> updateProfile(
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String website,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) TagPermission tagPermission,
            @RequestParam(defaultValue = "false") boolean privateAccount,
            @RequestParam(defaultValue = "true") boolean showActivityStatus) {

        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));

        String avatarUrl = null;
        if (avatar != null && !avatar.isEmpty()) {
            avatarUrl = cloudinaryService.upload(avatar, "avatars").url();
        }

        UpdateUserProfileRequest request = UpdateUserProfileRequest.builder()
                .userContext(ctx)
                .fullName(fullName)
                .bio(bio)
                .website(website)
                .gender(gender)
                .tagPermission(tagPermission)
                .avatarUrl(avatarUrl)
                .privateAccount(privateAccount)
                .showActivityStatus(showActivityStatus)
                .build();

        MeResponse response = updateUserProfileService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile updated", 200));
    }

    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount() {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        DeactivateAccountRequest request = DeactivateAccountRequest.builder().userContext(ctx).build();
        deactivateAccountService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Account deactivated successfully", 200));
    }
}
