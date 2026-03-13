// src/api/dummyData.js

/**
 * 1. USER CENTER (USERS DATABASE)
 */
export const usersDB = {
    "u-001": {
        id: "u-001",
        username: "alex_lifestyle",
        fullName: "Alex Rivera",
        avatarUrl: "https://bit.ly/dan-abramov",
        bio: "Lifestyle & Photography 📸 | Exploring the world one photo at a time.",
        website: "https://alexrivera.com",
        isVerified: true,
        hasStory: true,
        stories: [
            {
                id: "s0-1",
                url: "https://picsum.photos/1080/1920?random=100",
                views: [
                    {
                        id: "u-002",
                        username: "leomessi",
                        avatarUrl: "https://bit.ly/kent-c-dodds",
                        liked: true,
                    },
                    {
                        id: "u-003",
                        username: "cristiano",
                        avatarUrl: "https://bit.ly/dan-abramov",
                        liked: false,
                    },
                    {
                        id: "u-005",
                        username: "nasa",
                        avatarUrl: "https://i.pravatar.cc/150?u=nasa",
                        liked: true,
                    },
                ],
                replies: [
                    {
                        id: "rep-1",
                        user: {
                            username: "leomessi",
                            avatarUrl: "https://bit.ly/kent-c-dodds",
                        },
                        text: "Incredible shot! 🔥",
                        time: "2h",
                    },
                ],
            },
        ],
        highlights: [
            {
                id: "h0-1",
                title: "Travel",
                cover: "https://picsum.photos/200/200?random=50",
                stories: [
                    {
                        id: "s0-h1",
                        url: "https://picsum.photos/1080/1920?random=51",
                        views: [
                            {
                                id: "u-007",
                                username: "nature_vibes",
                                avatarUrl: "https://i.pravatar.cc/150?u=dev",
                                liked: true,
                            },
                            {
                                id: "u-012",
                                username: "daily_insider",
                                avatarUrl: "https://i.pravatar.cc/150?u=tech",
                                liked: true,
                            },
                        ],
                        replies: [
                            {
                                id: "hrep-1",
                                user: {
                                    username: "nature_vibes",
                                    avatarUrl:
                                        "https://i.pravatar.cc/150?u=dev",
                                },
                                text: "Love this place!",
                                time: "1w",
                            },
                        ],
                    },
                ],
            },
            {
                id: "h0-2",
                title: "Home",
                cover: "https://picsum.photos/200/200?random=52",
                stories: [
                    {
                        id: "s0-h2",
                        url: "https://picsum.photos/1080/1920?random=53",
                        views: [
                            {
                                id: "u-004",
                                username: "nike",
                                avatarUrl: "https://i.pravatar.cc/150?u=nike",
                                liked: false,
                            },
                            {
                                id: "u-008",
                                username: "pixel_art",
                                avatarUrl: "https://i.pravatar.cc/150?u=art",
                                liked: true,
                            },
                        ],
                        replies: [],
                    },
                ],
            },
        ],
        archivedStories: [
            {
                id: "as-1",
                day: "9",
                month: "Mar",
                year: "2026",
                url: "https://picsum.photos/400/700?random=10",
            },
            {
                id: "as-2",
                day: "28",
                month: "Feb",
                year: "",
                url: "https://picsum.photos/400/700?random=11",
            },
            {
                id: "as-3",
                day: "8",
                month: "Feb",
                year: "",
                url: "https://picsum.photos/400/700?random=12",
            },
            {
                id: "as-4",
                day: "7",
                month: "Feb",
                year: "",
                url: "https://picsum.photos/400/700?random=13",
            },
            {
                id: "as-5",
                day: "15",
                month: "Jan",
                year: "",
                url: "https://picsum.photos/400/700?random=14",
            },
            {
                id: "as-6",
                day: "23",
                month: "Jan",
                year: "",
                url: "https://picsum.photos/400/700?random=15",
            },
            {
                id: "as-7",
                day: "1",
                month: "Jan",
                year: "",
                url: "https://picsum.photos/400/700?random=16",
            },
            {
                id: "as-8",
                day: "26",
                month: "Dec",
                year: "2025",
                url: "https://picsum.photos/400/700?random=17",
            },
        ],
        archivedPosts: [
            {
                id: "ap-1",
                userId: "u-001",
                type: "post",
                imageUrl: "https://picsum.photos/1080/1080?random=200",
                caption: "Memories from last summer. ☀️",
                likeCount: 120,
                commentCount: 15,
                createdAt: "2023-07-15T10:00:00Z",
                user: {
                    username: "alex_lifestyle",
                    avatarUrl: "https://bit.ly/dan-abramov",
                },
            },
            {
                id: "ap-2",
                userId: "u-001",
                type: "post",
                imageUrl: "https://picsum.photos/1080/1080?random=201",
                caption: "Quiet moments. ☕",
                likeCount: 85,
                commentCount: 4,
                createdAt: "2023-11-20T15:30:00Z",
                user: {
                    username: "alex_lifestyle",
                    avatarUrl: "https://bit.ly/dan-abramov",
                },
            },
            {
                id: "ap-3",
                userId: "u-001",
                type: "post",
                imageUrl: "https://picsum.photos/1080/1080?random=202",
                caption: "Old adventures. 🏔️",
                likeCount: 210,
                commentCount: 32,
                createdAt: "2023-05-05T08:45:00Z",
                user: {
                    username: "alex_lifestyle",
                    avatarUrl: "https://bit.ly/dan-abramov",
                },
            },
        ],
        favoriteUserIds: ["u-002"],
    },
    "u-002": {
        id: "u-002",
        username: "leomessi",
        fullName: "Leo Messi",
        avatarUrl: "https://bit.ly/kent-c-dodds",
        bio: "⚽🏆 World Champion! | Family, football and mates.",
        website: "https://themessistore.com",
        isVerified: true,
        hasStory: true,
        stories: [
            { id: "s1-1", url: "https://picsum.photos/1080/1920?random=101" },
        ],
        highlights: [
            {
                id: "h1",
                title: "Qatar",
                cover: "https://picsum.photos/200/200?random=60",
                stories: [
                    {
                        id: "s1-h1",
                        url: "https://picsum.photos/1080/1920?random=1",
                    },
                ],
            },
        ],
    },
    "u-003": {
        id: "u-003",
        username: "cristiano",
        fullName: "Cristiano Ronaldo",
        avatarUrl: "https://bit.ly/dan-abramov",
        bio: "Love this game! ⚽🇵🇹 | Fitness, Family, and Business.",
        website: "https://cristianoronaldo.com",
        isVerified: true,
        hasStory: true,
        stories: [
            { id: "s2-1", url: "https://picsum.photos/1080/1920?random=201" },
        ],
        highlights: [],
    },
    "u-004": {
        id: "u-004",
        username: "nike",
        fullName: "Nike",
        avatarUrl: "https://i.pravatar.cc/150?u=nike",
        bio: "Just Do It. 👟✔️",
        website: "https://nike.com",
        isVerified: true,
        hasStory: true,
        stories: [
            { id: "s3-1", url: "https://picsum.photos/1080/1920?random=301" },
        ],
        highlights: [],
    },
    "u-005": {
        id: "u-005",
        username: "nasa",
        fullName: "NASA",
        avatarUrl: "https://i.pravatar.cc/150?u=nasa",
        bio: "Exploring the secrets of the universe for the benefit of all. 🌌",
        website: "https://nasa.gov",
        isVerified: true,
        hasStory: true,
        stories: [
            { id: "s4-1", url: "https://picsum.photos/1080/1920?random=401" },
        ],
        highlights: [],
    },
    "u-006": {
        id: "u-006",
        username: "natgeo",
        fullName: "National Geographic",
        avatarUrl: "https://i.pravatar.cc/150?u=natgeo",
        bio: "Experience the world through the eyes of our explorers. 🌍",
        website: "https://natgeo.com",
        isVerified: true,
        hasStory: true,
        stories: [
            { id: "s5-1", url: "https://picsum.photos/1080/1920?random=501" },
        ],
        highlights: [],
    },
    "u-007": {
        id: "u-007",
        username: "nature_vibes",
        fullName: "Wild Explorers",
        avatarUrl: "https://i.pravatar.cc/150?u=dev",
        bio: "Sharing the beauty of nature and adventure. 🌲🏔️",
        website: "https://nature.com",
        isVerified: false,
        hasStory: true,
        stories: [
            { id: "s6-1", url: "https://picsum.photos/1080/1920?random=601" },
        ],
        highlights: [],
    },
    "u-008": {
        id: "u-008",
        username: "pixel_art",
        fullName: "Digital Artist",
        avatarUrl: "https://i.pravatar.cc/150?u=art",
        bio: "Pixels and Brushes. 🎨✨",
        website: "https://behance.net",
        isVerified: false,
        hasStory: false,
        stories: [],
        highlights: [],
    },
    "u-009": {
        id: "u-009",
        username: "traveler_pro",
        fullName: "Marco Polo",
        avatarUrl: "https://i.pravatar.cc/150?u=travel",
        bio: "Wanderlust. ✈️🌍",
        website: "https://travel.com",
        isVerified: false,
        hasStory: true,
        stories: [
            { id: "s7-1", url: "https://picsum.photos/1080/1920?random=701" },
        ],
        highlights: [],
    },
    "u-010": {
        id: "u-010",
        username: "fitness_king",
        fullName: "Alex Iron",
        avatarUrl: "https://i.pravatar.cc/150?u=gym",
        bio: "No Pain No Gain. 💪🔥",
        website: "https://fitness.com",
        isVerified: false,
        hasStory: false,
        stories: [],
        highlights: [],
    },
    "u-011": {
        id: "u-011",
        username: "foodie_queen",
        fullName: "Sarah Chef",
        avatarUrl: "https://i.pravatar.cc/150?u=food",
        bio: "Cooking with love. 🍳❤️",
        website: "https://sarahscookbook.com",
        isVerified: false,
        hasStory: true,
        stories: [
            { id: "s8-1", url: "https://picsum.photos/1080/1920?random=801" },
        ],
        highlights: [],
    },
    "u-012": {
        id: "u-012",
        username: "daily_insider",
        fullName: "Morning News",
        avatarUrl: "https://i.pravatar.cc/150?u=tech",
        bio: "Latest updates from around the globe. 📱💡",
        website: "https://dailynews.com",
        isVerified: true,
        hasStory: false,
        stories: [],
        highlights: [],
    },
};

