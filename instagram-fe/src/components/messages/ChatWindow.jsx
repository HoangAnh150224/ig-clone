import React, { useState, useEffect, useRef } from "react";
import { 
    Box, 
    VStack, 
    HStack, 
    Text, 
    Flex, 
    Input, 
    Button,
    PopoverRoot,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverPositioner,
    IconButton,
    Center
} from "@chakra-ui/react";
import {
    AiOutlineInfoCircle,
    AiOutlineHeart,
    AiOutlinePicture,
    AiOutlineDelete,
} from "react-icons/ai";
import { HiOutlineMicrophone, HiOutlineDotsVertical } from "react-icons/hi";
import { BsEmojiSmile } from "react-icons/bs";
import UserAvatar from "../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SharedPostPreview = ({ post, onClick }) => {
    if (!post) return null;
    return (
        <VStack 
            align="stretch" 
            bg="gray.50" 
            borderRadius="12px" 
            overflow="hidden" 
            border="1px solid" 
            borderColor="gray.200"
            cursor="pointer"
            onClick={onClick}
            gap={0}
            mb={1}
        >
            <HStack p={2} gap={2}>
                <UserAvatar src={post.author?.avatarUrl} size="24px" />
                <Text fontSize="12px" fontWeight="bold" color="black">{post.author?.username}</Text>
            </HStack>
            {post.media?.[0]?.url && (
                <Box width="100%" height="200px">
                    <Image 
                        src={post.media[0].url} 
                        alt="Shared post" 
                        width="100%" 
                        height="100%" 
                        objectFit="cover" 
                    />
                </Box>
            )}
            <Box p={3}>
                <Text fontSize="12px" color="black" noOfLines={2}>
                    <Text as="span" fontWeight="bold" mr={1}>{post.author?.username}</Text>
                    {post.caption}
                </Text>
            </Box>
        </VStack>
    );
};

const MessageItem = ({ msg, isMe, authUser, onUnsendMessage, isLastMe, lastReadAt }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const isDeleted = msg.deleted;

    const isSeen = isMe && lastReadAt && new Date(msg.createdAt) <= new Date(lastReadAt);
    const timeStr = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <VStack align={isMe ? "end" : "start"} gap={1} width="full">
            <Flex 
                justify={isMe ? "flex-end" : "flex-start"} 
                align="center" 
                gap={2} 
                position="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    if (!isOpen) setIsHovered(false);
                }}
                width="full"
            >
                {isMe && !isDeleted && (
                    <PopoverRoot 
                        open={isOpen} 
                        onOpenChange={(e) => setIsOpen(e.open)}
                        positioning={{ placement: "left" }}
                    >
                        <PopoverTrigger asChild>
                            <Box 
                                cursor="pointer"
                                opacity={isHovered || isOpen ? 1 : 0}
                                transition="0.2s"
                                p={1}
                                borderRadius="full"
                                _hover={{ bg: "gray.100" }}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <HiOutlineDotsVertical color="gray" size={18} />
                            </Box>
                        </PopoverTrigger>
                        <PopoverPositioner zIndex={1500}>
                            <PopoverContent 
                                width="120px" 
                                bg="white" 
                                boxShadow="0 4px 12px rgba(0,0,0,0.15)" 
                                border="1px solid" 
                                borderColor="gray.200"
                                borderRadius="8px"
                                overflow="hidden"
                            >
                                <PopoverBody p={0}>
                                    <Button
                                        variant="ghost"
                                        color="#ed4956"
                                        size="sm"
                                        width="full"
                                        height="40px"
                                        fontWeight="bold"
                                        onClick={() => {
                                            onUnsendMessage(msg.id);
                                            setIsOpen(false);
                                        }}
                                        _hover={{ bg: "gray.50" }}
                                        borderRadius="0"
                                    >
                                        Unsend
                                    </Button>
                                </PopoverBody>
                            </PopoverContent>
                        </PopoverPositioner>
                    </PopoverRoot>
                )}
                
                <VStack align={isMe ? "end" : "start"} maxW="70%" gap={0}>
                    {msg.sharedPost && !isDeleted && (
                        <Box width="240px">
                            <SharedPostPreview 
                                post={msg.sharedPost} 
                                onClick={() => navigate(`/p/${msg.sharedPost.id}`)} 
                            />
                        </Box>
                    )}
                    
                    {(msg.text || msg.content || isDeleted) && (
                        <Box
                            p={3}
                            px={4}
                            borderRadius="22px"
                            bg={isDeleted ? "transparent" : (isMe ? "#3797f0" : "gray.100")}
                            color={isDeleted ? "gray.400" : (isMe ? "white" : "black")}
                            border={isDeleted ? "1px solid" : "none"}
                            borderColor="gray.200"
                            fontSize="sm"
                            fontStyle={isDeleted ? "italic" : "normal"}
                            title={timeStr}
                        >
                            {isDeleted ? "Message unsent" : (msg.text || msg.content)}
                        </Box>
                    )}
                </VStack>
            </Flex>
            {isMe && isLastMe && (
                <Text fontSize="10px" color="gray.500" pr={2}>
                    {isSeen ? "Seen" : "Sent"}
                </Text>
            )}
        </VStack>
    );
};

