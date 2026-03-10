import { allPosts, userRelationsDB } from '../api/dummyData';

const postService = {
  /**
   * Get feed posts for the authenticated user (own posts + following posts).
   * TODO: Replace with API call → GET /api/posts/feed?userId={userId}
   */
  getFeedPosts: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followingIds = userRelationsDB[userId]?.following.map(u => u.id) || [];
        const feedPosts = allPosts.filter(post =>
          post.userId === userId || followingIds.includes(post.userId)
        );
        resolve({ data: feedPosts });
      }, 300);
    });
  },

  /**
   * Get explore posts (posts from users NOT followed by the authenticated user).
   * TODO: Replace with API call → GET /api/posts/explore?userId={userId}
   */
  getExplorePosts: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followingIds = userRelationsDB[userId]?.following.map(u => u.id) || [];
        const explorePosts = allPosts.filter(post =>
          post.userId !== userId && !followingIds.includes(post.userId)
        );
        resolve({ data: explorePosts });
      }, 300);
    });
  },
};

export default postService;
