package com.instagram.be.favorite.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.base.request.UserOnlyRequest;
import com.instagram.be.favorite.request.FavoriteRequest;
import com.instagram.be.favorite.response.FavoriteResponse;
import com.instagram.be.favorite.service.GetFavoritePostsService;
import com.instagram.be.favorite.service.GetFavoriteUsersService;
import com.instagram.be.favorite.service.ToggleFavoritePostService;
import com.instagram.be.favorite.service.ToggleFavoriteUserService;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.post.response.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class FavoriteController {

  private final ToggleFavoritePostService toggleFavoritePostService;
  private final ToggleFavoriteUserService toggleFavoriteUserService;
  private final GetFavoritePostsService getFavoritePostsService;
  private final GetFavoriteUsersService getFavoriteUsersService;

  @PostMapping("/me/favorite/posts/{postId}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<FavoriteResponse>> toggleFavoritePost(@PathVariable UUID postId) {
    var request = FavoriteRequest.builder()
      .userContext(SecurityUtils.getCurrentUserContext()
        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
      .targetId(postId)
      .build();
    return ResponseEntity.ok(ApiResponse.success(toggleFavoritePostService.execute(request), "Favorite toggled", 200));
  }

  @PostMapping("/{userId}/favorite")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<FavoriteResponse>> toggleFavoriteUser(@PathVariable UUID userId) {
    var request = FavoriteRequest.builder()
      .userContext(SecurityUtils.getCurrentUserContext()
        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
      .targetId(userId)
      .build();
    return ResponseEntity.ok(ApiResponse.success(toggleFavoriteUserService.execute(request), "Favorite toggled", 200));
  }

  @GetMapping("/me/favorites/posts")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<List<PostResponse>>> getFavoritePosts() {
    var request = UserOnlyRequest.builder()
      .userContext(SecurityUtils.getCurrentUserContext()
        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
      .build();
    return ResponseEntity.ok(ApiResponse.success(getFavoritePostsService.execute(request), "Favorite posts retrieved", 200));
  }

  @GetMapping("/me/favorites/users")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<List<FollowUserResponse>>> getFavoriteUsers() {
    var request = UserOnlyRequest.builder()
      .userContext(SecurityUtils.getCurrentUserContext()
        .orElseThrow(() -> new IllegalStateException("No authenticated user")))
      .build();
    return ResponseEntity.ok(ApiResponse.success(getFavoriteUsersService.execute(request), "Favorite users retrieved", 200));
  }
}
