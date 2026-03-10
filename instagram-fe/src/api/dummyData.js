// src/api/dummyData.js

/**
 * 1. TRUNG TÂM NGƯỜI DÙNG (USERS DATABASE)
 * Chứa thông tin gốc của tất cả tài khoản
 */
export const usersDB = {
  'u-001': { 
    id: 'u-001', username: 'antigravity_dev', fullName: 'Antigravity Developer', 
    avatar: 'https://bit.ly/dan-abramov', bio: 'Senior AI Orchestrator 🚀 | Coding the future with React & Spring Boot.', 
    website: 'https://github.com/antigravity', isVerified: true, hasStory: true,
    stories: [
      { 
        id: 's0-1', url: 'https://picsum.photos/1080/1920?random=100', 
        views: [
          { id: 'u-002', username: 'leomessi', avatar: 'https://bit.ly/kent-c-dodds', liked: true },
          { id: 'u-003', username: 'cristiano', avatar: 'https://bit.ly/dan-abramov', liked: false },
          { id: 'u-005', username: 'nasa', avatar: 'https://i.pravatar.cc/150?u=nasa', liked: true },
        ], 
        replies: [{ id: 'rep-1', user: { username: 'leomessi', avatar: 'https://bit.ly/kent-c-dodds' }, text: 'Great work! 🔥', time: '2h' }] 
      }
    ],
    highlights: [
      { 
        id: 'h0-1', title: 'Coding', cover: 'https://picsum.photos/200/200?random=50', 
        stories: [
          { 
            id: 's0-h1', url: 'https://picsum.photos/1080/1920?random=51',
            views: [
              { id: 'u-007', username: 'coding_vibes', avatar: 'https://i.pravatar.cc/150?u=dev', liked: true },
              { id: 'u-012', username: 'tech_insider', avatar: 'https://i.pravatar.cc/150?u=tech', liked: true },
            ],
            replies: [
              { id: 'hrep-1', user: { username: 'coding_vibes', avatar: 'https://i.pravatar.cc/150?u=dev' }, text: 'Love the setup!', time: '1w' }
            ]
          } 
        ] 
      },
      { 
        id: 'h0-2', title: 'Office', cover: 'https://picsum.photos/200/200?random=52', 
        stories: [
          { 
            id: 's0-h2', url: 'https://picsum.photos/1080/1920?random=53',
            views: [
              { id: 'u-004', username: 'nike', avatar: 'https://i.pravatar.cc/150?u=nike', liked: false },
              { id: 'u-008', username: 'pixel_art', avatar: 'https://i.pravatar.cc/150?u=art', liked: true },
            ],
            replies: []
          } 
        ] 
      }
    ]
  },
  'u-002': { 
    id: 'u-002', username: 'leomessi', fullName: 'Leo Messi', avatar: 'https://bit.ly/kent-c-dodds', 
    bio: '⚽🏆 Campeón del Mundo! | Familia, fútbol y mates.', website: 'https://themessistore.com', 
    isVerified: true, hasStory: true, stories: [{ id: 's1-1', url: 'https://picsum.photos/1080/1920?random=101' }],
    highlights: [{ id: 'h1', title: 'Qatar', cover: 'https://picsum.photos/200/200?random=60', stories: [{id: 's1-h1', url: 'https://picsum.photos/1080/1920?random=1'}] }]
  },
  'u-003': { 
    id: 'u-003', username: 'cristiano', fullName: 'Cristiano Ronaldo', avatar: 'https://bit.ly/dan-abramov', 
    bio: 'Love this game! ⚽🇵🇹 | Fitness, Family, and Business.', website: 'https://cristianoronaldo.com', 
    isVerified: true, hasStory: true, stories: [{ id: 's2-1', url: 'https://picsum.photos/1080/1920?random=201' }], highlights: [] 
  },
  'u-004': { id: 'u-004', username: 'nike', fullName: 'Nike', avatar: 'https://i.pravatar.cc/150?u=nike', bio: 'Just Do It. 👟✔️', website: 'https://nike.com', isVerified: true, hasStory: true, stories: [{ id: 's3-1', url: 'https://picsum.photos/1080/1920?random=301' }], highlights: [] },
  'u-005': { id: 'u-005', username: 'nasa', fullName: 'NASA', avatar: 'https://i.pravatar.cc/150?u=nasa', bio: 'Exploring the secrets of the universe for the benefit of all. 🌌', website: 'https://nasa.gov', isVerified: true, hasStory: true, stories: [{ id: 's4-1', url: 'https://picsum.photos/1080/1920?random=401' }], highlights: [] },
  'u-006': { id: 'u-006', username: 'natgeo', fullName: 'National Geographic', avatar: 'https://i.pravatar.cc/150?u=natgeo', bio: 'Experience the world through the eyes of our explorers. 🌍', website: 'https://natgeo.com', isVerified: true, hasStory: true, stories: [{ id: 's5-1', url: 'https://picsum.photos/1080/1920?random=501' }], highlights: [] },
  'u-007': { id: 'u-007', username: 'coding_vibes', fullName: 'Code & Coffee', avatar: 'https://i.pravatar.cc/150?u=dev', bio: 'Sharing the daily life of a fullstack developer. 💻☕', website: 'https://dev.to', isVerified: false, hasStory: true, stories: [{ id: 's6-1', url: 'https://picsum.photos/1080/1920?random=601' }], highlights: [] },
  'u-008': { id: 'u-008', username: 'pixel_art', fullName: 'Digital Artist', avatar: 'https://i.pravatar.cc/150?u=art', bio: 'Pixels and Brushes. 🎨✨', website: 'https://behance.net', isVerified: false, hasStory: false, stories: [], highlights: [] },
  'u-009': { id: 'u-009', username: 'traveler_pro', fullName: 'Marco Polo', avatar: 'https://i.pravatar.cc/150?u=travel', bio: 'Wanderlust. ✈️🌍', website: 'https://travel.com', isVerified: false, hasStory: true, stories: [{ id: 's7-1', url: 'https://picsum.photos/1080/1920?random=701' }], highlights: [] },
  'u-010': { id: 'u-010', username: 'fitness_king', fullName: 'Alex Iron', avatar: 'https://i.pravatar.cc/150?u=gym', bio: 'No Pain No Gain. 💪🔥', website: 'https://fitness.com', isVerified: false, hasStory: false, stories: [], highlights: [] },
  'u-011': { id: 'u-011', username: 'foodie_queen', fullName: 'Sarah Chef', avatar: 'https://i.pravatar.cc/150?u=food', bio: 'Cooking with love. 🍳❤️', website: 'https://sarahscookbook.com', isVerified: false, hasStory: true, stories: [{ id: 's8-1', url: 'https://picsum.photos/1080/1920?random=801' }], highlights: [] },
  'u-012': { id: 'u-012', username: 'tech_insider', fullName: 'Tech News', avatar: 'https://i.pravatar.cc/150?u=tech', bio: 'Latest updates from the world of technology. 📱💡', website: 'https://techcrunch.com', isVerified: true, hasStory: false, stories: [], highlights: [] },
};