/**
 * 2. RELATIONSHIP SYSTEM (RELATIONS)
 */
export const userRelationsDB = {
    "u-001": {
        following: [
            usersDB["u-002"],
            usersDB["u-003"],
            usersDB["u-005"],
            usersDB["u-006"],
            usersDB["u-007"],
            usersDB["u-012"],
        ],
        followers: [
            usersDB["u-002"],
            usersDB["u-003"],
            usersDB["u-004"],
            usersDB["u-008"],
            usersDB["u-011"],
        ],
    },
    "u-002": {
        following: [usersDB["u-001"], usersDB["u-003"], usersDB["u-004"]],
        followers: [usersDB["u-001"], usersDB["u-003"], usersDB["u-005"]],
    },
    "u-003": {
        following: [usersDB["u-001"], usersDB["u-002"], usersDB["u-004"]],
        followers: [usersDB["u-001"], usersDB["u-002"], usersDB["u-006"]],
    },
    "u-004": {
        following: [usersDB["u-001"], usersDB["u-002"], usersDB["u-003"]],
        followers: [usersDB["u-001"], usersDB["u-002"]],
    },
    "u-005": {
        following: [usersDB["u-001"], usersDB["u-006"]],
        followers: [usersDB["u-001"], usersDB["u-004"], usersDB["u-012"]],
    },
    "u-006": {
        following: [usersDB["u-001"], usersDB["u-005"]],
        followers: [usersDB["u-001"], usersDB["u-003"], usersDB["u-009"]],
    },
    "u-007": {
        following: [usersDB["u-001"], usersDB["u-008"]],
        followers: [usersDB["u-001"], usersDB["u-010"]],
    },
    "u-008": {
        following: [usersDB["u-001"], usersDB["u-007"]],
        followers: [usersDB["u-001"], usersDB["u-007"]],
    },
    "u-009": {
        following: [usersDB["u-001"], usersDB["u-006"]],
        followers: [usersDB["u-001"]],
    },
    "u-010": {
        following: [usersDB["u-007"]],
        followers: [usersDB["u-001"], usersDB["u-010"]],
    },
    "u-011": {
        following: [usersDB["u-001"], usersDB["u-008"]],
        followers: [usersDB["u-001"]],
    },
    "u-012": {
        following: [usersDB["u-001"], usersDB["u-005"]],
        followers: [usersDB["u-001"]],
    },
};

