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

  const fetchMorePosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    setTimeout(() => {
      const newPosts = Array.from({ length: 9 }).map((_, i) => ({
        id: `explore-${posts.length + i}`,
        imageUrl: `https://picsum.photos/600/600?random=${posts.length + i + 1000}`,
        likeCount: Math.floor(Math.random() * 5000),
        commentCount: Math.floor(Math.random() * 200),
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
      setLoading(false);
      
      if (posts.length > 50) setHasMore(false);
    }, 1500);
  };

  useEffect(() => {
    const initialPosts = Array.from({ length: 15 }).map((_, i) => ({
      id: `explore-${i}`,
      imageUrl: `https://picsum.photos/600/600?random=${i + 500}`,
      likeCount: Math.floor(Math.random() * 5000),
      commentCount: Math.floor(Math.random() * 200),
    }));
    setPosts(initialPosts);
    setLoading(false);
    setIsInitialLoad(false);
  }, []);

  const { lastElementRef } = useInfiniteScroll(fetchMorePosts, hasMore, loading);

  return (
    <Container maxW="935px" p={0} py={4}>
      {isInitialLoad ? (
        <Center py={20}>
          <Spinner size="xl" color="gray.400" />
        </Center>
      ) : (
        <>
          <ExploreGrid posts={posts} />
          
          {!loading && hasMore && <Box ref={lastElementRef} height="20px" width="100%" />}

          {/* Spinner trung tâm, không text, padding lớn */}
          {loading && (
            <Center py={24} width="100%">
              <Spinner size="xl" color="gray.400" thickness="4px" />
            </Center>
          )}

          {!hasMore && (
            <Box py={10} />
          )}
        </>
      )}
    </Container>
  );
};

export default Explore;
