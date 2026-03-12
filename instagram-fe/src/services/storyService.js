import axiosClient from "../api/axiosClient";

/**
 * StoryService handles story-related API calls.
 */
const storyService = {
    /**
     * Create a new story.
     * API: POST /stories
     */
    createStory: async (storyData) => {
        return axiosClient.post("/stories", storyData);
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
