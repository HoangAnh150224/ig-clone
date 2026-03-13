package com.instagram.be.block.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.request.PaginatedRequest;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.block.request.BlockRequest;
import com.instagram.be.block.response.BlockResponse;
import com.instagram.be.block.service.BlockService;
import com.instagram.be.block.service.GetBlockedUsersService;
import com.instagram.be.follow.response.FollowUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;
    private final GetBlockedUsersService getBlockedUsersService;

    @GetMapping("/me/blocked")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<FollowUserResponse>>> getBlockedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        PaginatedRequest request = PaginatedRequest.builder()
                .page(page)
                .size(size)
                .userContext(ctx)
                .build();
        return ResponseEntity.ok(ApiResponse.success(getBlockedUsersService.execute(request), "Blocked users retrieved", 200));
    }

    @PostMapping("/{userId}/block")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<BlockResponse>> block(@PathVariable UUID userId) {
        UserContext ctx = SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
        BlockRequest request = BlockRequest.builder()
                .targetUserId(userId)
                .userContext(ctx)
                .build();
        BlockResponse response = blockService.execute(request);
        String message = response.blocked() ? "User blocked" : "User unblocked";
        return ResponseEntity.ok(ApiResponse.success(response, message, 200));
    }
}
