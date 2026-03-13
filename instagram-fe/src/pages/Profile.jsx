import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Container,
    VStack,
    Text,
    Link as ChakraLink,
    Flex,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLock } from "react-icons/fi";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import PostGrid from "../components/profile/PostGrid";
import ProfileHighlights from "../components/profile/ProfileHighlights";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import profileService from "../services/profileService";
import postService from "../services/postService";
import {
    setUserProfile,
    setProfilePosts,
    setLoading,
    resetProfile,
} from "../store/slices/userSlice";

const Profile = () => {
    const { username } = useParams();
    const dispatch = useDispatch();
    const { userProfile, posts, loading } = useSelector((state) => state.user);
    const { user: authUser } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("posts");
    const [highlights, setHighlights] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);

    const isOwnProfile = authUser?.username === username;

    const fetchTabData = useCallback(async (tab) => {
        setTabLoading(true);
        try {
            let results = [];
            if (tab === "posts" || tab === "reels") {
                const response = await profileService.getUserPosts(username);
                results = response.content || response;
            } else if (tab === "saved") {
                const response = await postService.getSavedPosts();
                results = response.content || response;
            } else if (tab === "tagged") {
                const response = await postService.getTaggedPosts(userProfile?.id);
                results = response.content || response;
            }
            dispatch(setProfilePosts(results));
        } catch (error) {
            console.error(`Failed to fetch ${tab} data`, error);
        } finally {
            setTabLoading(false);
        }
    }, [username, userProfile?.id, dispatch]);

    const fetchInitialData = useCallback(async () => {
        dispatch(resetProfile());
        dispatch(setLoading(true));
        try {
            const [profileRes, highlightsRes] = await Promise.all([
                profileService.getUserProfile(username),
                profileService.getUserHighlights(username),
            ]);
            dispatch(setUserProfile(profileRes));
            setHighlights(highlightsRes || []);
            
            // Fetch posts for the initial active tab
            const postsRes = await profileService.getUserPosts(username);
            dispatch(setProfilePosts(postsRes.content || postsRes));
        } catch (error) {
            console.error("Failed to fetch initial profile data", error);
        } finally {
            dispatch(setLoading(false));
        }
    }, [username, dispatch]);

    useEffect(() => {
        fetchInitialData();
        setActiveTab("posts");
    }, [fetchInitialData]);

    const handleRefreshHighlights = async () => {
        try {
            const highlightsRes = await profileService.getUserHighlights(username);
            setHighlights(highlightsRes || []);
        } catch (error) {
            console.error("Failed to refresh highlights", error);
        }
    };

    useEffect(() => {
        if (userProfile && activeTab !== "posts") {
            fetchTabData(activeTab);
        }
    }, [activeTab, fetchTabData, userProfile]);

    if (loading) {
        return (
            <Container maxW="935px" p={0} mt={4}>
                <ProfileSkeleton />
            </Container>
        );
    }

    if (!userProfile && !loading) {
        return (
            <VStack h="50vh" justify="center" gap={4}>
                <Text fontSize="2xl" fontWeight="bold">
                    Sorry, this page isn't available.
                </Text>
                <Text color="gray.500">
                    The link you followed may be broken, or the page may have been removed.
                </Text>
                <ChakraLink href="/" color="blue.900" fontWeight="bold">
                    Go back to Instagram.
                </ChakraLink>
            </VStack>
        );
    }

    const filteredPosts = activeTab === "reels" 
        ? posts.filter(p => p.type === "REEL") 
        : posts;

    const isPrivateProfileHidden = userProfile?.privateAccount && !isOwnProfile && !userProfile?.isFollowing;
    const isBlocked = authUser?.blockedUserIds?.includes(userProfile?.id);

    return (
        <Container maxW="935px" p={0} bg="white" color="black" mt={4}>
            <ProfileHeader user={userProfile} isOwnProfile={isOwnProfile} />

            {isBlocked ? (
                <Flex direction="column" align="center" justify="center" py={16} borderTop="1px solid" borderColor="gray.200" mt={8}>
                    <Text fontSize="14px" fontWeight="bold" mb={2} color="black">
                        You blocked {userProfile?.username}
                    </Text>
                    <Text fontSize="14px" color="gray.500" textAlign="center" maxW="300px">
                        Unblock them to see their photos and videos, and to message them.
                    </Text>
                </Flex>
            ) : isPrivateProfileHidden ? (
                <Flex direction="column" align="center" justify="center" py={16} borderTop="1px solid" borderColor="gray.200" mt={8}>
                    <Box p={6} borderRadius="full" border="2px solid" borderColor="black" mb={6} display="flex" alignItems="center" justifyContent="center">
                        <FiLock size={48} strokeWidth={1.5} />
                    </Box>
                    <Text fontSize="14px" fontWeight="bold" mb={2}>
                        This account is private
                    </Text>
                    <Text fontSize="14px" color="gray.500">
                        Follow to see their photos and videos.
                    </Text>
                </Flex>
            ) : (
                <>
                    <ProfileHighlights 
                        isOwnProfile={isOwnProfile} 
                        user={userProfile} 
                        highlights={highlights} 
                        onRefresh={handleRefreshHighlights}
                    />

                    <ProfileTabs 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        isOwnProfile={isOwnProfile} 
                    />

                    <Box py={4}>
                        <PostGrid posts={filteredPosts} loading={tabLoading} />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default Profile;
