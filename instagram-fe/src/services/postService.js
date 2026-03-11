import { allPosts, allReels, userRelationsDB, usersDB } from "../api/dummyData";

const postService = {
    /**
     * Get feed posts for the authenticated user (own posts + following posts).
     * Priority: Favorite Users' posts at the top.
     * API: GET /api/posts/feed?userId={userId}
     */
    getFeedPosts: async (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const followingIds =
                    userRelationsDB[userId]?.following.map((u) => u.id) || [];
                const favoriteUserIds = usersDB[userId]?.favoriteUserIds || [];

                // 1. Get posts and Reels, attach User info from usersDB
                const allFeedItems = [
                    ...allPosts
                        .filter(
                            (post) =>
                                post.userId === userId ||
                                followingIds.includes(post.userId),
                        )
                        .map((p) => ({
                            ...p,
                            type: "post",
                            user: usersDB[p.userId],
                        })),
                    ...allReels
                        .filter(
                            (reel) =>
                                reel.userId === userId ||
                                followingIds.includes(reel.userId),
                        )
                        .map((r) => ({
                            ...r,
                            type: "reel",
                            user: usersDB[r.userId],
                        })),
                ];

                // 2. Sort: Priority to Favorite Users first, then by date
                const sortedItems = allFeedItems.sort((a, b) => {
                    const aIsFav = favoriteUserIds.includes(a.userId);
                    const bIsFav = favoriteUserIds.includes(b.userId);

                    if (aIsFav && !bIsFav) return -1;
                    if (!aIsFav && bIsFav) return 1;

                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

                resolve(sortedItems);
            }, 300);
        });
    },

    /**
     * Get explore posts (posts from users NOT followed by the authenticated user).
     * API: GET /api/posts/explore?userId={userId}
     */
    getExplorePosts: async (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const followingIds =
                    userRelationsDB[userId]?.following.map((u) => u.id) || [];

                const explorePosts = allPosts.filter(
                    (post) =>
                        post.userId !== userId &&
                        !followingIds.includes(post.userId),
                );

                const exploreReels = allReels
                    .filter(
                        (reel) =>
                            reel.userId !== userId &&
                            !followingIds.includes(reel.userId),
                    )
                    .map((reel) => ({ ...reel, type: "reel" }));

                const combined = [...explorePosts, ...exploreReels].sort(
                    () => Math.random() - 0.5,
                );

                resolve(combined);
            }, 300);
        });
    },

    /**
     * Get all posts and reels for a specific user.
     * API: GET /api/users/{userId}/posts
     */
    getUserPosts: async (userId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userPosts = allPosts
                    .filter((post) => post.userId === userId)
                    .map((post) => ({ ...post, type: "post" }));

                const userReels = allReels
                    .filter((reel) => reel.userId === userId)
                    .map((reel) => ({ ...reel, type: "reel" }));

                const combined = [...userPosts, ...userReels].sort((a, b) => {
                    const dateA = a.createdAt || "";
                    const dateB = b.createdAt || "";
                    return dateB.localeCompare(dateA);
                });

                resolve(combined);
            }, 300);
        });
    },

    /**
     * Get post details by ID
     * API: GET /api/posts/{postId}
     */
    getPostById: async (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let post = allPosts.find((p) => p.id === postId);

                if (!post) {
                    const reel = allReels.find((r) => r.id === postId);
                    if (reel) {
                        post = { ...reel, type: "reel" };
                    }
                } else {
                    post = { ...post, type: "post" };
                }

                resolve(post);
            }, 300);
        });
    },

    /**
     * Delete Post
     * API: DELETE /api/posts/{postId}
     */
    deletePost: async (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },

    /**
     * Report Post
     * API: POST /api/reports/posts/{postId}
     */
    reportPost: async (postId, reason) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },

    /**
     * Update Post
     * API: PATCH /api/posts/{postId}
     */
    updatePost: async (postId, updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },

    /**
     * Get Favorite Posts
     * API: GET /api/favorites
     */
    getFavoritePosts: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const favPosts = allPosts
                    .slice(0, 3)
                    .map((p) => ({ ...p, type: "post" }));
                resolve(favPosts);
            }, 500);
        });
    },

    /**
     * Toggle Save/Bookmark Post
     * API: POST /api/saved/posts/{postId}
     */
    toggleSavePost: async (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },

    /**
     * Toggle Favorite Post
     * API: POST /api/favorites/posts/{postId}
     */
    toggleFavorite: async (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },
};

export default postService;
