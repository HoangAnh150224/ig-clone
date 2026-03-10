import React, { useRef, useState, useEffect } from 'react';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import StoryModal from '../modals/StoryModal';
import storyService from '../../services/storyService';

const Stories = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [stories, setStories] = useState([]);

  // Mouse Drag Logic
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchStories = async () => {
      const response = await storyService.getStoriesForFeed();
      setStories(response);
    };
    fetchStories();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const slide = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleStoryClick = (story) => {
    if (isDragging) return;
    setSelectedUser(story);
    setIsStoryOpen(true);
  };

  return (
    <>
      <Box position="relative" width="100%" maxW="630px" mx="auto" mb={4} userSelect="none">
        {showLeft && (
          <Box
            position="absolute" left={2} top="48px" zIndex={10}
            width="26px" height="26px" borderRadius="full"
            bg="white" display="flex" alignItems="center" justifyContent="center"
            cursor="pointer" onClick={() => slide('left')} boxShadow="md"
          >
            <Box as="svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </Box>
          </Box>
        )}

        {showRight && (
          <Box
            position="absolute" right={2} top="48px" zIndex={10}
            width="26px" height="26px" borderRadius="full"
            bg="white" display="flex" alignItems="center" justifyContent="center"
            cursor="pointer" onClick={() => slide('right')} boxShadow="md"
          >
            <Box as="svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </Box>
          </Box>
        )}

        <Box
          ref={scrollRef} width="100%" py={4} bg="white" overflowX="auto"
          cursor={isDragging ? "grabbing" : "pointer"}
          css={{ '&::-webkit-scrollbar': { display: 'none' }, 'scrollbarWidth': 'none', 'msOverflowStyle': 'none' }}
          onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove} onScroll={handleScroll}
        >
          <HStack gap={4} px={4}>
            {stories.map((story) => (
              <VStack key={story.id} gap={2} cursor="pointer" minW="90px" onClick={() => handleStoryClick(story)}>
                <Box
                  p="3px" borderRadius="full"
                  bg={story.hasStory ? "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" : "transparent"}
                  border={!story.hasStory ? "1px solid" : "none"}
                  borderColor="gray.200" width="90px" height="90px" display="flex" alignItems="center" justifyContent="center"
                >
                  <Box bg="white" borderRadius="full" p="2px" width="100%" height="100%">
                    <Box borderRadius="full" overflow="hidden" width="100%" height="100%">
                      <UserAvatar src={story.avatar} size="100%" />
                    </Box>
                  </Box>
                </Box>
                <Text fontSize="12px" width="90px" textAlign="center" isTruncated color="black">
                  {story.isOwn ? 'Your story' : story.username}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Box>
      </Box>

      {/* Story Player */}
      <StoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        highlights={stories.map(s => ({
          title: 'Story',
          user: s,
          stories: s.stories || [{ id: s.id, url: `https://picsum.photos/1080/1920?random=${s.id}` }]
        }))}
        initialHighlightIndex={stories.findIndex(s => s.id === selectedUser?.id)}
      />
    </>
  );
};

export default Stories;
