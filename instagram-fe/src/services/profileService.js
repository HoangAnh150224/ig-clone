import axiosClient from "../api/axiosClient";

/**
 * ProfileService handles user profile and social discovery API calls.
 */
const profileService = {
    /**
     * Get user profile by username.
     * API: GET /users/{username}
     */
    getUserProfile: async (username) => {
        return axiosClient.get(`/users/${username}`);
    },

    /**
     * Get user suggestions (Who to follow).
     * API: GET /users/suggestions
     */
    getSuggestions: async (limit = 5) => {
        return axiosClient.get(`/users/suggestions?limit=${limit}`);
    },

    /**
     * Get all posts for a specific user.
     * API: GET /posts/user/{username}
     */
    getUserPosts: async (username, page = 0, size = 12) => {
        return axiosClient.get(
            `/posts/user/${username}?page=${page}&size=${size}`,
        );
    },

    /**
     * Toggle Follow/Unfollow user.
     * API: POST /users/{userId}/follow
     */
    toggleFollow: async (userId) => {
        return axiosClient.post(`/users/${userId}/follow`);
    },

    /**
     * Get followers list.
     * API: GET /users/{userId}/followers
     */
    getUserFollowers: async (userId, page = 0, size = 20) => {
        return axiosClient.get(
            `/users/${userId}/followers?page=${page}&size=${size}`,
        );
    },

    /**
     * Get following list.
     * API: GET /users/{userId}/following
     */
    getUserFollowing: async (userId, page = 0, size = 20) => {
        return axiosClient.get(
            `/users/${userId}/following?page=${page}&size=${size}`,
        );
    },

    /**
     * Search users by query.
     */
    searchUsers: async (query) => {
        return axiosClient.get(`/search?q=${query}`);
    },

    /**
     * Get search history.
     * API: GET /search/history
     */
    getSearchHistory: async () => {
        return axiosClient.get("/search/history");
    },

    /**
     * Add user to search history.
     * API: POST /search/history
     */
    addToSearchHistory: async (searchedUserId) => {
        return axiosClient.post("/search/history", { searchedUserId });
    },

    /**
     * Delete a search history item.
     * API: DELETE /search/history/{id}
     */
    deleteSearchHistory: async (id) => {
        return axiosClient.delete(`/search/history/${id}`);
    },

    /**
     * Clear all search history.
     * API: DELETE /search/history
     */
    clearSearchHistory: async () => {
        return axiosClient.delete("/search/history");
    },

    /**
     * Remove a follower from current user's followers list.
     * API: DELETE /users/followers/{userId}
     */
    removeFollower: async (userId) => {
        return axiosClient.delete(`/users/followers/${userId}`);
    },

    /**
     * Get follow requests for the current user.
     * API: GET /users/follow-requests
     */
    getFollowRequests: async (page = 0, size = 20) => {
        return axiosClient.get(
            `/users/follow-requests?page=${page}&size=${size}`,
        );
    },

    /**
     * Accept a follow request.
     * API: POST /users/{userId}/follow/accept
     */
    acceptFollowRequest: async (userId) => {
        return axiosClient.post(`/users/${userId}/follow/accept`);
    },

    /**
     * Decline a follow request.
     * API: POST /users/{userId}/follow/decline
     */
    declineFollowRequest: async (userId) => {
        return axiosClient.post(`/users/${userId}/follow/decline`);
    },

    /**
     * Get highlights for a specific user.
     * API: GET /users/{username}/highlights
     */
    getUserHighlights: async (username) => {
        return axiosClient.get(`/users/${username}/highlights`);
    },

    /**
     * Get stories inside a specific highlight.
     * API: GET /highlights/{id}/stories
     */
    getHighlightStories: async (id) => {
        return axiosClient.get(`/highlights/${id}/stories`);
    },

    /**
     * Create a new Highlight.
     * API: POST /highlights
     * @param {File} cover - Optional cover image file
     * @param {Object} data - Highlight metadata (name, storyIds)
     */
    createHighlight: async (cover, data) => {
        const formData = new FormData();

        if (cover) {
            formData.append("cover", cover);
        }

        // Append data as JSON string (Backend uses @RequestPart("data"))
        formData.append(
            "data",
            new Blob([JSON.stringify(data)], {
                type: "application/json",
            }),
        );

        return axiosClient.post("/highlights", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    /**
     * Delete a highlight.
     * API: DELETE /highlights/{id}
     */
    deleteHighlight: async (id) => {
        return axiosClient.delete(`/highlights/${id}`);
    },

    /**
     * Add a story to an existing highlight.
     * API: POST /highlights/{id}/stories
     */
    addStoryToHighlight: async (highlightId, storyId) => {
        return axiosClient.post(`/highlights/${highlightId}/stories`, {
            storyId,
        });
    },

    /**
     * Search hashtags by name.
     * API: GET /hashtags/search
     */
    searchHashtags: async (query, limit = 10) => {
        return axiosClient.get(`/hashtags/search?q=${query}&limit=${limit}`);
    },
};

export default profileService;
