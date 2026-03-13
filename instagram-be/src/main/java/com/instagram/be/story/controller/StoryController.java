package com.instagram.be.story.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.storage.CloudinaryService;
import com.instagram.be.story.request.*;
import com.instagram.be.story.response.*;
import com.instagram.be.story.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
public class StoryController {

    private final CloudinaryService cloudinaryService;
    private final GetFeedStoriesService getFeedStoriesService;
    private final ViewStoryService viewStoryService;
    private final CreateStoryService createStoryService;
    private final DeleteStoryService deleteStoryService;
    private final ArchiveStoryService archiveStoryService;
    private final GetStoryViewersService getStoryViewersService;
    private final LikeStoryService likeStoryService;
    private final ReplyToStoryService replyToStoryService;
    private final GetArchivedStoriesService getArchivedStoriesService;

    @GetMapping("/feed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StoryFeedResponse>>> getFeedStories() {
        GetFeedStoriesRequest request = GetFeedStoriesRequest.builder().userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getFeedStoriesService.execute(request), "Stories retrieved", 200));
    }

    @PostMapping("/{id}/view")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> viewStory(@PathVariable UUID id) {
        StoryActionRequest request = StoryActionRequest.builder().storyId(id).userContext(currentUser()).build();
        viewStoryService.execute(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(consumes = MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StoryResponse>> createStory(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "closeFriends", defaultValue = "false") boolean closeFriends) {

        CloudinaryService.UploadResult result = cloudinaryService.upload(file, "stories");
        String rawType = file.getContentType();
        com.instagram.be.post.enums.MediaType mediaType =
                rawType != null && rawType.startsWith("video")
                        ? com.instagram.be.post.enums.MediaType.VIDEO
                        : com.instagram.be.post.enums.MediaType.IMAGE;

        CreateStoryRequest request = CreateStoryRequest.builder()
                .mediaUrl(result.url())
                .mediaType(mediaType)
                .closeFriends(closeFriends)
                .userContext(currentUser())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createStoryService.execute(request), "Story created", 201));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteStory(@PathVariable UUID id) {
        StoryActionRequest request = StoryActionRequest.builder().storyId(id).userContext(currentUser()).build();
        deleteStoryService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Story deleted", 200));
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StoryResponse>> archiveStory(@PathVariable UUID id) {
        StoryActionRequest request = StoryActionRequest.builder().storyId(id).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(archiveStoryService.execute(request), "Archive toggled", 200));
    }

    @GetMapping("/{id}/viewers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<StoryViewResponse>>> getViewers(@PathVariable UUID id) {
        StoryActionRequest request = StoryActionRequest.builder().storyId(id).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getStoryViewersService.execute(request), "Viewers retrieved", 200));
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> likeStory(@PathVariable UUID id) {
        StoryActionRequest request = StoryActionRequest.builder().storyId(id).userContext(currentUser()).build();
        likeStoryService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Story liked", 200));
    }

    @PostMapping("/{id}/reply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<StoryReplyResponse>> replyToStory(
            @PathVariable UUID id,
            @RequestBody ReplyToStoryRequest request) {
        request.setStoryId(id);
        request.setUserContext(currentUser());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(replyToStoryService.execute(request), "Reply sent", 201));
    }

    private UserContext currentUser() {
        return SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    }
}
