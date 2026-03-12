import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Image, Flex, HStack, Text, VStack, Spinner, Center } from "@chakra-ui/react";
import {
    AiOutlineClose,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineHeart,
    AiFillHeart,
} from "react-icons/ai";
import { BsThreeDots, BsSend, BsChevronUp, BsHeartFill } from "react-icons/bs";
import { FiHeart, FiPlus } from "react-icons/fi";
import UserAvatar from "../common/UserAvatar";
import { useSelector } from "react-redux";
import profileService from "../../services/profileService";
import storyService from "../../services/storyService";
import InstagramAlert from "../common/InstagramAlert";

const StoryModal = ({
    isOpen,
    onClose,
    highlights,
    initialHighlightIndex,
    isArchiveMode = false,
}) => {
    const navigate = useNavigate();
    const { user: authUser } = useSelector((state) => state.auth);

    const [highlightIndex, setHighlightIndex] = useState(
        initialHighlightIndex || 0,
    );
    const [storyIndex, setStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isActivityOpen, setIsActivityOpen] = useState(false);
    const [viewers, setViewers] = useState([]);
    const [loadingViewers, setLoadingViewers] = useState(false);
    const [isHighlighting, setIsHighlighting] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
    });

    const currentHighlight = highlights?.[highlightIndex];
    const currentStories = currentHighlight?.stories || [];
    const currentStory = currentStories[storyIndex];
    const storyUser = currentHighlight?.user;

    const markAsSeen = useCallback(async (storyId) => {
        if (!storyId || isArchiveMode) return;
        try {
            await storyService.viewStory(storyId);
            // Optionally update local state if needed, but the main goal is the server call
            if (currentStory) {
                currentStory.seen = true;
            }
        } catch (error) {
            console.error("Failed to mark story as seen", error);
        }
    }, [isArchiveMode, currentStory]);

    useEffect(() => {
        if (isOpen && currentStory && !currentStory.seen) {
            markAsSeen(currentStory.id);
        }
    }, [isOpen, currentStory, markAsSeen]);

    const isOwnStory =
        storyUser?.id === authUser?.id ||
        storyUser?.username === authUser?.username;

    const handleNavigateToUser = (e) => {
        e.stopPropagation();
        if (storyUser?.username) {
            onClose();
            navigate(`/${storyUser.username}`);
        }
    };

    const handleAddToHighlight = async () => {
        setIsHighlighting(true);
        try {
            const result = await profileService.addToHighlight(
                currentStory.id,
                null,
                "New Highlight",
            );
            if (result) {
                setAlertConfig({
                    isOpen: true,
                    title: "Added",
                    message: "Story added to your Highlight.",
                });
            }
        } catch (error) {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: error.message || "Failed to add to Highlight.",
            });
        } finally {
            setIsHighlighting(false);
        }
    };

    const handleOpenActivity = async () => {
        if (!currentStory?.id) return;
        setIsActivityOpen(true);
        setLoadingViewers(true);
        try {
            const response = await storyService.getStoryViewers(currentStory.id);
            setViewers(response.content || (Array.isArray(response) ? response : []));
        } catch (error) {
            console.error("Failed to fetch story viewers", error);
        } finally {
            setLoadingViewers(false);
        }
    };

    const getFirstUnseenIndex = useCallback((stories) => {
        if (!stories || stories.length === 0) return 0;
        const index = stories.findIndex(s => s.seen === false);
        return index === -1 ? 0 : index;
    }, []);

    useEffect(() => {
        if (isOpen) {
            setHighlightIndex(initialHighlightIndex || 0);
            
            // Jump to the first unseen story of the initial highlight
            const initialStories = highlights?.[initialHighlightIndex || 0]?.stories || [];
            setStoryIndex(getFirstUnseenIndex(initialStories));
            
            setProgress(0);
            setIsLiked(false);
            setIsActivityOpen(false);
            setViewers([]);
        }
    }, [isOpen, initialHighlightIndex, highlights, getFirstUnseenIndex]);

    const handleNext = useCallback(() => {
        if (isActivityOpen || isHighlighting) return;
        if (storyIndex < currentStories.length - 1) {
            setStoryIndex((prev) => prev + 1);
            setProgress(0);
        } else if (highlightIndex < highlights.length - 1) {
            const nextHighlightIndex = highlightIndex + 1;
            setHighlightIndex(nextHighlightIndex);
            
            // When moving to the next highlight, also jump to its first unseen story
            const nextStories = highlights[nextHighlightIndex]?.stories || [];
            setStoryIndex(getFirstUnseenIndex(nextStories));
            
            setProgress(0);
        } else {
            onClose();
        }
    }, [
        storyIndex,
        currentStories.length,
        highlightIndex,
        highlights,
        onClose,
        isActivityOpen,
        isHighlighting,
        getFirstUnseenIndex
    ]);

    const handlePrev = useCallback(() => {
        if (isActivityOpen || isHighlighting) return;
        if (storyIndex > 0) {
            setStoryIndex((prev) => prev - 1);
            setProgress(0);
        } else if (highlightIndex > 0) {
            const prevHighlight = highlights[highlightIndex - 1];
            setHighlightIndex((prev) => prev - 1);
            setStoryIndex((prevHighlight.stories?.length || 1) - 1);
            setProgress(0);
        }
    }, [
        storyIndex,
        highlightIndex,
        highlights,
        isActivityOpen,
        isHighlighting,
    ]);

    useEffect(() => {
        if (!isOpen || isActivityOpen || isHighlighting) return;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + 2;
            });
        }, 50);
        return () => clearInterval(interval);
    }, [isOpen, handleNext, isActivityOpen, isHighlighting]);

    if (!isOpen || !currentHighlight) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0,0,0,0.98)"
            zIndex={2000}
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {!isActivityOpen && (
                <Box
                    position="fixed"
                    top={6}
                    right={6}
                    color="white"
                    cursor="pointer"
                    onClick={onClose}
                    zIndex={2100}
                    _hover={{ opacity: 0.7 }}
                >
                    <AiOutlineClose size={36} />
                </Box>
            )}

            {!isActivityOpen && (highlightIndex > 0 || storyIndex > 0) && (
                <Box
                    position="absolute"
                    left="5%"
                    cursor="pointer"
                    color="white"
                    onClick={handlePrev}
                    display={{ base: "none", lg: "block" }}
                    zIndex={2100}
                >
                    <AiOutlineLeft size={48} />
                </Box>
            )}
            {!isActivityOpen && (
                <Box
                    position="absolute"
                    right="5%"
                    cursor="pointer"
                    color="white"
                    onClick={handleNext}
                    display={{ base: "none", lg: "block" }}
                    zIndex={2100}
                >
                    <AiOutlineRight size={48} />
                </Box>
            )}

            <Box
                width="100%"
                maxW="550px"
                height="98vh"
                position="relative"
                borderRadius={{ base: "0", md: "12px" }}
                overflow="hidden"
                bg="#000000"
                isolation="isolate"
                transform="translate3d(0, 0, 0)"
                backfaceVisibility="hidden"
                outline="none"
                border="none"
                boxShadow="none"
                style={{
                    maskImage: "radial-gradient(white, black)",
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                }}
            >
                <HStack
                    position="absolute"
                    top={4}
                    left={2}
                    right={2}
                    spacing={1}
                    zIndex={20}
                    opacity={isActivityOpen ? 0 : 1}
                    transition="0.3s"
                >
                    {currentStories.map((_, idx) => (
                        <Box
                            key={idx}
                            flex={1}
                            height="2px"
                            bg="rgba(255, 255, 255, 0.35)"
                            borderRadius="full"
                            overflow="hidden"
                        >
                            <Box
                                width={
                                    idx < storyIndex
                                        ? "100%"
                                        : idx === storyIndex
                                          ? `${progress}%`
                                          : "0%"
                                }
                                height="100%"
                                bg="white"
                                transition="width 0.1s linear"
                            />
                        </Box>
                    ))}
                </HStack>

                {/* User header with navigation logic */}
                <Box
                    position="absolute"
                    top={6}
                    left={0}
                    right={0}
                    p={4}
                    zIndex={10}
                    opacity={isActivityOpen ? 0 : 1}
                    transition="0.3s"
                >
                    <HStack
                        gap={3}
                        cursor="pointer"
                        onClick={handleNavigateToUser}
                        width="fit-content"
                    >
                        <UserAvatar 
                            src={storyUser?.avatar || storyUser?.avatarUrl} 
                            size="32px" 
                            hasBorder={false}
                        />
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            gap={0}
                        >
                            <Text
                                color="white"
                                fontWeight="bold"
                                fontSize="14px"
                            >
                                {storyUser?.username}
                            </Text>
                            <Text
                                color="whiteAlpha.800"
                                fontSize="12px"
                                mt="-2px"
                            >
                                {currentHighlight.title}
                            </Text>
                        </Box>
                    </HStack>
                </Box>

                <Image
                    src={currentStory?.url}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                />

                {!isActivityOpen && (
                    <Flex
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        zIndex={5}
                    >
                        <Box flex={1} onClick={handlePrev} cursor="pointer" />
                        <Box flex={2} onClick={handleNext} cursor="pointer" />
                    </Flex>
                )}

                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={6}
                    zIndex={10}
                    bgGradient={
                        isActivityOpen
                            ? "none"
                            : "linear(to-t, blackAlpha.800, transparent)"
                    }
                >
                    {isOwnStory ? (
                        <Flex justify="space-between" align="center">
                            {isArchiveMode ? (
                                <Flex flex={1} justify="center">
                                    <VStack
                                        gap={1}
                                        cursor="pointer"
                                        onClick={handleAddToHighlight}
                                        _hover={{ opacity: 0.8 }}
                                        color="white"
                                    >
                                        <Box
                                            p={2}
                                            borderRadius="full"
                                            border="2px solid white"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <FiHeart size={20} />
                                        </Box>
                                        <Text fontSize="12px" fontWeight="bold">
                                            Highlight
                                        </Text>
                                    </VStack>
                                </Flex>
                            ) : (
                                <>
                                    <VStack
                                        gap={1}
                                        cursor="pointer"
                                        onClick={handleOpenActivity}
                                        _hover={{ opacity: 0.8 }}
                                        align="start"
                                    >
                                        <Box
                                            display="flex"
                                            position="relative"
                                            width="40px"
                                            height="24px"
                                        >
                                            <Box
                                                width="24px"
                                                height="24px"
                                                borderRadius="full"
                                                overflow="hidden"
                                                position="absolute"
                                                left="0"
                                                border="2px solid black"
                                            >
                                                <Image
                                                    src={
                                                        currentStory?.views?.[0]
                                                            ?.avatar ||
                                                        "https://i.pravatar.cc/150?u=1"
                                                    }
                                                />
                                            </Box>
                                            <Box
                                                width="24px"
                                                height="24px"
                                                borderRadius="full"
                                                overflow="hidden"
                                                position="absolute"
                                                left="12px"
                                                border="2px solid black"
                                            >
                                                <Image
                                                    src={
                                                        currentStory?.views?.[1]
                                                            ?.avatar ||
                                                        "https://i.pravatar.cc/150?u=2"
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                        <Text
                                            color="white"
                                            fontSize="12px"
                                            fontWeight="bold"
                                        >
                                            Activity
                                        </Text>
                                    </VStack>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        gap={0}
                                        cursor="pointer"
                                        color="white"
                                    >
                                        <BsThreeDots size={24} />
                                        <Text fontSize="10px">More</Text>
                                    </Box>
                                </>
                            )}
                        </Flex>
                    ) : (
                        <HStack gap={4}>
                            <Flex
                                flex={1}
                                border="1px solid white"
                                borderRadius="full"
                                px={6}
                                py={3}
                                align="center"
                            >
                                <Text color="whiteAlpha.900" fontSize="md">
                                    Reply to {storyUser?.username}...
                                </Text>
                            </Flex>
                            <HStack gap={4} color="white">
                                <Box
                                    onClick={() => setIsLiked(!isLiked)}
                                    cursor="pointer"
                                >
                                    {isLiked ? (
                                        <AiFillHeart
                                            size={30}
                                            color="#ff3040"
                                        />
                                    ) : (
                                        <AiOutlineHeart size={30} />
                                    )}
                                </Box>
                                <BsSend size={26} cursor="pointer" />
                            </HStack>
                        </HStack>
                    )}
                </Box>

                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    height={isActivityOpen ? "100%" : "0"}
                    bg="white"
                    zIndex={100}
                    transition="height 0.3s ease-out"
                    overflow="hidden"
                    borderRadius={isActivityOpen ? "0" : "12px 12px 0 0"}
                    visibility={isActivityOpen ? "visible" : "hidden"}
                    pointerEvents={isActivityOpen ? "auto" : "none"}
                >
                    {isActivityOpen && (
                        <Flex direction="column" height="100%" color="black">
                            <Flex
                                p={4}
                                justify="space-between"
                                align="center"
                                borderBottom="1px solid"
                                borderColor="gray.100"
                            >
                                <Text fontWeight="bold" fontSize="md">
                                    Activity
                                </Text>
                                <Box
                                    cursor="pointer"
                                    onClick={() => setIsActivityOpen(false)}
                                >
                                    <AiOutlineClose size={24} />
                                </Box>
                            </Flex>

                            <Box flex={1} overflowY="auto">
                                {currentStory?.replies?.length > 0 && (
                                    <Box
                                        p={4}
                                        borderBottom="1px solid"
                                        borderColor="gray.50"
                                    >
                                        <Text
                                            fontWeight="bold"
                                            fontSize="sm"
                                            mb={4}
                                            color="gray.500"
                                        >
                                            Replies
                                        </Text>
                                        {currentStory.replies.map((rep, index) => (
                                            <Flex
                                                key={rep.id || `reply-${index}`}
                                                align="center"
                                                gap={3}
                                                mb={4}
                                                cursor="pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onClose();
                                                    navigate(
                                                        `/${rep.user.username}`,
                                                    );
                                                }}
                                            >
                                                <UserAvatar
                                                    src={rep.user.avatar}
                                                    size="44px"
                                                />
                                                <Box flex={1}>
                                                    <Text
                                                        fontWeight="bold"
                                                        fontSize="sm"
                                                    >
                                                        {rep.user.username}
                                                    </Text>
                                                    <Text fontSize="sm">
                                                        {rep.text}
                                                    </Text>
                                                </Box>
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.400"
                                                >
                                                    {rep.time}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </Box>
                                )}

                                <Box p={4}>
                                    <Text
                                        fontWeight="bold"
                                        fontSize="sm"
                                        mb={4}
                                        color="gray.500"
                                    >
                                        Viewers
                                    </Text>
                                    {loadingViewers ? (
                                        <Flex justify="center" p={8}>
                                            <Spinner color="#0095f6" />
                                        </Flex>
                                    ) : viewers.length > 0 ? (
                                        viewers.map((viewer, index) => (
                                            <Flex
                                                key={viewer.id || `viewer-${index}`}
                                                align="center"
                                                gap={3}
                                                mb={4}
                                                justify="space-between"
                                                cursor="pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onClose();
                                                    navigate(`/${viewer.username}`);
                                                }}
                                            >
                                                <HStack gap={3}>
                                                    <UserAvatar
                                                        src={viewer.avatar || viewer.avatarUrl}
                                                        size="44px"
                                                    />
                                                    <Box>
                                                        <HStack gap={1}>
                                                            <Text
                                                                fontWeight="bold"
                                                                fontSize="sm"
                                                            >
                                                                {viewer.username}
                                                            </Text>
                                                            {viewer.verified && (
                                                                <Image src="/verified.png" w="14px" h="14px" />
                                                            )}
                                                        </HStack>
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                        >
                                                            {viewer.mutualCount > 0 
                                                                ? `Followed by ${viewer.mutualCount} mutual` 
                                                                : viewer.fullName}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                                {viewer.liked && (
                                                    <AiFillHeart
                                                        color="#ff3040"
                                                        size={20}
                                                    />
                                                )}
                                            </Flex>
                                        ))
                                    ) : (
                                        <Center p={8}>
                                            <Text color="gray.500" fontSize="sm">No viewers yet</Text>
                                        </Center>
                                    )}
                                </Box>
                            </Box>
                        </Flex>
                    )}
                </Box>
            </Box>
            <InstagramAlert
                isOpen={alertConfig.isOpen}
                onClose={() =>
                    setAlertConfig({ ...alertConfig, isOpen: false })
                }
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </Box>
    );
};

export default StoryModal;