/**
 * 2. HỆ THỐNG QUAN HỆ (RELATIONS)
 * Định nghĩa ai đang theo dõi ai
 */
export const userRelationsDB = {
  'u-001': { 
    following: [usersDB['u-002'], usersDB['u-003'], usersDB['u-005'], usersDB['u-006'], usersDB['u-007'], usersDB['u-012']], 
    followers: [usersDB['u-002'], usersDB['u-003'], usersDB['u-004'], usersDB['u-008'], usersDB['u-011']] 
  },
  'u-002': { following: [usersDB['u-001'], usersDB['u-003'], usersDB['u-004']], followers: [usersDB['u-001'], usersDB['u-003'], usersDB['u-005']] },
  'u-003': { following: [usersDB['u-001'], usersDB['u-002'], usersDB['u-004']], followers: [usersDB['u-001'], usersDB['u-002'], usersDB['u-006']] },
  'u-004': { following: [usersDB['u-001'], usersDB['u-002'], usersDB['u-003']], followers: [usersDB['u-001'], usersDB['u-002']] },
  'u-005': { following: [usersDB['u-001'], usersDB['u-006']], followers: [usersDB['u-001'], usersDB['u-004'], usersDB['u-012']] },
  'u-006': { following: [usersDB['u-001'], usersDB['u-005']], followers: [usersDB['u-001'], usersDB['u-003'], usersDB['u-009']] },
  'u-007': { following: [usersDB['u-001'], usersDB['u-008']], followers: [usersDB['u-001'], usersDB['u-010']] },
  'u-008': { following: [usersDB['u-001'], usersDB['u-007']], followers: [usersDB['u-001'], usersDB['u-007']] },
  'u-009': { following: [usersDB['u-001'], usersDB['u-006']], followers: [usersDB['u-001']] },
  'u-010': { following: [usersDB['u-007']], followers: [usersDB['u-001'], usersDB['u-010']] },
  'u-011': { following: [usersDB['u-001'], usersDB['u-008']], followers: [usersDB['u-001']] },
  'u-012': { following: [usersDB['u-001'], usersDB['u-005']], followers: [usersDB['u-001']] },
};

