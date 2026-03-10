import React from 'react';
import { Box, Flex, Text, HStack } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import { AiOutlineHeart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const CommentCard = ({ comment, onClose }) => {
  const navigate = useNavigate();
  
  const data = comment || {
    username: 'vibe_coder',
    content: 'This looks absolutely amazing! 🚀',
    time: '2h',
    avatar: 'https://i.pravatar.cc/150?u=vibe',
    likeCount: 2
  };

  const handleNavigate = () => {
    if (onClose) onClose(); // Đóng modal trước khi chuyển trang
    navigate(`/${data.username}`);
  };

  return (
    <Flex gap={3} mb={4} align="start" width="100%">
      <Box cursor="pointer" onClick={handleNavigate}>
        <UserAvatar src={data.avatar} size="32px" />
      </Box>
      <Box flex={1}>
        <Text fontSize="14px" lineHeight="1.4" color="black">
          <Text as="span" fontWeight="bold" mr={2} cursor="pointer" onClick={handleNavigate} _hover={{ opacity: 0.7 }}>
            {data.username}
          </Text>
          {data.content}
        </Text>
        <HStack gap={4} mt={2}>
          <Text fontSize="12px" color="gray.500">{data.time}</Text>
          {data.likeCount > 0 && (
            <Text fontSize="12px" color="gray.500" fontWeight="bold">{data.likeCount} likes</Text>
          )}
          <Text fontSize="12px" color="gray.500" fontWeight="bold" cursor="pointer">Reply</Text>
        </HStack>
      </Box>
      <Box pt={1} cursor="pointer" color="gray.500" _hover={{ color: "gray.300" }}>
        <AiOutlineHeart size={12} />
      </Box>
    </Flex>
  );
};

export default CommentCard;
