import React, { useState, useEffect, useCallback } from 'react';
import { Box, Image, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { AiOutlineClose, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import UserAvatar from '../common/UserAvatar';

const StoryModal = ({ isOpen, onClose, highlights, initialHighlightIndex }) => {
  const [highlightIndex, setHighlightIndex] = useState(initialHighlightIndex || 0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentHighlight = highlights?.[highlightIndex];
  const currentStories = currentHighlight?.stories || [];
  const currentStory = currentStories[storyIndex];
  const currentUser = currentHighlight?.user; 

  useEffect(() => {
    if (isOpen) {
      setHighlightIndex(initialHighlightIndex || 0);
      setStoryIndex(0);
      setProgress(0);
    }
  }, [isOpen, initialHighlightIndex]);

  const handleNext = useCallback(() => {
    if (storyIndex < currentStories.length - 1) {
      setStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (highlightIndex < highlights.length - 1) {
      setHighlightIndex(prev => prev + 1);
      setStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIndex, currentStories.length, highlightIndex, highlights?.length, onClose]);

  const handlePrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (highlightIndex > 0) {
      const prevHighlight = highlights[highlightIndex - 1];
      setHighlightIndex(prev => prev - 1);
      setStoryIndex((prevHighlight.stories?.length || 1) - 1);
      setProgress(0);
    }
  }, [storyIndex, highlightIndex, highlights]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; 
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, handleNext]);

  if (!isOpen || !currentHighlight) return null;

  return (
    <Box 
      position="fixed" top={0} left={0} right={0} bottom={0} 
      bg="rgba(0,0,0,0.98)" zIndex={2000} display="flex" alignItems="center" justifyContent="center"
    >
      <Box 
        position="fixed" top={6} right={6} color="white" cursor="pointer" 
        onClick={onClose} zIndex={2100} _hover={{ opacity: 0.7 }}
      >
        <AiOutlineClose size={36} />
      </Box>

      {(highlightIndex > 0 || storyIndex > 0) && (
        <Box 
          position="absolute" left="5%" cursor="pointer" color="white" 
          onClick={handlePrev} display={{ base: "none", lg: "block" }}
          zIndex={2100} _hover={{ opacity: 0.7 }}
        >
          <AiOutlineLeft size={48} />
        </Box>
      )}
      <Box 
        position="absolute" right="5%" cursor="pointer" color="white" 
        onClick={handleNext} display={{ base: "none", lg: "block" }}
        zIndex={2100} _hover={{ opacity: 0.7 }}
      >
        <AiOutlineRight size={48} />
      </Box>

      <Box 
        width="100%" maxW="550px" height="98vh" position="relative" 
        borderRadius={{ base: "0", md: "12px" }} overflow="hidden" bg="black"
      >
        {/* Progress Segments - Placed higher */}
        <HStack position="absolute" top={3} left={4} right={4} spacing={1.5} zIndex={20}>
          {currentStories.map((_, idx) => (
            <Box key={idx} flex={1} height="2px" bg="whiteAlpha.400" borderRadius="full" overflow="hidden">
              <Box 
                width={idx < storyIndex ? "100%" : idx === storyIndex ? `${progress}%` : "0%"} 
                height="100%" bg="white" 
                transition="width 0.1s linear"
              />
            </Box>
          ))}
        </HStack>

        {/* User Info - Placed closer to progress bar */}
        <Box position="absolute" top={6} left={0} right={0} p={4} zIndex={10}>
          <HStack gap={3}>
            <UserAvatar src={currentUser?.avatar} size="32px" />
            <VStack align="start" gap={0}>
              <Text color="white" fontWeight="bold" fontSize="14px">{currentUser?.username}</Text>
              <Text color="whiteAlpha.800" fontSize="12px" mt="-2px">{currentHighlight.title}</Text>
            </VStack>
          </HStack>
        </Box>

        <Flex position="absolute" top={0} left={0} right={0} bottom={0} zIndex={5}>
          <Box flex={1} onClick={handlePrev} cursor="pointer" />
          <Box flex={2} onClick={handleNext} cursor="pointer" />
        </Flex>

        <Image 
          src={currentStory?.url} 
          width="100%" height="100%" objectFit="cover" 
        />

        <Box position="absolute" bottom={0} left={0} right={0} p={8} zIndex={10} bgGradient="linear(to-t, blackAlpha.800, transparent)">
          <Flex border="1px solid white" borderRadius="full" px={6} py={3} align="center">
            <Text color="whiteAlpha.900" fontSize="md">Reply to {currentUser?.username}...</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default StoryModal;
