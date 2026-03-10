import React, { useState } from 'react';
import { Box, HStack, Text, Input, Flex } from '@chakra-ui/react';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineSend } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill, BsThreeDots } from 'react-icons/bs';
import { FaRegSmile } from 'react-icons/fa';
import UserAvatar from '../common/UserAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePost } from '../../store/slices/postSlice';
import { useNavigate } from 'react-router-dom';
import CommentModal from '../Comment/CommentModal';
import ImageCarousel from '../common/ImageCarousel';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [comment, setComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const isLiked = post.likes?.includes(authUser?.id) || false;

  const handleLike = () => {
    dispatch(toggleLikePost({ postId: post.id, userId: authUser?.id || 'guest' }));
  };

  const handleDoubleLike = () => {
    if (!isLiked) handleLike();
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

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
          <Box cursor="pointer" color="black"><BsThreeDots size={18} /></Box>
        </Flex>

        {/* Post Image Container with Aspect Ratio (4:5) */}
        <Box 
          className="post-image-container" 
          onDoubleClick={handleDoubleLike} 
          bg="white" 
          position="relative" 
          width="100%"
          paddingBottom="125%" // 4:5 Aspect Ratio (100 / 0.8)
          overflow="hidden"
        >
          <Box position="absolute" top={0} left={0} right={0} bottom={0}>
            {showHeartAnim && (
              <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={10}>
                <AiFillHeart size={100} className="heart-animation" color="white" />
              </Box>
            )}
            <ImageCarousel images={post.images || [post.imageUrl]} height="100%" />
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
              {isSaved ? <BsBookmarkFill size={24} /> : <BsBookmark size={24} />}
            </Box>
          </Flex>

          <Text fontSize="14px" fontWeight="600" mb={2} color="black">{post.likeCount} likes</Text>

          <Box mb={2}>
            <Text fontSize="14px" lineHeight="1.4" color="black">
              <Text 
                as="span" fontWeight="600" mr={2} cursor="pointer" 
                onClick={() => navigate(`/${post.user?.username}`)}
              >
                {post.user?.username}
              </Text>
              {post.caption}
            </Text>
          </Box>

          <Text 
            fontSize="14px" color="gray.500" cursor="pointer" mb={2}
            onClick={() => setIsCommentModalOpen(true)}
          >
            View all {post.commentCount} comments
          </Text>

          <Text fontSize="10px" color="gray.500" uppercase mb={3} letterSpacing="0.02em">
            {post.timeAgo}
          </Text>
        </Box>

        {/* Comment Input */}
        <Box borderTop="1px solid" borderColor="gray.100" px={3} py={3} bg="white" display={{ base: "none", md: "block" }}>
          <HStack gap={3} bg="white">
            <FaRegSmile size={20} cursor="pointer" color="black" />
            <Input 
              placeholder="Add a comment..." variant="unstyled" fontSize="14px" 
              value={comment} onChange={(e) => setComment(e.target.value)} 
              _placeholder={{ color: "gray.500" }}
              color="black"
              bg="white"
            />
            <Text 
              as="button" color="#0095f6" fontSize="14px" fontWeight="600" 
              opacity={comment.trim() ? 1 : 0.3} cursor={comment.trim() ? "pointer" : "default"}
            >
              Post
            </Text>
          </HStack>
        </Box>
      </Box>

      {/* Post Detail Modal */}
      <CommentModal 
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
        isLiked={isLiked}
        handleLike={handleLike}
        isSaved={isSaved}
        handleSave={() => setIsSaved(!isSaved)}
      />
    </>
  );
};

export default PostCard;
