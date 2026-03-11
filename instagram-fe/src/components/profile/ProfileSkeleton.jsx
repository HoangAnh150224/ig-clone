import React from "react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    Skeleton,
    SkeletonCircle,
    Container,
    Grid,
    GridItem,
} from "@chakra-ui/react";

const ProfileSkeleton = () => {
    return (
        <Container maxW="935px" p={0} bg="white">
            {/* Header Skeleton */}
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 8, md: 20 }}
                py={8}
                px={4}
                align="center"
            >
                {/* Avatar Section */}
                <Box flexShrink={0}>
                    <SkeletonCircle size={{ base: "84px", md: "150px" }} />
                </Box>

                {/* Info Section */}
                <VStack align="start" gap={6} flex={1}>
                    <HStack gap={4} width="100%">
                        <Skeleton height="24px" width="150px" />
                        <Skeleton
                            height="32px"
                            width="100px"
                            borderRadius="8px"
                        />
                        <Skeleton
                            height="32px"
                            width="100px"
                            borderRadius="8px"
                        />
                    </HStack>

                    <HStack
                        gap={10}
                        display={{ base: "none", md: "flex" }}
                        width="100%"
                    >
                        <Skeleton height="18px" width="80px" />
                        <Skeleton height="18px" width="80px" />
                        <Skeleton height="18px" width="80px" />
                    </HStack>

                    <VStack align="start" gap={2} width="100%">
                        <Skeleton height="16px" width="120px" />
                        <Skeleton height="14px" width="250px" />
                        <Skeleton height="14px" width="200px" />
                    </VStack>
                </VStack>
            </Flex>

            {/* Highlights Skeleton */}
            <HStack gap={10} px={10} py={4} mb={10} overflowX="hidden">
                {[1, 2, 3, 4].map((i) => (
                    <VStack key={i} gap={2}>
                        <SkeletonCircle
                            size="87px"
                            p="3px"
                            border="1px solid"
                            borderColor="gray.100"
                        />
                        <Skeleton height="12px" width="50px" />
                    </VStack>
                ))}
            </HStack>

            {/* Tabs Skeleton */}
            <Flex
                borderTop="1px solid"
                borderColor="gray.200"
                justify="center"
                gap={16}
            >
                <Skeleton height="1px" width="60px" mt="-1px" />
                <Skeleton height="1px" width="60px" mt="-1px" />
                <Skeleton height="1px" width="60px" mt="-1px" />
            </Flex>
            <HStack justify="center" gap={16} py={4}>
                <Skeleton height="16px" width="60px" />
                <Skeleton height="16px" width="60px" />
                <Skeleton height="16px" width="60px" />
            </HStack>

            {/* Grid Skeleton */}
            <Grid templateColumns="repeat(3, 1fr)" gap="28px" py={4}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <GridItem key={i} ratio={1 / 1}>
                        <Skeleton height="300px" width="100%" />
                    </GridItem>
                ))}
            </Grid>
        </Container>
    );
};

export default ProfileSkeleton;
