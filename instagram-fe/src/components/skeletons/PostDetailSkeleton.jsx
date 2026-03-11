import React from "react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Skeleton,
    SkeletonCircle,
} from "@chakra-ui/react";

const PostDetailSkeleton = () => {
    return (
        <Box maxW="1200px" mx="auto" mt={8} mb={20} px={{ base: 0, md: 4 }}>
            <Flex
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                direction={{ base: "column", md: "row" }}
                height={{ md: "calc(100vh - 120px)" }}
                maxH="900px"
            >
                {/* Media Section */}
                <Box flex={1.5} bg="gray.100" height="100%">
                    <Skeleton height="100%" width="100%" />
                </Box>

                {/* Info & Comments Section */}
                <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    bg="white"
                    height="100%"
                    borderLeft={{ md: "1px solid" }}
                    borderColor="gray.200"
                >
                    {/* Header */}
                    <Flex
                        p={4}
                        justify="space-between"
                        align="center"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                    >
                        <HStack gap={3}>
                            <SkeletonCircle size="32px" />
                            <Skeleton height="14px" width="100px" />
                        </HStack>
                    </Flex>

                    {/* Comments Area */}
                    <Box flex={1} p={4}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Flex key={i} gap={3} mb={6} align="start">
                                <SkeletonCircle size="32px" />
                                <VStack align="start" gap={2} flex={1}>
                                    <Skeleton height="12px" width="70%" />
                                    <Skeleton height="10px" width="30%" />
                                </VStack>
                            </Flex>
                        ))}
                    </Box>

                    {/* Interaction Area */}
                    <Box p={4} borderTop="1px solid" borderColor="gray.100">
                        <HStack justify="space-between" mb={4}>
                            <HStack gap={4}>
                                <SkeletonCircle size="24px" />
                                <SkeletonCircle size="24px" />
                                <SkeletonCircle size="24px" />
                            </HStack>
                            <SkeletonCircle size="24px" />
                        </HStack>
                        <Skeleton height="14px" width="80px" mb={2} />
                        <Skeleton height="10px" width="60px" />
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default PostDetailSkeleton;
