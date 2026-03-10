import { commentsDB } from '../api/dummyData';

const commentService = {
  /**
   * Get comments by post ID or reel ID.
   * TODO: Replace with API call → GET /api/comments?postId={postId}
   */
  getCommentsByPostId: (postId) => {
    return commentsDB[postId] || [];
  },
};

export default commentService;
