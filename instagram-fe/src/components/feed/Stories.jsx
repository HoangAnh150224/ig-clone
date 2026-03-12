import React, { useRef, useState, useEffect, useCallback } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import UserAvatar from "../common/UserAvatar";
import StoryModal from "../modals/StoryModal";
import storyService from "../../services/storyService";
import { useSelector, useDispatch } from "react-redux";
import { openCreatePostModal } from "../../store/slices/uiSlice";
import { FiPlus } from "react-icons/fi";

const Stories = () => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth);
    const scrollRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [stories, setStories] = useState([]);

    // Mouse Drag Logic
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 0);
            setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    }, []);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await storyService.getFeedStories();
                let fetchedStories = response || [];

                // 1. Find own story
                const ownStoryIndex = fetchedStories.findIndex(s => s.isOwn || s.username === authUser?.username);
                let finalStories = [];

                if (ownStoryIndex !== -1) {
                    // 2a. If own story exists, move it to the front
                    const ownStory = fetchedStories.splice(ownStoryIndex, 1)[0];
                    finalStories = [ownStory, ...fetchedStories];
                } else {
                    // 2b. If no own story, add a placeholder
                    const placeholder = {
                        id: 'own-placeholder',
                        username: "Your story",
                        avatar: authUser?.avatarUrl,
                        isOwn: true,
                        hasUnseenStory: false,
                        stories: []
                    };
                    finalStories = [placeholder, ...fetchedStories];
                }

                setStories(finalStories);
            } catch (error) {
                console.error("Failed to fetch stories", error);
            }
        };
        if (authUser) {
            fetchStories();
        }
    }, [authUser]);

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
            handleScroll();
        }
        return () =>
            scrollContainer?.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const slide = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -400 : 400;
            scrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleStoryClick = (index, story) => {
        if (isDragging) return;

        // If it's the own placeholder with no stories, open create modal
        if (story.isOwn && (!story.stories || story.stories.length === 0)) {
            dispatch(openCreatePostModal());
            return;
        }

        setSelectedStoryIndex(index);
        setIsStoryOpen(true);
    };

    return (
        <>
            <Box
                position="relative"
                width="100%"
                maxW="630px"
                mx="auto"
                mb={4}
                userSelect="none"
            >
                {showLeft && (
                    <Box
                        position="absolute"
                        left={2}
                        top="48px"
                        zIndex={10}
                        width="26px"
                        height="26px"
                        borderRadius="full"
                        bg="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        onClick={() => slide("left")}
                        boxShadow="md"
                    >
                        <Box
                            as="svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </Box>
                    </Box>
                )}

                {showRight && (
                    <Box
                        position="absolute"
                        right={2}
                        top="48px"
                        zIndex={10}
                        width="26px"
                        height="26px"
                        borderRadius="full"
                        bg="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        onClick={() => slide("right")}
                        boxShadow="md"
                    >
                        <Box
                            as="svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </Box>
                    </Box>
                )}

                <Box
                    ref={scrollRef}
                    width="100%"
                    py={4}
                    bg="white"
                    overflowX="auto"
                    cursor={isDragging ? "grabbing" : "pointer"}
                    css={{
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseMove={onMouseMove}
                    onScroll={handleScroll}
                >
                    <HStack gap={4} px={4}>
                        {stories.map((story, index) => (
                            <VStack
                                key={story.id || `story-${index}`}
                                gap={2}
                                cursor="pointer"
                                minW="74px"
                                onClick={() => handleStoryClick(index, story)}
                            >
                                <Box
                                    p="2px"
                                    borderRadius="full"
                                    bg={
                                        story.isCloseFriends
                                            ? "#1ed760"
                                            : story.hasUnseenStory
                                            ? "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)"
                                            : "transparent"
                                    }
                                    border={
                                        !story.hasUnseenStory && !story.isCloseFriends ? "1px solid" : "none"
                                    }
                                    borderColor="gray.200"
                                    width="74px"
                                    height="74px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    position="relative"
                                >
                                    <Box
                                        bg="white"
                                        borderRadius="full"
                                        p="2px"
                                        width="100%"
                                        height="100%"
                                    >
                                        <Box
                                            borderRadius="full"
                                            overflow="hidden"
                                            width="100%"
                                            height="100%"
                                        >
                                            <UserAvatar
                                                src={story.avatar || story.avatarUrl}
                                                size="100%"
                                            />
                                        </Box>
                                    </Box>
                                    
                                    {/* Plus icon for own placeholder */}
                                    {story.isOwn && (!story.stories || story.stories.length === 0) && (
                                        <Box
                                            position="absolute"
                                            bottom="2px"
                                            right="2px"
                                            bg="#0095f6"
                                            borderRadius="full"
                                            border="2px solid white"
                                            width="20px"
                                            height="20px"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            color="white"
                                        >
                                            <FiPlus size={14} strokeWidth={4} />
                                        </Box>
                                    )}
                                </Box>
                                <Text
                                    fontSize="12px"
                                    width="74px"
                                    textAlign="center"
                                    isTruncated
                                    color="black"
                                >
                                    {story.isOwn
                                        ? "Your story"
                                        : story.username}
                                </Text>
                            </VStack>
                        ))}
                    </HStack>
                </Box>
            </Box>

            {/* Story Player */}
            <StoryModal
                isOpen={isStoryOpen}
                onClose={() => setIsStoryOpen(false)}
                highlights={stories.map((s) => ({
                    title: "Story",
                    user: s,
                    stories: s.stories || [],
                }))}
                initialHighlightIndex={selectedStoryIndex}
            />
        </>
    );
};

export default Stories;