/**
 * 3. COMMENT REPOSITORY (COMMENTS DATABASE)
 */
export const commentsDB = {
    "p-m1": [
        {
            id: "c-1",
            user: usersDB["u-001"],
            content: "Legend! 🐐",
            timeAgo: "1h",
            likedBy: [usersDB["u-002"], usersDB["u-003"]],
            replies: [
                {
                    id: "cr-1",
                    user: usersDB["u-002"],
                    content: "Thanks!",
                    timeAgo: "30m",
                    likedBy: [usersDB["u-001"]],
                },
            ],
        },
        {
            id: "c-2",
            user: usersDB["u-003"],
            content: "The best to ever do it.",
            timeAgo: "2h",
            likedBy: [usersDB["u-001"]],
            replies: [],
        },
    ],
    "p-a1": [
        {
            id: "c-3",
            user: usersDB["u-002"],
            content: "Nice shot! What camera is that?",
            timeAgo: "2h",
            likedBy: [usersDB["u-001"]],
            replies: [],
        },
        {
            id: "c-4",
            user: usersDB["u-007"],
            content: "Love the vibes! 🚀",
            timeAgo: "5h",
            likedBy: [usersDB["u-001"]],
            replies: [],
        },
    ],
    "p-n1": [
        {
            id: "c-5",
            user: usersDB["u-001"],
            content: "Clean designs as always. 🔥",
            timeAgo: "1d",
            likedBy: [usersDB["u-004"]],
            replies: [],
        },
    ],
    "r-001": [
        {
            id: "rc-1",
            user: usersDB["u-003"],
            content: "Incredible skills Leo! ⚽",
            timeAgo: "4d",
            likedBy: [usersDB["u-001"]],
            replies: [],
        },
    ],
};

