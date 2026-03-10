import React, { useState } from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { AiOutlinePlus } from 'react-icons/ai';
import StoryModal from '../modals/StoryModal';

const ProfileHighlights = ({ isOwnProfile, user }) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(0);

  // Get highlights from the passed user data
  const highlights = user?.highlights || [];

  const handleHighlightClick = (index) => {
    setSelectedHighlightIndex(index);
    setIsStoryOpen(true);
  };

  if (!isOwnProfile && highlights.length === 0) return null;

  return (
    <>
      <Box 
        width="100%" py={8} px={4} bg="white" overflowX="auto" 
        css={{ '&::-webkit-scrollbar': { display: 'none' } }}
      >
        <HStack gap={10} align="start">
          {/* "New" button */}
          {isOwnProfile && (
            <VStack gap={2} cursor="pointer" minW="87px">
              <Box 
                width="87px" height="87px" borderRadius="full" border="1px solid" borderColor="gray.200"
                display="flex" alignItems="center" justifyContent="center" bg="gray.50"
                _hover={{ bg: 'gray.100' }}
              >
                <AiOutlinePlus size={30} color="gray" />
              </Box>
              <Text fontSize="12px" fontWeight="600" color="black">New</Text>
            </VStack>
          )}

          {highlights.map((item, index) => (
            <VStack key={item.id} gap={2} cursor="pointer" minW="87px" onClick={() => handleHighlightClick(index)}>
              <Box 
                width="87px" height="87px" borderRadius="full" border="1px solid" borderColor="gray.200"
                p="3px" display="flex" alignItems="center" justifyContent="center" bg="white"
              >
                <Box width="100%" height="100%" borderRadius="full" overflow="hidden" bg="gray.100">
                  <img src={item.cover} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              </Box>
              <Text fontSize="12px" fontWeight="600" color="black" textAlign="center" isTruncated width="80px">
                {item.title}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Box>

      {/* Story Player for Highlights */}
      <StoryModal 
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        highlights={highlights.map(h => ({ ...h, user: user }))}
        initialHighlightIndex={selectedHighlightIndex}
      />
    </>
  );
};

export default ProfileHighlights;
