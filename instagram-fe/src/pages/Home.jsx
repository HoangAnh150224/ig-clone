import React, { useEffect } from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/feed/PostCard';
import Stories from '../components/feed/Stories';
import RightSidebar from '../components/layout/RightSidebar';
import { setMockPosts, selectAllPosts } from '../store/slices/postSlice';
import postService from '../services/postService';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchFeedPosts = async () => {
      if (authUser) {
        const response = await postService.getFeedPosts(authUser.id);
        dispatch(setMockPosts(response.data));
      }
    };
    fetchFeedPosts();
  }, [dispatch, authUser]);

  return (
    <Flex justify="center" gap={16} py={8} bg="white" minH="100vh">
      <Box width="100%" maxW="630px">
        <Stories />
        <VStack gap={8} align="center" width="100%">
          {posts.map((post) => (
            <Box key={post.id} width="100%">
              <PostCard post={post} />
            </Box>
          ))}
        </VStack>
      </Box>

      <Box width="320px" display={{ base: "none", lg: "block" }}>
        <RightSidebar />
      </Box>
    </Flex>
  );
};

export default Home;
