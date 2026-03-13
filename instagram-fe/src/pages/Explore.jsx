import React, { useEffect, useCallback, useRef } from "react";
import { Box, Container, Spinner, Center, VStack, Text, Heading } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ExploreGrid from "../components/profile/ExploreGrid";
import ExploreSkeleton from "../components/skeletons/ExploreSkeleton";
import { fetchExplorePosts, fetchHashtagPosts, resetExplore } from "../store/slices/exploreSlice";

const Explore = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");

    const { posts, loading, page, nextCursor, hasMore, error } = useSelector((state) => state.explore);
    const isFetchingMore = loading && (page > 0 || nextCursor);
    
    const loadMoreRef = useRef(null);

    const loadPosts = useCallback(() => {
        if (query) {
            dispatch(fetchHashtagPosts({ name: query, cursor: nextCursor, size: 18 }));
        } else {
            dispatch(fetchExplorePosts({ page: page, size: 18 }));
        }
    }, [dispatch, query, page, nextCursor]);

    // Reset and load when query changes
    useEffect(() => {
        dispatch(resetExplore());
        // Small delay to ensure state reset before load
        setTimeout(() => {
            if (query) {
                dispatch(fetchHashtagPosts({ name: query, cursor: null, size: 18 }));
            } else {
                dispatch(fetchExplorePosts({ page: 0, size: 18 }));
            }
        }, 0);
    }, [dispatch, query]);

    // Infinite Scroll Implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && posts.length > 0) {
                    loadPosts();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadPosts, posts.length]);

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
            {query && (
                <Box mb={8} px={4}>
                    <Heading size="lg" mb={2}>#{query}</Heading>
                    <Text color="gray.500">{posts.length > 0 ? `${posts.length}+ posts` : "Finding posts..."}</Text>
                </Box>
            )}

            {loading && posts.length === 0 ? (
                <ExploreSkeleton />
            ) : (
                <VStack gap={8} align="stretch">
                    {posts.length > 0 ? (
                        <ExploreGrid posts={posts} />
                    ) : !loading && (
                        <Center py={20}>
                            <Text color="gray.500">No posts found for #{query || "explore"}.</Text>
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
                                You've seen all posts.
                            </Text>
                        </Center>
                    )}
                </VStack>
            )}
        </Container>
    );
};

export default Explore;
