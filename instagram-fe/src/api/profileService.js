import { allUsers, currentUser, contentDB, userRelationsDB, commentsDB, usersDB } from './dummyData';

const profileService = {
  getUserProfile: async (username) => {
    return new Promise((resolve) => {
      // Tìm User gốc trong usersDB để lấy dữ liệu Stories chi tiết (views, replies)
      const rawUser = Object.values(usersDB).find(u => u.username === username) || 
                      (username === currentUser.username ? usersDB[currentUser.id] : null);

      setTimeout(() => {
        if (!rawUser) {
          resolve({ data: null });
          return;
        }

        const relations = userRelationsDB[rawUser.id] || { followers: [], following: [] };
        const myRelations = userRelationsDB[currentUser.id] || { following: [] };
        const isFollowing = myRelations.following.some(u => u.id === rawUser.id);
        const userPosts = contentDB.posts.filter(p => p.userId === rawUser.id);

        resolve({
          data: {
            ...rawUser, // Chứa mảng stories có đầy đủ views và replies
            isFollowing: isFollowing,
            isOwnProfile: rawUser.id === currentUser.id,
            postCount: userPosts.length, 
            followerCount: relations.followers.length,
            followingCount: relations.following.length,
            bio: rawUser.bio || '',
            website: rawUser.website || '',
            highlights: rawUser.highlights || [],
            settings: rawUser.id === currentUser.id ? {
              privacy: currentUser.privacy || {},
              notifications: currentUser.notifications || {},
              blockedUsers: currentUser.social?.blockedUsers || []
            } : null
          }
        });
      }, 500);
    });
  },

  getSuggestions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const myId = currentUser.id;
        const myFollowingList = userRelationsDB[myId]?.following || [];
        const myFollowingIds = myFollowingList.map(u => u.id);
        
        const filteredUsers = allUsers.filter(user => 
          user.id !== myId && 
          !myFollowingIds.includes(user.id)
        );

        resolve({ data: filteredUsers });
      }, 600);
    });
  },

  getUserPosts: async (username) => {
    return new Promise((resolve) => {
      const user = allUsers.find(u => u.username === username) || 
                   (username === currentUser.username ? currentUser : null);
      
      setTimeout(() => {
        if (!user) {
          resolve({ data: [] });
          return;
        }
        const posts = contentDB.posts
          .filter(p => p.userId === user.id)
          .map(p => ({
            ...p,
            user: user,
            imageUrl: p.media[0].url,
            images: p.media.map(m => m.url),
            commentCount: commentsDB[p.id]?.length || 0,
            likeCount: p.likedBy?.length || 0,
            likedBy: p.likedBy || [],
            timeAgo: '2 HOURS AGO'
          }));
        resolve({ data: posts });
      }, 800);
    });
  }
};

export default profileService;
