import {
    allUsers,
    currentUser,
    userRelationsDB,
    usersDB,
} from "../api/dummyData";

const storyService = {
    /**
     * Get stories for the home feed (own story + following users' stories).
     * API: GET /api/stories/feed
     */
    getStoriesForFeed: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const myFollowingList =
                    userRelationsDB[currentUser.id]?.following || [];
                const followingUsernames = myFollowingList.map(
                    (u) => u.username,
                );

                const followingWithStories = allUsers.filter(
                    (user) =>
                        followingUsernames.includes(user.username) &&
                        user.hasStory,
                );

                // Current user's story comes first (with full data from usersDB)
                const stories = [
                    { ...usersDB[currentUser.id], isOwn: true },
                    ...followingWithStories,
                ];

                resolve(stories);
            }, 300);
        });
    },
};

export default storyService;
