import React from 'react';
import { Box, Flex, VStack, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const PostCardSkeleton = () => {
  return (
    <Box 
      width="100%" 
      maxW="470px" 
      mx="auto"
      mb={4} 
      bg="white" 
      border="1px solid" 
      borderColor="gray.200" 
      borderRadius="8px"
      overflow="hidden"
    >
      {/* Header */}
      <Flex p={3} justify="space-between" align="center" bg="white">
        <HStack gap={3}>
          <SkeletonCircle size="32px" />
          <Skeleton height="14px" width="100px" />
        </HStack>
        <SkeletonCircle size="20px" />
      </Flex>

      {/* Media (Image/Video) - 4:5 Aspect Ratio */}
      <Box 
        width="100%" 
        paddingBottom="125%"
        position="relative"
        bg="gray.100"
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Skeleton height="100%" width="100%" />
        </Box>
      </Box>

      {/* Footer / Interaction Area */}
      <Box p={3} bg="white">
        {/* Buttons */}
        <Flex justify="space-between" mb={3}>
          <HStack gap={4}>
            <SkeletonCircle size="24px" />
            <SkeletonCircle size="24px" />
            <SkeletonCircle size="24px" />
          </HStack>
          <SkeletonCircle size="24px" />
        </Flex>

        {/* Likes & Caption */}
        <VStack align="start" gap={2}>
          <Skeleton height="14px" width="80px" />
          <HStack width="100%">
            <Skeleton height="12px" width="60px" />
            <Skeleton height="12px" width="150px" />
          </HStack>
          <Skeleton height="10px" width="120px" />
        </VStack>
      </Box>

      {/* Comment Input Skeleton */}
      <Box borderTop="1px solid" borderColor="gray.100" p={3} bg="white" display={{ base: "none", md: "block" }}>
        <HStack gap={3}>
          <SkeletonCircle size="20px" />
          <Skeleton height="14px" flex={1} />
          <Skeleton height="14px" width="40px" />
        </HStack>
      </Box>
    </Box>
  );
};

export default PostCardSkeleton;
