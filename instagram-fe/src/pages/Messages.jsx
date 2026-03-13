import React, { useState, useEffect, useCallback, useRef } from "react";
import { Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import ChatList from "../components/messages/ChatList";
import ChatWindow from "../components/messages/ChatWindow";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import NewMessageModal from "../components/modals/NewMessageModal";
import messageService from "../services/messageService";
import userService from "../services/userService";
import useStomp from "../hooks/useStomp";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

const Messages = () => {
    const authUser = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [activeChatId, setActiveChatId] = useState(null);
    const [view, setView] = useState("primary"); // 'primary' | 'requests'
    const [primaryChats, setPrimaryChats] = useState([]);
    const [requestChats, setRequestChats] = useState([]);
    const [requestCount, setRequestCount] = useState(0);
    const [activeChatMessages, setActiveChatMessages] = useState([]);
    const [messagesCursor, setMessagesCursor] = useState(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
    const [typingUsers, setTypingUsers] = useState({}); // { userId: boolean }
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
    const [tempChat, setTempChat] = useState(null);
    const topicSubRef = useRef(null);

    const { connected, subscribe, send } = useStomp("/ws");

    const fetchChats = useCallback(async () => {
        setLoading(true);
        try {
            const [primaryRes, requestRes, countRes] = await Promise.all([
                messageService.getPrimaryChats(),
                messageService.getRequestChats(),
                messageService.getRequestCount(),
            ]);

            const formatChats = (list) => {
                const data = Array.isArray(list) ? list : list.content || [];
                return data
                    .map((chat) => {
                        const isObject = typeof chat.lastMessage === "object";
                        // Extract time from the message object if available, fallback to conversation times
                        const lastMsgTime = isObject
                            ? chat.lastMessage?.createdAt ||
                              chat.lastMessage?.timestamp
                            : null;

                        return {
                            ...chat,
                            lastMessage: isObject
                                ? chat.lastMessage?.content
                                : chat.lastMessage,
                            lastMessageSenderId: isObject
                                ? chat.lastMessage?.senderId
                                : null,
                            sortTime: new Date(
                                lastMsgTime ||
                                    chat.lastMessageAt ||
                                    chat.updatedAt ||
                                    chat.createdAt,
                            ).getTime(),
                        };
                    })
                    .sort((a, b) => b.sortTime - a.sortTime);
            };

            const pChats = formatChats(primaryRes);
            const rChats = formatChats(requestRes);

            setPrimaryChats(pChats);
            setRequestChats(rChats);
            setRequestCount(countRes);

            // Check for selectedUser from profile navigation
            if (location.state?.selectedUser) {
                const user = location.state.selectedUser;
                const existing = [...pChats, ...rChats].find(
                    (c) => (c.participant?.id || c.user?.id) === user.id,
                );

                if (existing) {
                    setActiveChatId(existing.id);
                } else {
                    setActiveChatId("temp");
                    setTempChat({
                        id: "temp",
                        participant: user,
                        messages: [],
                    });
                }
                // Clear state to prevent re-selection on refresh
                window.history.replaceState({}, document.title);
            }
        } catch (error) {
            console.error("Failed to fetch chats", error);
        } finally {
            setLoading(false);
        }
    }, [location.state]); // Removed authUser and dispatch from dependencies

    // Separate useEffect for fetching blocked users once to avoid loop
    useEffect(() => {
        const fetchBlocked = async () => {
            if (!authUser?.id) return;
            try {
                const blockedRes = await userService.getBlockedUsers();
                const blockedList = Array.isArray(blockedRes)
                    ? blockedRes
                    : blockedRes.content || [];
                const blockedUserIds = blockedList.map((u) => u.id);

                // Use string comparison for robustness
                const currentIds = (authUser.blockedUserIds || []).map((id) =>
                    String(id),
                );
                const newIds = blockedUserIds.map((id) => String(id));

                const isDifferent =
                    newIds.length !== currentIds.length ||
                    newIds.some((id) => !currentIds.includes(id));

                if (isDifferent) {
                    dispatch(
                        setUser({
                            ...authUser,
                            blockedUserIds: blockedUserIds,
                        }),
                    );
                }
            } catch (error) {
                console.error("Failed to fetch blocked users", error);
            }
        };
        fetchBlocked();
    }, [authUser?.id, dispatch]); // Only runs when user changes or on mount

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    const fetchMessages = useCallback(async (chatId, cursor = null) => {
        if (
            !chatId ||
            chatId === "primary" ||
            chatId === "requests" ||
            chatId === "temp"
        )
            return;

        if (cursor) {
            setIsLoadingMoreMessages(true);
        }

        try {
            const response = await messageService.getChatMessages(
                chatId,
                cursor,
            );
            const msgs = response.content || [];
            const nextCursor = response.nextCursor;
            const hasMore = response.hasMore;

            if (!cursor) {
                // Initial load: show newest at bottom
                setActiveChatMessages([...msgs].reverse());
            } else {
                // Loading more (older): prepend to existing
                setActiveChatMessages((prev) => [
                    ...[...msgs].reverse(),
                    ...prev,
                ]);
            }

            setMessagesCursor(nextCursor);
            setHasMoreMessages(hasMore);

            // Mark as read only on initial load
            if (!cursor) {
                await messageService.markAsRead(chatId);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            if (cursor) {
                setIsLoadingMoreMessages(false);
            }
        }
    }, []);

    const handleNewIncomingMessage = useCallback(
        (message) => {
            console.log("New message received:", message);

            const msgConversationId = message.conversationId || message.id;
            const senderId = message.senderId || message.sender?.id;
            const recipientId = message.recipientId;
            const conversationPartnerId =
                senderId === authUser.id ? recipientId : senderId;

            // If it's the current active chat, add or update message
            if (
                activeChatId === msgConversationId ||
                (activeChatId === "temp" &&
                    tempChat?.participant?.id === conversationPartnerId)
            ) {
                setActiveChatMessages((prev) => {
                    const existingIdx = prev.findIndex(
                        (m) => m.id === message.id,
                    );
                    if (existingIdx > -1) {
                        // Update existing message (e.g. mark as deleted)
                        const updated = [...prev];
                        updated[existingIdx] = message;
                        return updated;
                    }
                    return [...prev, message];
                });

                if (activeChatId === "temp") {
                    setTempChat(null);
                    setActiveChatId(msgConversationId);
                    fetchChats();
                } else {
                    messageService.markAsRead(msgConversationId);
                }
            }

            // Update Chat Lists
            const updateChatInList = (prev) => {
                const chatIdx = prev.findIndex(
                    (c) =>
                        c.id === msgConversationId ||
                        (c.participant?.id || c.user?.id) ===
                            conversationPartnerId,
                );

                const isMe = senderId === authUser.id;
                const senderPrefix = isMe ? "You: " : "";
                const lastMsgText = message.deleted
                    ? "Message unsend"
                    : `${senderPrefix}${message.text || message.content}`;

                if (chatIdx > -1) {
                    const updatedList = [...prev];
                    const chat = { ...updatedList[chatIdx] };
                    chat.id = msgConversationId;
                    chat.lastMessage = lastMsgText;
                    chat.time = "Now";
                    chat.unread =
                        activeChatId !== msgConversationId &&
                        !isMe &&
                        !message.deleted;

                    // Move to top
                    updatedList.splice(chatIdx, 1);
                    return [chat, ...updatedList];
                } else {
                    fetchChats();
                    return prev;
                }
            };

            setPrimaryChats((prev) => updateChatInList(prev));
        },
        [authUser.id, activeChatId, fetchChats, tempChat],
    );

    const handleUnsendMessage = async (messageId) => {
        if (!activeChatId || activeChatId === "temp") return;
        try {
            await messageService.deleteMessage(activeChatId, messageId);
            // WebSocket will likely send an update, but we can update locally for speed
            setActiveChatMessages((prev) =>
                prev.map((m) =>
                    m.id === messageId
                        ? { ...m, deleted: true, content: null }
                        : m,
                ),
            );
        } catch (error) {
            console.error("Failed to unsend message", error);
            alert("Could not unsend message.");
        }
    };

    const handleAcceptRequest = async () => {
        if (!activeChatId || activeChatId === "temp") return;
        try {
            await messageService.acceptConversation(activeChatId);
            // Move to primary view and refresh
            setView("primary");
            fetchChats();
        } catch (error) {
            console.error("Failed to accept request", error);
        }
    };

    const handleSeenStatusUpdate = useCallback(
        (data) => {
            // data: { conversationId, userId, readAt }
            if (data.userId === authUser.id) return; // Ignore our own seen status broadcast

            const updateList = (prev) => {
                return prev.map((chat) => {
                    if (chat.id === data.conversationId) {
                        return { ...chat, lastReadAt: data.readAt };
                    }
                    return chat;
                });
            };

            setPrimaryChats((prev) => updateList(prev));
        },
        [authUser.id],
    );

    // Topic Subscription for current active chat
    useEffect(() => {
        if (connected && activeChatId && activeChatId !== "temp") {
            // Unsubscribe from previous topic if any
            if (topicSubRef.current) {
                topicSubRef.current.unsubscribe();
            }

            // Subscribe to the conversation topic to get messages sent by both parties
            const sub = subscribe(`/topic/messages/${activeChatId}`, (data) => {
                // If it's a message, handle it (check for properties that exist in message but not status)
                if (
                    data.sender ||
                    data.deleted !== undefined ||
                    data.content !== undefined
                ) {
                    handleNewIncomingMessage(data);
                } else if (data.readAt) {
                    // If it's a read status update
                    handleSeenStatusUpdate(data);
                }
            });
            topicSubRef.current = sub;

            // Mark as read immediately when joining
            messageService.markAsRead(activeChatId);

            return () => {
                sub?.unsubscribe();
                topicSubRef.current = null;
            };
        }
    }, [
        connected,
        activeChatId,
        subscribe,
        handleNewIncomingMessage,
        handleSeenStatusUpdate,
    ]);

    // Private queue subscription for background updates and new conversations
    useEffect(() => {
        if (connected && authUser?.id) {
            const sub = subscribe(
                `/user/${authUser.id}/queue/messages`,
                (message) => {
                    handleNewIncomingMessage(message);
                },
            );

            const typingSub = subscribe(
                `/user/${authUser.id}/queue/typing`,
                (data) => {
                    setTypingUsers((prev) => ({
                        ...prev,
                        [data.senderId]: data.isTyping,
                    }));
                    if (data.isTyping) {
                        setTimeout(() => {
                            setTypingUsers((prev) => ({
                                ...prev,
                                [data.senderId]: false,
                            }));
                        }, 5000);
                    }
                },
            );

            return () => {
                sub?.unsubscribe();
                typingSub?.unsubscribe();
            };
        }
    }, [connected, subscribe, handleNewIncomingMessage, authUser?.id]);

    useEffect(() => {
        if (activeChatId && activeChatId !== "temp") {
            fetchMessages(activeChatId);
        } else {
            setActiveChatMessages([]);
        }
    }, [activeChatId, fetchMessages]);

    const handleTyping = () => {
        const displayedChats = view === "primary" ? primaryChats : requestChats;
        const activeChat =
            displayedChats.find((chat) => chat.id === activeChatId) || tempChat;
        const recipientId = activeChat?.participant?.id || activeChat?.user?.id;

        if (!recipientId || !connected) return;

        // Robust block check
        if (
            authUser?.blockedUserIds?.some(
                (id) => String(id) === String(recipientId),
            )
        )
            return;

        send("/app/chat.typing", { recipientId: recipientId, isTyping: true });
    };

    const handleSendMessage = async (
        text,
        mediaUrl = null,
        mediaType = null,
        sharedPostId = null,
    ) => {
        const displayedChats = view === "primary" ? primaryChats : requestChats;
        const activeChat =
            displayedChats.find((chat) => chat.id === activeChatId) || tempChat;

        if (!activeChat || (!text?.trim() && !mediaUrl && !sharedPostId))
            return;

        // Try all possible locations for recipient ID based on chat structure
        const recipientId = activeChat.participant?.id || activeChat.user?.id;

        if (!recipientId) {
            console.error(
                "Cannot send message: Valid Recipient ID not found",
                activeChat,
            );
            return;
        }

        // Robust block check
        const isBlocked = authUser?.blockedUserIds?.some(
            (id) => String(id) === String(recipientId),
        );
        if (isBlocked) {
            alert(
                "You have blocked this user. Unblock them in Settings to send a message.",
            );
            return;
        }

        // 1. Optimistic Update
        const tempMsgId = `temp-${Date.now()}`;
        const optimisticMsg = {
            id: tempMsgId,
            senderId: authUser.id,
            recipientId: recipientId,
            content: text,
            mediaUrl: mediaUrl,
            mediaType: mediaType,
            sharedPost: sharedPostId ? { id: sharedPostId } : null, // Partial object for UI
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        setActiveChatMessages((prev) => [...prev, optimisticMsg]);

        try {
            // 2. Send via HTTP POST
            const messageBody = {
                recipientId: recipientId,
                content: text,
                mediaUrl: mediaUrl,
                mediaType: mediaType,
                sharedPostId: sharedPostId,
            };

            console.log(
                "Sending message with body:",
                JSON.stringify(messageBody),
            );
            const sentMessage = await messageService.sendMessage(messageBody);

            // 3. Update active chat messages
            setActiveChatMessages((prev) => {
                const alreadyExists = prev.some((m) => m.id === sentMessage.id);
                if (alreadyExists) {
                    return prev.filter((m) => m.id !== tempMsgId);
                }
                return prev.map((m) => (m.id === tempMsgId ? sentMessage : m));
            });

            // 4. Handle transition from 'temp' or 'requests' to real conversation
            if (activeChatId === "temp" || view === "requests") {
                if (view === "requests") setView("primary");
                setTempChat(null);
                setActiveChatId(sentMessage.conversationId);
                fetchChats();
            }

            // Stop typing status
            if (connected) {
                send("/app/chat.typing", {
                    recipientId: recipientId,
                    isTyping: false,
                });
            }
        } catch (error) {
            console.error("Failed to send message", error);
            setActiveChatMessages((prev) =>
                prev.filter((m) => m.id !== tempMsgId),
            );
            alert("Failed to send message. Please try again.");
        }
    };

    if (loading) {
        return <MessageSkeleton />;
    }

    const displayedChats = view === "primary" ? primaryChats : requestChats;
    const activeChat =
        displayedChats.find((chat) => chat.id === activeChatId) || tempChat;
    const participantId = activeChat?.participant?.id || activeChat?.user?.id;

    return (
        <Flex height="100vh" bg="white" color="black" width="100%">
            <ChatList
                chats={displayedChats}
                onSelectChat={(id) => {
                    setActiveChatId(id);
                    setTempChat(null);
                }}
                activeChatId={activeChatId}
                currentView={view}
                onViewChange={(newView) => {
                    setView(newView);
                    setActiveChatId(null);
                    setTempChat(null);
                }}
                requestCount={requestCount}
                onOpenNewMessage={() => setIsNewMessageOpen(true)}
            />

            <Flex flex={1}>
                <ChatWindow
                    activeChat={
                        activeChat
                            ? {
                                  ...activeChat,
                                  messages: activeChatMessages,
                              }
                            : null
                    }
                    onSendMessage={handleSendMessage}
                    onTyping={handleTyping}
                    onUnsendMessage={handleUnsendMessage}
                    onOpenNewMessage={() => setIsNewMessageOpen(true)}
                    onAcceptRequest={handleAcceptRequest}
                    onLoadMoreMessages={() =>
                        fetchMessages(activeChatId, messagesCursor)
                    }
                    hasMoreMessages={hasMoreMessages}
                    isLoadingMoreMessages={isLoadingMoreMessages}
                    currentView={view}
                    isTyping={
                        participantId ? typingUsers[participantId] : false
                    }
                />
            </Flex>

            <NewMessageModal
                isOpen={isNewMessageOpen}
                onClose={() => setIsNewMessageOpen(false)}
                onSelectUser={(user) => {
                    const existing = [...primaryChats, ...requestChats].find(
                        (c) => (c.participant?.id || c.user?.id) === user.id,
                    );
                    if (existing) {
                        setActiveChatId(existing.id);
                        setTempChat(null);
                    } else {
                        setActiveChatId("temp");
                        setTempChat({
                            id: "temp",
                            participant: user,
                            messages: [],
                        });
                        setActiveChatMessages([]);
                    }
                }}
            />
        </Flex>
    );
};

export default Messages;
