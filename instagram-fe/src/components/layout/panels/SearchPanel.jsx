import React, { useState } from "react";
import { Box, Text, Input, VStack, Flex } from "@chakra-ui/react";
import UserAvatar from "../../common/UserAvatar";

const SearchPanel = ({ isOpen }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const mockUsers = [
        { id: 1, username: "cristiano", fullName: "Cristiano Ronaldo", avatar: "https://bit.ly/dan-abramov" },
        { id: 2, username: "leomessi", fullName: "Leo Messi", avatar: "https://bit.ly/kent-c-dodds" },
        { id: 3, username: "selenagomez", fullName: "Selena Gomez", avatar: "https://bit.ly/ryan-florence" },
    ];

    return (
        <Box
            position="fixed"
            left="72px"
            top={0}
            height="100vh"
            width="397px"
            bg="white"
            borderRight="1px solid"
            borderColor="gray.200"
            zIndex={90}
            p={4}
            boxShadow="xl"
            color="black"
            transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
            opacity={isOpen ? 1 : 0}
            visibility={isOpen ? "visible" : "hidden"}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
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
                    <Text fontWeight="bold" color="black">Recent</Text>
                    <Text color="blue.500" fontSize="sm" fontWeight="semibold" cursor="pointer">Clear all</Text>
                </Flex>

                {mockUsers.map((user) => (
                    <Flex
                        key={user.id}
                        align="center"
                        gap={3}
                        cursor="pointer"
                        p={2}
                        _hover={{ bg: "gray.50" }}
                        borderRadius="md"
                        transition="background 0.2s"
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
                ))}
            </VStack>
        </Box>
    );
};

export default SearchPanel;
