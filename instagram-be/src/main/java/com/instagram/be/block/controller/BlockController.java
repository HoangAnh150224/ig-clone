package com.instagram.be.block.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.block.request.BlockRequest;
import com.instagram.be.block.response.BlockResponse;
import com.instagram.be.block.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

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