/**
 * 4. CONTENT REPOSITORY (POSTS & REELS)
 */
export const contentDB = {
    posts: [
        {
            id: "p-a1",
            userId: "u-001",
            shareUrl: "http://localhost:5173/p/p-a1",
            media: [{ url: "https://picsum.photos/1080/1350?random=100" }],
            caption:
                "Chasing sunsets and good vibes only. 🌅 #photography #nature",
            likedBy: [usersDB["u-002"], usersDB["u-003"], usersDB["u-007"]],
            createdAt: "2024-03-10T12:00:00Z",
        },
        {
            id: "p-m1",
            userId: "u-002",
            shareUrl: "http://localhost:5173/p/p-m1",
            media: [
                { url: "https://picsum.photos/1080/1350?random=10" },
                { url: "https://picsum.photos/1080/1350?random=11" },
            ],
            caption: "Another day, another goal. 🇦🇷 #football #victory",
            likedBy: [usersDB["u-001"], usersDB["u-003"]],
            createdAt: "2024-03-09T10:00:00Z",
        },
        {
            id: "p-c1",
            userId: "u-003",
            shareUrl: "http://localhost:5173/p/p-c1",
            media: [{ url: "https://picsum.photos/1080/1350?random=20" }],
            caption: "Focused. 💪 #training #cr7",
            likedBy: [usersDB["u-001"], usersDB["u-002"]],
            createdAt: "2024-03-09T15:00:00Z",
        },
        {
            id: "p-n1",
            userId: "u-004",
            shareUrl: "http://localhost:5173/p/p-n1",
            media: [{ url: "https://picsum.photos/1080/1350?random=30" }],
            caption: "Innovation is our DNA. ✔️ #nike",
            likedBy: [usersDB["u-001"], usersDB["u-005"]],
            createdAt: "2024-03-09T08:00:00Z",
        },
        {
            id: "p-na1",
            userId: "u-005",
            shareUrl: "http://localhost:5173/p/p-na1",
            media: [{ url: "https://picsum.photos/1080/1350?random=40" }],
            caption: "Behold the Crab Nebula. 🌌 #space #nasa",
            likedBy: [usersDB["u-001"], usersDB["u-006"]],
            createdAt: "2024-03-08T20:00:00Z",
        },
        {
            id: "p-ng1",
            userId: "u-006",
            shareUrl: "http://localhost:5173/p/p-ng1",
            media: [{ url: "https://picsum.photos/1080/1350?random=50" }],
            caption: "The migration has begun. 🐘 #nature #wildlife",
            likedBy: [usersDB["u-005"], usersDB["u-009"]],
            createdAt: "2024-03-07T09:00:00Z",
        },
        {
            id: "p-cv1",
            userId: "u-007",
            shareUrl: "http://localhost:5173/p/p-cv1",
            media: [{ url: "https://picsum.photos/1080/1350?random=60" }],
            caption: "Coffee + Nature = Life. ☕🏔️",
            likedBy: [usersDB["u-001"]],
            createdAt: "2024-03-10T08:00:00Z",
        },
        {
            id: "p-pa1",
            userId: "u-008",
            shareUrl: "http://localhost:5173/p/p-pa1",
            media: [{ url: "https://picsum.photos/1080/1350?random=70" }],
            caption: "New character design for my indie game. 🎨",
            likedBy: [usersDB["u-007"]],
            createdAt: "2024-03-08T14:00:00Z",
        },
        {
            id: "p-tr1",
            userId: "u-009",
            shareUrl: "http://localhost:5173/p/p-tr1",
            media: [{ url: "https://picsum.photos/1080/1350?random=80" }],
            caption: "Sunset in Santorini. 🌅 #travel",
            likedBy: [usersDB["u-001"], usersDB["u-006"]],
            createdAt: "2024-03-06T18:00:00Z",
        },
        {
            id: "p-fk1",
            userId: "u-010",
            shareUrl: "http://localhost:5173/p/p-fk1",
            media: [{ url: "https://picsum.photos/1080/1350?random=90" }],
            caption: "Deadlift day. 400lbs. 🏋️‍♂️",
            likedBy: [usersDB["u-007"]],
            createdAt: "2024-03-10T17:00:00Z",
        },
        {
            id: "p-fq1",
            userId: "u-011",
            shareUrl: "http://localhost:5173/p/p-fq1",
            media: [{ url: "https://picsum.photos/1080/1350?random=22" }],
            caption: "Homemade Italian Pasta. 🍝",
            likedBy: [usersDB["u-001"]],
            createdAt: "2024-03-10T19:00:00Z",
        },
        {
            id: "p-ti1",
            userId: "u-012",
            shareUrl: "http://localhost:5173/p/p-ti1",
            media: [{ url: "https://picsum.photos/1080/1350?random=33" }],
            caption: "Morning news update. 💻 #global",
            likedBy: [usersDB["u-001"], usersDB["u-005"]],
            createdAt: "2024-03-10T22:00:00Z",
        },
    ],
    reels: [
        {
            id: "r-001",
            userId: "u-002",
            videoUrl:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            caption: "Skills! ⚽",
            likedBy: [usersDB["u-001"], usersDB["u-003"]],
            music: "Messi Song",
            user: usersDB["u-002"],
            createdAt: "2024-03-09T10:00:00Z",
        },
        {
            id: "r-002",
            userId: "u-003",
            videoUrl:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            caption: "Go! 🐐",
            likedBy: [usersDB["u-001"], usersDB["u-002"]],
            music: "CR7 Vibe",
            user: usersDB["u-003"],
            createdAt: "2024-03-09T11:00:00Z",
        },
        {
            id: "r-003",
            userId: "u-006",
            videoUrl:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            caption: "Nature is wild. 🌊",
            likedBy: [usersDB["u-005"]],
            music: "Earth Vibe",
            user: usersDB["u-006"],
            createdAt: "2024-03-09T12:00:00Z",
        },
        {
            id: "r-004",
            userId: "u-008",
            videoUrl:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            caption: "New Art Piece 🎨",
            likedBy: [],
            music: "Artistic Vibe",
            user: usersDB["u-008"],
            createdAt: "2024-03-09T13:00:00Z",
        },
        {
            id: "r-005",
            userId: "u-009",
            videoUrl:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            caption: "Sunset Vibes 🌅",
            likedBy: [usersDB["u-001"]],
            music: "Travel Music",
            user: usersDB["u-009"],
            createdAt: "2024-03-09T14:00:00Z",
        },
        {
            id: "r-006",
            userId: "u-010",
            videoUrl:
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            caption: "Motivation! 💪",
            likedBy: [],
            music: "Power Gym",
            user: usersDB["u-010"],
            createdAt: "2024-03-09T15:00:00Z",
        },
    ],
};

