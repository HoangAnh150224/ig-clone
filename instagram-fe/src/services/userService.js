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
     * @param {Object} profileData - The fields to update
     * @param {File} avatar - Optional avatar file
     */
    updateUserProfile: async (profileData, avatar = null) => {
        const formData = new FormData();
        
        if (avatar) {
            formData.append("avatar", avatar);
        }

        // Append other fields as request parameters
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== undefined && profileData[key] !== null) {
                formData.append(key, profileData[key]);
            }
        });

        return axiosClient.patch("/users/me", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
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
     * API: GET /users/me/favorites/users
     */
    getFavoriteUsers: async () => {
        return axiosClient.get("/users/me/favorites/users");
    },

    /**
     * Toggle user in favorites
     * API: POST /users/{userId}/favorite
     */
    toggleFavoriteUser: async (userId) => {
        return axiosClient.post(`/users/${userId}/favorite`);
    },

    /**
     * Get list of blocked users.
     * API: GET /users/me/blocked
     */
    getBlockedUsers: async (page = 0, size = 20) => {
        return axiosClient.get(`/users/me/blocked?page=${page}&size=${size}`);
    },

    /**
     * Block or unblock a user
     * API: POST /users/{userId}/block
     */
    blockUser: async (userId) => {
        return axiosClient.post(`/users/${userId}/block`);
    },

    /**
     * Deactivate current user account
     * API: DELETE /users/me
     */
    deactivateAccount: async () => {
        return axiosClient.delete("/users/me");
    },
};

export default userService;
