import { allUsers, currentUser } from './dummyData';

const profileService = {
  getUserProfile: async (username) => {
    return new Promise((resolve) => {
      const user = allUsers.find(u => u.username === username) || 
                   (username === currentUser.username ? currentUser : null);

      setTimeout(() => {
        if (!user) {
          resolve({ data: null });
          return;
        }
        resolve({
          data: {
            ...user,
            isFollowing: currentUser.following.includes(user.username),
            isOwnProfile: user.username === currentUser.username,
            postCount: user.postCount || 0,
            followerCount: user.followerCount || 0,
            followingCount: user.followingCount || 0,
            bio: user.bio || '',
            website: user.website || '',
            highlights: user.highlights || []
          }
        });
      }, 500);
    });
  },

  getUserPosts: async (username) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = Array.from({ length: 12 }).map((_, i) => ({
          id: `p${i}-${username}`,
          images: [
            `https://picsum.photos/1080/1350?random=${i + 100}`,
            `https://picsum.photos/1080/1350?random=${i + 200}`
          ],
          imageUrl: `https://picsum.photos/1080/1350?random=${i + 100}`,
          likeCount: Math.floor(Math.random() * 5000),
          commentCount: Math.floor(Math.random() * 500),
          user: { username },
          caption: `Post #${i} by ${username}`,
          timeAgo: '2 HOURS AGO',
          createdAt: new Date().toISOString()
        }));
        resolve({ data: posts });
      }, 800);
    });
  }
};

export default profileService;
