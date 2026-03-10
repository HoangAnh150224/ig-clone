import { allUsers, chatMessages, messageRequests } from '../api/dummyData';

const messageService = {
  /**
   * Get primary chat list (first 3 users with their chat history).
   * TODO: Replace with API call → GET /api/messages/primary
   */
  getPrimaryChats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chats = allUsers.slice(0, 3).map(user => ({
          id: user.id,
          user: user,
          lastMessage: chatMessages[user.username]?.[chatMessages[user.username].length - 1]?.text || 'No messages',
          time: chatMessages[user.username]?.[chatMessages[user.username].length - 1]?.time || '',
          unread: false,
          messages: chatMessages[user.username] || []
        }));
        resolve({ data: chats });
      }, 300);
    });
  },

  /**
   * Get message request list.
   * TODO: Replace with API call → GET /api/messages/requests
   */
  getRequestChats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const requests = messageRequests.map(req => ({
          ...req,
          messages: chatMessages[req.user.username] || []
        }));
        resolve({ data: requests });
      }, 300);
    });
  },

  /**
   * Get total message request count.
   * TODO: Replace with API call → GET /api/messages/requests/count
   */
  getRequestCount: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: messageRequests.length });
      }, 100);
    });
  },
};

export default messageService;
