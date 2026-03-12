package com.instagram.be.userprofile.controller;

import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.highlight.request.GetUserHighlightsRequest;
import com.instagram.be.highlight.response.HighlightResponse;
import com.instagram.be.highlight.service.GetUserHighlightsService;
import com.instagram.be.userprofile.request.GetSuggestionsRequest;
import com.instagram.be.userprofile.request.GetUserProfileRequest;
import com.instagram.be.userprofile.request.UpdateUserProfileRequest;
import com.instagram.be.userprofile.response.UserProfileResponse;
import com.instagram.be.userprofile.service.GetSuggestionsService;
import com.instagram.be.userprofile.service.GetUserProfileService;
import com.instagram.be.userprofile.service.UpdateUserProfileService;
import com.instagram.be.follow.response.FollowUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final GetUserProfileService getUserProfileService;
    private final UpdateUserProfileService updateUserProfileService;
    private final GetUserHighlightsService getUserHighlightsService;
    private final GetSuggestionsService getSuggestionsService;

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

    @PatchMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MeResponse>> updateProfile(
            @RequestBody UpdateUserProfileRequest request) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        request.setUserContext(ctx);
        MeResponse response = updateUserProfileService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Profile updated", 200));
    }
}
