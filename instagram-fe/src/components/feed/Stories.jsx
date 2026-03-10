import React from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';

const mockStories = [
  { id: 1, username: 'your_story', avatar: 'https://i.pravatar.cc/150?u=1', isOwn: true },
  { id: 2, username: 'messi', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, username: 'ronaldo', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, username: 'nasa', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, username: 'spacex', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, username: 'coding_vibes', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 7, username: 'pixel_art', avatar: 'https://i.pravatar.cc/150?u=7' },
];

const Stories = () => {
  return (
    <Box 
      width="100%" 
      maxW="800px" 
      mx="auto" 
      py={4} 
      mb={4}
      bg="white"
      overflowX="auto" 
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        'msOverflowStyle': 'none',
        'scrollbarWidth': 'none',
      }}
    >
      <HStack gap={6} px={4}>
        {mockStories.map((story) => (
          <VStack key={story.id} gap={2} cursor="pointer" minW="82px">
            <Box 
              p="3px" 
              borderRadius="full" 
              bgGradient={story.isOwn ? "none" : "linear(to-tr, #f9ce34, #ee2a7b, #6228d7)"}
              border={story.isOwn ? "1px solid" : "none"}
              borderColor="gray.200"
              width="82px"
              height="82px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box bg="white" borderRadius="full" p="2px">
                <UserAvatar src={story.avatar} size="66px" />
              </Box>
            </Box>
            <Text fontSize="12px" width="82px" textAlign="center" isTruncated color="black">
              {story.isOwn ? 'Your story' : story.username}
            </Text>
          </VStack>
        ))}
      </HStack>
    </Box>
  );
};

export default Stories;
