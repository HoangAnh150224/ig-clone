import React, { useState, useRef, useEffect } from 'react';
import { Box, Flex, VStack, Image, Text, HStack, Spinner, Center } from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiFillPlayCircle } from 'react-icons/ai';
import { BsThreeDots, BsMusicNoteBeamed, BsFillVolumeMuteFill, BsFillVolumeUpFill } from 'react-icons/bs';
import { RiSendPlaneFill } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMute } from '../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';
import ReelCommentPanel from '../components/messages/ReelCommentPanel';
import MoreOptionsModal from '../components/modals/MoreOptionsModal';
import ReelSkeleton from '../components/skeletons/ReelSkeleton';
import reelService from '../services/reelService';

const ReelCard = ({ reel, onOpenComments, onOpenMoreOptions }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const isMuted = useSelector((state) => state.ui.isMuted);
  const videoRef = useRef(null);
  const [isLiked, setIsLiked] = useState(reel.likedBy?.some(u => u.id === authUser?.id) || false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const isOwnPost = authUser?.id === reel.userId || authUser?.id === reel.user?.id;

  const handleLike = () => setIsLiked(!isLiked);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleLike = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      handleLike();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleMute());
  };

  const handleNavigateToUser = (e) => {
    e.stopPropagation();
    if (reel.user?.username) {
      navigate(`/${reel.user.username}`);
    }
  };

  return (
    <Box
      height="98vh" width="550px" bg="black" borderRadius="12px"
      position="relative" overflow="hidden" scrollSnapAlign="start" boxShadow="0 0 20px rgba(0,0,0,0.5)"
      cursor="pointer" onClick={togglePlay}
      onDoubleClick={handleDoubleLike}
    >
      <Box 
        as="video"
        ref={videoRef}
        src={reel.videoUrl} 
        width="100%" 
        height="100%" 
        objectFit="cover" 
        autoPlay 
        loop 
        muted={isMuted}
        playsInline
      />

      {/* Volume Control Overlay */}
      <Box 
        position="absolute" top={4} right={4} bg="blackAlpha.600" p={2.5} 
        borderRadius="full" color="white" zIndex={25} onClick={handleMuteToggle}
        _hover={{ bg: "blackAlpha.800" }}
      >
        {isMuted ? <BsFillVolumeMuteFill size={20} /> : <BsFillVolumeUpFill size={20} />}
      </Box>

      {!isPlaying && (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="whiteAlpha.800" pointerEvents="none" zIndex={15}>
          <AiFillPlayCircle size={80} />
        </Box>
      )}

      {showHeartAnim && (
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={20} pointerEvents="none">
          <AiFillHeart size={100} className="heart-animation" color="white" />
        </Box>
      )}

      {/* Right Controls */}
      <VStack position="absolute" right={4} bottom={20} gap={6} color="white" zIndex={10}>
        <VStack gap={1}>
          <Box onClick={(e) => { e.stopPropagation(); handleLike(); }} cursor="pointer" color={isLiked ? "#ff3040" : "white"}>
            {isLiked ? <AiFillHeart size={36} /> : <AiOutlineHeart size={36} />}
          </Box>
          <Text fontSize="12px" fontWeight="bold">{reel.likeCount + (isLiked ? (reel.likedBy?.some(u => u.id === authUser?.id) ? 0 : 1) : (reel.likedBy?.some(u => u.id === authUser?.id) ? -1 : 0))}</Text>
        </VStack>
        <VStack gap={1} onClick={(e) => { e.stopPropagation(); onOpenComments(reel); }} cursor="pointer">
          <AiOutlineMessage size={36} />
          <Text fontSize="12px" fontWeight="bold">{reel.commentCount}</Text>
        </VStack>
        <RiSendPlaneFill size={36} cursor="pointer" onClick={(e) => e.stopPropagation()} />
        <FaRegBookmark size={30} cursor="pointer" onClick={(e) => e.stopPropagation()} />
        <BsThreeDots size={30} cursor="pointer" onClick={(e) => { e.stopPropagation(); onOpenMoreOptions(reel); }} />
        <Box boxSize="40px" borderRadius="4px" border="2px solid white" overflow="hidden" cursor="pointer" onClick={handleNavigateToUser}>
          <Image src={reel.user.avatar} />
        </Box>
      </VStack>

      <Box position="absolute" bottom={0} left={0} right={0} p={6} bgGradient="linear(to-t, blackAlpha.900, transparent)" color="white" zIndex={5} onClick={(e) => e.stopPropagation()}>
        <HStack gap={3} mb={4}>
          <Box cursor="pointer" onClick={handleNavigateToUser}>
            <UserAvatar src={reel.user.avatar} size="44px" />
          </Box>
          <Text fontWeight="bold" fontSize="16px" cursor="pointer" onClick={handleNavigateToUser} _hover={{ textDecoration: "underline" }}>
            {reel.user.username}
          </Text>
          <Box px={4} py={1.5} border="1px solid white" borderRadius="8px" fontSize="xs" fontWeight="bold" cursor="pointer" _hover={{ bg: "whiteAlpha.200" }}>Follow</Box>
        </HStack>
        <Text fontSize="16px" mb={4} noOfLines={2}>{reel.caption}</Text>
        <HStack gap={2}>
          <BsMusicNoteBeamed size={14} />
          <Text fontSize="14px" isTruncated>{reel.music}</Text>
        </HStack>
      </Box>
    </Box>
  );
};

