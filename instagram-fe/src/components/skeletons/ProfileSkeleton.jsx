import React from "react";
import {
    Box,
    HStack,
    VStack,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Grid,
    Flex,
} from "@chakra-ui/react";

const ProfileSkeleton = () => {
    return (
        <Box width="100%" bg="white">
            {/* Header Skeleton */}
            <Flex
                flexDirection="row"
                gap={{ base: 8, md: 20 }}
                pt={12}
                pb={10}
                px={4}
                alignItems="start"
                maxW="935px"
                mx="auto"
            >
                {/* Avatar Section */}
                <Box flexShrink={0} pt={2}>
                    <SkeletonCircle
                        size={{ base: "77px", md: "150px" }}
                        startColor="gray.100"
                        endColor="gray.200"
                    />
                </Box>

                {/* Info Section */}
                <VStack align="start" gap={4} flex={1} width="100%">
                    <HStack gap={4} wrap="wrap" width="100%">
                        <Skeleton
                            height="24px"
                            width="120px"
                            borderRadius="4px"
                        />
                        <HStack gap={2}>
                            <Skeleton
                                height="32px"
                                width="90px"
                                borderRadius="8px"
                            />
                            <Skeleton
                                height="32px"
                                width="110px"
                                borderRadius="8px"
                            />
                            <Skeleton
                                height="24px"
                                width="24px"
                                borderRadius="full"
                            />
                        </HStack>
                    </HStack>

                    <HStack gap={10}>
                        <Skeleton
                            height="18px"
                            width="60px"
                            borderRadius="4px"
                        />
                        <Skeleton
                            height="18px"
                            width="80px"
                            borderRadius="4px"
                        />
                        <Skeleton
                            height="18px"
                            width="80px"
                            borderRadius="4px"
                        />
                    </HStack>

                    <VStack align="start" gap={2} width="100%">
                        <Skeleton
                            height="16px"
                            width="140px"
                            borderRadius="4px"
                        />
                        <Skeleton
                            height="14px"
                            width="240px"
                            borderRadius="4px"
                        />
                        <Skeleton
                            height="14px"
                            width="180px"
                            borderRadius="4px"
                        />
                    </VStack>
                </VStack>
            </Flex>

            {/* Highlights Skeleton */}
            <Box py={8} px={4} overflowX="hidden">
                <HStack gap={10} align="start">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <VStack key={i} gap={2} minW="87px">
                            <SkeletonCircle
                                size="87px"
                                startColor="gray.50"
                                endColor="gray.100"
                                border="1px solid"
                                borderColor="gray.100"
                            />
                            <Skeleton
                                height="12px"
                                width="40px"
                                borderRadius="4px"
                            />
                        </VStack>
                    ))}
                </HStack>
            </Box>

            {/* Tabs Skeleton */}
            <Flex
                borderTop="1px solid"
                borderColor="gray.200"
                justify="center"
                gap={12}
            >
                {[1, 2, 3].map((i) => (
                    <HStack key={i} py={4} gap={2}>
                        <Skeleton height="12px" width="12px" />
                        <Skeleton
                            height="12px"
                            width="50px"
                            borderRadius="2px"
                        />
                    </HStack>
                ))}
            </Flex>

            {/* Grid Skeleton */}
            <Grid templateColumns="repeat(3, 1fr)" gap="4px" py={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <Box key={i} position="relative" paddingBottom="100%">
                        <Skeleton
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            borderRadius="0"
                        />
                    </Box>
                ))}
            </Grid>
        </Box>
    );
};

export default ProfileSkeleton;
