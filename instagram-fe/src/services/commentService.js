import axiosClient from "../api/axiosClient";

/**
 * CommentService handles comment-related API calls.
 */
const commentService = {
    /**
     * Add a comment to a post.
     * API: POST /posts/{postId}/comments
     */
    addComment: async (postId, content, parentId = null) => {
        return axiosClient.post(`/posts/${postId}/comments`, {
            content,
            parentCommentId: parentId,
        });
    },

    /**
     * Get comments for a post (paginated).
     * API: GET /posts/{postId}/comments
     */
    getComments: async (postId, page = 0, size = 20, parentId = null) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (size) params.append("size", size);
        if (parentId) params.append("parentId", parentId);
        return axiosClient.get(
            `/posts/${postId}/comments?${params.toString()}`,
        );
    },

    /**
     * Delete a comment.
     * API: DELETE /posts/{postId}/comments/{commentId}
     */
    deleteComment: async (postId, commentId) => {
        return axiosClient.delete(`/posts/${postId}/comments/${commentId}`);
    },

    /**
     * Update a comment content.
     * API: PUT /posts/{postId}/comments/{commentId}
     * @param {String} postId
     * @param {String} commentId
     * @param {String} content
     */
    updateComment: async (postId, commentId, content) => {
        return axiosClient.put(`/posts/${postId}/comments/${commentId}`, {
            content,
        });
    },

    /**
     * Toggle like on a comment.
     * API: POST /posts/{postId}/comments/{commentId}/like
     */
    likeComment: async (postId, commentId) => {
        return axiosClient.post(`/posts/${postId}/comments/${commentId}/like`);
    },

    /**
     * Toggle pin on a comment.
     * API: POST /posts/{postId}/comments/{commentId}/pin
     */
    pinComment: async (postId, commentId) => {
        return axiosClient.post(`/posts/${postId}/comments/${commentId}/pin`);
    },
};

export default commentService;