/**
 * 3. KHO BÌNH LUẬN (COMMENTS DATABASE)
 */
export const commentsDB = {
  'p-m1': [
    { id: 'c-1', user: usersDB['u-001'], content: 'Legend! 🐐', timeAgo: '1h', likedBy: [usersDB['u-002'], usersDB['u-003']], replies: [{ id: 'cr-1', user: usersDB['u-002'], content: 'Thanks dev!', timeAgo: '30m', likedBy: [usersDB['u-001']] }] },
    { id: 'c-2', user: usersDB['u-003'], content: 'The best to ever do it.', timeAgo: '2h', likedBy: [usersDB['u-001']], replies: [] },
  ],
  'p-a1': [
    { id: 'c-3', user: usersDB['u-002'], content: 'Nice setup! What VS Code theme is that?', timeAgo: '2h', likedBy: [usersDB['u-001']], replies: [] },
    { id: 'c-4', user: usersDB['u-007'], content: 'React for the win! 🚀', timeAgo: '5h', likedBy: [usersDB['u-001']], replies: [] }
  ],
  'p-n1': [
    { id: 'c-5', user: usersDB['u-001'], content: 'Clean designs as always. 🔥', timeAgo: '1d', likedBy: [usersDB['u-004']], replies: [] }
  ],
  'r-001': [
    { id: 'rc-1', user: usersDB['u-003'], content: 'Incredible skills Leo! ⚽', timeAgo: '4d', likedBy: [usersDB['u-001']], replies: [] }
  ]
};

/**
 * 4. KHO NỘI DUNG (POSTS & REELS)
 */
export const contentDB = {
  posts: [
    { id: 'p-a1', userId: 'u-001', media: [{ url: 'https://picsum.photos/1080/1350?random=100' }], caption: 'Building the next gen Instagram clone with React & Chakra UI. 🚀 #coding #reactjs', likedBy: [usersDB['u-002'], usersDB['u-003'], usersDB['u-007']], createdAt: '2024-03-10T12:00:00Z' },
    { id: 'p-m1', userId: 'u-002', media: [{ url: 'https://picsum.photos/1080/1350?random=10' }, { url: 'https://picsum.photos/1080/1350?random=11' }], caption: 'Another day, another goal. 🇦🇷 #football #victory', likedBy: [usersDB['u-001'], usersDB['u-003']], createdAt: '2024-03-09T10:00:00Z' },
    { id: 'p-c1', userId: 'u-003', media: [{ url: 'https://picsum.photos/1080/1350?random=20' }], caption: 'Focused. 💪 #training #cr7', likedBy: [usersDB['u-001'], usersDB['u-002']], createdAt: '2024-03-09T15:00:00Z' },
    { id: 'p-n1', userId: 'u-004', media: [{ url: 'https://picsum.photos/1080/1350?random=30' }], caption: 'Innovation is our DNA. ✔️ #nike', likedBy: [usersDB['u-001'], usersDB['u-005']], createdAt: '2024-03-09T08:00:00Z' },
    { id: 'p-na1', userId: 'u-005', media: [{ url: 'https://picsum.photos/1080/1350?random=40' }], caption: 'Behold the Crab Nebula. 🌌 #space #nasa', likedBy: [usersDB['u-001'], usersDB['u-006']], createdAt: '2024-03-08T20:00:00Z' },
    { id: 'p-ng1', userId: 'u-006', media: [{ url: 'https://picsum.photos/1080/1350?random=50' }], caption: 'The migration has begun. 🐘 #nature #wildlife', likedBy: [usersDB['u-005'], usersDB['u-009']], createdAt: '2024-03-07T09:00:00Z' },
    { id: 'p-cv1', userId: 'u-007', media: [{ url: 'https://picsum.photos/1080/1350?random=60' }], caption: 'Coffee + Code = Life. ☕💻', likedBy: [usersDB['u-001']], createdAt: '2024-03-10T08:00:00Z' },
    { id: 'p-pa1', userId: 'u-008', media: [{ url: 'https://picsum.photos/1080/1350?random=70' }], caption: 'New character design for my indie game. 🎨', likedBy: [usersDB['u-007']], createdAt: '2024-03-08T14:00:00Z' },
    { id: 'p-tr1', userId: 'u-009', media: [{ url: 'https://picsum.photos/1080/1350?random=80' }], caption: 'Sunset in Santorini. 🌅 #travel', likedBy: [usersDB['u-001'], usersDB['u-006']], createdAt: '2024-03-06T18:00:00Z' },
    { id: 'p-fk1', userId: 'u-010', media: [{ url: 'https://picsum.photos/1080/1350?random=90' }], caption: 'Deadlift day. 400lbs. 🏋️‍♂️', likedBy: [usersDB['u-007']], createdAt: '2024-03-10T17:00:00Z' },
    { id: 'p-fq1', userId: 'u-011', media: [{ url: 'https://picsum.photos/1080/1350?random=22' }], caption: 'Homemade Italian Pasta. 🍝', likedBy: [usersDB['u-001']], createdAt: '2024-03-10T19:00:00Z' },
    { id: 'p-ti1', userId: 'u-012', media: [{ url: 'https://picsum.photos/1080/1350?random=33' }], caption: 'Apple announces new Silicon. 💻 #tech', likedBy: [usersDB['u-001'], usersDB['u-005']], createdAt: '2024-03-10T22:00:00Z' }
  ],
  reels: [
    { id: 'r-001', userId: 'u-002', gifUrl: 'https://media.giphy.com/media/3o7TKMGpxxS1UCvLA4/giphy.gif', caption: 'Messi Magic! ⚽', likedBy: [usersDB['u-001'], usersDB['u-003']], music: 'Messi Song', user: usersDB['u-002'] },
    { id: 'r-002', userId: 'u-003', gifUrl: 'https://media.giphy.com/media/hryis7AOdJgBXczSdB/giphy.gif', caption: 'SIUUUU! 🐐', likedBy: [usersDB['u-001'], usersDB['u-002']], music: 'CR7 Vibe', user: usersDB['u-003'] },
    { id: 'r-003', userId: 'u-006', gifUrl: 'https://media.giphy.com/media/l41lTjJpSshXcyByM/giphy.gif', caption: 'Nature is wild. 🌊', likedBy: [usersDB['u-005']], music: 'Earth Vibe', user: usersDB['u-006'] }
  ]
};

