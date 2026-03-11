import axiosClient from "../api/axiosClient";

/**
 * ProfileService handles user profile and social discovery API calls.
 */
const profileService = {
    /**
     * Get user profile by username.
     * API: GET /users/{username}/profile
     */
    getUserProfile: async (username) => {
        return axiosClient.get(`/users/${username}/profile`);
    },

    /**
     * Get user suggestions (Who to follow).
     * API: GET /users/suggestions
     */
    getSuggestions: async () => {
        return axiosClient.get("/users/suggestions");
    },

    /**
     * Get all posts and reels for a specific user by username.
     * API: GET /users/${username}/posts
     */
    getUserPosts: async (username) => {
        return axiosClient.get(`/users/${username}/posts`);
    },

    /**
     * Add story from Archive to Highlight.
     * API: POST /highlights
     */
    addToHighlight: async (storyId, highlightId = null, newTitle = null) => {
        return axiosClient.post("/highlights", {
            storyId,
            highlightId,
            title: newTitle
        });
    },

    /**
     * Toggle Follow/Unfollow user.
     * API: POST /users/{userId}/follow
     */
    toggleFollow: async (userId) => {
        return axiosClient.post(`/users/${userId}/follow`);
    },
    
    /**
     * Get users who follow this user.
     * API: GET /users/{userId}/followers
     */
    getUserFollowers: async (userId) => {
        return axiosClient.get(`/users/${userId}/followers`);
    },

    /**
     * Get users this user is following.
     * API: GET /users/{userId}/following
     */
    getUserFollowing: async (userId) => {
        return axiosClient.get(`/users/${userId}/following`);
    },

    /**
     * Search users by query.
     * API: GET /users/search?query=...
     */
    searchUsers: async (query) => {
        return axiosClient.get(`/users/search?query=${query}`);
    },

    /**
     * Get recent search history.
     * API: GET /search/history
     */
    getSearchHistory: async () => {
        return axiosClient.get("/search/history");
    },

    /**
     * Add a user to search history.
     * API: POST /search/history
     */
    addToSearchHistory: async (userId) => {
        return axiosClient.post("/search/history", { userId });
    },

    /**
     * Delete a single entry from search history.
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
    }
};

export default profileService;
