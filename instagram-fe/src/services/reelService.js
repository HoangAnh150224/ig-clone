import axiosClient from "../api/axiosClient";

/**
 * ReelService handles reel-related API calls.
 * Now standardized to use the common feed endpoint with type=REEL.
 */
const reelService = {
    /**
     * Get reels for the feed (cursor-based).
     * API: GET /posts/feed?type=REEL
     */
    getAllReels: async (cursor = null, size = 12) => {
        const params = new URLSearchParams();
        params.append("type", "REEL");
        if (cursor) params.append("cursor", cursor);
        if (size) params.append("size", size);
        return axiosClient.get(`/posts/feed?${params.toString()}`);
    },

    /**
     * Get archived reels.
     * API: GET /archive/posts?type=REEL
     */
    getArchivedReels: async (page = 0, size = 12) => {
        return axiosClient.get(
            `/archive/posts?type=REEL&page=${page}&size=${size}`,
        );
    },
};

export default reelService;
