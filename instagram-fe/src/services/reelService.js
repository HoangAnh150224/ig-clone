import { allReels } from '../api/dummyData';

const reelService = {
  /**
   * Get all reels.
   * TODO: Replace with API call → GET /api/reels
   */
  getAllReels: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: allReels });
      }, 300);
    });
  },
};

export default reelService;
