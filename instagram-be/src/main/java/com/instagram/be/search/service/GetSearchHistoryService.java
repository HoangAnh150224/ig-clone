package com.instagram.be.search.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.search.repository.SearchHistoryRepository;
import com.instagram.be.search.request.GetSearchHistoryRequest;
import com.instagram.be.search.response.SearchHistoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetSearchHistoryService extends BaseService<GetSearchHistoryRequest, List<SearchHistoryResponse>> {

    private static final int MAX_HISTORY = 20;

    private final SearchHistoryRepository searchHistoryRepository;

    @Override
    protected List<SearchHistoryResponse> doProcess(GetSearchHistoryRequest request) {
        UUID userId = request.getUserContext().getUserId();
        return searchHistoryRepository.findRecentByUserId(userId, PageRequest.of(0, MAX_HISTORY))
                .stream()
                .map(SearchHistoryResponse::from)
                .toList();
    }
}
