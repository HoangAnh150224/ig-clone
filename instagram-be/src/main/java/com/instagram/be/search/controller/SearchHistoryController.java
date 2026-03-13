package com.instagram.be.search.controller;

import com.instagram.be.base.SecurityUtils;
import com.instagram.be.base.UserContext;
import com.instagram.be.base.api.ApiResponse;
import com.instagram.be.search.request.*;
import com.instagram.be.search.response.SearchHistoryResponse;
import com.instagram.be.search.response.SearchResultResponse;
import com.instagram.be.search.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchHistoryController {

  private final GetSearchHistoryService getSearchHistoryService;
  private final AddSearchHistoryService addSearchHistoryService;
  private final DeleteSearchHistoryService deleteSearchHistoryService;
  private final ClearSearchHistoryService clearSearchHistoryService;
  private final SearchService searchService;

  @GetMapping
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<SearchResultResponse>> search(
    @RequestParam(defaultValue = "") String q,
    @RequestParam(defaultValue = "10") int size) {
    UserContext ctx = SecurityUtils.getCurrentUserContext()
      .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    SearchRequest request = SearchRequest.builder().userContext(ctx).query(q).size(size).build();
    return ResponseEntity.ok(ApiResponse.success(searchService.execute(request), "Search results", 200));
  }

  @GetMapping("/history")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<List<SearchHistoryResponse>>> getHistory() {
    UserContext ctx = SecurityUtils.getCurrentUserContext()
      .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    GetSearchHistoryRequest request = GetSearchHistoryRequest.builder().userContext(ctx).build();
    List<SearchHistoryResponse> response = getSearchHistoryService.execute(request);
    return ResponseEntity.ok(ApiResponse.success(response, "Search history retrieved", 200));
  }

  @PostMapping("/history")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<SearchHistoryResponse>> addHistory(
    @Valid @RequestBody AddSearchHistoryRequest request) {
    UserContext ctx = SecurityUtils.getCurrentUserContext()
      .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    request.setUserContext(ctx);
    SearchHistoryResponse response = addSearchHistoryService.execute(request);
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(ApiResponse.success(response, "Search history saved", HttpStatus.CREATED.value()));
  }

  @DeleteMapping("/history/{id}")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<Void>> deleteHistory(@PathVariable UUID id) {
    UserContext ctx = SecurityUtils.getCurrentUserContext()
      .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    DeleteSearchHistoryRequest request = DeleteSearchHistoryRequest.builder()
      .historyId(id)
      .userContext(ctx)
      .build();
    deleteSearchHistoryService.execute(request);
    return ResponseEntity.ok(ApiResponse.success(null, "Search history deleted", 200));
  }

  @DeleteMapping("/history")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<ApiResponse<Void>> clearHistory() {
    UserContext ctx = SecurityUtils.getCurrentUserContext()
      .orElseThrow(() -> new IllegalStateException("No authenticated user"));
    ClearSearchHistoryRequest request = ClearSearchHistoryRequest.builder().userContext(ctx).build();
    clearSearchHistoryService.execute(request);
    return ResponseEntity.ok(ApiResponse.success(null, "Search history cleared", 200));
  }
}
