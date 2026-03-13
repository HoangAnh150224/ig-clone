package com.instagram.be.auth.service;

import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.GetMeRequest;
import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetMeService extends BaseService<GetMeRequest, MeResponse> {

  private final AuthRepository authRepository;

  @Override
  @Transactional(readOnly = true)
  public MeResponse execute(GetMeRequest request) {
    return super.execute(request);
  }

  @Override
  protected MeResponse doProcess(GetMeRequest request) {
    UUID userId = request.getUserContext().getUserId();
    return authRepository.findById(userId)
      .map(MeResponse::from)
      .orElseThrow(() -> new NotFoundException("User not found"));
  }
}
