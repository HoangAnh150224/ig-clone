import React, { useState, useEffect } from "react";
import {
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    DialogBody,
    DialogPositioner,
    Box,
    Flex,
    Text,
    HStack,
    VStack,
    Input,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import UserAvatar from "../common/UserAvatar";
import { useSelector } from "react-redux";
import profileService from "../../services/profileService";
import messageService from "../../services/messageService";

const ShareModal = ({ isOpen, onClose, post }) => {
    const authUser = useSelector((state) => state.auth.user);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchInitialSuggestions();
        } else {
            setSearchQuery("");
            setSelectedUsers([]);
        }
    }, [isOpen]);

    const fetchInitialSuggestions = async () => {
        setLoading(true);
        try {
            // Get followings as initial suggestions
            const response = await profileService.getUserFollowing(authUser.id);
            setSearchResults(response.content || (Array.isArray(response) ? response : []));
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (val) => {
        setSearchQuery(val);
        if (val.trim().length > 0) {
            setLoading(true);
            try {
                const response = await profileService.searchUsers(val);
                setSearchResults(response.content || (Array.isArray(response) ? response : []));
            } catch {
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        } else {
            fetchInitialSuggestions();
        }
    };

    const toggleSelectUser = (user) => {
        if (selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleShare = async () => {
        if (selectedUsers.length === 0) return;
        setIsSending(true);
        try {
            // Send sharedPostId instead of link text
            await Promise.all(selectedUsers.map(user => 
                messageService.sendMessage({
                    recipientId: user.id,
                    sharedPostId: post.id,
                    content: searchQuery.trim() || null // If user typed something in search, use it as caption
                })
            ));
            
            onClose();
        } catch (error) {
            console.error("Failed to share post", error);
            alert("Failed to share post.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open && !isSending) onClose();
            }}
            placement="center"
        >
            <DialogBackdrop bg="blackAlpha.600" />
            <DialogPositioner>
                <DialogContent
                    maxW="550px"
                    width="95vw"
                    maxHeight="600px"
                    bg="white"
                    color="black"
                    borderRadius="12px"
                    overflow="hidden"
                >
                    {/* Header */}
                    <Flex
                        p={3}
                        justify="space-between"
                        align="center"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                    >
                        <Box width="32px" />
                        <Text fontWeight="bold" fontSize="16px">Share</Text>
                        <Box cursor="pointer" onClick={onClose} p={1}>
                            <AiOutlineClose size={20} />
                        </Box>
                    </Flex>

                    {/* Search Section */}
                    <Box p={4} borderBottom="1px solid" borderColor="gray.100">
                        <HStack gap={3}>
                            <Text fontWeight="600" fontSize="14px">To:</Text>
                            <Input
                                placeholder="Search..."
                                variant="unstyled"
                                fontSize="14px"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                flex={1}
                            />
                        </HStack>
                        {selectedUsers.length > 0 && (
                            <HStack wrap="wrap" gap={2} mt={3}>
                                {selectedUsers.map(u => (
                                    <Flex 
                                        key={u.id} 
                                        bg="#e0f1ff" 
                                        color="#0095f6" 
                                        px={3} 
                                        py={1} 
                                        borderRadius="full" 
                                        fontSize="12px" 
                                        align="center" 
                                        gap={2}
                                    >
                                        <Text fontWeight="600">{u.username}</Text>
                                        <AiOutlineClose cursor="pointer" onClick={() => toggleSelectUser(u)} />
                                    </Flex>
                                ))}
                            </HStack>
                        )}
                    </Box>

                    {/* Results Section */}
                    <DialogBody p={0} overflowY="auto" flex={1}>
                        {loading ? (
                            <Flex justify="center" py={10}>
                                <Spinner color="gray.300" />
                            </Flex>
                        ) : (
                            <VStack align="stretch" gap={0} py={2}>
                                {searchResults.map((user) => (
                                    <Flex
                                        key={user.id}
                                        px={4}
                                        py={2}
                                        align="center"
                                        justify="space-between"
                                        _hover={{ bg: "gray.50" }}
                                        cursor="pointer"
                                        onClick={() => toggleSelectUser(user)}
                                    >
                                        <HStack gap={3}>
                                            <UserAvatar src={user.avatarUrl} size="44px" />
                                            <VStack align="start" gap={0}>
                                                <Text fontSize="14px" fontWeight="bold">{user.username}</Text>
                                                <Text fontSize="14px" color="gray.500">{user.fullName}</Text>
                                            </VStack>
                                        </HStack>
                                        <Box 
                                            boxSize="24px" 
                                            borderRadius="full" 
                                            border="1px solid" 
                                            borderColor={selectedUsers.some(u => u.id === user.id) ? "transparent" : "gray.300"}
                                            bg={selectedUsers.some(u => u.id === user.id) ? "#0095f6" : "transparent"}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            {selectedUsers.some(u => u.id === user.id) && (
                                                <Box boxSize="8px" bg="white" borderRadius="full" />
                                            )}
                                        </Box>
                                    </Flex>
                                ))}
                            </VStack>
                        )}
                    </DialogBody>

                    {/* Footer */}
                    <Box p={4} borderTop="1px solid" borderColor="gray.100">
                        <Button
                            width="100%"
                            bg="#0095f6"
                            color="white"
                            fontWeight="bold"
                            isDisabled={selectedUsers.length === 0 || isSending}
                            isLoading={isSending}
                            onClick={handleShare}
                            _hover={{ bg: "#1877f2" }}
                        >
                            Send
                        </Button>
                    </Box>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};

export default ShareModal;