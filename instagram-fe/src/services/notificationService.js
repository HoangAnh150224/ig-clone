import axiosClient from "../api/axiosClient";

/**
 * NotificationService handles notification API calls.
 */
const notificationService = {
    /**
     * Get paginated notifications (cursor-based).
     * API: GET /notifications
     */
    getNotifications: async (cursor = null, size = 20) => {
        const params = new URLSearchParams();
        if (cursor) params.append("cursor", cursor);
        if (size) params.append("size", size);
        return axiosClient.get(`/notifications?${params.toString()}`);
    },

    /**
     * Get unread notification count.
     * API: GET /notifications/unread-count
     */
    getUnreadCount: async () => {
        const response = await axiosClient.get("/notifications/unread-count");
        return typeof response === 'number' ? response : (response.count || 0);
    },

    /**
     * Mark all notifications as read.
     * API: POST /notifications/read-all
     */
    markAllRead: async () => {
        return axiosClient.post("/notifications/read-all");
    },

    /**
     * Mark a single notification as read.
     * API: PATCH /notifications/{id}/read
     */
    markAsRead: async (id) => {
        return axiosClient.patch(`/notifications/${id}/read`);
    }
};

export default notificationService;
