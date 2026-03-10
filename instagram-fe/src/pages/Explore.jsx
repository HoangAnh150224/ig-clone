import React, { useEffect, useState } from "react";
import { Box, Container, Spinner, Center } from "@chakra-ui/react";
import ExploreGrid from "../components/profile/ExploreGrid";
import ExploreSkeleton from "../components/skeletons/ExploreSkeleton";
import { useSelector } from "react-redux";
import postService from "../services/postService";

const Explore = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const authUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchExplorePosts = async () => {
            if (authUser) {
                setLoading(true);
                const response = await postService.getExplorePosts(authUser.id);
                setPosts(response);
                setLoading(false);
            }
        };
        fetchExplorePosts();
    }, [authUser]);

    return (
        <Container maxW="935px" p={0} py={8} bg="white">
            {loading ? (
                <ExploreSkeleton />
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
