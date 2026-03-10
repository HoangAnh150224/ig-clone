import React, { useEffect, useState } from 'react';
import { Box, Container, Spinner, Center } from '@chakra-ui/react';
import ExploreGrid from '../components/profile/ExploreGrid';
import { allPosts, userRelationsDB } from '../api/dummyData';
import { useSelector } from 'react-redux';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (authUser) {
      setLoading(true);
      
      // Lấy danh sách ID những người đang follow
      const followingIds = userRelationsDB[authUser.id]?.following.map(u => u.id) || [];
      
      // Lọc bài viết: Chỉ hiện bài của những người KHÔNG follow và không phải bài của chính mình
      const explorePosts = allPosts.filter(post => 
        post.userId !== authUser.id && !followingIds.includes(post.userId)
      );
      
      setPosts(explorePosts);
      setLoading(false);
    }
  }, [authUser]);

  return (
    <Container maxW="935px" p={0} py={8} bg="white">
      {loading ? (
        <Center py={20}>
          <Spinner size="xl" color="gray.400" />
        </Center>
      ) : (
        <Box>
          <ExploreGrid posts={posts} />
          <Box py={10} />
        </Box>
      )}
    </Container>
  );
};

export default Explore;
