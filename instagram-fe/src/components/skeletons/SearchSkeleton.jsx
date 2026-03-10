import React from 'react';
import { VStack, HStack, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const SearchSkeleton = () => {
  return (
    <VStack align="stretch" gap={4} py={2}>
      {[1, 2, 3, 4, 5].map((i) => (
        <HStack key={i} gap={3} px={2}>
          <SkeletonCircle size="44px" />
          <VStack align="start" gap={2} flex={1}>
            <Skeleton height="12px" width="100px" />
            <Skeleton height="10px" width="150px" />
          </VStack>
        </HStack>
      ))}
    </VStack>
  );
};

export default SearchSkeleton;