import messageService from "../../services/messageService";

import cloudinaryService from "../../services/cloudinaryService";
import { Spinner } from "@chakra-ui/react";

const ChatWindow = ({ 
    activeChat, 
    onSendMessage, 
    onTyping, 
    onUnsendMessage, 
    onOpenNewMessage, 
    onAcceptRequest,
    onDeleteChat,
    currentView,
    isTyping = false 
}) => {
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth.user);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages, isTyping]);

    const handleMessageChange = (e) => {
        const val = e.target.value;
        setMessage(val);
        if (onTyping) onTyping();
    };

    const handleSend = () => {
        if (!message.trim()) return;
        onSendMessage(message);
        setMessage("");
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const uploadResult = await cloudinaryService.upload(file, "messages");
            // Send message with media info
            onSendMessage(null, uploadResult.url, uploadResult.mediaType);
        } catch (error) {
            console.error("Image upload failed", error);
            alert("Failed to send image.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    if (!activeChat) {
        // ... (existing empty state)
        return (
            <Flex flex={1} bg="white" color="black" direction="column" align="center" justify="center" gap={4}>
                <Box borderRadius="full" border="2px solid" borderColor="black" p={6} display="flex" align="center" justify="center" bg="white">
                    <AiOutlinePicture size={60} color="black" />
                </Box>
                <Text fontSize="2xl" fontWeight="500" color="black">Your messages</Text>
                <Text color="gray.500">Send photos and private messages to a friend or group.</Text>
                <Box 
                    as="button" 
                    bg="#0095f6" 
                    color="white" 
                    px={5} 
                    py={2} 
                    borderRadius="8px" 
                    fontSize="sm" 
                    fontWeight="bold" 
                    mt={2}
                    onClick={onOpenNewMessage}
                    _hover={{ bg: "#1877f2" }}
                    _active={{ bg: "#166fe5" }}
                >
                    Send message
                </Box>
            </Flex>
        );
    }

    const participant = activeChat.participant || activeChat.user;
    const isBlocked = authUser?.blockedUserIds?.some(id => String(id) === String(participant?.id));

    if (!participant) {
        return (
            <Flex flex={1} bg="white" color="black" direction="column" align="center" justify="center">
                <Text>Conversation data missing</Text>
            </Flex>
        );
    }

    const handleDeleteChat = async () => {
        if (window.confirm("Delete conversation? This will permanently remove your copy of the conversation from your inbox.")) {
            try {
                await messageService.deleteConversation(activeChat.id);
                if (onDeleteChat) onDeleteChat(activeChat.id);
            } catch (error) {
                console.error("Failed to delete chat", error);
            }
        }
    };

    return (
        <Box flex={1} bg="white" color="black" display="flex" flexDirection="column" height="100vh">
            {/* Header */}
            <Flex p={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between" bg="white">
                <HStack gap={3} cursor="pointer" onClick={() => navigate(`/${participant?.username}`)}>
                    <UserAvatar src={participant?.avatarUrl || participant?.avatar} size="32px" />
                    <VStack align="start" gap={0}>
                        <Text fontWeight="bold" color="black" fontSize="sm">{participant?.username}</Text>
                        {activeChat.isOnline && !isBlocked && <Text fontSize="xs" color="green.500">Active now</Text>}
                    </VStack>
                </HStack>
                
                <PopoverRoot positioning={{ placement: "bottom-end" }}>
                    <PopoverTrigger asChild>
                        <Box cursor="pointer" p={1}>
                            <AiOutlineInfoCircle size={24} color="black" />
                        </Box>
                    </PopoverTrigger>
                    <PopoverPositioner zIndex={1500}>
                        <PopoverContent width="200px" bg="white" boxShadow="lg" borderRadius="8px">
                            <PopoverBody p={0}>
                                <VStack align="stretch" gap={0}>
                                    <Button 
                                        variant="ghost" 
                                        color="#ed4956" 
                                        fontWeight="bold" 
                                        onClick={handleDeleteChat}
                                        borderRadius="0"
                                        height="45px"
                                    >
                                        Delete Chat
                                    </Button>
                                    <Box h="1px" bg="gray.100" />
                                    <Button 
                                        variant="ghost" 
                                        color="black" 
                                        onClick={() => navigate(`/${participant?.username}`)}
                                        borderRadius="0"
                                        height="45px"
                                    >
                                        View Profile
                                    </Button>
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </PopoverPositioner>
                </PopoverRoot>
            </Flex>

            {/* Messages */}
            <VStack flex={1} p={4} overflowY="auto" align="stretch" gap={4} bg="white" className="no-scrollbar">
                {(() => {
                    // Find the index of the last message sent by the current user
                    let lastMeIdx = -1;
                    if (activeChat.messages) {
                        for (let i = activeChat.messages.length - 1; i >= 0; i--) {
                            const m = activeChat.messages[i];
                            const mSenderId = m.senderId || m.sender?.id;
                            if (mSenderId === authUser?.id || m.sender === "me") {
                                lastMeIdx = i;
                                break;
                            }
                        }
                    }

                    return activeChat.messages?.map((msg, index) => {
                        const msgSenderId = msg.senderId || msg.sender?.id;
                        const isMe = msgSenderId === authUser?.id || msg.sender === "me";
                        const isLastMe = index === lastMeIdx;

                        return (
                            <MessageItem 
                                key={msg.id || index} 
                                msg={msg} 
                                isMe={isMe} 
                                authUser={authUser} 
                                onUnsendMessage={onUnsendMessage} 
                                isLastMe={isLastMe}
                                lastReadAt={activeChat.lastReadAt}
                            />
                        );
                    });
                })()}
                {isTyping && !isBlocked && (
                    <Flex justify="flex-start">
                        <Box p={3} px={4} borderRadius="22px" bg="gray.100" color="gray.500" fontSize="xs">
                            Typing...
                        </Box>
                    </Flex>
                )}
                <div ref={messagesEndRef} />
            </VStack>

            {/* Input / Request Footer */}
            <Box p={4} px={5} bg="white">
                <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    accept="image/*,video/*" 
                    onChange={handleImageUpload} 
                />
                
                {isBlocked ? (
                    <Center py={4} bg="gray.50" borderRadius="12px" border="1px solid" borderColor="gray.100">
                        <VStack gap={2}>
                            <Text fontWeight="bold" color="black">You blocked this user</Text>
                            <Text fontSize="xs" color="gray.500">You can't message them unless you unblock them.</Text>
                            <Button 
                                size="xs" 
                                color="#0095f6" 
                                variant="ghost" 
                                fontWeight="bold"
                                onClick={() => navigate("/accounts/edit")}
                            >
                                Unblock
                            </Button>
                        </VStack>
                    </Center>
                ) : currentView === "requests" ? (
                    <VStack gap={4} py={2}>
                        <Text fontSize="14px" color="gray.500" textAlign="center">
                            The user wants to send you a message. They won't know you've seen it until you accept.
                        </Text>
                        <HStack width="100%" gap={4} justify="center">
                            <Button 
                                variant="ghost" 
                                color="#ed4956" 
                                fontWeight="bold" 
                                fontSize="14px"
                                _hover={{ bg: "gray.50" }}
                            >
                                Delete
                            </Button>
                            <Button 
                                variant="ghost" 
                                color="black" 
                                fontWeight="bold" 
                                fontSize="14px"
                                _hover={{ bg: "gray.50" }}
                                onClick={onAcceptRequest}
                            >
                                Accept
                            </Button>
                        </HStack>
                        <Box borderTop="1px solid" borderColor="gray.100" width="100%" pt={4}>
                             <Flex border="1px solid" borderColor="gray.200" borderRadius="22px" p={1} px={4} align="center" gap={3} bg="white">
                                <BsEmojiSmile size={24} cursor="pointer" color="black" />
                                <Input
                                    variant="unstyled"
                                    placeholder="Message..."
                                    flex={1}
                                    py={2}
                                    value={message}
                                    onChange={handleMessageChange}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    color="black"
                                    bg="white"
                                    _placeholder={{ color: "gray.500" }}
                                />
                                {message.length > 0 && (
                                    <Text fontWeight="bold" color="#0095f6" cursor="pointer" onClick={handleSend}>Send</Text>
                                )}
                            </Flex>
                        </Box>
                    </VStack>
                ) : (
                    <Flex border="1px solid" borderColor="gray.200" borderRadius="22px" p={1} px={4} align="center" gap={3} bg="white">
                        <BsEmojiSmile size={24} cursor="pointer" color="black" />
                        <Input
                            variant="unstyled"
                            placeholder="Message..."
                            flex={1}
                            py={2}
                            value={message}
                            onChange={handleMessageChange}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            color="black"
                            bg="white"
                            _placeholder={{ color: "gray.500" }}
                        />
                        {message.length > 0 ? (
                            <Text fontWeight="bold" color="#0095f6" cursor="pointer" onClick={handleSend}>Send</Text>
                        ) : (
                            <HStack gap={4}>
                                <HiOutlineMicrophone size={24} cursor="pointer" color="black" />
                                <Box cursor="pointer" onClick={() => fileInputRef.current?.click()}>
                                    {isUploading ? <Spinner size="xs" color="black" /> : <AiOutlinePicture size={24} color="black" />}
                                </Box>
                                <AiOutlineHeart size={24} cursor="pointer" color="black" />
                            </HStack>
                        )}
                    </Flex>
                )}
            </Box>
        </Box>
    );
};

export default ChatWindow;
