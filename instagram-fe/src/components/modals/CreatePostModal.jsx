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
} from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineArrowLeft } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { closeCreatePostModal } from "../../store/slices/uiSlice";
import UserAvatar from "../common/UserAvatar";

const CreatePostModal = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.isCreatePostModalOpen);
    const { user } = useSelector((state) => state.auth);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState("");
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
            >
                <AiOutlineClose size={28} />
            </IconButton>

            <Box
                bg="white"
                borderRadius="xl"
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
                    <Box width="40px">
                        {previewUrl && (
                            <IconButton
                                variant="ghost"
                                onClick={() => setPreviewUrl(null)}
                                aria-label="Back"
                            >
                                <AiOutlineArrowLeft size={24} />
                            </IconButton>
                        )}
                    </Box>
                    <Text fontWeight="bold">Create new post</Text>
                    <Box width="40px">
                        {previewUrl && (
                            <Button
                                variant="link"
                                color="brand.blue"
                                fontWeight="bold"
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
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                            <Button
                                bg="#0095f6"
                                color="white"
                                px={4}
                                py={2}
                                borderRadius="md"
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
                            >
                                <Image
                                    src={previewUrl}
                                    maxH="100%"
                                    objectFit="contain"
                                />
                            </Box>
                            <Box
                                flex={1}
                                p={4}
                                borderLeft="1px solid"
                                borderColor="gray.200"
                            >
                                <HStack mb={4} gap={3}>
                                    <UserAvatar
                                        src={user?.avatar}
                                        size="28px"
                                    />
                                    <Text fontWeight="bold" fontSize="sm">
                                        {user?.username || "guest_user"}
                                    </Text>
                                </HStack>
                                <Textarea
                                    placeholder="Write a caption..."
                                    variant="unstyled"
                                    resize="none"
                                    h="200px"
                                    fontSize="md"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                                <Box h="1px" bg="gray.100" my={4} />
                                <Flex justify="space-between" color="gray.400">
                                    <FaRegSmile size={20} cursor="pointer" />
                                    <Text fontSize="xs">
                                        {caption.length}/2,200
                                    </Text>
                                </Flex>
                            </Box>
                        </Flex>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};

const Button = ({ children, ...props }) => (
    <Box as="button" {...props}>
        {children}
    </Box>
);

export default CreatePostModal;
