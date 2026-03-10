import React, { useEffect, useState } from 'react';
import { Box, Container, Spinner, Center } from '@chakra-ui/react';
import ExploreGrid from '../components/profile/ExploreGrid';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Logic khóa cuộn và cuộn nhẹ
  useEffect(() => {
    if (loading && !isInitialLoad) {
      window.scrollBy({ top: 150, behavior: 'smooth' });
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
  }, [loading, isInitialLoad]);

  const generateMockPosts = (count, startId) => {
    const users = ['cristiano', 'leomessi', 'nasa', 'coding_vibes', 'pixel_art', 'traveler'];
    return Array.from({ length: count }).map((_, i) => {
      const id = startId + i;
      const username = users[id % users.length];
      return {
        id: `explore-${id}`,
        imageUrl: `https://picsum.photos/1080/1350?random=${id + 500}`,
        images: [
          `https://picsum.photos/1080/1350?random=${id + 500}`,
          `https://picsum.photos/1080/1350?random=${id + 1500}`
        ],
        user: {
          username: username,
          avatar: `https://i.pravatar.cc/150?u=${username}`
        },
        caption: `Amazing content discovered in Explore! #${username} #vibecoding`,
        likeCount: Math.floor(Math.random() * 5000),
        commentCount: Math.floor(Math.random() * 200),
        timeAgo: '5 HOURS AGO'
      };
    });
  };

  const fetchMorePosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const newPosts = generateMockPosts(9, posts.length);
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
      if (posts.length > 50) setHasMore(false);
    }, 1500);
  };

  useEffect(() => {
    const initialPosts = generateMockPosts(15, 0);
    setPosts(initialPosts);
    setLoading(false);
    setIsInitialLoad(false);
  }, []);

  const { lastElementRef } = useInfiniteScroll(fetchMorePosts, hasMore, loading);

  return (
    <Container maxW="935px" p={0} py={8} bg="white">
      {isInitialLoad ? (
        <Center py={20}>
          <Spinner size="xl" color="gray.400" />
        </Center>
      ) : (
        <>
          <ExploreGrid posts={posts} />
          {!loading && hasMore && <Box ref={lastElementRef} height="20px" width="100%" />}
          {loading && (
            <Center py={24} width="100%">
              <Spinner size="xl" color="gray.400" thickness="4px" />
            </Center>
          )}
          {!hasMore && <Box py={10} />}
        </>
      )}
    </Container>
  );
};

export default Explore;
