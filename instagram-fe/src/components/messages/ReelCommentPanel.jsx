import React, { useState } from 'react';
import { Box, Flex, Text, HStack, Input, VStack } from '@chakra-ui/react';
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsEmojiSmile } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import UserAvatar from '../common/UserAvatar';
import { commentsDB } from '../../api/dummyData';

const ReelCommentCard = ({ comment }) => {
  const authUser = useSelector((state) => state.auth.user);
  const [showReplies, setShowReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.likedBy?.some(u => u.id === authUser?.id) || false);

  const handleLike = () => setIsLiked(!isLiked);

  // Tính toán like count dựa trên likedBy và trạng thái isLiked hiện tại
  const baseLikes = comment.likedBy || [];
  const alreadyLikedInDB = baseLikes.some(u => u.id === authUser?.id);
  const currentLikeCount = baseLikes.length + (isLiked ? (alreadyLikedInDB ? 0 : 1) : (alreadyLikedInDB ? -1 : 0));

  return (
    <Box mb={6} width="100%">
      <Flex gap={3} align="start">
        <UserAvatar src={comment.user.avatar} size="32px" />
        <Box flex={1}>
          <Flex align="center" gap={2} mb={1}>
            <Text fontWeight="bold" fontSize="13px" color="black">{comment.user.username}</Text>
            <Text color="gray.500" fontSize="12px">{comment.timeAgo}</Text>
          </Flex>
          <Text fontSize="14px" color="black" lineHeight="1.4" mb={2}>
            {comment.content}
          </Text>
          <HStack gap={4} fontSize="12px" color="gray.500" fontWeight="bold">
            <Text cursor="pointer">{currentLikeCount.toLocaleString()} likes</Text>
            <Text cursor="pointer">Reply</Text>
            <Text cursor="pointer">See translation</Text>
          </HStack>
        </Box>
        <Box pt={1} cursor="pointer" color={isLiked ? "#ff3040" : "gray.400"} onClick={handleLike}>
          {isLiked ? <AiFillHeart size={14} /> : <AiOutlineHeart size={14} />}
        </Box>
      </Flex>

      {/* REPLIES SECTION */}
      {comment.replies && comment.replies.length > 0 && (
        <Box ml="44px" mt={3}>
          {!showReplies ? (
            <Text 
              fontSize="12px" color="gray.500" fontWeight="bold" cursor="pointer" 
              onClick={() => setShowReplies(true)}
            >
              ——— View all {comment.replies.length} replies
            </Text>
          ) : (
            <VStack align="stretch" gap={4} mt={4}>
              <Text 
                fontSize="12px" color="gray.500" fontWeight="bold" cursor="pointer" mb={2}
                onClick={() => setShowReplies(false)}
              >
                ——— Hide replies
              </Text>
              {comment.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} authUser={authUser} />
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};

const ReplyItem = ({ reply, authUser }) => {
  const [isLiked, setIsLiked] = useState(reply.likedBy?.some(u => u.id === authUser?.id) || false);
  return (
    <Flex gap={3} align="start">
      <UserAvatar src={reply.user.avatar} size="24px" />
      <Box flex={1}>
        <Flex align="center" gap={2} mb={1}>
          <Text fontWeight="bold" fontSize="13px" color="black">{reply.user.username}</Text>
          <Text color="gray.500" fontSize="12px">{reply.timeAgo}</Text>
        </Flex>
        <Text fontSize="14px" color="black" lineHeight="1.4" mb={1}>
          {reply.content}
        </Text>
        <HStack gap={4} fontSize="12px" color="gray.500" fontWeight="bold">
          <Text cursor="pointer">{reply.likeCount} likes</Text>
          <Text cursor="pointer">Reply</Text>
        </HStack>
      </Box>
      <Box pt={1} cursor="pointer" color={isLiked ? "#ff3040" : "gray.400"} onClick={() => setIsLiked(!isLiked)}>
        {isLiked ? <AiFillHeart size={12} /> : <AiOutlineHeart size={12} />}
      </Box>
    </Flex>
  );
};

const ReelCommentPanel = ({ isOpen, onClose, reel }) => {
  if (!isOpen || !reel) return null;

  const comments = commentsDB[reel.id] || [];

  return (
    <Box 
      width="400px" 
      height="98vh" 
      bg="white" 
      borderRadius="12px" 
      display="flex" 
      flexDirection="column"
      ml={4}
      boxShadow="0 0 20px rgba(0,0,0,0.1)"
      border="1px solid"
      borderColor="gray.200"
    >
      {/* Header */}
      <Flex p={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
        <Box cursor="pointer" onClick={onClose} color="black">
          <AiOutlineClose size={24} />
        </Box>
        <Text fontWeight="bold" color="black">Comments</Text>
        <Box width="24px" />
      </Flex>

      {/* List */}
      <Box flex={1} overflowY="auto" p={4} css={{ '&::-webkit-scrollbar': { width: '0px' } }}>
        {comments.length > 0 ? (
          comments.map((c) => <ReelCommentCard key={c.id} comment={c} />)
        ) : (
          <Flex h="100%" align="center" justify="center" direction="column">
            <Text color="gray.400">No comments yet.</Text>
          </Flex>
        )}
      </Box>

      {/* Footer */}
      <Box p={4} borderTop="1px solid" borderColor="gray.100">
        <Flex align="center" gap={3} bg="gray.50" p={2} px={4} borderRadius="full" border="1px solid" borderColor="gray.200">
          <UserAvatar src="https://bit.ly/dan-abramov" size="28px" />
          <Input 
            variant="unstyled" 
            placeholder="Add a comment..."
            fontSize="14px" 
            color="black"
            _placeholder={{ color: "gray.500" }}
          />
          <BsEmojiSmile color="gray" size={20} cursor="pointer" />
        </Flex>
      </Box>
    </Box>
  );
};

export default ReelCommentPanel;
