import React from 'react';
import { Flex, Box, VStack, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const MessageSkeleton = () => {
  return (
    <Flex height="100vh" bg="white" color="black" width="100%">
      {/* Sidebar Chat List Skeleton */}
      <Box width="397px" borderRight="1px solid" borderColor="gray.100" p={4}>
        <HStack justify="space-between" mb={8} px={2}>
          <Skeleton height="24px" width="100px" />
          <SkeletonCircle size="24px" />
        </HStack>

        <HStack gap={4} mb={8} px={2}>
          <Skeleton height="16px" width="60px" />
          <Skeleton height="16px" width="60px" />
        </HStack>

        <VStack align="stretch" gap={6}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <HStack key={i} gap={3} px={2}>
              <SkeletonCircle size="56px" />
              <VStack align="start" gap={2} flex={1}>
                <Skeleton height="14px" width="120px" />
                <Skeleton height="12px" width="180px" />
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Main Chat Window Skeleton */}
      <Flex flex={1} direction="column" align="center" justify="center" p={10}>
        <VStack gap={6}>
          <SkeletonCircle size="96px" p="2px" border="2px solid" borderColor="gray.100" />
          <VStack gap={2}>
            <Skeleton height="24px" width="200px" />
            <Skeleton height="14px" width="300px" />
          </VStack>
          <Skeleton height="36px" width="120px" borderRadius="8px" mt={4} />
        </VStack>
      </Flex>
    </Flex>
  );
};

export default MessageSkeleton;
