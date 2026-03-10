import { allUsers, chatMessages, messageRequests } from "../api/dummyData";

const messageService = {
    /**
     * BACKEND SETUP: Get primary conversation list
     * API: GET /api/messages/primary
     */
    getPrimaryChats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const chats = allUsers.slice(0, 3).map((user) => ({
                    id: user.id,
                    user: user,
                    lastMessage:
                        chatMessages[user.username]?.[
                            chatMessages[user.username].length - 1
                        ]?.text || "No messages",
                    time:
                        chatMessages[user.username]?.[
                            chatMessages[user.username].length - 1
                        ]?.time || "",
                    unread: false,
                    messages: chatMessages[user.username] || [],
                }));
                resolve(chats);
            }, 300);
        });
    },

    /**
     * BACKEND SETUP: Get chat messages for a conversation
     * API: GET /api/messages/{chatId}
     */
    getChatMessages: async (chatId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate finding messages by chatId (using username as key here)
                const user = allUsers.find((u) => u.id === chatId);
                const messages = chatMessages[user?.username] || [];
                resolve(messages);
            }, 200);
        });
    },

    /**
     * BACKEND SETUP: Send new message
     * API: POST /api/messages/send
     */
    sendMessage: async (recipientId, text) => {
        return new Promise((resolve) => {
            console.log(
                `Backend Action: SENDING MESSAGE to ${recipientId}: ${text}`,
            );
            setTimeout(() => {
                const newMessage = {
                    id: Date.now(),
                    sender: "me",
                    text: text,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };

                // Update local dummy data
                const user = allUsers.find((u) => u.id === recipientId);
                if (user && chatMessages[user.username]) {
                    chatMessages[user.username].push(newMessage);
                }

                resolve(newMessage);
            }, 400);
        });
    },

    /**
     * Get message request list.
     * API: GET /api/messages/requests
     */
    getRequestChats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const requests = messageRequests.map((req) => ({
                    ...req,
                    messages: chatMessages[req.user.username] || [],
                }));
                resolve(requests);
            }, 300);
        });
    },

    /**
     * Get total message request count.
     * API: GET /api/messages/requests/count
     */
    getRequestCount: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(messageRequests.length);
            }, 100);
        });
    },
};

export default messageService;
