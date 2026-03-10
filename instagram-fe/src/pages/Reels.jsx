import React, { useState, useRef } from 'react';
import { Box, Flex, VStack, Image, Text, HStack } from '@chakra-ui/react';
import { AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { BsThreeDots, BsMusicNoteBeamed } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa';
import UserAvatar from '../components/common/UserAvatar';
import ReelCommentPanel from '../components/messages/ReelCommentPanel';
import { allReels } from '../api/dummyData';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const ReelCard = ({ reel, onOpenComments }) => {
  return (
    <Box 
      height="98vh" width="550px" bg="black" borderRadius="12px" 
      position="relative" overflow="hidden" scrollSnapAlign="start" boxShadow="0 0 20px rgba(0,0,0,0.5)"
    >
      <Image src={reel.gifUrl} width="100%" height="100%" objectFit="cover" />

      <VStack position="absolute" right={4} bottom={20} gap={6} color="white" zIndex={10}>
        <VStack gap={1}>
          <AiOutlineHeart size={32} cursor="pointer" />
          <Text fontSize="xs" fontWeight="bold">{reel.likeCount}</Text>
        </VStack>
        <VStack gap={1} onClick={() => onOpenComments(reel)} cursor="pointer">
          <AiOutlineMessage size={32} />
          <Text fontSize="xs" fontWeight="bold">{reel.commentCount}</Text>
        </VStack>
        <RiSendPlaneFill size={32} cursor="pointer" />
        <FaRegBookmark size={28} cursor="pointer" />
        <BsThreeDots size={28} cursor="pointer" />
        <Box boxSize="36px" borderRadius="4px" border="2px solid white" overflow="hidden">
          <Image src={reel.user.avatar} />
        </Box>
      </VStack>

      <Box position="absolute" bottom={0} left={0} right={0} p={6} bgGradient="linear(to-t, blackAlpha.900, transparent)" color="white" zIndex={5}>
        <HStack gap={3} mb={4}>
          <UserAvatar src={reel.user.avatar} size="40px" />
          <Text fontWeight="bold" fontSize="md">{reel.user.username}</Text>
          <Box px={4} py={1.5} border="1px solid white" borderRadius="8px" fontSize="xs" fontWeight="bold" cursor="pointer">Follow</Box>
        </HStack>
        <Text fontSize="md" mb={4} noOfLines={2}>{reel.caption}</Text>
        <HStack gap={2}>
          <BsMusicNoteBeamed size={14} />
          <Text fontSize="sm" isTruncated>{reel.music}</Text>
        </HStack>
      </Box>
    </Box>
  );
};

const Reels = () => {
  const [reels, setReels] = useState(allReels);
  const [loading, setLoading] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activeReel, setActiveReel] = useState(null);
  const containerRef = useRef(null);

  const loadMoreReels = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const nextId = reels.length + 1;
      const newReel = {
        ...allReels[nextId % allReels.length],
        id: `reel-${nextId}`,
        caption: `Next generation of Reels! 🔥 #${nextId}`
      };
      setReels(prev => [...prev, newReel]);
      setLoading(false);
    }, 1000);
  };

  const { lastElementRef } = useInfiniteScroll(loadMoreReels, true, loading);

  const handleOpenComments = (reel) => {
    setActiveReel(reel);
    setIsCommentOpen(true);
  };

  const scrollToIndex = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'up' ? -window.innerHeight : window.innerHeight;
      containerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box height="100vh" width="100%" bg="white">
      <Flex height="100%" width="100%" align="center" justify="center" position="relative">
        
        {/* SMALLER NAVIGATION BUTTONS */}
        <VStack position="fixed" right="5%" top="50%" transform="translateY(-50%)" zIndex={100} gap={3}>
          <Box 
            p={2} bg="gray.50" borderRadius="full" cursor="pointer" border="1px solid" borderColor="gray.200"
            onClick={() => scrollToIndex('up')} _hover={{ bg: "gray.100" }} boxShadow="sm"
          >
            <Box as="svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </Box>
          </Box>
          <Box 
            p={2} bg="gray.50" borderRadius="full" cursor="pointer" border="1px solid" borderColor="gray.200"
            onClick={() => scrollToIndex('down')} _hover={{ bg: "gray.100" }} boxShadow="sm"
          >
            <Box as="svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </Box>
          </Box>
        </VStack>

        <Flex align="center" justify="center" maxW="1200px" width="100%">
          <Box ref={containerRef} height="100vh" overflowY="auto" flexShrink={0} css={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}>
            <VStack gap={4} py={4}>
              {reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} onOpenComments={handleOpenComments} />
              ))}
              <Box ref={lastElementRef} height="20px" />
            </VStack>
          </Box>
          <ReelCommentPanel isOpen={isCommentOpen} onClose={() => setIsCommentOpen(false)} reel={activeReel} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Reels;
