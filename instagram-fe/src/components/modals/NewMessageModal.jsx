import React, { useState, useEffect } from "react";
import {
    Box,
    Text,
    VStack,
    Input,
    Flex,
    Spinner,
    IconButton,
    HStack,
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    DialogBody,
    DialogPositioner,
    DialogHeader,
    DialogTitle,
    DialogCloseTrigger,
} from "@chakra-ui/react";
import UserAvatar from "../common/UserAvatar";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import profileService from "../../services/profileService";

const NewMessageModal = ({ isOpen, onClose, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.trim() === "") {
                setSearchResults([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const results = await profileService.searchUsers(searchTerm);
                setSearchResults(results.users || (Array.isArray(results) ? results : []));
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSelect = (user) => {
        onSelectUser(user);
        setSearchTerm("");
        onClose();
    };

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => !e.open && onClose()}
            size="md"
            placement="center"
        >
            <DialogBackdrop bg="blackAlpha.600" />
            <DialogPositioner>
                <DialogContent
                    borderRadius="12px"
                    overflow="hidden"
                    bg="white"
                    p={0}
                    maxW="400px"
                    height="60vh"
                >
                    <DialogHeader borderBottom="1px solid" borderColor="gray.100" p={3}>
                        <Flex justify="space-between" align="center" width="100%">
                            <Box width="32px" />
                            <DialogTitle fontSize="16px" fontWeight="bold">New Message</DialogTitle>
                            <IconButton
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <AiOutlineClose size={20} />
                            </IconButton>
                        </Flex>
                    </DialogHeader>
                    <DialogBody p={0} display="flex" flexDirection="column">
                        <HStack p={4} borderBottom="1px solid" borderColor="gray.100" gap={3}>
                            <Text fontWeight="bold" fontSize="14px">To:</Text>
                            <Input
                                placeholder="Search..."
                                variant="unstyled"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                fontSize="14px"
                                color="black"
                                autoFocus
                            />
                        </HStack>

                        <Box flex={1} overflowY="auto">
                            {loading ? (
                                <Flex justify="center" align="center" h="100px">
                                    <Spinner size="sm" color="gray.400" />
                                </Flex>
                            ) : searchTerm && searchResults.length > 0 ? (
                                <VStack align="stretch" gap={0}>
                                    {searchResults.map((user) => (
                                        <Flex
                                            key={user.id}
                                            align="center"
                                            gap={3}
                                            px={4}
                                            py={3}
                                            cursor="pointer"
                                            _hover={{ bg: "gray.50" }}
                                            onClick={() => handleSelect(user)}
                                        >
                                            <UserAvatar src={user.avatarUrl} size="44px" />
                                            <VStack align="start" gap={0}>
                                                <Text fontWeight="bold" fontSize="14px" color="black">{user.username}</Text>
                                                <Text color="gray.500" fontSize="14px">{user.fullName}</Text>
                                            </VStack>
                                        </Flex>
                                    ))}
                                </VStack>
                            ) : searchTerm ? (
                                <Text color="gray.400" fontSize="14px" textAlign="center" mt={8}>No account found.</Text>
                            ) : null}
                        </Box>
                    </DialogBody>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};

export default NewMessageModal;
