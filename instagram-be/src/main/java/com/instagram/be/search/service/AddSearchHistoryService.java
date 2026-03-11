package com.instagram.be.search.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.hashtag.Hashtag;
import com.instagram.be.hashtag.HashtagRepository;
import com.instagram.be.search.SearchHistory;
import com.instagram.be.search.repository.SearchHistoryRepository;
import com.instagram.be.search.request.AddSearchHistoryRequest;
import com.instagram.be.search.response.SearchHistoryResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddSearchHistoryService extends BaseService<AddSearchHistoryRequest, SearchHistoryResponse> {

    private final SearchHistoryRepository searchHistoryRepository;
    private final UserProfileRepository userProfileRepository;
    private final HashtagRepository hashtagRepository;

    @Override
    @Transactional
    public SearchHistoryResponse execute(AddSearchHistoryRequest request) {
        return super.execute(request);
    }

    @Override
    protected SearchHistoryResponse doProcess(AddSearchHistoryRequest request) {
        UUID userId = request.getUserContext().getUserId();
        UserProfile currentUser = userProfileRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User", userId));

        if (request.getSearchedUserId() != null) {
            return addUserSearch(currentUser, request.getSearchedUserId());
        } else {
            return addHashtagSearch(currentUser, request.getHashtagId());
        }
    }

    private SearchHistoryResponse addUserSearch(UserProfile currentUser, UUID searchedUserId) {
        UserProfile searchedUser = userProfileRepository.findById(searchedUserId)
                .orElseThrow(() -> new NotFoundException("User", searchedUserId));

        // Upsert: remove old entry if exists, then create fresh (refreshes timestamp)
        searchHistoryRepository.findByUserIdAndSearchedUserId(currentUser.getId(), searchedUserId)
                .ifPresent(searchHistoryRepository::delete);

        SearchHistory entry = SearchHistory.builder()
                .user(currentUser)
                .searchedUser(searchedUser)
                .build();

        return SearchHistoryResponse.from(searchHistoryRepository.save(entry));
    }

    private SearchHistoryResponse addHashtagSearch(UserProfile currentUser, UUID hashtagId) {
        Hashtag hashtag = hashtagRepository.findById(hashtagId)
                .orElseThrow(() -> new NotFoundException("Hashtag", hashtagId));

        searchHistoryRepository.findByUserIdAndHashtagId(currentUser.getId(), hashtagId)
                .ifPresent(searchHistoryRepository::delete);

        SearchHistory entry = SearchHistory.builder()
                .user(currentUser)
                .hashtag(hashtag)
                .build();

        return SearchHistoryResponse.from(searchHistoryRepository.save(entry));
    }
}
