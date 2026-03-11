import React, { useState } from "react";
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
import { currentUser } from "../api/dummyData";
import StoryModal from "../components/modals/StoryModal";
import PostDetailModal from "../components/modals/PostDetailModal";

const Archive = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("stories");
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const archivedStories = currentUser.archivedStories || [];
    const archivedPosts = currentUser.archivedPosts || [];

    const storyHighlights = archivedStories.map((story) => ({
        id: story.id,
        title: `${story.day} ${story.month}`,
        user: currentUser,
        stories: [
            {
                id: story.id,
                url: story.url,
                views: [],
                replies: [],
            },
        ],
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
            {/* 1. Top Navigation Bar */}
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
                    _hover={{ bg: "transparent" }}
                />
                <Text fontSize="20px" fontWeight="700">
                    Archive
                </Text>
            </Flex>

            {/* 2. Tabs Section */}
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
                            <Text
                                fontWeight="700"
                                fontSize="12px"
                                letterSpacing="1px"
                            >
                                STORIES
                            </Text>
                        </HStack>
                        {activeTab === "stories" && (
                            <Box
                                h="1px"
                                w="100%"
                                bg="black"
                                position="absolute"
                                bottom="0"
                            />
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
                            <Text
                                fontWeight="700"
                                fontSize="12px"
                                letterSpacing="1px"
                            >
                                POSTS
                            </Text>
                        </HStack>
                        {activeTab === "posts" && (
                            <Box
                                h="1px"
                                w="100%"
                                bg="black"
                                position="absolute"
                                bottom="0"
                            />
                        )}
                    </VStack>
                </HStack>
            </Flex>

            {/* 3. Content Section */}
            <VStack gap={0} align="stretch">
                <Box px={4} py={6}>
                    <Text color="gray.500" fontSize="13px">
                        {activeTab === "stories"
                            ? "Only you can see your archived stories unless you choose to share them."
                            : "Only you can see the posts you've archived."}
                    </Text>
                </Box>

                {activeTab === "stories" ? (
                    <Grid templateColumns="repeat(4, 1fr)" gap={1} px={1}>
                        {archivedStories.map((story, index) => (
                            <Box
                                key={story.id}
                                position="relative"
                                pt="177.77%"
                                overflow="hidden"
                                borderRadius="4px"
                                cursor="pointer"
                                onClick={() => handleStoryClick(index)}
                            >
                                <Image
                                    src={story.url}
                                    alt={`${story.day} ${story.month}`}
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                                <Box
                                    position="absolute"
                                    top="8px"
                                    left="8px"
                                    bg="white"
                                    borderRadius="6px"
                                    px={1.5}
                                    py={0.5}
                                    boxShadow="0 2px 4px rgba(0,0,0,0.15)"
                                    textAlign="center"
                                    minW="34px"
                                >
                                    <Text
                                        color="black"
                                        fontSize="15px"
                                        fontWeight="800"
                                        lineHeight="1"
                                        mb="2px"
                                    >
                                        {story.day}
                                    </Text>
                                    <Text
                                        color="black"
                                        fontSize="9px"
                                        fontWeight="700"
                                        lineHeight="1"
                                    >
                                        {story.month}
                                    </Text>
                                </Box>
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
                                    src={post.imageUrl}
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
                isArchiveMode={true}
            />

            {/* Post Detail Modal */}
            {selectedPost && (
                <PostDetailModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                    post={selectedPost}
                    isLiked={false}
                    handleLike={() => {}}
                    isSaved={false}
                    handleSave={() => {}}
                />
            )}
        </Box>
    );
};

export default Archive;
