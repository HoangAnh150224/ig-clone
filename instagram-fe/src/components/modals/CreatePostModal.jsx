import React, { useState, useRef } from "react";
import {
    Box,
    Flex,
    Text,
    Image,
    VStack,
    HStack,
    Center,
    Button,
    Spinner,
} from "@chakra-ui/react";
import {
    AiOutlineClose,
    AiOutlineArrowLeft,
    AiOutlineTags,
} from "react-icons/ai";
import { BsImages, BsGear, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { closeCreatePostModal } from "../../store/slices/uiSlice";
import { fetchPosts, resetPosts } from "../../store/slices/postSlice";
import UserAvatar from "../common/UserAvatar";
import postService from "../../services/postService";
import storyService from "../../services/storyService";
import cloudinaryService from "../../services/cloudinaryService";

const CreatePostModal = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isCreatePostModalOpen);
    const { user } = useSelector((state) => state.auth);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState("");
    const [locationName, setLocationName] = useState("");
    const [hashtagsStr, setHashtagsStr] = useState("");
    const [postType, setPostType] = useState("POST"); // 'POST', 'REEL', or 'STORY'
    const [isCloseFriends, setIsCloseFriends] = useState(false);
    const [hideLikeCount, setHideLikeCount] = useState(false);
    const [commentsDisabled, setCommentsDisabled] = useState(false);
    const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validation based on selected type
            if (postType === "REEL" && !file.type.startsWith("video/")) {
                alert("Please select a video file for Reels.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClose = () => {
        dispatch(closeCreatePostModal());
        setSelectedFile(null);
        setPreviewUrl(null);
        setCaption("");
        setLocationName("");
        setHashtagsStr("");
        setPostType("POST");
        setIsCloseFriends(false);
        setHideLikeCount(false);
        setCommentsDisabled(false);
        setIsAdvancedSettingsOpen(false);
        setLoading(false);
    };

    const handleShare = async () => {
        if (!selectedFile || loading) return;
        setLoading(true);
        try {
            const uploadRes = await cloudinaryService.upload(
                selectedFile,
                postType.toLowerCase(),
            );

            if (postType === "STORY") {
                const storyData = {
                    mediaUrl: uploadRes.url,
                    mediaType: uploadRes.mediaType,
                    closeFriends: isCloseFriends,
                };
                await storyService.createStory(storyData);
            } else {
                const hashtags = hashtagsStr
                    .split(/[,\s]+/)
                    .filter((tag) => tag.length > 0)
                    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

                // If user selected REEL but uploaded image, we still respect REEL type
                // but normally we should enforce it. Here we trust the state or media type.
                const finalType =
                    postType === "REEL" || uploadRes.mediaType === "VIDEO"
                        ? "REEL"
                        : "POST";

                const postData = {
                    caption,
                    locationName,
                    hashtags,
                    hideLikeCount,
                    commentsDisabled,
                    type: finalType,
                    media: [
                        {
                            url: uploadRes.url,
                            mediaType: uploadRes.mediaType,
                            displayOrder: 0,
                        },
                    ],
                };
                await postService.createPost(postData);
                dispatch(resetPosts());
                dispatch(fetchPosts({ cursor: null, size: 20 }));
            }

            handleClose();
        } catch (error) {
            console.error("Failed to create content", error);
            alert("Error: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.700"
            zIndex={1000}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleClose}
        >
            <Box
                position="fixed"
                top={4}
                right={4}
                cursor="pointer"
                color="white"
                onClick={handleClose}
            >
                <AiOutlineClose size={28} />
            </Box>

            <Box
                bg="white"
                borderRadius="0px"
                overflow="hidden"
                width={previewUrl ? "min(1100px, 90vw)" : "min(600px, 90vw)"}
                height="min(750px, 85vh)"
                onClick={(e) => e.stopPropagation()}
                display="flex"
                flexDirection="column"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    px={4}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                >
                    <Box width="60px">
                        {previewUrl && !loading && (
                            <Box
                                cursor="pointer"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setSelectedFile(null);
                                }}
                            >
                                <AiOutlineArrowLeft size={24} color="black" />
                            </Box>
                        )}
                    </Box>
                    <Text fontWeight="bold" color="black">
                        {previewUrl
                            ? `Create new ${postType.toLowerCase()}`
                            : `Create new ${postType.toLowerCase()}`}
                    </Text>
                    <Box width="60px" textAlign="right">
                        {previewUrl && (
                            <Button
                                variant="ghost"
                                color="#0095f6"
                                fontWeight="bold"
                                fontSize="14px"
                                onClick={handleShare}
                                loading={loading}
                                _hover={{ bg: "transparent" }}
                                p={0}
                                height="auto"
                            >
                                Share
                            </Button>
                        )}
                    </Box>
                </Flex>

                <Flex flex={1} overflow="hidden">
                    {!previewUrl ? (
                        <Center flex={1} flexDirection="column" gap={4}>
                            <BsImages size={80} color="#cbd5e0" />
                            <Text fontSize="xl" color="gray.600">
                                Drag{" "}
                                {postType === "REEL"
                                    ? "video"
                                    : "photos and videos"}{" "}
                                here
                            </Text>
                            <input
                                type="file"
                                accept={
                                    postType === "REEL"
                                        ? "video/*"
                                        : "image/*,video/*"
                                }
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />

                            {/* Type Selection BEFORE file selection */}
                            <VStack gap={4} mt={4}>
                                <HStack gap={4}>
                                    <Button
                                        size="sm"
                                        variant={
                                            postType === "POST"
                                                ? "solid"
                                                : "outline"
                                        }
                                        bg={
                                            postType === "POST"
                                                ? "black"
                                                : "transparent"
                                        }
                                        color={
                                            postType === "POST"
                                                ? "white"
                                                : "black"
                                        }
                                        onClick={() => setPostType("POST")}
                                    >
                                        Post
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            postType === "REEL"
                                                ? "solid"
                                                : "outline"
                                        }
                                        bg={
                                            postType === "REEL"
                                                ? "black"
                                                : "transparent"
                                        }
                                        color={
                                            postType === "REEL"
                                                ? "white"
                                                : "black"
                                        }
                                        onClick={() => setPostType("REEL")}
                                    >
                                        Reel
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={
                                            postType === "STORY"
                                                ? "solid"
                                                : "outline"
                                        }
                                        bg={
                                            postType === "STORY"
                                                ? "black"
                                                : "transparent"
                                        }
                                        color={
                                            postType === "STORY"
                                                ? "white"
                                                : "black"
                                        }
                                        onClick={() => setPostType("STORY")}
                                    >
                                        Story
                                    </Button>
                                </HStack>

                                <Button
                                    bg="#0095f6"
                                    color="white"
                                    px={6}
                                    py={2}
                                    borderRadius="8px"
                                    fontWeight="bold"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Select from computer
                                </Button>
                            </VStack>
                        </Center>
                    ) : (
                        <Flex
                            width="100%"
                            direction={{ base: "column", md: "row" }}
                        >
                            <Box
                                flex={1.5}
                                bg="black"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="relative"
                            >
                                {selectedFile?.type.startsWith("video/") ? (
                                    <video
                                        src={previewUrl}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                        }}
                                        controls
                                    />
                                ) : (
                                    <Image
                                        src={previewUrl}
                                        maxH="100%"
                                        objectFit="contain"
                                    />
                                )}
                                {loading && (
                                    <Center
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        w="100%"
                                        h="100%"
                                        bg="blackAlpha.600"
                                        zIndex={10}
                                    >
                                        <VStack gap={4}>
                                            <Spinner
                                                size="xl"
                                                color="white"
                                                thickness="4px"
                                            />
                                            <Text
                                                color="white"
                                                fontWeight="bold"
                                            >
                                                Uploading...
                                            </Text>
                                        </VStack>
                                    </Center>
                                )}
                            </Box>
                            <Box
                                flex={1}
                                borderLeft="1px solid"
                                borderColor="gray.200"
                                bg="white"
                                display="flex"
                                flexDirection="column"
                                overflowY="auto"
                                p={0}
                            >
                                <Box p={4}>
                                    <HStack mb={4} gap={3}>
                                        <UserAvatar
                                            src={user?.avatarUrl}
                                            size="28px"
                                        />
                                        <Text
                                            fontWeight="bold"
                                            fontSize="sm"
                                            color="black"
                                        >
                                            {user?.username || "user"}
                                        </Text>
                                    </HStack>

                                    <Box mb={6}>
                                        <Text
                                            fontSize="xs"
                                            fontWeight="bold"
                                            color="gray.500"
                                            mb={2}
                                            textTransform="uppercase"
                                        >
                                            Share as:
                                        </Text>
                                        <HStack gap={4}>
                                            <Button
                                                size="sm"
                                                variant={
                                                    postType === "POST"
                                                        ? "solid"
                                                        : "outline"
                                                }
                                                bg={
                                                    postType === "POST"
                                                        ? "black"
                                                        : "transparent"
                                                }
                                                color={
                                                    postType === "POST"
                                                        ? "white"
                                                        : "black"
                                                }
                                                onClick={() =>
                                                    setPostType("POST")
                                                }
                                            >
                                                Post
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={
                                                    postType === "REEL"
                                                        ? "solid"
                                                        : "outline"
                                                }
                                                bg={
                                                    postType === "REEL"
                                                        ? "black"
                                                        : "transparent"
                                                }
                                                color={
                                                    postType === "REEL"
                                                        ? "white"
                                                        : "black"
                                                }
                                                onClick={() =>
                                                    setPostType("REEL")
                                                }
                                            >
                                                Reel
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={
                                                    postType === "STORY"
                                                        ? "solid"
                                                        : "outline"
                                                }
                                                bg={
                                                    postType === "STORY"
                                                        ? "black"
                                                        : "transparent"
                                                }
                                                color={
                                                    postType === "STORY"
                                                        ? "white"
                                                        : "black"
                                                }
                                                onClick={() =>
                                                    setPostType("STORY")
                                                }
                                            >
                                                Story
                                            </Button>
                                        </HStack>
                                    </Box>

                                    <Box
                                        as="textarea"
                                        placeholder={
                                            postType === "POST"
                                                ? "Write a caption..."
                                                : postType === "REEL"
                                                  ? "Write a caption for your reel..."
                                                  : "Add text to story (optional)..."
                                        }
                                        style={{
                                            width: "100%",
                                            height: "120px",
                                            fontSize: "16px",
                                            border: "none",
                                            outline: "none",
                                            resize: "none",
                                            color: "black",
                                            backgroundColor: "transparent",
                                        }}
                                        value={caption}
                                        onChange={(e) =>
                                            setCaption(e.target.value)
                                        }
                                        disabled={loading}
                                    />

                                    <Flex
                                        justify="space-between"
                                        color="gray.400"
                                        mb={4}
                                    >
                                        <FaRegSmile
                                            size={20}
                                            cursor="pointer"
                                        />
                                        <Text fontSize="xs">
                                            {caption.length}/2,200
                                        </Text>
                                    </Flex>

                                    {(postType === "POST" ||
                                        postType === "REEL") && (
                                        <VStack
                                            align="stretch"
                                            gap={0}
                                            borderTop="1px solid"
                                            borderColor="gray.100"
                                        >
                                            <Flex
                                                align="center"
                                                py={3}
                                                borderBottom="1px solid"
                                                borderColor="gray.100"
                                            >
                                                <Box color="black" mr={3}>
                                                    <GrLocation size={20} />
                                                </Box>
                                                <Box
                                                    as="input"
                                                    placeholder="Add location"
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: "14px",
                                                        color: "black",
                                                        width: "100%",
                                                    }}
                                                    value={locationName}
                                                    onChange={(e) =>
                                                        setLocationName(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Flex>

                                            <Flex
                                                align="center"
                                                py={3}
                                                borderBottom="1px solid"
                                                borderColor="gray.100"
                                            >
                                                <Box color="black" mr={3}>
                                                    <AiOutlineTags size={20} />
                                                </Box>
                                                <Box
                                                    as="input"
                                                    placeholder="Add hashtags (comma separated)"
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: "14px",
                                                        color: "black",
                                                        width: "100%",
                                                    }}
                                                    value={hashtagsStr}
                                                    onChange={(e) =>
                                                        setHashtagsStr(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </Flex>

                                            <Box>
                                                <Flex
                                                    py={4}
                                                    justify="space-between"
                                                    align="center"
                                                    cursor="pointer"
                                                    onClick={() =>
                                                        setIsAdvancedSettingsOpen(
                                                            !isAdvancedSettingsOpen,
                                                        )
                                                    }
                                                >
                                                    <HStack
                                                        color="black"
                                                        fontWeight="600"
                                                        fontSize="sm"
                                                    >
                                                        <Box mr={2}>
                                                            <BsGear size={18} />
                                                        </Box>
                                                        <Text>
                                                            Advanced Settings
                                                        </Text>
                                                    </HStack>
                                                    {isAdvancedSettingsOpen ? (
                                                        <BsChevronUp
                                                            size={14}
                                                            color="black"
                                                        />
                                                    ) : (
                                                        <BsChevronDown
                                                            size={14}
                                                            color="black"
                                                        />
                                                    )}
                                                </Flex>

                                                {isAdvancedSettingsOpen && (
                                                    <VStack
                                                        align="stretch"
                                                        gap={4}
                                                        pb={4}
                                                    >
                                                        <Flex
                                                            justify="space-between"
                                                            align="center"
                                                        >
                                                            <Text
                                                                fontSize="sm"
                                                                color="black"
                                                            >
                                                                Hide like and
                                                                view counts
                                                            </Text>
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    hideLikeCount
                                                                }
                                                                onChange={(e) =>
                                                                    setHideLikeCount(
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                style={{
                                                                    width: "20px",
                                                                    height: "20px",
                                                                }}
                                                            />
                                                        </Flex>
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                        >
                                                            Only you will see
                                                            the total number of
                                                            likes and views on
                                                            this post. You can
                                                            change this later.
                                                        </Text>

                                                        <Flex
                                                            justify="space-between"
                                                            align="center"
                                                            mt={2}
                                                        >
                                                            <Text
                                                                fontSize="sm"
                                                                color="black"
                                                            >
                                                                Turn off
                                                                commenting
                                                            </Text>
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    commentsDisabled
                                                                }
                                                                onChange={(e) =>
                                                                    setCommentsDisabled(
                                                                        e.target
                                                                            .checked,
                                                                    )
                                                                }
                                                                style={{
                                                                    width: "20px",
                                                                    height: "20px",
                                                                }}
                                                            />
                                                        </Flex>
                                                        <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                        >
                                                            You can change this
                                                            later from the menu
                                                            at the top of your
                                                            post.
                                                        </Text>
                                                    </VStack>
                                                )}
                                            </Box>
                                        </VStack>
                                    )}

                                    {postType === "STORY" && (
                                        <Box
                                            py={4}
                                            borderTop="1px solid"
                                            borderColor="gray.100"
                                        >
                                            <Flex
                                                justify="space-between"
                                                align="center"
                                            >
                                                <VStack align="start" gap={0}>
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="600"
                                                        color="black"
                                                    >
                                                        Close Friends Only
                                                    </Text>
                                                    <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                    >
                                                        Only people in your
                                                        close friends list can
                                                        see this.
                                                    </Text>
                                                </VStack>
                                                <input
                                                    type="checkbox"
                                                    checked={isCloseFriends}
                                                    onChange={(e) =>
                                                        setIsCloseFriends(
                                                            e.target.checked,
                                                        )
                                                    }
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                    }}
                                                />
                                            </Flex>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

export default CreatePostModal;
