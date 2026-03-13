package com.instagram.be.story.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.story.response.StoryResponse;
import com.instagram.be.story.service.GetArchivedStoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/archive")
@RequiredArgsConstructor
public class ArchiveController {

    private final GetArchivedStoriesService getArchivedStoriesService;

    @GetMapping("/stories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StoryResponse>>> getArchivedStories() {
        UserOnlyRequest request = UserOnlyRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .build();
        return ResponseEntity.ok(ApiResponse.success(getArchivedStoriesService.execute(request), "Archived stories retrieved", 200));
    }
}
