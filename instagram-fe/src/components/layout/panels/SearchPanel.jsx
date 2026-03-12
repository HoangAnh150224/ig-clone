import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Input, Flex, Spinner } from "@chakra-ui/react";
import UserAvatar from "../../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import profileService from "../../../services/profileService";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";

const SearchPanel = ({ isOpen }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && !searchTerm) {
            const fetchHistory = async () => {
                try {
                    const history = await profileService.getSearchHistory();
                    setSearchHistory(history || []);
                } catch (error) {
                    console.error("Failed to fetch history:", error);
                }
            };
            fetchHistory();
        }
    }, [isOpen, searchTerm]);

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
                // Extract users list from SearchResultResponse or fallback to array
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

    const handleNavigate = async (user) => {
        if (!user || !user.id || !user.username) return;
        try {
            await profileService.addToSearchHistory(user.id);
        } catch (error) {
            console.error("Failed to add to history:", error);
        }
        setSearchTerm("");
        navigate(`/${user.username}`);
    };

    const handleDeleteHistory = async (e, id) => {
        e.stopPropagation();
        try {
            await profileService.deleteSearchHistory(id);
            setSearchHistory(searchHistory.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to delete history:", error);
        }
    };

    const handleClearAll = async () => {
        try {
            await profileService.clearSearchHistory();
            setSearchHistory([]);
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    };

    return (
        <Box
            position="fixed"
            left="72px"
            top={0}
            height="100vh"
            width="397px"
            bg="white"
            zIndex={90}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
            opacity={isOpen ? 1 : 0}
            visibility={isOpen ? "visible" : "hidden"}
            borderRight="1px solid"
            borderColor="gray.200"
            borderRightRadius="16px"
            boxShadow="4px 0 24px rgba(0,0,0,0.08)"
            display="flex"
            flexDirection="column"
            overflow="hidden"
        >
            <Box pt={6} px={6} mb={8}>
                <Text fontSize="24px" fontWeight="bold" tracking="tight" color="black">
                    Search
                </Text>
            </Box>

            <Box px={4} mb={6}>
                <Box position="relative" display="flex" alignItems="center">
                    {!searchTerm && (
                        <Box position="absolute" left="12px" color="gray.400" pointerEvents="none" zIndex={1}>
                            <AiOutlineSearch size={18} />
                        </Box>
                    )}
                    <Input
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg="#efefef"
                        border="none"
                        borderRadius="8px"
                        height="40px"
                        pl={searchTerm ? "12px" : "40px"}
                        pr="40px"
                        fontSize="16px"
                        color="black"
                        _focus={{ outline: "none", pl: "12px" }}
                        transition="padding 0.2s"
                    />
                    {searchTerm && (
                        <Box
                            position="absolute"
                            right="12px"
                            bg="gray.400"
                            borderRadius="full"
                            width="18px"
                            height="18px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            cursor="pointer"
                            onClick={() => setSearchTerm("")}
                        >
                            <AiOutlineClose size={10} color="white" />
                        </Box>
                    )}
                </Box>
            </Box>

            <Box height="1px" bg="gray.100" width="100%" />

            <Box flex={1} overflowY="auto" pt={4} className="no-scrollbar">
                <Flex justify="space-between" align="center" px={6} mb={4}>
                    <Text fontWeight="bold" fontSize="16px" color="black">
                        {searchTerm ? "Results" : "Recent"}
                    </Text>
                    {!searchTerm && searchHistory.length > 0 && (
                        <Text
                            color="#0095f6"
                            fontSize="14px"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={handleClearAll}
                        >
                            Clear all
                        </Text>
                    )}
                </Flex>

                <VStack align="stretch" gap={0} pb={4}>
                    {loading ? (
                        <VStack px={6} mt={2} gap={4} align="stretch">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Flex key={i} align="center" gap={3}>
                                    <Box w="44px" h="44px" borderRadius="full" bg="gray.100" className="animate-pulse" />
                                    <VStack align="start" gap={1} flex={1}>
                                        <Box h="12px" w="100px" bg="gray.100" borderRadius="4px" className="animate-pulse" />
                                        <Box h="10px" w="150px" bg="gray.50" borderRadius="4px" className="animate-pulse" />
                                    </VStack>
                                </Flex>
                            ))}
                        </VStack>
                    ) : searchTerm ? (
                        searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <Flex
                                    key={user.id}
                                    align="center"
                                    gap={3}
                                    px={6}
                                    py={3}
                                    cursor="pointer"
                                    _hover={{ bg: "blackAlpha.50" }}
                                    onClick={() => handleNavigate(user)}
                                >
                                    <UserAvatar src={user.avatarUrl} size="44px" />
                                    <VStack align="start" gap={0} minW={0}>
                                        <Text fontWeight="bold" fontSize="14px" color="black" truncate>{user.username}</Text>
                                        <Text color="gray.500" fontSize="14px" truncate>{user.fullName}</Text>
                                    </VStack>
                                </Flex>
                            ))
                        ) : (
                            <Text color="gray.400" fontSize="14px" textAlign="center" mt={12} px={6}>
                                No results found.
                            </Text>
                        )
                    ) : searchHistory.length > 0 ? (
                        searchHistory.map((item) => (
                            <Flex
                                key={item.id}
                                align="center"
                                justify="space-between"
                                px={6}
                                py={2}
                                cursor="pointer"
                                _hover={{ bg: "blackAlpha.50" }}
                                onClick={() => handleNavigate(item.searchedUser)}
                            >
                                <Flex align="center" gap={3}>
                                    <UserAvatar src={item.searchedUser?.avatarUrl} size="44px" />
                                    <VStack align="start" gap={0} minW={0}>
                                        <Text fontWeight="bold" fontSize="14px" color="black" truncate>{item.searchedUser?.username}</Text>
                                        <Text color="gray.500" fontSize="14px" truncate>{item.searchedUser?.fullName}</Text>
                                    </VStack>
                                </Flex>
                                <Box
                                    p={2}
                                    color="gray.400"
                                    _hover={{ color: "black" }}
                                    onClick={(e) => handleDeleteHistory(e, item.id)}
                                >
                                    <AiOutlineClose size={18} />
                                </Box>
                            </Flex>
                        ))
                    ) : (
                        <Flex direction="column" align="center" justify="center" h="200px" px={10} textAlign="center">
                            <Text color="black" fontSize="14px" fontWeight="bold">No recent searches.</Text>
                        </Flex>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default SearchPanel;
