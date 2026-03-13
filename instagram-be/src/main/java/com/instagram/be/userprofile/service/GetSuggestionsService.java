package com.instagram.be.userprofile.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.follow.response.FollowUserResponse;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import com.instagram.be.userprofile.request.GetSuggestionsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetSuggestionsService extends BaseService<GetSuggestionsRequest, List<FollowUserResponse>> {

  private final UserProfileRepository userProfileRepository;

  @Override
  @Transactional(readOnly = true)
  public List<FollowUserResponse> execute(GetSuggestionsRequest request) {
    return super.execute(request);
  }

  @Override
  protected List<FollowUserResponse> doProcess(GetSuggestionsRequest request) {
    UUID currentUserId = request.getUserContext().getUserId();
    int limit = request.getLimit() > 0 ? request.getLimit() : 5;

    List<Object[]> results = userProfileRepository.findSuggestions(currentUserId, PageRequest.of(0, limit));

    return results.stream()
      .map(row -> {
        UserProfile user = (UserProfile) row[0];
        long mutualCount = (long) row[1];
        return FollowUserResponse.of(user, false, mutualCount);
      })
      .collect(Collectors.toList());
  }
}
