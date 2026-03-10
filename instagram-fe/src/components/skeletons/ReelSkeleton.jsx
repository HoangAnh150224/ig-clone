import React from 'react';
import { Box, Flex, VStack, Skeleton, SkeletonCircle, HStack } from '@chakra-ui/react';

const ReelSkeleton = () => {
  return (
    <Box height="98vh" width="550px" bg="black" borderRadius="12px" position="relative" overflow="hidden">
      {/* Media Background */}
      <Skeleton height="100%" width="100%" opacity={0.3} />

      {/* Right Controls */}
      <VStack position="absolute" right={4} bottom={20} gap={8}>
        <VStack gap={2}>
          <SkeletonCircle size="36px" />
          <Skeleton height="10px" width="20px" />
        </VStack>
        <VStack gap={2}>
          <SkeletonCircle size="36px" />
          <Skeleton height="10px" width="20px" />
        </VStack>
        <SkeletonCircle size="36px" />
        <SkeletonCircle size="30px" />
        <SkeletonCircle size="30px" />
      </VStack>

      {/* Bottom Info */}
      <Box position="absolute" bottom={0} left={0} right={0} p={6}>
        <HStack gap={3} mb={4}>
          <SkeletonCircle size="44px" />
          <Skeleton height="16px" width="120px" />
          <Skeleton height="28px" width="70px" borderRadius="8px" />
        </HStack>
        <Skeleton height="16px" width="80%" mb={3} />
        <Skeleton height="16px" width="60%" mb={4} />
        <HStack gap={2}>
          <Skeleton height="14px" width="100px" />
        </HStack>
      </Box>
    </Box>
  );
};

export default ReelSkeleton;
