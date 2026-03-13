package com.instagram.be.hashtag.service;

import com.instagram.be.base.service.BaseService;
import com.instagram.be.hashtag.repository.HashtagRepository;
import com.instagram.be.hashtag.request.HashtagSearchRequest;
import com.instagram.be.hashtag.response.HashtagSuggestionResponse;
import com.instagram.be.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HashtagSearchService extends BaseService<HashtagSearchRequest, List<HashtagSuggestionResponse>> {

    private final HashtagRepository hashtagRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HashtagSuggestionResponse> execute(HashtagSearchRequest request) {
        return super.execute(request);
    }

    @Override
    protected List<HashtagSuggestionResponse> doProcess(HashtagSearchRequest request) {
        String q = request.getQ();
        if (q == null || q.isBlank()) return List.of();

        int limit = Math.min(request.getLimit(), 20);
        var hashtags = hashtagRepository.findByNameStartingWith(q.toLowerCase(), PageRequest.of(0, limit));

        return hashtags.stream()
                .map(h -> new HashtagSuggestionResponse(h.getName(),
                        postRepository.countByHashtagName(h.getName())))
                .toList();
    }
}
