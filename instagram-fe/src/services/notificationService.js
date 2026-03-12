import axiosClient from "../api/axiosClient";

/**
 * NotificationService handles notification API calls.
 */
const notificationService = {
    /**
     * Get paginated notifications.
     * API: GET /notifications
     */
    getNotifications: async (page = 0, size = 20) => {
        return axiosClient.get(`/notifications?page=${page}&size=${size}`);
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
