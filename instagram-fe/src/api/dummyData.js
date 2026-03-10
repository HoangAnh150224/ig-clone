// src/api/dummyData.js

export const currentUser = {
  id: 'user-0',
  username: 'antigravity_dev',
  fullName: 'Antigravity Developer',
  avatar: 'https://bit.ly/dan-abramov',
  bio: 'Vibe coding my way to the moon 🚀 | React & Spring Boot Enthusiast',
  website: 'https://github.com/antigravity',
  following: ['leomessi', 'cristiano', 'nasa', 'coding_vibes'],
  followerCount: 5400,
  followingCount: 850,
  postCount: 12,
  highlights: [
    { 
      id: 'h0-1', title: 'Coding', cover: 'https://picsum.photos/200/200?random=50',
      stories: [{ id: 's0-h1', url: 'https://picsum.photos/1080/1920?random=51' }]
    },
    { 
      id: 'h0-2', title: 'Setup', cover: 'https://picsum.photos/200/200?random=52',
      stories: [{ id: 's0-h2', url: 'https://picsum.photos/1080/1920?random=53' }]
    }
  ]
};

export const allUsers = [
  { 
    id: 'user-1', 
    username: 'leomessi', 
    fullName: 'Leo Messi', 
    avatar: 'https://bit.ly/kent-c-dodds',
    bio: 'Official Instagram of Leo Messi. ⚽🏆 Campeón del Mundo!',
    website: 'https://www.themessistore.com',
    followerCount: 500000000,
    followingCount: 300,
    postCount: 1150,
    hasStory: true,
    stories: [
      { id: 's1-1', url: 'https://picsum.photos/1080/1920?random=101', timeAgo: '1h' },
      { id: 's1-2', url: 'https://picsum.photos/1080/1920?random=102', timeAgo: '2h' }
    ],
    highlights: [
      { 
        id: 'h1-1', title: 'World Cup', cover: 'https://picsum.photos/200/200?random=60',
        stories: [
          { id: 's1-h1-1', url: 'https://picsum.photos/1080/1920?random=61' },
          { id: 's1-h1-2', url: 'https://picsum.photos/1080/1920?random=62' }
        ]
      },
      { 
        id: 'h1-2', title: 'Family', cover: 'https://picsum.photos/200/200?random=63',
        stories: [{ id: 's1-h2-1', url: 'https://picsum.photos/1080/1920?random=64' }]
      }
    ]
  },
  { 
    id: 'user-2', 
    username: 'cristiano', 
    fullName: 'Cristiano Ronaldo', 
    avatar: 'https://bit.ly/dan-abramov',
    bio: 'SIUUUUUUU! ⚽🇵🇹 | Join my journey.',
    website: 'https://www.cristianoronaldo.com',
    followerCount: 620000000,
    followingCount: 500,
    postCount: 3600,
    hasStory: true,
    stories: [
      { id: 's2-1', url: 'https://picsum.photos/1080/1920?random=201', timeAgo: '3h' }
    ],
    highlights: [
      { 
        id: 'h2-1', title: 'CR7 Museum', cover: 'https://picsum.photos/200/200?random=70',
        stories: [{ id: 's2-h1-1', url: 'https://picsum.photos/1080/1920?random=71' }]
      }
    ]
  },
  { 
    id: 'user-3', username: 'nasa', fullName: 'NASA', avatar: 'https://i.pravatar.cc/150?u=nasa', 
    bio: 'Exploring the universe 🌌🔭', website: 'https://www.nasa.gov',
    followerCount: 98000000, followingCount: 50, postCount: 4500, hasStory: true,
    highlights: []
  },
  { 
    id: 'user-4', username: 'coding_vibes', fullName: 'Coding Vibes', avatar: 'https://i.pravatar.cc/150?u=code', 
    bio: 'Code inspiration 💻🔥', website: 'https://vibecoding.com',
    followerCount: 120000, followingCount: 200, postCount: 300, hasStory: true,
    highlights: []
  }
];

export const commentsDB = {
  'post-1': [
    { id: 'c1', user: allUsers[0], content: 'The best player ever! 🐐', timeAgo: '1h', likeCount: 1200, replies: [] }
  ],
  'reel-1': [
    { 
      id: 'rc1', user: allUsers[3], content: 'That slow motion is sick! 🔥', timeAgo: '4d', likeCount: 15400,
      replies: [{ id: 'rr1', user: allUsers[0], content: 'Thanks!', timeAgo: '3d', likeCount: 120 }]
    }
  ]
};

export const allPosts = [
  {
    id: 'post-1',
    user: allUsers[0],
    images: ['https://picsum.photos/1080/1350?random=11'],
    caption: 'Vibe coding with Antigravity! 🚀',
    likeCount: 12450,
    commentCount: 45,
    timeAgo: '2 HOURS AGO',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const allReels = [
  {
    id: 'reel-1',
    user: allUsers[0],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJmZzRyeXN6YngycXlxNXFyeXN6YngycXlxNXFyeXN6YngycXlxNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMGpxxS1UCvLA4/giphy.gif',
    caption: 'Messi skills ⚽✨',
    likeCount: '1.2M',
    commentCount: '45K',
    music: 'GOAT Anthem',
    timeAgo: '4d'
  }
];

export const chatMessages = {
  'leomessi': [{ id: 1, sender: 'other', text: 'Hey bro!', time: '10:00 AM' }]
};

export const notifications = [
  { id: 1, type: 'like', user: allUsers[0], content: 'liked your photo.', timeAgo: '2h' },
  { id: 2, type: 'follow', user: allUsers[1], content: 'started following you.', timeAgo: '5h' },
  { id: 3, type: 'comment', user: allUsers[3], content: 'commented: "Amazing! ❤️"', timeAgo: '1d' },
  { id: 4, type: 'follow', user: allUsers[2], content: 'started following you.', timeAgo: '2d' }
];
