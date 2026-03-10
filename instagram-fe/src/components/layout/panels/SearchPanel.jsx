import React, { useState, useEffect } from "react";
import { Box, Text, Input, VStack, Flex } from "@chakra-ui/react";
import UserAvatar from "../../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import { allUsers } from "../../../api/dummyData";

const SearchPanel = ({ isOpen }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    // Logic tìm kiếm thời gian thực
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]); // Hoặc hiển thị danh sách gợi ý mặc định
            return;
        }

        const filtered = allUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchTerm]);

    const handleNavigate = (username) => {
        setSearchTerm(""); // Reset tìm kiếm sau khi điều hướng
        navigate(`/${username}`);
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
            p={4}
            color="black"
            transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
            opacity={isOpen ? 1 : 0}
            visibility={isOpen ? "visible" : "hidden"}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            boxShadow="20px 0 20px -20px rgba(0,0,0,0.1)" // Bóng đổ nhẹ bên phải
        >
            <Text fontSize="24px" fontWeight="bold" mb={6} mt={2} color="black">
                Search
            </Text>

            <Box mb={6}>
                <Input
                    placeholder="Search"
                    bg="gray.100"
                    border="none"
                    _focus={{ bg: "gray.100", border: "1px solid", borderColor: "gray.300" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    color="black"
                    _placeholder={{ color: "gray.500" }}
                    borderRadius="8px"
                />
            </Box>

            <Box height="1px" bg="gray.200" width="full" mb={4} />

            <VStack align="stretch" gap={4} overflowY="auto" maxH="calc(100vh - 180px)">
                <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="bold" color="black">
                        {searchTerm ? "Results" : "Recent"}
                    </Text>
                    {!searchTerm && (
                        <Text color="blue.500" fontSize="sm" fontWeight="semibold" cursor="pointer">
                            Clear all
                        </Text>
                    )}
                </Flex>

                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <Flex
                            key={user.id}
                            align="center"
                            gap={3}
                            cursor="pointer"
                            p={2}
                            _hover={{ bg: "gray.50" }}
                            borderRadius="md"
                            transition="background 0.2s"
                            onClick={() => handleNavigate(user.username)}
                        >
                            <UserAvatar src={user.avatar} size="44px" />
                            <Box>
                                <Text fontWeight="bold" fontSize="sm" color="black">
                                    {user.username}
                                </Text>
                                <Text color="gray.500" fontSize="sm">
                                    {user.fullName}
                                </Text>
                            </Box>
                        </Flex>
                    ))
                ) : (
                    searchTerm && (
                        <Text color="gray.500" fontSize="sm" textAlign="center" mt={10}>
                            No results found.
                        </Text>
                    )
                )}

                {!searchTerm && (
                    <Text color="gray.500" fontSize="sm" textAlign="center" mt={10}>
                        No recent searches.
                    </Text>
                )}
            </VStack>
        </Box>
    );
};

export default SearchPanel;
