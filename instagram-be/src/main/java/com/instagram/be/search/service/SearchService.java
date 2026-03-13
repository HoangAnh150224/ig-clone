package com.instagram.be.search.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.hashtag.repository.HashtagRepository;
import com.instagram.be.search.repository.SearchRepository;
import com.instagram.be.search.request.SearchRequest;
import com.instagram.be.search.response.SearchResultResponse;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService extends BaseService<SearchRequest, SearchResultResponse> {

    @Qualifier("elasticsearchSearchRepository")
    private final SearchRepository searchRepository;
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
            return new SearchResultResponse(List.of(), List.of(), List.of());
        }

        PageRequest pageRequest = PageRequest.of(0, 20); // Limit search results

        // Search Users using the search repository interface
        List<UserProfile> users = searchRepository.searchUsers(query, pageRequest);
        List<FollowUserResponse> userResponses = users.stream()
                .map(FollowUserResponse::from)
                .collect(Collectors.toList());

        // Search Hashtags
        List<Hashtag> hashtags = hashtagRepository.findByNameStartingWith(query, pageRequest);
        List<SearchResultResponse.HashtagInfo> hashtagResponses = hashtags.stream()
                .map(h -> new SearchResultResponse.HashtagInfo(h.getName(), 0L)) // Post count can be added later
                .collect(Collectors.toList());

        // Search Posts
        List<com.instagram.be.post.Post> posts = searchRepository.searchPosts(query, pageRequest);
        List<SearchResultResponse.PostInfo> postResponses = posts.stream()
                .map(p -> new SearchResultResponse.PostInfo(p.getId(), p.getCaption()))
                .collect(Collectors.toList());

        return new SearchResultResponse(userResponses, hashtagResponses, postResponses);
    }
}