/**
 * 5. EXPORT FOR UI
 */
export const currentUser = {
    ...usersDB["u-001"],
    email: "alex@lifestyle.io",
    phoneNumber: "+84 901 234 567",
    gender: "male",
    accountType: "PERSONAL",
    privacy: {
        isPrivateAccount: false,
        activityStatus: true,
        tagPermissions: "EVERYONE",
    },
    social: { blockedUsers: [] },
    notifications: { pauseAll: false, reminders: true },
};

export const allUsers = Object.values(usersDB);

export const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "custom", label: "Custom" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export const allPosts = contentDB.posts.map((p) => ({
    ...p,
    user: usersDB[p.userId],
    imageUrl: p.media[0].url,
    images: p.media.map((m) => m.url),
    commentCount: commentsDB[p.id]?.length || 0,
    likeCount: p.likedBy?.length || 0,
    likedBy: p.likedBy || [],
    timeAgo: "2 HOURS AGO",
}));

export const allReels = contentDB.reels.map((r) => ({
    ...r,
    likeCount: r.likedBy?.length || 0,
    likedBy: r.likedBy || [],
    commentCount: commentsDB[r.id]?.length || 0,
    createdAt: r.createdAt,
    timeAgo: "4d",
}));

export const notifications = [
    {
        id: 1,
        type: "like",
        user: usersDB["u-002"],
        content: "liked your photo.",
        timeAgo: "2h",
        postImage: "https://picsum.photos/1080/1350?random=100",
        section: "Today",
    },
    {
        id: 2,
        type: "follow",
        user: usersDB["u-003"],
        content: "started following you.",
        timeAgo: "5h",
        section: "Today",
    },
    {
        id: 3,
        type: "comment",
        user: usersDB["u-005"],
        content: 'commented: "Amazing shot! 🚀"',
        timeAgo: "1d",
        postImage: "https://picsum.photos/1080/1350?random=100",
        section: "Yesterday",
    },
    {
        id: 4,
        type: "mention",
        user: usersDB["u-002"],
        content: "mentioned you in a comment.",
        timeAgo: "5d",
        section: "Earlier",
    },
];

export const messageRequests = [
    {
        id: "req-001",
        user: usersDB["u-004"],
        lastMessage: "Check out new collection.",
        time: "2h",
        unread: true,
    },
    {
        id: "req-007",
        user: usersDB["u-011"],
        lastMessage: "Loved your recipe!",
        time: "1d",
        unread: true,
    },
];

export const chatMessages = {
    leomessi: [
        { id: 1, sender: "other", text: "Hey!", time: "10:00 AM" },
        { id: 2, sender: "me", text: "Hi Leo!", time: "10:02 AM" },
        { id: 3, sender: "other", text: "Great progress!", time: "10:05 AM" },
    ],
    cristiano: [{ id: 1, sender: "other", text: "SIUUUUUU!", time: "9:00 AM" }],
    nike: [
        {
            id: 1,
            sender: "other",
            text: "Check out new collection.",
            time: "2h",
        },
    ],
    foodie_queen: [
        { id: 1, sender: "other", text: "Loved your recipe!", time: "1d" },
    ],
};
