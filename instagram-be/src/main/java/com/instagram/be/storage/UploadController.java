package com.instagram.be.storage;

import com.instagram.be.base.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

  private final CloudinaryService cloudinaryService;

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
