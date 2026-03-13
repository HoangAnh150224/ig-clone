package com.instagram.be.search.repository.impl;

import com.instagram.be.post.Post;
import com.instagram.be.post.repository.PostRepository;
import com.instagram.be.search.repository.SearchRepository;
import com.instagram.be.userprofile.UserProfile;
import com.instagram.be.userprofile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Database-backed search implementation using SQL LIKE.
 * This is a temporary solution and should be replaced by a proper
 * full-text search engine like Elasticsearch.
 */
@Repository("databaseSearchRepository")
@RequiredArgsConstructor
public class DatabaseSearchRepositoryImpl implements SearchRepository {

    private final UserProfileRepository userProfileRepository;
    private final PostRepository postRepository;

    @Override
    public List<UserProfile> searchUsers(String query, Pageable pageable) {
        return userProfileRepository.searchByKeyword(query, pageable);
    }

    @Override
    public List<Post> searchPosts(String query, Pageable pageable) {
        return postRepository.searchByKeyword(query, pageable);
    }
}
