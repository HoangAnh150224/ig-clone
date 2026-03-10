import React, { useEffect, useState } from 'react';
import { Box, Flex, VStack, Spinner, Center } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../components/feed/PostCard';
import Stories from '../components/feed/Stories';
import RightSidebar from '../components/layout/RightSidebar';
import { setMockPosts, addMockPosts, selectAllPosts } from '../store/slices/postSlice';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Khóa cuộn và cuộn nhẹ để hiện Spinner
  useEffect(() => {
    if (loading) {
      // Cuộn xuống thêm một chút để Spinner lọt vào view trước khi khóa
      window.scrollBy({ top: 120, behavior: 'smooth' });
      
      // Đợi hiệu ứng cuộn mượt xong rồi mới khóa cứng
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
    const initialPosts = [
      {
        id: '1',
        user: { username: 'antigravity_dev', avatar: 'https://bit.ly/dan-abramov' },
        imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
        caption: 'Vibe coding với Instagram Clone cực mượt! #react #redux #igclone',
        likeCount: 1240,
        likes: [],
        commentCount: 45,
        timeAgo: '2 HOURS AGO',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        user: { username: 'pixel_perfect', avatar: 'https://bit.ly/tioluwani-kolawole' },
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        caption: 'Nature is the best designer. 🌿✨',
        likeCount: 850,
        likes: [],
        commentCount: 12,
        timeAgo: '5 HOURS AGO',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
    dispatch(setMockPosts(initialPosts));
  }, [dispatch]);

  const loadMorePosts = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const nextId = posts.length + 1;
      const daysAgo = Math.floor(nextId / 2) + 1;
      const newPosts = [
        {
          id: String(nextId),
          user: { username: `user_${nextId}`, avatar: `https://i.pravatar.cc/150?u=${nextId}` },
          imageUrl: `https://picsum.photos/600/600?random=${nextId + 100}`,
          caption: `Tải xong bài viết số ${nextId}.`,
          likeCount: Math.floor(Math.random() * 1000),
          likes: [],
          commentCount: Math.floor(Math.random() * 50),
          timeAgo: `${daysAgo} DAYS AGO`,
          createdAt: new Date(Date.now() - 86400000 * daysAgo).toISOString(),
        }
      ];
      
      dispatch(addMockPosts(newPosts));
      setLoading(false);
      
      if (posts.length > 30) setHasMore(false);
    }, 1500);
  };

  const { lastElementRef } = useInfiniteScroll(loadMorePosts, hasMore, loading);

  return (
    <Flex justify="center" gap={16} bg="white" minH="100vh" width="100%">
      <Box width="100%" maxW="800px" bg="white">
        <Stories />
        
        <VStack gap={8} align="center" py={4} width="100%">
          {posts.map((post) => (
            <Box key={post.id} width="100%" maxW="630px">
              <PostCard post={post} />
            </Box>
          ))}
          
          {/* Sentinel */}
          {!loading && hasMore && <Box ref={lastElementRef} height="20px" width="100%" />}

          {/* Chỉ hiển thị Spinner, xóa text, thêm padding lớn */}
          {loading && (
            <Center py={20} width="100%">
              <Spinner size="xl" color="gray.400" thickness="4px" />
            </Center>
          )}

          {!hasMore && (
            <Box py={10} />
          )}
        </VStack>
      </Box>

      <RightSidebar />
    </Flex>
  );
};

export default Home;
