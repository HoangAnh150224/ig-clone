package com.instagram.be.search.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.search.repository.SearchHistoryRepository;
import com.instagram.be.search.request.ClearSearchHistoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClearSearchHistoryService extends BaseService<ClearSearchHistoryRequest, Void> {

  private final SearchHistoryRepository searchHistoryRepository;

  @Override
  @Transactional
  public Void execute(ClearSearchHistoryRequest request) {
    return super.execute(request);
  }

  @Override
  protected Void doProcess(ClearSearchHistoryRequest request) {
    UUID userId = request.getUserContext().getUserId();
    searchHistoryRepository.deleteAllByUserId(userId);
    return null;
  }
}
