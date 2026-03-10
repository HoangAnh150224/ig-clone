import { currentUser, userRelationsDB } from '../api/dummyData';

const userService = {
  /**
   * Get the currently authenticated user's full data.
   * TODO: Replace with API call → GET /api/users/me
   */
  getCurrentUser: () => {
    return currentUser;
  },

  /**
   * Get followers list for a given user ID.
   * TODO: Replace with API call → GET /api/users/{userId}/followers
   */
  getFollowersList: (userId) => {
    const data = userRelationsDB[userId] || { followers: [] };
    return data.followers;
  },

  /**
   * Get following list for a given user ID.
   * TODO: Replace with API call → GET /api/users/{userId}/following
   */
  getFollowingList: (userId) => {
    const data = userRelationsDB[userId] || { following: [] };
    return data.following;
  },
};

export default userService;
