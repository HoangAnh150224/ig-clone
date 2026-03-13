package com.instagram.be.search.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.search.repository.SearchHistoryRepository;
import com.instagram.be.search.request.DeleteSearchHistoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteSearchHistoryService extends BaseService<DeleteSearchHistoryRequest, Void> {

    private final SearchHistoryRepository searchHistoryRepository;

    @Override
    @Transactional
    public Void execute(DeleteSearchHistoryRequest request) {
        return super.execute(request);
    }

    @Override
    protected Void doProcess(DeleteSearchHistoryRequest request) {
        UUID userId = request.getUserContext().getUserId();
        searchHistoryRepository.findByIdAndUserId(request.getHistoryId(), userId)
                .ifPresentOrElse(
                        searchHistoryRepository::delete,
                        () -> {
                            throw new NotFoundException("Search history", request.getHistoryId());
                        }
                );
        return null;
    }
}
