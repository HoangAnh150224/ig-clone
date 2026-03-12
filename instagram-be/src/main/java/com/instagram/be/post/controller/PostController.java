package com.instagram.be.post.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.response.PaginatedResponse;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.post.enums.PostType;
import com.instagram.be.post.request.*;
import com.instagram.be.post.service.GetExplorePostsService;
import com.instagram.be.post.service.GetHashtagPostsService;
import com.instagram.be.post.response.*;
import com.instagram.be.post.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final CreatePostService createPostService;
    private final GetPostService getPostService;
    private final UpdatePostService updatePostService;
    private final DeletePostService deletePostService;
    private final ArchivePostService archivePostService;
    private final LikePostService likePostService;
    private final ViewPostService viewPostService;
    private final SavePostService savePostService;
    private final GetLikersService getLikersService;
    private final GetSavedPostsService getSavedPostsService;
    private final GetFeedService getFeedService;
    private final GetUserPostsService getUserPostsService;
    private final GetArchivedPostsService getArchivedPostsService;
    private final GetTaggedPostsService getTaggedPostsService;
    private final GetExplorePostsService getExplorePostsService;
    private final GetHashtagPostsService getHashtagPostsService;

    @PostMapping("/posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<CreatePostResponse>> createPost(
            @RequestBody CreatePostRequest request) {
        UserContext ctx = currentUser();
        request.setUserContext(ctx);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createPostService.execute(request), "Post created", 201));
    }

    @GetMapping("/posts/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable UUID id) {
        UserContext ctx = SecurityUtils.getCurrentUserContext().orElse(null);
        PostActionRequest request = PostActionRequest.builder().postId(id).userContext(ctx).build();
        return ResponseEntity.ok(ApiResponse.success(getPostService.execute(request), "Post retrieved", 200));
    }

    @PutMapping("/posts/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable UUID id, @RequestBody UpdatePostRequest request) {
        request.setPostId(id);
        request.setUserContext(currentUser());
        return ResponseEntity.ok(ApiResponse.success(updatePostService.execute(request), "Post updated", 200));
    }

    @DeleteMapping("/posts/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable UUID id) {
        PostActionRequest request = PostActionRequest.builder().postId(id).userContext(currentUser()).build();
        deletePostService.execute(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted", 200));
    }

    @PatchMapping("/posts/{id}/archive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PostResponse>> archivePost(@PathVariable UUID id) {
        PostActionRequest request = PostActionRequest.builder().postId(id).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(archivePostService.execute(request), "Archive toggled", 200));
    }

    @PostMapping("/posts/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LikeResponse>> likePost(@PathVariable UUID id) {
        PostActionRequest request = PostActionRequest.builder().postId(id).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(likePostService.execute(request), "Like toggled", 200));
    }

    @PostMapping("/posts/{id}/view")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> viewPost(@PathVariable UUID id) {
        PostActionRequest request = PostActionRequest.builder().postId(id)
                .userContext(SecurityUtils.getCurrentUserContext().orElse(null)).build();
        viewPostService.execute(request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/posts/{id}/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<SaveResponse>> savePost(@PathVariable UUID id) {
        PostActionRequest request = PostActionRequest.builder().postId(id).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(savePostService.execute(request), "Save toggled", 200));
    }

    @GetMapping("/posts/{id}/likers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<FollowUserResponse>>> getLikers(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        GetPostListRequest request = GetPostListRequest.builder()
                .postId(id).page(page).size(size)
                .userContext(SecurityUtils.getCurrentUserContext().orElse(null)).build();
        return ResponseEntity.ok(ApiResponse.success(getLikersService.execute(request), "Likers retrieved", 200));
    }

    @GetMapping("/posts/saved")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostResponse>>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        GetPostListRequest request = GetPostListRequest.builder()
                .page(page).size(size).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getSavedPostsService.execute(request), "Saved posts retrieved", 200));
    }

    @GetMapping("/feed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FeedResponse>> getFeed(
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String type) {
        PostType typeFilter = type != null ? PostType.valueOf(type.toUpperCase()) : null;
        GetPostListRequest request = GetPostListRequest.builder()
                .cursor(cursor).size(size).typeFilter(typeFilter).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getFeedService.execute(request), "Feed retrieved", 200));
    }

    @GetMapping("/users/{username}/posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostResponse>>> getUserPosts(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        GetPostListRequest request = GetPostListRequest.builder()
                .targetUsername(username).page(page).size(size)
                .userContext(SecurityUtils.getCurrentUserContext().orElse(null)).build();
        return ResponseEntity.ok(ApiResponse.success(getUserPostsService.execute(request), "Posts retrieved", 200));
    }

    @GetMapping("/archive/posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostResponse>>> getArchivedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        GetPostListRequest request = GetPostListRequest.builder()
                .page(page).size(size).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getArchivedPostsService.execute(request), "Archived posts retrieved", 200));
    }

    @GetMapping("/posts/tagged/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostResponse>>> getTaggedPosts(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        GetPostListRequest request = GetPostListRequest.builder()
                .targetUserId(userId).page(page).size(size)
                .userContext(SecurityUtils.getCurrentUserContext().orElse(null)).build();
        return ResponseEntity.ok(ApiResponse.success(getTaggedPostsService.execute(request), "Tagged posts retrieved", 200));
    }

    @GetMapping("/explore")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostResponse>>> explore(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        GetExploreRequest request = GetExploreRequest.builder()
                .page(page).size(size).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getExplorePostsService.execute(request), "Explore feed retrieved", 200));
    }

    @GetMapping("/hashtags/{name}/posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaginatedResponse<PostResponse>>> getHashtagPosts(
            @PathVariable String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        GetHashtagPostsRequest request = GetHashtagPostsRequest.builder()
                .hashtagName(name).page(page).size(size).userContext(currentUser()).build();
        return ResponseEntity.ok(ApiResponse.success(getHashtagPostsService.execute(request), "Hashtag posts retrieved", 200));
    }

    private UserContext currentUser() {
        return SecurityUtils.getCurrentUserContext()
                .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    }
}
