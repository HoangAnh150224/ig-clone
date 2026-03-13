package com.instagram.be.highlight.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.highlight.request.*;
import com.instagram.be.highlight.response.HighlightResponse;
import com.instagram.be.highlight.service.*;
import com.instagram.be.storage.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/highlights")
@RequiredArgsConstructor
public class HighlightController {

    private final CloudinaryService cloudinaryService;
    private final CreateHighlightService createHighlightService;
    private final AddStoryToHighlightService addStoryToHighlightService;
    private final DeleteHighlightService deleteHighlightService;

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<HighlightResponse>> createHighlight(
            @RequestPart(value = "cover", required = false) MultipartFile cover,
            @RequestPart("data") CreateHighlightRequest request) {

        if (cover != null && !cover.isEmpty()) {
            String coverUrl = cloudinaryService.upload(cover, "highlights").url();
            request.setCoverUrl(coverUrl);
        }
        request.setUserContext(currentUser());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createHighlightService.execute(request), "Highlight created", 201));
    }

    @PostMapping("/{id}/stories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<HighlightResponse>> addStory(
            @PathVariable UUID id,
            @RequestBody HighlightStoryRequest request) {
        request.setHighlightId(id);
        request.setUserContext(currentUser());
        return ResponseEntity.ok(ApiResponse.success(addStoryToHighlightService.execute(request), "Story added", 200));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteHighlight(@PathVariable UUID id) {
        HighlightActionRequest request = HighlightActionRequest.builder()
                .highlightId(id).userContext(currentUser()).build();
        deleteHighlightService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Highlight deleted", 200));
    }

    private UserContext currentUser() {
        return SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    }
}
