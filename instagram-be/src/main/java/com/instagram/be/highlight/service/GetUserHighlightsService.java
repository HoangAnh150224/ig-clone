package com.instagram.be.highlight.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.exception.NotFoundException;
import com.instagram.be.highlight.repository.HighlightRepository;
import com.instagram.be.highlight.request.GetUserHighlightsRequest;
import com.instagram.be.highlight.response.HighlightResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetUserHighlightsService extends BaseService<GetUserHighlightsRequest, List<HighlightResponse>> {

    private final UserProfileRepository userProfileRepository;
    private final HighlightRepository highlightRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HighlightResponse> execute(GetUserHighlightsRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<HighlightResponse> doProcess(GetUserHighlightsRequest request) {
        UserProfile user = userProfileRepository.findByUsername(request.getTargetUsername())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.getTargetUsername()));

        return highlightRepository.findByUserId(user.getId()).stream()
                .map(HighlightResponse::from)
                .toList();
    }
}
