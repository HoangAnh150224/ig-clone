import { commentsDB } from "../api/dummyData";

const commentService = {
    /**
     * Get comments by post ID or reel ID.
     * API: GET /api/comments?postId={postId}
     */
    getCommentsByPostId: (postId) => {
        return commentsDB[postId] || [];
    },

    /**
     * BACKEND SETUP: Add new comment
     * API: POST /api/posts/{postId}/comments
     */
    addComment: async (postId, content) => {
        return new Promise((resolve) => {
            console.log(
                `Backend Action: ADDING COMMENT to post ${postId}: ${content}`,
            );
            setTimeout(() => {
                // TODO: Send POST request via axiosClient
                const newComment = {
                    id: `c-new-${Date.now()}`,
                    content,
                    timeAgo: "1m",
                    likedBy: [],
                    replies: [],
                };
                resolve(newComment);
            }, 500);
        });
    },

    /**
     * BACKEND SETUP: Reply to a comment
     * API: POST /api/comments/{commentId}/replies
     */
    addReply: async (commentId, content) => {
        return new Promise((resolve) => {
            console.log(
                `Backend Action: REPLYING to comment ${commentId}: ${content}`,
            );
            setTimeout(() => {
                // TODO: Send POST request via axiosClient
                const newReply = {
                    id: `cr-new-${Date.now()}`,
                    content,
                    timeAgo: "1m",
                    likedBy: [],
                };
                resolve(newReply);
            }, 500);
        });
    },

    /**
     * BACKEND SETUP: Like a comment
     * API: POST /api/comments/{commentId}/like
     */
    toggleLikeComment: async (commentId) => {
        return new Promise((resolve) => {
            console.log(`Backend Action: TOGGLE LIKE for comment ${commentId}`);
            setTimeout(() => {
                resolve();
            }, 300);
        });
    },
};

export default commentService;
