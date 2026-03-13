package com.instagram.be.hashtag.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.hashtag.request.HashtagSearchRequest;
import com.instagram.be.hashtag.response.HashtagSuggestionResponse;
import com.instagram.be.hashtag.service.HashtagSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagSearchService hashtagSearchService;

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<HashtagSuggestionResponse>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "10") int limit) {
        HashtagSearchRequest request = HashtagSearchRequest.builder()
                .q(q).limit(limit)
                .userContext(SecurityUtils.getCurrentUserContext().orElse(null))
                .build();
        return ResponseEntity.ok(ApiResponse.success(hashtagSearchService.execute(request), "Hashtags retrieved", 200));
    }
}