const Reels = () => {
  const authUser = useSelector((state) => state.auth.user);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [activeReel, setActiveReel] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      const response = await reelService.getAllReels();
      setReels(response);
      setLoading(false);
    };
    fetchReels();
  }, []);

  const handleOpenComments = (reel) => {
    setActiveReel(reel);
    setIsCommentOpen(true);
  };

  const handleOpenMoreOptions = (reel) => {
    setActiveReel(reel);
    setIsMoreOptionsOpen(true);
  };

  const scrollToIndex = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'up' ? -window.innerHeight : window.innerHeight;
      containerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Box height="100vh" width="100%" bg="white" display="flex" alignItems="center" justifyContent="center">
        <ReelSkeleton />
      </Box>
    );
  }

  const isOwnActiveReel = authUser?.id === activeReel?.userId || authUser?.id === activeReel?.user?.id;

  return (
    <Box height="100vh" width="100%" bg="white">
      <Flex height="100%" width="100%" align="center" justify="center" position="relative">

        {/* REFINED NAVIGATION BUTTONS */}
        <VStack position="fixed" right="5%" top="50%" transform="translateY(-50%)" zIndex={100} gap={4}>
          <Box
            p={2.8} bg="white" borderRadius="full" cursor="pointer" border="1.5px solid" borderColor="gray.300"
            onClick={() => scrollToIndex('up')} _hover={{ bg: "gray.50", transform: "scale(1.05)" }} boxShadow="md"
            transition="0.2s" display="flex" alignItems="center" justifyContent="center"
          >
            <Box as="svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </Box>
          </Box>
          <Box
            p={2.8} bg="white" borderRadius="full" cursor="pointer" border="1.5px solid" borderColor="gray.300"
            onClick={() => scrollToIndex('down')} _hover={{ bg: "gray.50", transform: "scale(1.05)" }} boxShadow="md"
            transition="0.2s" display="flex" alignItems="center" justifyContent="center"
          >
            <Box as="svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </Box>
          </Box>
        </VStack>

        <Flex align="center" justify="center" maxW="1400px" width="100%">
          <Box
            ref={containerRef}
            height="100vh" overflowY="auto" flexShrink={0}
            css={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }}
          >
            <VStack gap={4} py={4}>
              {reels.map((reel) => (
                <ReelCard 
                  key={reel.id} 
                  reel={reel} 
                  onOpenComments={handleOpenComments} 
                  onOpenMoreOptions={handleOpenMoreOptions}
                />
              ))}
            </VStack>
          </Box>
          
          <ReelCommentPanel isOpen={isCommentOpen} onClose={() => setIsCommentOpen(false)} reel={activeReel} />
          
          <MoreOptionsModal 
            isOpen={isMoreOptionsOpen} 
            onClose={() => setIsMoreOptionsOpen(false)} 
            post={activeReel}
            isOwnPost={isOwnActiveReel}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Reels;
