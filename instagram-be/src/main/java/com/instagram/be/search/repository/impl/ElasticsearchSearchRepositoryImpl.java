package com.instagram.be.search.repository.impl;

import com.instagram.be.post.Post;
import com.instagram.be.post.document.PostDocument;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.search.repository.SearchRepository;
import com.instagram.be.userprofile.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Elasticsearch-backed search implementation.
 * This should be the primary search repository in production.
 */
@Repository("elasticsearchSearchRepository")
@RequiredArgsConstructor
public class ElasticsearchSearchRepositoryImpl implements SearchRepository {

    private final ElasticsearchOperations elasticsearchOperations;
    private final PostRepository postRepository;

    @Override
    public List<UserProfile> searchUsers(String query, Pageable pageable) {
        Criteria criteria = new Criteria("username").fuzzy(query)
                .or("fullName").fuzzy(query);
        Query searchQuery = new CriteriaQuery(criteria).setPageable(pageable);

        return elasticsearchOperations.search(searchQuery, UserProfile.class)
                .stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
    }

    @Override
    public List<Post> searchPosts(String query, Pageable pageable) {
        Criteria criteria = new Criteria("caption").matches(query);
        Query searchQuery = new CriteriaQuery(criteria).setPageable(pageable);

        List<UUID> postIds = elasticsearchOperations.search(searchQuery, PostDocument.class)
                .stream()
                .map(hit -> hit.getContent().getId())
                .collect(Collectors.toList());

        if (postIds.isEmpty()) {
            return List.of();
        }
        return postRepository.findByIds(postIds);
    }
}
