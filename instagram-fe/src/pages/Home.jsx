import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    VStack,
    HStack,
    SkeletonCircle,
    Skeleton,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/feed/PostCard";
import Stories from "../components/feed/Stories";
import RightSidebar from "../components/layout/RightSidebar";
import PostCardSkeleton from "../components/skeletons/PostCardSkeleton";
import { setMockPosts, selectAllPosts } from "../store/slices/postSlice";
import postService from "../services/postService";

const Home = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const authUser = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedPosts = async () => {
            setLoading(true);
            try {
                if (authUser) {
                    const response = await postService.getFeedPosts(
                        authUser.id,
                    );
                    dispatch(setMockPosts(response));
                }
            } catch (error) {
                console.error("Failed to fetch posts", error);
            } finally {
                // Add a slight delay to make the transition smoother
                setTimeout(() => setLoading(false), 500);
            }
        };
        fetchFeedPosts();
    }, [dispatch, authUser]);

    return (
        <Flex justify="center" gap={16} py={8} bg="white" minH="100vh">
            <Box width="100%" maxW="630px">
                {loading ? (
                    <HStack gap={4} px={4} mb={8} overflow="hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <VStack key={i} gap={2} minW="90px">
                                <SkeletonCircle size="90px" />
                                <Skeleton height="10px" width="60px" />
                            </VStack>
                        ))}
                    </HStack>
                ) : (
                    <Stories />
                )}

                <VStack gap={8} align="center" width="100%" mt={4}>
                    {loading
                        ? [1, 2, 3].map((i) => <PostCardSkeleton key={i} />)
                        : posts.map((post) => (
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
