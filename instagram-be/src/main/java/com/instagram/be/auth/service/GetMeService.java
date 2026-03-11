package com.instagram.be.auth.service;

import com.instagram.be.auth.repository.AuthRepository;
import com.instagram.be.auth.request.GetMeRequest;
import com.instagram.be.auth.response.MeResponse;
import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetMeService extends BaseService<GetMeRequest, MeResponse> {

    private final AuthRepository authRepository;

    @Override
    protected MeResponse doProcess(GetMeRequest request) {
        UUID userId = request.getUserContext().getUserId();
        return authRepository.findById(userId)
                .map(MeResponse::from)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
