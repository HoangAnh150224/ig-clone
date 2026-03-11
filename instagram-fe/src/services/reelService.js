import { allReels } from "../api/dummyData";

const reelService = {
    /**
     * Get all reels.
     * API: GET /api/reels
     */
    getAllReels: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(allReels);
            }, 300);
        });
    },

    /**
     * BACKEND SETUP: Update reel
     * API: PATCH /api/reels/{reelId}
     */
    updateReel: async (reelId, updatedData) => {
        return new Promise((resolve) => {
            console.log(`Backend Action: UPDATING REEL ${reelId}`, updatedData);
            setTimeout(() => {
                // TODO: Send PATCH request via axiosClient
                resolve();
            }, 500);
        });
    },
};

export default reelService;
