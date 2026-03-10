import React from 'react';
import { SimpleGrid, Box, Image, Flex, HStack, Text } from '@chakra-ui/react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';

const PostGridItem = ({ post }) => {
  return (
    <Box 
      position="relative" 
      width="100%"
      pb="125%" // Tỉ lệ 4:5 chuẩn IG 2025 (1080x1350)
      cursor="pointer"
      role="group"
      overflow="hidden"
      borderRadius="0" // Remove rounded corners
    >
      <Image 
        src={post.imageUrl} 
        alt="User post" 
        position="absolute"
        top={0}
        left={0}
        w="100%" 
        h="100%" 
        objectFit="cover" 
      />
      
      {/* Overlay on Hover */}
      <Flex
        position="absolute" top={0} left={0} w="100%" h="100%"
        bg="blackAlpha.600" opacity={0} _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s" align="center" justify="center" gap={6} color="white"
      >
        <HStack gap={1}>
          <AiFillHeart size={24} />
          <Text fontWeight="bold">{post.likeCount}</Text>
        </HStack>
        <HStack gap={1}>
          <FaComment size={20} />
          <Text fontWeight="bold">{post.commentCount}</Text>
        </HStack>
      </Flex>
    </Box>
  );
};

const PostGrid = ({ posts, loading }) => {
  if (loading) return <Box textAlign="center" py={10}>Loading posts...</Box>;
  if (!posts || posts.length === 0) return <Box textAlign="center" py={10} fontWeight="bold">No Photos Yet</Box>;

  return (
    <SimpleGrid columns={3} spacing="4px">
      {posts.map((post) => (
        <PostGridItem key={post.id} post={post} />
      ))}
    </SimpleGrid>
  );
};

export default PostGrid;
