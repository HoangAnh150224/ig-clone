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
     * API: GET /users/{username}/posts
     */
    getUserPosts: async (username, page = 0, size = 12) => {
        return axiosClient.get(`/users/${username}/posts?page=${page}&size=${size}`);
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
        return axiosClient.get(`/users/${userId}/followers?page=${page}&size=${size}`);
    },

    /**
     * Get following list.
     * API: GET /users/{userId}/following
     */
    getUserFollowing: async (userId, page = 0, size = 20) => {
        return axiosClient.get(`/users/${userId}/following?page=${page}&size=${size}`);
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
     * Backend doesn't have a clear-all DELETE /search/history yet based on controller,
     * but PLAN-BE says it does. Let's assume it doesn't until verified.
     */
    clearSearchHistory: async () => {
        // Implementation might be needed in backend
        return Promise.resolve();
    },

    /**
     * Get highlights for a specific user.
     * API: GET /users/{username}/highlights
     */
    getUserHighlights: async (username) => {
        return axiosClient.get(`/users/${username}/highlights`);
    },

    /**
     * Create a new Highlight.
     * API: POST /highlights
     */
    createHighlight: async (data) => {
        return axiosClient.post("/highlights", data);
    }
};

export default profileService;
