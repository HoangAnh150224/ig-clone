import React from 'react';
import { Flex, VStack, HStack, Skeleton, SkeletonCircle, Box } from '@chakra-ui/react';

const NotificationSkeleton = () => {
  return (
    <VStack gap={6} align="stretch" py={4}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <HStack key={i} gap={3} px={4}>
          <SkeletonCircle size="44px" />
          <VStack align="start" gap={1} flex={1}>
            <Skeleton height="14px" width="100%" />
            <Skeleton height="10px" width="40%" />
          </VStack>
          {i % 3 === 0 ? (
            <Skeleton height="32px" width="70px" borderRadius="8px" />
          ) : (
            <Skeleton height="40px" width="40px" borderRadius="4px" />
          )}
        </HStack>
      ))}
    </VStack>
  );
};

export default NotificationSkeleton;
