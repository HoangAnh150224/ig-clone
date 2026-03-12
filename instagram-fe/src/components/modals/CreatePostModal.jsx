import React, { useState, useRef } from "react";
import {
    Box,
    Flex,
    Text,
    Image,
    Textarea,
    VStack,
    HStack,
    IconButton,
    Center,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { closeCreatePostModal } from "../../store/slices/uiSlice";
import { fetchPosts, resetPosts } from "../../store/slices/postSlice";
import UserAvatar from "../common/UserAvatar";
import cloudinaryService from "../../services/cloudinaryService";
import postService from "../../services/postService";
import storyService from "../../services/storyService";

const CreatePostModal = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isCreatePostModalOpen);
    const { user } = useSelector((state) => state.auth);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState("");
    const [postType, setPostType] = useState("POST"); // 'POST' or 'STORY'
    const [isCloseFriends, setIsCloseFriends] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleClose = () => {
        dispatch(closeCreatePostModal());
        setSelectedFile(null);
        setPreviewUrl(null);
        setCaption("");
        setPostType("POST");
        setIsCloseFriends(false);
        setLoading(false);
    };

    const handleShare = async () => {
        if (!selectedFile || loading) return;
        setLoading(true);
        try {
            // 1. Upload to Cloudinary
            const uploadResult = await cloudinaryService.upload(selectedFile);
            
            if (postType === "STORY") {
                // 2a. Create Story
                const storyData = {
                    mediaUrl: uploadResult.url,
                    mediaType: uploadResult.mediaType,
                    isCloseFriends: isCloseFriends,
                    caption: caption
                };
                await storyService.createStory(storyData);
                // Refresh stories in Home (if applicable)
                // window.location.reload(); // Simple refresh for now or dispatch an action
            } else {
                // 2b. Create Post/Reel
                const postData = {
                    caption,
                    type: uploadResult.mediaType === "VIDEO" ? "REEL" : "POST",
                    media: [
                        {
                            url: uploadResult.url,
                            mediaType: uploadResult.mediaType,
                            displayOrder: 0
                        }
                    ]
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
            <IconButton
                position="fixed"
                top={4}
                right={4}
                variant="ghost"
                color="white"
                onClick={handleClose}
                aria-label="Close"
                _hover={{ bg: "transparent" }}
            >
                <AiOutlineClose size={28} />
            </IconButton>

            <Box
                bg="white"
                borderRadius="0px"
                overflow="hidden"
                width={previewUrl ? "min(1100px, 90vw)" : "min(600px, 90vw)"}
                height="min(700px, 80vh)"
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
                            <IconButton
                                variant="ghost"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setSelectedFile(null);
                                }}
                                aria-label="Back"
                            >
                                <AiOutlineArrowLeft size={24} color="black" />
                            </IconButton>
                        )}
                    </Box>
                    <Text fontWeight="bold" color="black">
                        {previewUrl ? `Create new ${postType.toLowerCase()}` : "Create new post"}
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
                                Drag photos and videos here
                            </Text>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                            <Button
                                bg="#0095f6"
                                color="white"
                                px={4}
                                py={2}
                                borderRadius="8px"
                                fontWeight="bold"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Select from computer
                            </Button>
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
                                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} 
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
                                    <Center position="absolute" top={0} left={0} w="100%" h="100%" bg="blackAlpha.600" zIndex={10}>
                                        <VStack gap={4}>
                                            <Spinner size="xl" color="white" thickness="4px" />
                                            <Text color="white" fontWeight="bold">Uploading...</Text>
                                        </VStack>
                                    </Center>
                                )}
                            </Box>
                            <Box
                                flex={1}
                                p={4}
                                borderLeft="1px solid"
                                borderColor="gray.200"
                                bg="white"
                                display="flex"
                                flexDirection="column"
                            >
                                <HStack mb={4} gap={3}>
                                    <UserAvatar
                                        src={user?.avatarUrl}
                                        size="28px"
                                    />
                                    <Text fontWeight="bold" fontSize="sm" color="black">
                                        {user?.username || "user"}
                                    </Text>
                                </HStack>

                                <Box mb={6}>
                                    <Text fontSize="sm" fontWeight="600" color="black" mb={2}>Select type:</Text>
                                    <HStack gap={4}>
                                        <Button 
                                            size="sm" 
                                            variant={postType === "POST" ? "solid" : "outline"}
                                            bg={postType === "POST" ? "black" : "transparent"}
                                            color={postType === "POST" ? "white" : "black"}
                                            onClick={() => setPostType("POST")}
                                        >
                                            Post
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant={postType === "STORY" ? "solid" : "outline"}
                                            bg={postType === "STORY" ? "black" : "transparent"}
                                            color={postType === "STORY" ? "white" : "black"}
                                            onClick={() => setPostType("STORY")}
                                        >
                                            Story
                                        </Button>
                                    </HStack>
                                </Box>

                                {postType === "STORY" && (
                                    <Box mb={6}>
                                        <Flex justify="space-between" align="center">
                                            <Text fontSize="sm" fontWeight="600" color="black">Close Friends Only:</Text>
                                            <Button 
                                                size="xs" 
                                                variant={isCloseFriends ? "solid" : "outline"}
                                                bg={isCloseFriends ? "#1ed760" : "transparent"}
                                                color={isCloseFriends ? "white" : "#1ed760"}
                                                borderColor="#1ed760"
                                                onClick={() => setIsCloseFriends(!isCloseFriends)}
                                            >
                                                {isCloseFriends ? "Enabled" : "Disabled"}
                                            </Button>
                                        </Flex>
                                    </Box>
                                )}

                                <Textarea
                                    placeholder={postType === "POST" ? "Write a caption..." : "Add text to story (optional)..."}
                                    variant="unstyled"
                                    resize="none"
                                    h="150px"
                                    fontSize="md"
                                    color="black"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    isDisabled={loading}
                                />
                                
                                <Box mt="auto">
                                    <Box h="1px" bg="gray.100" my={4} />
                                    <Flex justify="space-between" color="gray.400">
                                        <FaRegSmile size={20} cursor="pointer" />
                                        <Text fontSize="xs">
                                            {caption.length}/2,200
                                        </Text>
                                    </Flex>
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
