import axiosClient from "../api/axiosClient";

/**
 * MessageService handles real-time messaging API calls.
 */
const messageService = {
    /**
     * Get primary conversation list.
     * API: GET /messages
     */
    getPrimaryChats: async () => {
        return axiosClient.get("/messages");
    },

    /**
     * Get chat messages for a conversation (paginated).
     * API: GET /messages/{chatId}
     */
    getChatMessages: async (chatId, page = 0, size = 20) => {
        return axiosClient.get(`/messages/${chatId}?page=${page}&size=${size}`);
    },

    /**
     * Send new message.
     * API: POST /messages
     */
    sendMessage: async (messageBody) => {
        return axiosClient.post("/messages", messageBody);
    },

    /**
     * Get message request list.
     * API: GET /messages/requests
     */
    getRequestChats: async () => {
        return axiosClient.get("/messages/requests");
    },

    /**
     * Get total message request count.
     * API: GET /messages/requests
     */
    getRequestCount: async () => {
        try {
            const response = await axiosClient.get("/messages/requests");
            return Array.isArray(response) ? response.length : (response.content?.length || 0);
        } catch (error) {
            return 0;
        }
    },

    /**
     * Mark messages as read.
     * API: POST /messages/{chatId}/read
     */
    markAsRead: async (chatId) => {
        return axiosClient.post(`/messages/${chatId}/read`);
    },

    /**
     * Delete (unsend) a message.
     * API: DELETE /messages/{chatId}/{messageId}
     */
    deleteMessage: async (chatId, messageId) => {
        return axiosClient.delete(`/messages/${chatId}/${messageId}`);
    }
};

export default messageService;
