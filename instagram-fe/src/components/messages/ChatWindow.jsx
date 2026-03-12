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
    IconButton
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

const MessageItem = ({ msg, isMe, authUser, onUnsendMessage, isLastMe, lastReadAt }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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
                
                <Box
                    maxW="70%"
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
            </Flex>
            {isMe && isLastMe && (
                <Text fontSize="10px" color="gray.500" pr={2}>
                    {isSeen ? "Seen" : "Sent"}
                </Text>
            )}
        </VStack>
    );
};

const ChatWindow = ({ 
    activeChat, 
    onSendMessage, 
    onTyping, 
    onUnsendMessage, 
    onOpenNewMessage, 
    onAcceptRequest,
    currentView,
    isTyping = false 
}) => {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth.user);
    const messagesEndRef = useRef(null);

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

    if (!activeChat) {
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

    if (!participant) {
        return (
            <Flex flex={1} bg="white" color="black" direction="column" align="center" justify="center">
                <Text>Conversation data missing</Text>
            </Flex>
        );
    }

    return (
        <Box flex={1} bg="white" color="black" display="flex" flexDirection="column" height="100vh">
            {/* Header */}
            <Flex p={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between" bg="white">
                <HStack gap={3} cursor="pointer" onClick={() => navigate(`/${participant?.username}`)}>
                    <UserAvatar src={participant?.avatarUrl || participant?.avatar} size="32px" />
                    <VStack align="start" gap={0}>
                        <Text fontWeight="bold" color="black" fontSize="sm">{participant?.username}</Text>
                        {activeChat.isOnline && <Text fontSize="xs" color="green.500">Active now</Text>}
                    </VStack>
                </HStack>
                <AiOutlineInfoCircle size={24} cursor="pointer" color="black" />
            </Flex>

            {/* Messages */}
            <VStack flex={1} p={4} overflowY="auto" align="stretch" gap={4} bg="white" className="no-scrollbar">
                {activeChat.messages?.map((msg, index) => {
                    const msgSenderId = msg.senderId || msg.sender?.id;
                    const isMe = msgSenderId === authUser?.id || msg.sender === "me";
                    
                    // Logic to show "Seen" status only for the last message sent by me
                    const isLastMe = isMe && index === activeChat.messages.length - 1;

                    return (
                        <MessageItem 
                            key={msg.id} 
                            msg={msg} 
                            isMe={isMe} 
                            authUser={authUser} 
                            onUnsendMessage={onUnsendMessage} 
                            isLastMe={isLastMe}
                            lastReadAt={activeChat.lastReadAt}
                        />
                    );
                })}
                {isTyping && (
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
                {currentView === "requests" ? (
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
                                <AiOutlinePicture size={24} cursor="pointer" color="black" />
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
