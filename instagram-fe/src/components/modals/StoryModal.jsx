import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Image, Flex, HStack, Text, VStack, Spinner, Center, Input } from "@chakra-ui/react";
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
    const [storyReplies, setStoryReplies] = useState([]);
    const [loadingViewers, setLoadingViewers] = useState(false);
    const [isHighlighting, setIsHighlighting] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
    });

    const [activeStories, setActiveStories] = useState([]);
    const [isLoadingStories, setIsLoadingStories] = useState(false);

    useEffect(() => {
        const fetchHighlightStories = async () => {
            if (isOpen && highlights?.[highlightIndex]) {
                const h = highlights[highlightIndex];
                
                // If stories/items are already present, use them
                const existingStories = h.stories || h.items || [];
                if (existingStories.length > 0) {
                    setActiveStories(existingStories);
                    return;
                }

                // If no stories present and we have an ID, fetch them from the new endpoint
                if (h.id) {
                    setIsLoadingStories(true);
                    try {
                        const response = await profileService.getHighlightStories(h.id);
                        // Extract from ApiResponse wrapper (.data)
                        const stories = response?.data || (Array.isArray(response) ? response : (response?.content || []));
                        setActiveStories(stories);
                    } catch (error) {
                        console.error("Failed to fetch highlight stories", error);
                        setActiveStories([]);
                    } finally {
                        setIsLoadingStories(false);
                    }
                } else {
                    setActiveStories([]);
                }
            }
        };

        fetchHighlightStories();
    }, [isOpen, highlightIndex, highlights]);

    const currentHighlight = highlights?.[highlightIndex];
    const currentStories = activeStories;
    const currentStory = currentStories[storyIndex];
    const storyUser = currentHighlight?.user;

    const markAsSeen = useCallback(async (storyId) => {
        if (!storyId || isArchiveMode || currentStory?.seen) return;
        try {
            await storyService.viewStory(storyId);
            // We update the local object reference which is part of activeStories
            // This is generally safe in this context as seen is checked before calling.
            currentStory.seen = true;
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
            const [viewersRes, repliesRes] = await Promise.all([
                storyService.getStoryViewers(currentStory.id),
                storyService.getStoryReplies(currentStory.id),
            ]);
            
            // Handle ApiResponse wrapper structure
            const viewersList = viewersRes?.data || (Array.isArray(viewersRes) ? viewersRes : (viewersRes?.content || []));
            const repliesList = repliesRes?.data || (Array.isArray(repliesRes) ? repliesRes : (repliesRes?.content || []));
            
            setViewers(viewersList);
            setStoryReplies(repliesList);
        } catch (error) {
            console.error("Failed to fetch story activity", error);
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
            const hIndex = initialHighlightIndex || 0;
            setHighlightIndex(hIndex);
            
            // Jump to the first unseen story of the initial highlight
            const currentH = highlights?.[hIndex];
            const initialStories = currentH?.stories || currentH?.items || [];
            const initialStoryIndex = getFirstUnseenIndex(initialStories);
            setStoryIndex(initialStoryIndex);
            
            // Sync liked state from story data
            setIsLiked(initialStories[initialStoryIndex]?.liked || false);
            
            setProgress(0);
            setIsActivityOpen(false);
            setViewers([]);
            setStoryReplies([]);
        }
    }, [isOpen, initialHighlightIndex, highlights, getFirstUnseenIndex]);

    const handleNext = useCallback(() => {
        if (isActivityOpen || isHighlighting) return;
        if (storyIndex < currentStories.length - 1) {
            const nextIdx = storyIndex + 1;
            setStoryIndex(nextIdx);
            setIsLiked(currentStories[nextIdx]?.liked || false);
            setProgress(0);
        } else if (highlightIndex < highlights.length - 1) {
            const nextHighlightIndex = highlightIndex + 1;
            setHighlightIndex(nextHighlightIndex);
            
            const nextH = highlights[nextHighlightIndex];
            const nextStories = nextH?.stories || nextH?.items || [];
            const nextStoryIdx = getFirstUnseenIndex(nextStories);
            setStoryIndex(nextStoryIdx);
            setIsLiked(nextStories[nextStoryIdx]?.liked || false);
            
            setProgress(0);
        } else {
            onClose();
        }
    }, [
        storyIndex,
        currentStories,
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
            const prevIdx = storyIndex - 1;
            setStoryIndex(prevIdx);
            setIsLiked(currentStories[prevIdx]?.liked || false);
            setProgress(0);
        } else if (highlightIndex > 0) {
            const prevHighlightIdx = highlightIndex - 1;
            const prevH = highlights[prevHighlightIdx];
            const prevHighlightStories = prevH?.stories || prevH?.items || [];
            
            setHighlightIndex(prevHighlightIdx);
            const lastIdx = (prevHighlightStories.length || 1) - 1;
            setStoryIndex(lastIdx);
            setIsLiked(prevHighlightStories[lastIdx]?.liked || false);
            
            setProgress(0);
        }
    }, [
        storyIndex,
        currentStories,
        highlightIndex,
        highlights,
        isActivityOpen,
        isHighlighting,
    ]);

    const handleLike = async () => {
        if (!currentStory?.id) return;
        try {
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            
            await storyService.likeStory(currentStory.id);
            
            // Sync with local data
            if (currentStory) {
                currentStory.liked = newLikedState;
            }
        } catch (error) {
            console.error("Failed to like story", error);
            setIsLiked(!isLiked); // Rollback
        }
    };

    const handleSendReply = async (e) => {
        if (e.key !== "Enter" || !replyText.trim() || isSendingReply) return;

        setIsSendingReply(true);
        try {
            await storyService.replyToStory(currentStory.id, replyText);
            setReplyText("");
            setAlertConfig({
                isOpen: true,
                title: "Sent",
                message: "Your reply has been sent.",
            });
        } catch (error) {
            console.error("Failed to send reply", error);
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to send reply.",
            });
        } finally {
            setIsSendingReply(false);
        }
    };

    const handleDeleteStory = async () => {
        if (!currentStory?.id) return;
        try {
            await storyService.deleteStory(currentStory.id);
            setIsMoreMenuOpen(false);
            
            const updatedStories = currentStories.filter(s => s.id !== currentStory.id);
            setActiveStories(updatedStories);

            if (updatedStories.length > 0) {
                const nextIdx = storyIndex >= updatedStories.length ? updatedStories.length - 1 : storyIndex;
                setStoryIndex(nextIdx);
                setIsLiked(updatedStories[nextIdx]?.liked || false);
                setProgress(0);
            } else {
                onClose();
            }
            
            setAlertConfig({
                isOpen: true,
                title: "Deleted",
                message: "Your story has been deleted.",
            });
        } catch (error) {
            console.error("Failed to delete story", error);
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to delete story.",
            });
        }
    };

    const handleDeleteHighlight = async () => {
        if (!currentHighlight?.id) return;
        try {
            await profileService.deleteHighlight(currentHighlight.id);
            setIsMoreMenuOpen(false);
            onClose();
            // Optionally trigger a refresh of the profile
            window.location.reload(); 
        } catch (error) {
            console.error("Failed to delete highlight", error);
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to delete highlight.",
            });
        }
    };

    const handleArchiveStory = async () => {
        if (!currentStory?.id) return;
        try {
            await storyService.archiveStory(currentStory.id);
            setIsMoreMenuOpen(false);
            
            if (!isArchiveMode) {
                const updatedStories = currentStories.filter(s => s.id !== currentStory.id);
                setActiveStories(updatedStories);

                if (updatedStories.length > 0) {
                    const nextIdx = storyIndex >= updatedStories.length ? updatedStories.length - 1 : storyIndex;
                    setStoryIndex(nextIdx);
                    setIsLiked(updatedStories[nextIdx]?.liked || false);
                    setProgress(0);
                } else {
                    onClose();
                }
            } else {
                onClose();
            }

            setAlertConfig({
                isOpen: true,
                title: isArchiveMode ? "Unarchived" : "Archived",
                message: isArchiveMode 
                    ? "Story has been moved out of archive." 
                    : "Story has been moved to your archive.",
            });
        } catch (error) {
            console.error("Failed to archive story", error);
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to update story archive status.",
            });
        }
    };

    useEffect(() => {
        if (!isOpen || isActivityOpen || isHighlighting || isMoreMenuOpen || replyText.length > 0) return;
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
    }, [isOpen, handleNext, isActivityOpen, isHighlighting, isMoreMenuOpen, replyText]);

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
                    display="block"
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
                    display="block"
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
                borderRadius="12px"
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

                {/* Media Content */}
                {(() => {
                    // Some backends nest the story object inside the highlight item
                    const actualStory = currentStory?.story || currentStory;
                    const mediaUrl = actualStory?.mediaUrl || actualStory?.url || actualStory?.contentUrl;
                    const isVideo = actualStory?.type === "VIDEO" || 
                                   mediaUrl?.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) ||
                                   mediaUrl?.includes("video");

                    if (!mediaUrl) {
                        return (
                            <Center h="100%" flexDir="column" gap={4}>
                                <Spinner color="white" size="lg" />
                                <Text color="whiteAlpha.600" fontSize="sm">Loading media...</Text>
                            </Center>
                        );
                    }

                    if (isVideo) {
                        return (
                            <Box width="100%" height="100%" bg="black">
                                <video
                                    src={mediaUrl}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                    autoPlay
                                    muted
                                    playsInline
                                    onEnded={handleNext}
                                />
                            </Box>
                        );
                    }

                    return (
                        <Image
                            src={mediaUrl}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            fallback={
                                <Center h="100%">
                                    <Spinner color="white" />
                                </Center>
                            }
                        />
                    );
                })()}

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
                                                        currentStory?.views?.[0]?.viewer?.avatarUrl ||
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
                                                        currentStory?.views?.[1]?.viewer?.avatarUrl ||
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
                                        onClick={() => setIsMoreMenuOpen(true)}
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
                                py={1}
                                align="center"
                            >
                                <Input
                                    variant="unstyled"
                                    placeholder={`Reply to ${storyUser?.username}...`}
                                    color="white"
                                    _placeholder={{ color: "whiteAlpha.700" }}
                                    fontSize="14px"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyPress={handleSendReply}
                                    isDisabled={isSendingReply}
                                />
                            </Flex>
                            <HStack gap={4} color="white">
                                <Box
                                    onClick={handleLike}
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
                                {storyReplies?.length > 0 && (
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
                                        {storyReplies.map((rep, index) => {
                                            const replyUser = rep.sender || rep.author || rep.user;
                                            const username = replyUser?.username;
                                            const avatarUrl = replyUser?.avatarUrl || replyUser?.avatar;

                                            return (
                                                <Flex
                                                    key={rep.id || `reply-${index}`}
                                                    align="center"
                                                    gap={3}
                                                    mb={4}
                                                    cursor="pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (username) {
                                                            onClose();
                                                            navigate(`/${username}`);
                                                        }
                                                    }}
                                                >
                                                    <UserAvatar
                                                        src={avatarUrl}
                                                        size="44px"
                                                    />
                                                    <Box flex={1}>
                                                        <Text
                                                            fontWeight="bold"
                                                            fontSize="sm"
                                                        >
                                                            {username || "user"}
                                                        </Text>
                                                        <Text fontSize="sm">
                                                            {rep.text || rep.content}
                                                        </Text>
                                                    </Box>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.400"
                                                    >
                                                        {rep.time || "Just now"}
                                                    </Text>
                                                </Flex>
                                            );
                                        })}
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
                                            viewers.map((view, index) => (
                                            <Flex
                                                key={view.id || `viewer-${index}`}
                                                align="center"
                                                gap={3}
                                                mb={4}
                                                justify="space-between"
                                                cursor="pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onClose();
                                                    navigate(`/${view.viewer?.username || view.user?.username}`);
                                                }}
                                            >
                                                <HStack gap={3}>
                                                    <UserAvatar
                                                        src={view.viewer?.avatarUrl || view.user?.avatarUrl}
                                                        size="44px"
                                                    />
                                                    <Box>
                                                        <HStack gap={1}>
                                                            <Text
                                                                fontWeight="bold"
                                                                fontSize="sm"
                                                            >
                                                                {view.viewer?.username || view.user?.username}
                                                            </Text>
                                                            {(view.viewer?.verified || view.user?.verified) && (
                                                                <Image src="/verified.png" w="14px" h="14px" />
                                                            )}
                                                        </HStack>
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                        >
                                                            {(view.viewer?.mutualCount || view.user?.mutualCount) > 0 
                                                                ? `Followed by ${view.viewer?.mutualCount || view.user?.mutualCount} mutual` 
                                                                : (view.viewer?.fullName || view.user?.fullName)}
                                                        </Text>
                                                    </Box>
                                                </HStack>
                                                {(view.liked || view.isLiked) && (
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

            {/* More Menu Overlay */}
            {isMoreMenuOpen && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    zIndex={3000}
                    bg="blackAlpha.700"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => setIsMoreMenuOpen(false)}
                >
                    <VStack
                        bg="white"
                        borderRadius="xl"
                        width="300px"
                        overflow="hidden"
                        spacing={0}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Box
                            w="full"
                            py={4}
                            textAlign="center"
                            cursor="pointer"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                            onClick={handleArchiveStory}
                            _hover={{ bg: "gray.50" }}
                        >
                            <Text fontWeight="600">
                                {isArchiveMode ? "Unarchive" : "Archive"}
                            </Text>
                        </Box>
                        <Box
                            w="full"
                            py={4}
                            textAlign="center"
                            cursor="pointer"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                            onClick={handleDeleteStory}
                            _hover={{ bg: "gray.50" }}
                        >
                            <Text color="#ff3040" fontWeight="bold">
                                Delete Story
                            </Text>
                        </Box>
                        {!isArchiveMode && currentHighlight?.id !== "active-story" && (
                            <Box
                                w="full"
                                py={4}
                                textAlign="center"
                                cursor="pointer"
                                borderBottom="1px solid"
                                borderColor="gray.100"
                                onClick={handleDeleteHighlight}
                                _hover={{ bg: "gray.50" }}
                            >
                                <Text color="#ff3040" fontWeight="bold">
                                    Delete Highlight
                                </Text>
                            </Box>
                        )}
                        <Box
                            w="full"
                            py={4}
                            textAlign="center"
                            cursor="pointer"
                            onClick={() => setIsMoreMenuOpen(false)}
                            _hover={{ bg: "gray.50" }}
                        >
                            <Text>Cancel</Text>
                        </Box>
                    </VStack>
                </Box>
            )}
        </Box>
    );
};

export default StoryModal;
