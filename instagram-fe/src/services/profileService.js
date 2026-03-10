import {
    allUsers,
    currentUser,
    contentDB,
    userRelationsDB,
    commentsDB,
    usersDB,
    allReels,
} from "../api/dummyData";

const profileService = {
    /**
     * Get user profile by username.
     * API: GET /api/users/{username}/profile
     */
    getUserProfile: async (username) => {
        return new Promise((resolve) => {
            // Find raw user in usersDB for detailed story data (views, replies)
            const rawUser =
                Object.values(usersDB).find((u) => u.username === username) ||
                (username === currentUser.username
                    ? usersDB[currentUser.id]
                    : null);

            setTimeout(() => {
                if (!rawUser) {
                    resolve(null);
                    return;
                }

                const relations = userRelationsDB[rawUser.id] || {
                    followers: [],
                    following: [],
                };
                const myRelations = userRelationsDB[currentUser.id] || {
                    following: [],
                };
                const isFollowing = myRelations.following.some(
                    (u) => u.id === rawUser.id,
                );

                // Count both regular posts and reels
                const userPostsCount = contentDB.posts.filter(
                    (p) => p.userId === rawUser.id,
                ).length;
                const userReelsCount = contentDB.reels.filter(
                    (r) => r.userId === rawUser.id,
                ).length;

                resolve({
                    ...rawUser,
                    isFollowing: isFollowing,
                    isOwnProfile: rawUser.id === currentUser.id,
                    postCount: userPostsCount + userReelsCount, // Total count
                    followerCount: relations.followers.length,
                    followingCount: relations.following.length,
                    bio: rawUser.bio || "",
                    website: rawUser.website || "",
                    highlights: rawUser.highlights || [],
                    settings:
                        rawUser.id === currentUser.id
                            ? {
                                  privacy: currentUser.privacy || {},
                                  notifications:
                                      currentUser.notifications || {},
                                  blockedUsers:
                                      currentUser.social?.blockedUsers || [],
                              }
                            : null,
                });
            }, 500);
        });
    },

    /**
     * Get user suggestions.
     * API: GET /api/users/suggestions
     */
    getSuggestions: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const myId = currentUser.id;
                const myFollowingList = userRelationsDB[myId]?.following || [];
                const myFollowingIds = myFollowingList.map((u) => u.id);

                const filteredUsers = allUsers.filter(
                    (user) =>
                        user.id !== myId && !myFollowingIds.includes(user.id),
                );

                resolve(filteredUsers);
            }, 600);
        });
    },

    /**
     * Get all posts and reels for a specific user by username.
     * API: GET /api/users/{username}/posts
     */
    getUserPosts: async (username) => {
        return new Promise((resolve) => {
            const user =
                allUsers.find((u) => u.username === username) ||
                (username === currentUser.username ? currentUser : null);

            setTimeout(() => {
                if (!user) {
                    resolve([]);
                    return;
                }

                // Get regular posts
                const userPosts = contentDB.posts
                    .filter((p) => p.userId === user.id)
                    .map((p) => ({
                        ...p,
                        type: "post",
                        user: user,
                        imageUrl: p.media[0].url,
                        images: p.media.map((m) => m.url),
                        commentCount: commentsDB[p.id]?.length || 0,
                        likeCount: p.likedBy?.length || 0,
                        likedBy: p.likedBy || [],
                        timeAgo: "2 HOURS AGO",
                    }));

                // Get reels
                const userReels = allReels
                    .filter((r) => r.userId === user.id)
                    .map((r) => ({
                        ...r,
                        type: "reel",
                    }));

                // Combine and sort by createdAt
                const combined = [...userPosts, ...userReels].sort((a, b) => {
                    const dateA = a.createdAt || "";
                    const dateB = b.createdAt || "";
                    return dateB.localeCompare(dateA);
                });

                resolve(combined);
            }, 800);
        });
    },

    /**
     * BACKEND SETUP: Add story from Archive to Highlight
     * API: POST /api/highlights
     */
    addToHighlight: async (storyId, highlightId = null, newTitle = null) => {
        return new Promise((resolve) => {
            console.log(
                `Backend Action: Adding Story ${storyId} to Highlight ${highlightId || "New: " + newTitle}`,
            );

            // Simulate backend processing
            setTimeout(() => {
                // Find story in current user's archive (u-001)
                const story = currentUser.archivedStories?.find(
                    (s) => s.id === storyId,
                );

                if (!story) {
                    throw new Error("Story not found in archive");
                }

                // TODO: Send real request via axiosClient

                resolve({
                    id: highlightId || `h-new-${Date.now()}`,
                    title: newTitle || "Highlighted",
                    cover: story.url,
                    stories: [{ id: story.id, url: story.url }],
                });
            }, 1000);
        });
    },
};

export default profileService;
