import axiosClient from "../api/axiosClient";

/**
 * StoryService handles story-related API calls.
 */
const storyService = {
    /**
     * Create a new story.
     * API: POST /stories
     * @param {File} file - The story media file
     * @param {boolean} closeFriends - Whether this story is for close friends only
     */
    createStory: async (file, closeFriends = false) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("closeFriends", closeFriends);

        return axiosClient.post("/stories", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    /**
     * Get feed stories.
     * API: GET /stories/feed
     */
    getFeedStories: async () => {
        return axiosClient.get("/stories/feed");
    },

    /**
     * Record a view on a story.
     * API: POST /stories/{id}/view
     */
    viewStory: async (id) => {
        return axiosClient.post(`/stories/${id}/view`);
    },

    /**
     * Toggle like on a story.
     * API: POST /stories/{id}/like
     */
    likeStory: async (id) => {
        return axiosClient.post(`/stories/${id}/like`);
    },

    /**
     * Reply to a story.
     * API: POST /stories/{id}/reply
     */
    replyToStory: async (id, text) => {
        return axiosClient.post(`/stories/${id}/reply`, { text });
    },

    /**
     * Delete a story.
     * API: DELETE /stories/{id}
     */
    deleteStory: async (id) => {
        return axiosClient.delete(`/stories/${id}`);
    },

    /**
     * Archive a story.
     * API: PATCH /stories/{id}/archive
     */
    archiveStory: async (id) => {
        return axiosClient.patch(`/stories/${id}/archive`);
    },

    /**
     * Get archived stories.
     * API: GET /archive/stories
     */
    getArchivedStories: async () => {
        return axiosClient.get("/archive/stories");
    },

    /**
     * Get viewers of a story.
     * API: GET /stories/{id}/viewers
     */
    getStoryViewers: async (id) => {
        return axiosClient.get(`/stories/${id}/viewers`);
    }
};

export default storyService;
