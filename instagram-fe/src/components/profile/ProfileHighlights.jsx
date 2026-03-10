import React from 'react';
import { Box, HStack, Text, VStack, IconButton, Center } from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import UserAvatar from '../common/UserAvatar';

const ProfileHighlights = ({ isOwnProfile }) => {
  // Mock data for highlights
  const highlights = [
    { id: 1, title: 'Nature', cover: 'https://picsum.photos/200/200?random=10' },
    { id: 2, title: 'Travel', cover: 'https://picsum.photos/200/200?random=11' },
    { id: 3, title: 'Coding', cover: 'https://picsum.photos/200/200?random=12' },
    { id: 4, title: 'Vibe', cover: 'https://picsum.photos/200/200?random=13' },
  ];

  return (
    <Box 
      width="100%" 
      py={8} 
      px={4}
      bg="white"
      overflowX="auto" 
      css={{
        '&::-webkit-scrollbar': { display: 'none' },
        'msOverflowStyle': 'none',
        'scrollbarWidth': 'none',
      }}
    >
      <HStack gap={10} align="start">
        {/* "New" button - only if it's user's own profile */}
        {isOwnProfile && (
          <VStack gap={2} cursor="pointer" minW="87px">
            <Box 
              width="87px"
              height="87px"
              borderRadius="full"
              border="1px solid"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.50"
              _hover={{ bg: 'gray.100' }}
            >
              <AiOutlinePlus size={30} color="gray" />
            </Box>
            <Text fontSize="12px" fontWeight="600" color="black">New</Text>
          </VStack>
        )}

        {highlights.map((item) => (
          <VStack key={item.id} gap={2} cursor="pointer" minW="87px">
            <Box 
              width="87px"
              height="87px"
              borderRadius="full"
              border="1px solid"
              borderColor="gray.200"
              p="3px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="white"
            >
              <Box 
                width="100%" 
                height="100%" 
                borderRadius="full" 
                overflow="hidden"
                bg="gray.100"
              >
                <img 
                  src={item.cover} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </Box>
            </Box>
            <Text fontSize="12px" fontWeight="600" color="black" textAlign="center" isTruncated width="80px">
              {item.title}
            </Text>
          </VStack>
        ))}
      </HStack>
    </Box>
  );
};

export default ProfileHighlights;
