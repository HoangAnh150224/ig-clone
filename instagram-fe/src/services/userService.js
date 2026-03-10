import { currentUser, userRelationsDB, genderOptions, allUsers, usersDB } from '../api/dummyData';

const userService = {
  /**
   * Search users by query
   * API: GET /api/users/search?query={text}
   */
  searchUsers: async (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || query.trim() === '') {
          return resolve([]);
        }
        
        const lowerQuery = query.toLowerCase();
        const results = allUsers.filter(user => 
          user.username.toLowerCase().includes(lowerQuery) || 
          user.fullName.toLowerCase().includes(lowerQuery)
        );
        
        resolve(results);
      }, 300);
    });
  },

  /**
   * Get authenticated user data
   * API: GET /api/users/me
   */
  getCurrentUser: () => {
    return currentUser;
  },

  /**
   * Get available gender options
   */
  getGenderOptions: () => {
    return genderOptions;
  },

  /**
   * Update user profile
   * API: PUT /api/users/profile
   */
  updateUserProfile: async (profileData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(currentUser, profileData);
        resolve(currentUser);
      }, 500);
    });
  },

  /**
   * Follow a user
   * API: POST /api/users/{userId}/follow
   */
  followUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  },

  /**
   * Unfollow a user
   * API: DELETE /api/users/{userId}/follow
   */
  unfollowUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  },

  /**
   * Get followers list
   * API: GET /api/users/{userId}/followers
   */
  getFollowersList: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = userRelationsDB[userId] || { followers: [] };
        resolve(data.followers);
      }, 200);
    });
  },

  /**
   * Get following list
   * API: GET /api/users/{userId}/following
   */
  getFollowingList: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = userRelationsDB[userId] || { following: [] };
        resolve(data.following);
      }, 200);
    });
  },

  /**
   * Get favorite users
   * API: GET /api/users/favorites
   */
  getFavoriteUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const favIds = usersDB['u-001'].favoriteUserIds || [];
        resolve(favIds); 
      }, 300);
    });
  },

  /**
   * Toggle user in favorites
   * API: POST /api/users/favorites/{userId}
   */
  toggleFavoriteUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const favs = usersDB['u-001'].favoriteUserIds || [];
        if (favs.includes(userId)) {
          usersDB['u-001'].favoriteUserIds = favs.filter(id => id !== userId);
        } else {
          usersDB['u-001'].favoriteUserIds = [...favs, userId];
        }
        resolve();
      }, 300);
    });
  }
};

export default userService;
