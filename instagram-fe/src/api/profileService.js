const profileService = {
  getUserProfile: async (username) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: '1',
            username: username || 'antigravity_dev',
            fullName: 'Antigravity Developer',
            avatar: 'https://bit.ly/dan-abramov',
            bio: 'Vibe coding my way to the moon 🚀 | React & Spring Boot Enthusiast',
            website: 'https://github.com/antigravity',
            postCount: 12,
            followerCount: 5400,
            followingCount: 850,
            isFollowing: false,
            isOwnProfile: username === 'antigravity_dev' || !username,
          }
        });
      }, 1000);
    });
  },

  getUserPosts: async (username) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const posts = Array.from({ length: 12 }).map((_, i) => ({
          id: `p${i}`,
          imageUrl: `https://picsum.photos/600/600?random=${i + 100}`,
          likeCount: Math.floor(Math.random() * 500),
          commentCount: Math.floor(Math.random() * 50),
        }));
        resolve({ data: posts });
      }, 1200);
    });
  }
};

export default profileService;
