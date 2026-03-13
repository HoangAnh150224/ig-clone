import React, { useState, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Grid,
    Image,
    Input,
    VStack,
    Center,
    Spinner,
    Portal,
} from "@chakra-ui/react";
import { IoClose, IoChevronBack, IoCheckmarkCircle, IoCheckmarkCircleOutline } from "react-icons/io5";
import storyService from "../../services/storyService";
import profileService from "../../services/profileService";

const CreateHighlightModal = ({ isOpen, onClose, onCreated }) => {
    const [step, setStep] = useState(1); // 1: Select Stories, 2: Set Title/Cover
    const [archivedStories, setArchivedStories] = useState([]);
    const [selectedStoryIds, setSelectedStoryIds] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchArchivedStories();
            setStep(1);
            setSelectedStoryIds([]);
            setTitle("");
        }
    }, [isOpen]);

    const fetchArchivedStories = async () => {
        setLoading(true);
        try {
            const response = await storyService.getArchivedStories();
            // Handle different API response structures
            const stories = response?.content || (Array.isArray(response) ? response : []);
            setArchivedStories(stories);
        } catch (error) {
            console.error("Failed to fetch archived stories", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStorySelection = (id) => {
        setSelectedStoryIds(prev => 
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!title.trim() || selectedStoryIds.length === 0) return;
        setSaving(true);
        try {
            const firstSelectedStory = archivedStories.find(s => s.id === selectedStoryIds[0]);
            const coverUrl = firstSelectedStory?.mediaUrl || firstSelectedStory?.url;
            
            const data = {
                title: title,
                coverUrl: coverUrl,
                storyIds: selectedStoryIds
            };
            
            // First argument is null because we are using an existing story URL as cover, not a new file
            await profileService.createHighlight(null, data);
            if (onCreated) onCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create highlight", error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Portal>
            <Box
                position="fixed"
                top={0}
                left={0}
                w="100vw"
                h="100vh"
                bg="rgba(0,0,0,0.65)"
                zIndex={2000}
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={onClose}
            >
                <Box
                    bg="white"
                    borderRadius="12px"
                    width="400px"
                    maxW="90vw"
                    height="600px"
                    maxH="80vh"
                    onClick={(e) => e.stopPropagation()}
                    display="flex"
                    flexDirection="column"
                    overflow="hidden"
                >
                    {/* Header */}
                    <Flex
                        justify="space-between"
                        align="center"
                        px={4}
                        py={2}
                        borderBottom="1px solid"
                        borderColor="gray.100"
                        minH="50px"
                    >
                        <Box flex={1}>
                            {step === 1 ? (
                                <IconButton
                                    variant="ghost"
                                    onClick={onClose}
                                    icon={<IoClose size={28} color="black" />}
                                    aria-label="Close"
                                    _hover={{ bg: "transparent" }}
                                    p={0}
                                    minW="auto"
                                />
                            ) : (
                                <IconButton
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    icon={<IoChevronBack size={28} color="black" />}
                                    aria-label="Back"
                                    _hover={{ bg: "transparent" }}
                                    p={0}
                                    minW="auto"
                                />
                            )}
                        </Box>
                        
                        <Text fontWeight="700" color="black" fontSize="16px" flex={2} textAlign="center">
                            {step === 1 ? "Stories" : "New Highlight"}
                        </Text>

                        <Box flex={1} textAlign="right">
                            {step === 1 ? (
                                <Button
                                    variant="ghost"
                                    color={selectedStoryIds.length > 0 ? "#0095f6" : "gray.300"}
                                    fontWeight="700"
                                    isDisabled={selectedStoryIds.length === 0}
                                    onClick={() => setStep(2)}
                                    _hover={{ bg: "transparent" }}
                                    fontSize="14px"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="ghost"
                                    color={title.trim() && !saving ? "#0095f6" : "gray.300"}
                                    fontWeight="700"
                                    isDisabled={!title.trim() || saving}
                                    onClick={handleCreate}
                                    isLoading={saving}
                                    _hover={{ bg: "transparent" }}
                                    fontSize="14px"
                                >
                                    Add
                                </Button>
                            )}
                        </Box>
                    </Flex>

                    {/* Content */}
                    <Box flex={1} overflowY="auto">
                        {step === 1 ? (
                            loading ? (
                                <Center h="100%">
                                    <Spinner color="gray.300" size="lg" thickness="2px" />
                                </Center>
                            ) : archivedStories.length === 0 ? (
                                <Center h="100%" flexDirection="column" gap={4} px={8} textAlign="center">
                                    <Text fontWeight="700" fontSize="18px">No stories found</Text>
                                    <Text color="gray.500" fontSize="14px">
                                        You need to have archived stories to create a highlight.
                                    </Text>
                                </Center>
                            ) : (
                                <Grid templateColumns="repeat(3, 1fr)" gap="1px">
                                    {archivedStories.map((story) => {
                                        const isSelected = selectedStoryIds.includes(story.id);
                                        const mediaUrl = story.mediaUrl || story.url;
                                        return (
                                            <Box
                                                key={story.id}
                                                position="relative"
                                                paddingBottom="177%"
                                                cursor="pointer"
                                                onClick={() => toggleStorySelection(story.id)}
                                            >
                                                <Image
                                                    src={mediaUrl}
                                                    position="absolute"
                                                    top={0}
                                                    left={0}
                                                    w="100%"
                                                    h="100%"
                                                    objectFit="cover"
                                                    opacity={isSelected ? 0.7 : 1}
                                                    transition="opacity 0.2s"
                                                />
                                                <Box position="absolute" bottom={2} right={2}>
                                                    {isSelected ? (
                                                        <IoCheckmarkCircle size={24} color="#0095f6" />
                                                    ) : (
                                                        <IoCheckmarkCircleOutline size={24} color="white" />
                                                    )}
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Grid>
                            )
                        ) : (
                            <VStack p={10} gap={8} align="stretch">
                                <Center>
                                    <Box
                                        w="150px"
                                        h="150px"
                                        borderRadius="full"
                                        border="1px solid"
                                        borderColor="gray.100"
                                        overflow="hidden"
                                        bg="gray.50"
                                        position="relative"
                                    >
                                        <Image 
                                            src={
                                                archivedStories.find(s => s.id === selectedStoryIds[0])?.mediaUrl ||
                                                archivedStories.find(s => s.id === selectedStoryIds[0])?.url
                                            } 
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                    </Box>
                                </Center>
                                <Input
                                    placeholder="Highlight Name"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    variant="flushed"
                                    textAlign="center"
                                    fontSize="16px"
                                    autoFocus
                                    borderColor="gray.200"
                                    _focus={{ borderColor: "gray.400" }}
                                />
                            </VStack>
                        )}
                    </Box>
                </Box>
            </Box>
        </Portal>
    );
};

export default CreateHighlightModal;
