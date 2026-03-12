import React, { useEffect, useCallback, useRef } from "react";
import { Box, Container, Spinner, Center, VStack, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import ExploreGrid from "../components/profile/ExploreGrid";
import ExploreSkeleton from "../components/skeletons/ExploreSkeleton";
import { fetchExplorePosts, resetExplore } from "../store/slices/exploreSlice";

const Explore = () => {
    const dispatch = useDispatch();
    const { posts, loading, page, hasMore, error } = useSelector((state) => state.explore);
    const isFetchingMore = loading && page > 0;
    
    const loadMoreRef = useRef(null);

    const loadPosts = useCallback((pageNum = 0) => {
        dispatch(fetchExplorePosts({ page: pageNum, size: 18 }));
    }, [dispatch]);

    useEffect(() => {
        if (posts.length === 0) {
            loadPosts(0);
        }
    }, [loadPosts, posts.length]);

    // Infinite Scroll Implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && posts.length > 0) {
                    loadPosts(page);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, page, loadPosts, posts.length]);

    // Error handling UI
    if (error && posts.length === 0) {
        return (
            <Container maxW="935px" py={20}>
                <Center flexDir="column" gap={4}>
                    <Text fontWeight="bold" fontSize="xl">Couldn't load Explore posts</Text>
                    <Text color="gray.500">There was a problem reaching the server. Please try again later.</Text>
                    <Box 
                        as="button" 
                        px={4} py={2} bg="blue.500" color="white" borderRadius="md" 
                        onClick={() => loadPosts(0)}
                    >
                        Try Again
                    </Box>
                </Center>
            </Container>
        );
    }

    return (
        <Container maxW="935px" p={0} py={8} bg="white">
            {loading && posts.length === 0 ? (
                <ExploreSkeleton />
            ) : (
                <VStack gap={8} align="stretch">
                    {posts.length > 0 ? (
                        <ExploreGrid posts={posts} />
                    ) : !loading && (
                        <Center py={20}>
                            <Text color="gray.500">No explore posts found.</Text>
                        </Center>
                    )}
                    
                    {/* Infinite scroll trigger - Only show if we have posts and might have more */}
                    {hasMore && posts.length > 0 && (
                        <Box ref={loadMoreRef} h="40px" display="flex" alignItems="center" justifyContent="center">
                            {isFetchingMore && <Spinner size="md" color="gray.400" />}
                        </Box>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <Center py={10}>
                            <Text color="gray.500" fontSize="sm" fontStyle="italic">
                                You've seen all new explore posts.
                            </Text>
                        </Center>
                    )}
                </VStack>
            )}
        </Container>
    );
};

export default Explore;