/**
 * 5. EXPORT CHO UI
 */
export const currentUser = { ...usersDB['u-001'], email: 'dev@antigravity.io', phoneNumber: '+84 901 234 567', gender: 'Male', accountType: 'CREATOR', privacy: { isPrivateAccount: false, activityStatus: true, tagPermissions: 'EVERYONE' }, social: { blockedUsers: [] }, notifications: { pauseAll: false, reminders: true } };

export const allUsers = Object.values(usersDB);

export const allPosts = contentDB.posts.map(p => ({
  ...p,
  user: usersDB[p.userId],
  imageUrl: p.media[0].url,
  images: p.media.map(m => m.url),
  commentCount: commentsDB[p.id]?.length || 0,
  likeCount: p.likedBy?.length || 0,
  likedBy: p.likedBy || [],
  timeAgo: '2 HOURS AGO'
}));

export const allReels = contentDB.reels.map(r => ({
  ...r,
  likeCount: r.likedBy?.length || 0,
  likedBy: r.likedBy || [],
  commentCount: commentsDB[r.id]?.length || 0,
  timeAgo: '4d'
}));

export const notifications = [
  { id: 1, type: 'like', user: usersDB['u-002'], content: 'liked your photo.', timeAgo: '2h', postImage: 'https://picsum.photos/1080/1350?random=100', section: 'Today' },
  { id: 2, type: 'follow', user: usersDB['u-003'], content: 'started following you.', timeAgo: '5h', section: 'Today' },
  { id: 3, type: 'comment', user: usersDB['u-005'], content: 'commented: "Amazing work! 🚀"', timeAgo: '1d', postImage: 'https://picsum.photos/1080/1350?random=100', section: 'Yesterday' },
  { id: 4, type: 'mention', user: usersDB['u-002'], content: 'mentioned you in a comment.', timeAgo: '5d', section: 'Earlier' }
];

export const messageRequests = [
  { id: 'req-001', user: usersDB['u-004'], lastMessage: 'Check out new collection.', time: '2h', unread: true },
  { id: 'req-007', user: usersDB['u-011'], lastMessage: 'Loved your pasta recipe!', time: '1d', unread: true }
];

export const chatMessages = {
  'leomessi': [
    { id: 1, sender: 'other', text: 'Hey bro!', time: '10:00 AM' },
    { id: 2, sender: 'me', text: 'Hi Leo!', time: '10:02 AM' },
    { id: 3, sender: 'other', text: 'Great progress on the app!', time: '10:05 AM' }
  ],
  'cristiano': [{ id: 1, sender: 'other', text: 'SIUUUUUU!', time: '9:00 AM' }],
  'nike': [{ id: 1, sender: 'other', text: 'Check out new collection.', time: '2h' }],
  'foodie_queen': [{ id: 1, sender: 'other', text: 'Loved your pasta recipe!', time: '1d' }]
};
