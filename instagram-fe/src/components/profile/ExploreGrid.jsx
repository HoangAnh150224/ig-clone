import React from 'react';
import { Box, Image, Flex, HStack, Text, Grid, GridItem } from '@chakra-ui/react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';

const ExploreItem = ({ post, isLarge }) => {
  return (
    <Box 
      position="relative" 
      width="100%"
      height="100%"
      cursor="pointer"
      role="group"
      overflow="hidden"
      borderRadius="0"
    >
      <Image 
        src={post.imageUrl} 
        alt="Explore post" 
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
          <Text fontWeight="bold">{post.likeCount || Math.floor(Math.random() * 1000)}</Text>
        </HStack>
        <HStack gap={1}>
          <FaComment size={20} />
          <Text fontWeight="bold">{post.commentCount || Math.floor(Math.random() * 50)}</Text>
        </HStack>
      </Flex>
    </Box>
  );
};

const ExploreGrid = ({ posts }) => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap="4px"
      autoRows="minmax(300px, auto)"
    >
      {posts.map((post, index) => {
        // Tạo pattern: Cứ mỗi 10 bài viết, bài số 2 và bài số 7 sẽ chiếm 2 hàng và 2 cột
        const isLarge = index % 10 === 2 || index % 10 === 6;
        
        return (
          <GridItem
            key={post.id}
            colSpan={isLarge ? 2 : 1}
            rowSpan={isLarge ? 2 : 1}
          >
            <ExploreItem post={post} isLarge={isLarge} />
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default ExploreGrid;
