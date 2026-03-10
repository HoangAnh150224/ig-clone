import React, { useState } from 'react';
import { SimpleGrid, Box, Image, Flex, HStack, Text } from '@chakra-ui/react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import CommentModal from '../Comment/CommentModal';

const PostGridItem = ({ post, onClick }) => {
  return (
    <Box 
      position="relative" 
      width="100%"
      pb="100%" // Square for grid
      cursor="pointer"
      role="group"
      overflow="hidden"
      borderRadius="0"
      onClick={() => onClick(post)}
    >
      <Image 
        src={post.imageUrl || (post.images && post.images[0])} 
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  if (loading) return <Box textAlign="center" py={10}>Loading posts...</Box>;
  if (!posts || posts.length === 0) return <Box textAlign="center" py={10} fontWeight="bold">No Photos Yet</Box>;

  return (
    <>
      <SimpleGrid columns={3} spacing="4px">
        {posts.map((post) => (
          <PostGridItem key={post.id} post={post} onClick={handlePostClick} />
        ))}
      </SimpleGrid>

      {selectedPost && (
        <CommentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          post={selectedPost}
          isLiked={false}
          handleLike={() => {}}
          isSaved={false}
          handleSave={() => {}}
        />
      )}
    </>
  );
};

export default PostGrid;
