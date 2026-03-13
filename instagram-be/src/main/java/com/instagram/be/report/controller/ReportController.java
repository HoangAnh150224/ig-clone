package com.instagram.be.report.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.report.request.CreateReportRequest;
import com.instagram.be.report.service.CreateReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class ReportController {

    private final CreateReportService createReportService;

    @PostMapping("/{postId}/report")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> reportPost(
            @PathVariable UUID postId,
            @RequestBody(required = false) CreateReportRequest body) {
        String reason = body != null ? body.getReason() : null;
        var request = CreateReportRequest.builder()
                .userContext(SecurityUtils.getCurrentUserContext()
                        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
                .postId(postId)
                .reason(reason)
                .build();
        createReportService.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(null, "Report submitted", 201));
    }
}
