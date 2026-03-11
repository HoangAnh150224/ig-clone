import axiosClient from "../api/axiosClient";

/**
 * CommentService handles all comment-related API calls.
 */
const commentService = {
    /**
     * Get comments by post ID.
     * API: GET /posts/{postId}/comments
     */
    getCommentsByPostId: async (postId) => {
        return axiosClient.get(`/posts/${postId}/comments`);
    },

    /**
     * Add new comment to a post.
     * API: POST /posts/{postId}/comments
     */
    addComment: async (postId, content) => {
        return axiosClient.post(`/posts/${postId}/comments`, { content });
    },

    /**
     * Reply to a specific comment.
     * API: POST /comments/{commentId}/replies
     */
    addReply: async (commentId, content) => {
        return axiosClient.post(`/comments/${commentId}/replies`, { content });
    },

    /**
     * Toggle Like on a comment.
     * API: POST /comments/{commentId}/like
     */
    toggleLikeComment: async (commentId) => {
        return axiosClient.post(`/comments/${commentId}/like`);
    },

    /**
     * Delete a comment.
     * API: DELETE /comments/{commentId}
     */
    deleteComment: async (commentId) => {
        return axiosClient.delete(`/comments/${commentId}`);
    }
};

export default commentService;
