package com.instagram.be.search.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.hashtag.repository.HashtagRepository;
import com.instagram.be.search.request.SearchRequest;
import com.instagram.be.search.response.SearchResultResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService extends BaseService<SearchRequest, SearchResultResponse> {

  private final UserProfileRepository userProfileRepository;
  private final HashtagRepository hashtagRepository;

  @Override
  @Transactional(readOnly = true)
  public SearchResultResponse execute(SearchRequest request) {
    return super.execute(request);
  }

  @Override
  protected SearchResultResponse doProcess(SearchRequest request) {
    String query = request.getQuery();
    if (query == null || query.isBlank()) {
      return new SearchResultResponse(List.of(), List.of());
    }

    PageRequest pageRequest = PageRequest.of(0, 20); // Limit search results

    // Search Users
    List<UserProfile> users = userProfileRepository.searchByKeyword(query, pageRequest);
    List<FollowUserResponse> userResponses = users.stream()
      .map(FollowUserResponse::from)
      .collect(Collectors.toList());

    // Search Hashtags
    List<Hashtag> hashtags = hashtagRepository.findByNameStartingWith(query, pageRequest);
    List<SearchResultResponse.HashtagInfo> hashtagResponses = hashtags.stream()
      .map(h -> new SearchResultResponse.HashtagInfo(h.getName(), 0L)) // Post count can be added later
      .collect(Collectors.toList());

    return new SearchResultResponse(userResponses, hashtagResponses);
  }
}
