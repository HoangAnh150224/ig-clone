import React, { useState, useEffect } from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Grid,
    Image,
    Flex,
    IconButton,
    SimpleGrid,
} from "@chakra-ui/react";
import { BsArrowLeft, BsClockHistory, BsGrid3X3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StoryModal from "../components/modals/StoryModal";
import PostDetailModal from "../components/modals/PostDetailModal";
import postService from "../services/postService";
import storyService from "../services/storyService";

const Archive = () => {
    const navigate = useNavigate();
    const { user: authUser } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState("stories");
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    
    const [archivedStories, setArchivedStories] = useState([]);
    const [archivedPosts, setArchivedPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePostAction = (postId, action, changes) => {
        if (action === "delete") {
            setArchivedPosts((prev) => prev.filter((p) => p.id !== postId));
        } else if (action === "archive" && changes.archived === false) {
            setArchivedPosts((prev) => prev.filter((p) => p.id !== postId));
        }
    };

    useEffect(() => {
        const fetchArchive = async () => {
            setLoading(true);
            try {
                if (activeTab === "stories") {
                    const response = await storyService.getArchivedStories();
                    setArchivedStories(response || []);
                } else {
                    const response = await postService.getArchivedPosts();
                    setArchivedPosts(response.content || response || []);
                }
            } catch (error) {
                console.error("Failed to fetch archive", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArchive();
    }, [activeTab]);

    const storyHighlights = archivedStories.map((story) => ({
        id: story.id,
        title: "Archive",
        user: authUser,
        stories: [story],
    }));

    const handleStoryClick = (index) => {
        setSelectedStoryIndex(index);
        setIsStoryOpen(true);
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    return (
        <Box bg="white" minH="100vh" color="black">
            {/* Top Navigation Bar */}
            <Flex
                align="center"
                px={4}
                py={3}
                borderBottom="1px solid"
                borderColor="gray.100"
            >
                <IconButton
                    icon={<BsArrowLeft size={24} />}
                    variant="ghost"
                    aria-label="Back"
                    onClick={() => navigate(-1)}
                    mr={4}
                />
                <Text fontSize="20px" fontWeight="700">
                    Archive
                </Text>
            </Flex>

            {/* Tabs Section */}
            <Flex
                justify="center"
                borderBottom="1px solid"
                borderColor="gray.100"
            >
                <HStack gap={12}>
                    <VStack
                        gap={2}
                        py={3}
                        cursor="pointer"
                        position="relative"
                        onClick={() => setActiveTab("stories")}
                        color={activeTab === "stories" ? "black" : "gray.400"}
                    >
                        <HStack>
                            <Icon as={BsClockHistory} boxSize={5} />
                            <Text fontWeight="700" fontSize="12px" letterSpacing="1px">
                                STORIES
                            </Text>
                        </HStack>
                        {activeTab === "stories" && (
                            <Box h="1px" w="100%" bg="black" position="absolute" bottom="0" />
                        )}
                    </VStack>

                    <VStack
                        gap={2}
                        py={3}
                        cursor="pointer"
                        position="relative"
                        onClick={() => setActiveTab("posts")}
                        color={activeTab === "posts" ? "black" : "gray.400"}
                    >
                        <HStack>
                            <Icon as={BsGrid3X3} boxSize={5} />
                            <Text fontWeight="700" fontSize="12px" letterSpacing="1px">
                                POSTS
                            </Text>
                        </HStack>
                        {activeTab === "posts" && (
                            <Box h="1px" w="100%" bg="black" position="absolute" bottom="0" />
                        )}
                    </VStack>
                </HStack>
            </Flex>

            {/* Content Section */}
            <VStack gap={0} align="stretch">
                <Box px={4} py={6}>
                    <Text color="gray.500" fontSize="13px">
                        {activeTab === "stories"
                            ? "Only you can see your archived stories unless you choose to share them."
                            : "Only you can see the posts you've archived."}
                    </Text>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={10}>Loading...</Box>
                ) : activeTab === "stories" ? (
                    <Grid templateColumns="repeat(4, 1fr)" gap={1} px={1}>
                        {archivedStories.map((story, index) => (
                            <Box
                                key={story.id}
                                position="relative"
                                pt="177.77%"
                                overflow="hidden"
                                borderRadius="0"
                                cursor="pointer"
                                onClick={() => handleStoryClick(index)}
                            >
                                <Image
                                    src={story.mediaUrl || story.url}
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Box>
                        ))}
                    </Grid>
                ) : (
                    <SimpleGrid columns={3} spacing="4px" px={1}>
                        {archivedPosts.map((post) => (
                            <Box
                                key={post.id}
                                position="relative"
                                pb="100%"
                                cursor="pointer"
                                onClick={() => handlePostClick(post)}
                            >
                                <Image
                                    src={post.media?.[0]?.url || post.imageUrl}
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
            </VStack>

            {/* Story Player */}
            <StoryModal
                isOpen={isStoryOpen}
                onClose={() => setIsStoryOpen(false)}
                highlights={storyHighlights}
                initialHighlightIndex={selectedStoryIndex}
            />

            {/* Post Detail Modal */}
            {selectedPost && (
                <PostDetailModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                    post={selectedPost}
                    onPostAction={handlePostAction}
                />
            )}
        </Box>
    );
};

export default Archive;
