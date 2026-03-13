package com.instagram.be.storage;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.ratelimit.RateLimiter;
import com.instagram.be.base.redis.RedisKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final RateLimiter rateLimiter;

    /**
     * Upload a single file.
     * Query param `folder` is optional (default: "general").
     * Used by: messages with media, standalone uploads
     */
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {

        UUID userId = SecurityUtils.getCurrentUserId().orElseThrow();
        rateLimiter.check(RedisKeys.rateUpload(userId), 30, 60);

        CloudinaryService.UploadResult result = cloudinaryService.upload(file, folder);
        return ResponseEntity.ok(ApiResponse.success(
                new UploadResponse(result.url(), result.publicId()),
                "File uploaded", 200));
    }

    /**
     * Upload multiple files at once (e.g. post media carousel).
     */
    @PostMapping(value = "/multiple", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<UploadResponse>>> uploadMultiple(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {

        UUID userId = SecurityUtils.getCurrentUserId().orElseThrow();
        rateLimiter.check(RedisKeys.rateUpload(userId), 30, 60);

        List<UploadResponse> results = files.stream()
                .map(f -> {
                    CloudinaryService.UploadResult r = cloudinaryService.upload(f, folder);
                    return new UploadResponse(r.url(), r.publicId());
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.success(results, "Files uploaded", 200));
    }

    public record UploadResponse(String url, String publicId) {
    }
}
