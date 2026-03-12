import React from "react";
import {
    Box,
    VStack,
    Skeleton,
    SkeletonCircle,
    HStack,
} from "@chakra-ui/react";

const ReelSkeleton = () => {
    return (
        <Box
            height="98vh"
            width="min(470px, 98vw)"
            bg="black"
            borderRadius="0"
            position="relative"
            overflow="hidden"
        >
            {/* Media Background */}
            <Skeleton height="100%" width="100%" opacity={0.2} borderRadius="0" startColor="gray.900" endColor="gray.800" />

            {/* Right Controls */}
            <VStack position="absolute" right={3} bottom={20} gap={5} zIndex={10}>
                <VStack gap={1}>
                    <SkeletonCircle size="32px" startColor="gray.800" endColor="gray.700" />
                    <Skeleton height="10px" width="20px" borderRadius="2px" startColor="gray.800" endColor="gray.700" />
                </VStack>
                <VStack gap={1}>
                    <SkeletonCircle size="32px" startColor="gray.800" endColor="gray.700" />
                    <Skeleton height="10px" width="20px" borderRadius="2px" startColor="gray.800" endColor="gray.700" />
                </VStack>
                <SkeletonCircle size="30px" startColor="gray.800" endColor="gray.700" />
                <SkeletonCircle size="26px" startColor="gray.800" endColor="gray.700" />
                <SkeletonCircle size="28px" startColor="gray.800" endColor="gray.700" />
                <Skeleton height="32px" width="32px" borderRadius="4px" startColor="gray.800" endColor="gray.700" />
            </VStack>

            {/* Bottom Info */}
            <Box position="absolute" bottom={0} left={0} right={0} p={5} zIndex={5}>
                <HStack gap={3} mb={3}>
                    <SkeletonCircle size="34px" startColor="gray.800" endColor="gray.700" />
                    <Skeleton height="14px" width="100px" borderRadius="4px" startColor="gray.800" endColor="gray.700" />
                    <Skeleton height="24px" width="60px" borderRadius="4px" startColor="gray.800" endColor="gray.700" />
                </HStack>
                <Skeleton height="14px" width="80%" mb={2} borderRadius="4px" startColor="gray.800" endColor="gray.700" />
                <Skeleton height="14px" width="60%" mb={3} borderRadius="4px" startColor="gray.800" endColor="gray.700" />
                <HStack gap={2}>
                    <Skeleton height="12px" width="120px" borderRadius="4px" startColor="gray.800" endColor="gray.700" />
                </HStack>
            </Box>
        </Box>
    );
};

export default ReelSkeleton;
