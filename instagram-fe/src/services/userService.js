import axiosClient from "../api/axiosClient";

/**
 * UserService handles user-related API calls.
 */
const userService = {
    /**
     * Search users by query
     * Note: Current backend implementation might not have a direct user search yet, 
     * but we'll prepare the service.
     */
    searchUsers: async (query) => {
        // Backend search endpoint is currently pending in PLAN-BE Phase 8.
        // We'll use the profileService search if available or keep it as placeholder.
        return axiosClient.get(`/users/search?query=${query}`);
    },

    /**
     * Get authenticated user data
     * API: GET /auth/me
     */
    getCurrentUser: async () => {
        return axiosClient.get("/auth/me");
    },

    /**
     * Update user profile
     * API: PATCH /users/me
     */
    updateUserProfile: async (profileData) => {
        return axiosClient.patch("/users/me", profileData);
    },

    /**
     * Follow a user
     * API: POST /users/{userId}/follow
     */
    followUser: async (userId) => {
        return axiosClient.post(`/users/${userId}/follow`);
    },

    /**
     * Get followers list
     * API: GET /users/{userId}/followers
     */
    getFollowersList: async (userId, page = 0, size = 20) => {
        return axiosClient.get(`/users/${userId}/followers?page=${page}&size=${size}`);
    },

    /**
     * Get following list
     * API: GET /users/{userId}/following
     */
    getFollowingList: async (userId, page = 0, size = 20) => {
        return axiosClient.get(`/users/${userId}/following?page=${page}&size=${size}`);
    },

    /**
     * Get favorite users
     * API: GET /users/favorites
     */
    getFavoriteUsers: async () => {
        return axiosClient.get("/users/favorites");
    },

    /**
     * Toggle user in favorites
     * API: POST /users/favorites/{userId}
     */
    toggleFavoriteUser: async (userId) => {
        return axiosClient.post(`/users/favorites/${userId}`);
    },

    /**
     * Get list of blocked users.
     * API: GET /users/blocked
     */
    getBlockedUsers: async (page = 0, size = 20) => {
        return axiosClient.get(`/users/blocked?page=${page}&size=${size}`);
    },

    /**
     * Block or unblock a user
     * API: POST /users/{userId}/block
     */
    blockUser: async (userId) => {
        return axiosClient.post(`/users/${userId}/block`);
    },
};

export default userService;
