import axiosClient from "../api/axiosClient";

/**
 * PostService handles post-related API calls.
 */
const postService = {
    /**
     * Create a new post.
     * API: POST /posts
     * @param {Object} postData - Post metadata including media URLs, caption, type, tags, etc.
     * Expected structure: { caption, type, locationName, media: [{ url, mediaType, displayOrder }], hashtags, taggedUserIds }
     */
    createPost: async (postData) => {
        return axiosClient.post("/posts", postData);
    },

    /**
     * Get a specific post by ID.
     * API: GET /posts/{id}
     */
    getPost: async (id) => {
        return axiosClient.get(`/posts/${id}`);
    },

    /**
     * Get feed posts (cursor-based).
     * API: GET /posts/feed
     */
    getFeedPosts: async (cursor = null, size = 12, type = null) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        if (size) params.append("size", size);
        if (type) params.append("type", type);
        return axiosClient.get(`/posts/feed?${params.toString()}`);
    },

    /**
     * Update an existing post.
     * API: PUT /posts/{id}
     */
    updatePost: async (id, data) => {
        return axiosClient.put(`/posts/${id}`, data);
    },

    /**
     * Report a post.
     * API: POST /posts/{postId}/report
     */
    reportPost: async (postId, reason) => {
        return axiosClient.post(`/posts/${postId}/report`, { reason });
    },

    /**
     * Toggle like on a post.
     * API: POST /posts/{id}/like
     */
    likePost: async (id) => {
        return axiosClient.post(`/posts/${id}/like`);
    },

    /**
     * Toggle save on a post.
     * API: POST /posts/{id}/save
     */
    savePost: async (id) => {
        return axiosClient.post(`/posts/${id}/save`);
    },

    /**
     * Archive a post.
     * API: PATCH /posts/{id}/archive
     */
    archivePost: async (id) => {
        return axiosClient.patch(`/posts/${id}/archive`);
    },

    /**
     * Delete a post.
     * API: DELETE /posts/{id}
     */
    deletePost: async (id) => {
        return axiosClient.delete(`/posts/${id}`);
    },

    /**
     * Get list of users who liked a post.
     * API: GET /posts/{id}/likers
     */
    getPostLikers: async (id, page = 0, size = 20) => {
        return axiosClient.get(`/posts/${id}/likers?page=${page}&size=${size}`);
    },

    /**
     * Record a view on a post.
     * API: POST /posts/{id}/view
     */
    viewPost: async (id) => {
        return axiosClient.post(`/posts/${id}/view`);
    },

    /**
     * Get saved posts for current user.
     * API: GET /posts/saved
     */
    getSavedPosts: async (page = 0, size = 12) => {
        return axiosClient.get(`/posts/saved?page=${page}&size=${size}`);
    },

    /**
     * Get archived posts for current user.
     * API: GET /posts/archive
     */
    getArchivedPosts: async (page = 0, size = 12) => {
        return axiosClient.get(`/posts/archive?page=${page}&size=${size}`);
    },

    /**
     * Get explore posts (paginated).
     * API: GET /posts/explore
     */
    getExplorePosts: async (page = 0, size = 18) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (size) params.append("size", size);
        return axiosClient.get(`/posts/explore?${params.toString()}`);
    },

    /**
     * Get posts tagged with current user.
     * API: GET /posts/tagged/{userId}
     */
    getTaggedPosts: async (userId, page = 0, size = 12) => {
        return axiosClient.get(`/posts/tagged/${userId}?page=${page}&size=${size}`);
    },

    /**
     * Get posts for a specific hashtag (cursor-based).
     * API: GET /posts/hashtags/{name}
     */
    getHashtagPosts: async (name, cursor = null, size = 20) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        if (size) params.append("size", size);
        return axiosClient.get(`/posts/hashtags/${name}?${params.toString()}`);
    },

    /**
     * Toggle favorite status on a post.
     * API: POST /users/me/favorite/posts/{postId}
     */
    togglePostFavorite: async (postId) => {
        return axiosClient.post(`/users/me/favorite/posts/${postId}`);
    },

    /**
     * Get list of favorite posts.
     * API: GET /users/me/favorites/posts
     */
    getFavoritePosts: async (page = 0, size = 12) => {
        return axiosClient.get(`/users/me/favorites/posts?page=${page}&size=${size}`);
    }
};

export default postService;
