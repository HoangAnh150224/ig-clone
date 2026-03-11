package com.instagram.be.follow.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.follow.request.FollowListRequest;
import com.instagram.be.follow.request.FollowRequest;
import com.instagram.be.follow.response.FollowResponse;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.follow.service.FollowService;
import com.instagram.be.follow.service.GetFollowersService;
import com.instagram.be.follow.service.GetFollowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final GetFollowersService getFollowersService;
    private final GetFollowingService getFollowingService;

    @PostMapping("/{userId}/follow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FollowResponse>> follow(@PathVariable UUID userId) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        FollowRequest request = FollowRequest.builder()
                .targetUserId(userId)
                .userContext(ctx)
                .build();
        FollowResponse response = followService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Follow request processed", 200));
    }

    @GetMapping("/{userId}/followers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<FollowUserResponse>>> getFollowers(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserContext ctx = SecurityUtils.getCurrentUserContext().orElse(null);
        FollowListRequest request = FollowListRequest.builder()
                .targetUserId(userId)
                .page(page)
                .size(size)
                .sortBy("createdAt")
                .sortDirection("DESC")
                .userContext(ctx)
                .build();
        PaginatedResponse<FollowUserResponse> response = getFollowersService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Followers retrieved", 200));
    }

    @GetMapping("/{userId}/following")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<FollowUserResponse>>> getFollowing(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserContext ctx = SecurityUtils.getCurrentUserContext().orElse(null);
        FollowListRequest request = FollowListRequest.builder()
                .targetUserId(userId)
                .page(page)
                .size(size)
                .sortBy("createdAt")
                .sortDirection("DESC")
                .userContext(ctx)
                .build();
        PaginatedResponse<FollowUserResponse> response = getFollowingService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Following retrieved", 200));
    }
}
