package com.instagram.be.search.repository;

import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Interface for search operations, allowing for multiple implementations
 * (e.g., database LIKE, Elasticsearch, etc.).
 */
public interface SearchRepository {
    /**
     * Searches for users based on a query string.
     *
     * @param query the search query
     * @param pageable pagination information
     * @return a list of matching user profiles
     */
    List<UserProfile> searchUsers(String query, Pageable pageable);

    /**
     * Searches for posts based on a query string.
     *
     * @param query the search query
     * @param pageable pagination information
     * @return a list of matching posts
     */
    List<Post> searchPosts(String query, Pageable pageable);
}
