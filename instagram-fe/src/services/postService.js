import axiosClient from "../api/axiosClient";

/**
 * PostService handles all feed, explore, and single post interactions.
 * All responses are unboxed by axiosClient.
 */
const postService = {
    /**
     * Get feed posts for the authenticated user.
     * API: GET /posts/feed
     */
    getFeedPosts: async (page = 0, size = 10) => {
        return axiosClient.get(`/posts/feed?page=${page}&size=${size}`);
    },

    /**
     * Get explore posts (Discovery).
     * API: GET /posts/explore
     */
    getExplorePosts: async (page = 0, size = 10) => {
        return axiosClient.get(`/posts/explore?page=${page}&size=${size}`);
    },

    /**
     * Get post details by ID.
     * API: GET /posts/{postId}
     */
    getPostById: async (postId) => {
        return axiosClient.get(`/posts/${postId}`);
    },

    /**
     * Create new post.
     * API: POST /posts
     */
    createPost: async (formData, onUploadProgress) => {
        return axiosClient.post("/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    },

    /**
     * Delete post by ID.
     * API: DELETE /posts/{postId}
     */
    deletePost: async (postId) => {
        return axiosClient.delete(`/posts/${postId}`);
    },

    /**
     * Toggle Like on a post.
     * API: POST /posts/{postId}/like
     */
    toggleLikePost: async (postId) => {
        return axiosClient.post(`/posts/${postId}/like`);
    },

    /**
     * Toggle Save/Bookmark a post.
     * API: POST /posts/{postId}/save
     */
    toggleSavePost: async (postId) => {
        return axiosClient.post(`/posts/${postId}/save`);
    },

    /**
     * Get users who liked a post.
     * API: GET /posts/{postId}/likes
     */
    getPostLikes: async (postId) => {
        return axiosClient.get(`/posts/${postId}/likes`);
    }
};

export default postService;
