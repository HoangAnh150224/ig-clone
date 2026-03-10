import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Spinner, Center } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/feed/PostCard';
import Stories from '../components/feed/Stories';
import RightSidebar from '../components/layout/RightSidebar';
import { setMockPosts, addMockPosts, selectAllPosts } from '../store/slices/postSlice';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { allPosts } from '../api/dummyData';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (loading) {
      window.scrollBy({ top: 120, behavior: 'smooth' });
      const timer = setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loading]);

  useEffect(() => {
    dispatch(setMockPosts(allPosts));
  }, [dispatch]);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const nextId = posts.length + 1;
      const newPosts = [
        {
          id: `extra-${nextId}`,
          user: { username: `explorer_${nextId}`, avatar: `https://i.pravatar.cc/150?u=${nextId}` },
          images: [
            `https://picsum.photos/1080/1350?random=${nextId + 100}`,
            `https://picsum.photos/1080/1350?random=${nextId + 200}`
          ],
          imageUrl: `https://picsum.photos/1080/1350?random=${nextId + 100}`,
          caption: `Discovering new vibes! ✨`,
          likeCount: Math.floor(Math.random() * 1000),
          commentCount: Math.floor(Math.random() * 50),
          timeAgo: '1 DAY AGO',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      dispatch(addMockPosts(newPosts));
      setLoading(false);
      if (posts.length > 30) setHasMore(false);
    }, 1500);
  };

  const { lastElementRef } = useInfiniteScroll(loadMorePosts, hasMore, loading);

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
          {!loading && hasMore && <Box ref={lastElementRef} height="20px" width="100%" />}
          {loading && (
            <Center py={20} width="100%">
              <Spinner size="xl" color="gray.400" thickness="4px" />
            </Center>
          )}
        </VStack>
      </Box>

      <Box width="320px" display={{ base: "none", lg: "block" }}>
        <RightSidebar />
      </Box>
    </Flex>
  );
};

export default Home;
