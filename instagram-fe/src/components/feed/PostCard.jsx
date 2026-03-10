import React, { useState, useRef } from 'react';
import { Box, HStack, Text, Input, Flex, Icon } from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineSend, AiFillPlayCircle } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill, BsThreeDots, BsFillVolumeMuteFill, BsFillVolumeUpFill, BsStarFill } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import UserAvatar from '../common/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePost } from '../../store/slices/postSlice';
import { toggleMute } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';
import PostDetailModal from '../modals/PostDetailModal';
import ImageCarousel from '../common/ImageCarousel';
import UserListModal from '../modals/UserListModal';
import MoreOptionsModal from '../modals/MoreOptionsModal';
import { formatPostDate } from '../../utils/dateUtils';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  const isMuted = useSelector((state) => state.ui.isMuted);
  const videoRef = useRef(null);
  
  // FAVORITES LOGIC: Get from Redux Store (Synchronized from Backend)
  const favoriteUserIds = authUser?.favoriteUserIds || [];
  const isFavoriteUser = favoriteUserIds.includes(post.userId || post.user?.id);

  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [comment, setComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isLikeListOpen, setIsLikeListOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const isLiked = post.likedBy?.some(u => u.id === authUser?.id) || false;
  const isOwnPost = post.user?.id === authUser?.id;
  const isReel = post.type === 'reel';

  const handleLike = () => {
    dispatch(toggleLikePost({ postId: post.id, userId: authUser?.id || 'guest' }));
  };

  const handleDoubleLike = (e) => {
    e.stopPropagation();
    if (!isLiked) handleLike();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

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

  const likedUsers = post.likedBy || [];

  return (
    <>
      <Box 
        width="100%" maxW="470px" mx="auto"
        border="1px solid" borderColor="gray.200" 
        borderRadius="8px" bg="white" overflow="hidden"
        color="black" mb={4}
      >
        {/* Header */}
        <Flex p={3} justify="space-between" align="center" bg="white">
          <HStack gap={3} cursor="pointer" onClick={() => navigate(`/${post.user?.username}`)}>
            <UserAvatar src={post.user?.avatar} />
            <Text fontSize="14px" fontWeight="600" color="black" _hover={{ color: "gray.500" }}>
              {post.user?.username || 'user'}
            </Text>
          </HStack>

          <HStack gap={3}>
            {/* GRADIENT STAR ICON FOR FAVORITES - MOVED TO RIGHT NEXT TO MORE OPTIONS */}
            {isFavoriteUser && (
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {/* Use a span or Box with color: transparent to ensure gradient shows through the icon */}
                <Icon as={BsStarFill} boxSize="15px" style={{ fill: 'url(#ig-gradient)' || 'inherit' }} />
                {/* Fallback SVG for guaranteed gradient if Icon component struggles */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <linearGradient id="ig-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f09433' }} />
                    <stop offset="25%" style={{ stopColor: '#e6683c' }} />
                    <stop offset="50%" style={{ stopColor: '#dc2743' }} />
                    <stop offset="75%" style={{ stopColor: '#cc2366' }} />
                    <stop offset="100%" style={{ stopColor: '#bc1888' }} />
                  </linearGradient>
                </svg>
              </Box>
            )}
            <Box cursor="pointer" color="black" onClick={() => setIsMoreOptionsOpen(true)}>
              <BsThreeDots size={18} />
            </Box>
          </HStack>
        </Flex>

        {/* Post Media */}
        <Box 
          className="post-media-container" 
          onDoubleClick={handleDoubleLike} 
          bg="black" 
          position="relative" 
          width="100%" 
          paddingBottom={isReel ? "125%" : "125%"} 
          overflow="hidden"
          cursor="pointer"
          onClick={isReel ? togglePlay : undefined}
        >
          <Box position="absolute" top={0} left={0} right={0} bottom={0} display="flex" alignItems="center" justifyContent="center">
            {isReel ? (
              <>
                <Box as="video" ref={videoRef} src={post.videoUrl} autoPlay loop muted={isMuted} playsInline width="100%" height="100%" objectFit="cover" />
                {!isPlaying && (
                  <Box position="absolute" color="whiteAlpha.800" pointerEvents="none" zIndex={5}>
                    <AiFillPlayCircle size={60} />
                  </Box>
                )}
                <Box position="absolute" bottom={4} right={4} bg="blackAlpha.700" p={2} borderRadius="full" color="white" zIndex={10} onClick={(e) => { e.stopPropagation(); dispatch(toggleMute()); }}>
                  {isMuted ? <BsFillVolumeMuteFill size={14} /> : <BsFillVolumeUpFill size={14} />}
                </Box>
              </>
            ) : (
              <ImageCarousel images={post.images || [post.imageUrl]} height="100%" />
            )}

            {showHeartAnim && (
              <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={10} pointerEvents="none">
                <AiFillHeart size={100} className="heart-animation" color="white" />
              </Box>
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box px={3} pt={3} bg="white">
          <Flex justify="space-between" mb={2}>
            <HStack gap={4}>
              <Box onClick={handleLike} cursor="pointer" transition="transform 0.1s" _active={{ transform: "scale(1.1)" }}>
                {isLiked ? <AiFillHeart size={26} color="#ff3040" /> : <AiOutlineHeart size={26} color="black" />}
              </Box>
              <AiOutlineMessage size={26} cursor="pointer" color="black" onClick={() => setIsCommentModalOpen(true)} />
              <AiOutlineSend size={26} cursor="pointer" color="black" />
            </HStack>
            <Box onClick={() => setIsSaved(!isSaved)} cursor="pointer" color="black">
              {isSaved ? <BsBookmarkFill size={24} color="#FFD700" /> : <BsBookmark size={24} />}
            </Box>
          </Flex>

          <Text fontSize="14px" fontWeight="600" mb={2} color="black" cursor="pointer" onClick={() => setIsLikeListOpen(true)}>
            {post.likeCount?.toLocaleString()} likes
          </Text>

          <Box mb={2}>
            <Text fontSize="14px" lineHeight="1.4" color="black">
              <Text as="span" fontWeight="600" mr={2} cursor="pointer" onClick={() => navigate(`/${post.user?.username}`)}>
                {post.user?.username}
              </Text>
              {post.caption}
            </Text>
          </Box>

          <Text fontSize="14px" color="gray.500" cursor="pointer" mb={2} onClick={() => setIsCommentModalOpen(true)}>
            View all {post.commentCount} comments
          </Text>

          <Text fontSize="10px" color="gray.500" textTransform="uppercase" mb={3} letterSpacing="0.02em">
            {formatPostDate(post.createdAt)}
          </Text>
        </Box>

        <Box borderTop="1px solid" borderColor="gray.100" px={3} py={3} bg="white" display={{ base: "none", md: "block" }}>
          <HStack gap={3} bg="white">
            <FaRegSmile size={20} cursor="pointer" color="black" />
            <Input placeholder="Add a comment..." variant="unstyled" fontSize="14px" value={comment} onChange={(e) => setComment(e.target.value)} _placeholder={{ color: "gray.500" }} color="black" bg="white" />
            <Text as="button" color="#0095f6" fontSize="14px" fontWeight="600" opacity={comment.trim() ? 1 : 0.3} cursor={comment.trim() ? "pointer" : "default"}>Post</Text>
          </HStack>
        </Box>
      </Box>

      <PostDetailModal isOpen={isCommentModalOpen} onClose={() => setIsCommentModalOpen(false)} post={post} isLiked={isLiked} handleLike={handleLike} isSaved={isSaved} handleSave={() => setIsSaved(!isSaved)} />
      <UserListModal isOpen={isLikeListOpen} onClose={() => setIsLikeListOpen(false)} title="Likes" users={likedUsers} />
      <MoreOptionsModal 
        isOpen={isMoreOptionsOpen} 
        onClose={() => setIsMoreOptionsOpen(false)} 
        isOwnPost={isOwnPost} 
        post={post} 
        isFavoriteUser={isFavoriteUser}
      />
    </>
  );
};

export default PostCard;
