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
    HStack,
} from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
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
            setArchivedStories(response.content || (Array.isArray(response) ? response : []));
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
            // First selected story as default cover
            const coverUrl = archivedStories.find(s => s.id === selectedStoryIds[0])?.url;
            
            const data = {
                title: title,
                coverUrl: coverUrl,
                storyIds: selectedStoryIds
            };
            
            await profileService.createHighlight(data);
            if (onCreated) onCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create highlight", error);
            alert("Error creating highlight");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Box
            position="fixed"
            top={0}
            left={0}
            w="100vw"
            h="100vh"
            bg="blackAlpha.700"
            zIndex={1500}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={onClose}
        >
            <Box
                bg="white"
                borderRadius="12px"
                width="min(400px, 90vw)"
                height="min(600px, 80vh)"
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
                    py={3}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                >
                    <Box width="60px">
                        <IconButton
                            variant="ghost"
                            onClick={step === 1 ? onClose : () => setStep(1)}
                            icon={<AiOutlineClose size={24} color="black" />}
                            aria-label="Close"
                        />
                    </Box>
                    <Text fontWeight="bold" color="black">
                        {step === 1 ? "Stories" : "New Highlight"}
                    </Text>
                    <Box width="60px" textAlign="right">
                        {step === 1 ? (
                            <Button
                                variant="ghost"
                                color="#0095f6"
                                fontWeight="bold"
                                isDisabled={selectedStoryIds.length === 0}
                                onClick={() => setStep(2)}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                color="#0095f6"
                                fontWeight="bold"
                                isDisabled={!title.trim() || saving}
                                onClick={handleCreate}
                                loading={saving}
                            >
                                Add
                            </Button>
                        )}
                    </Box>
                </Flex>

                {/* Content */}
                <Box flex={1} overflowY="auto" p={1}>
                    {step === 1 ? (
                        loading ? (
                            <Center h="100%">
                                <Spinner color="gray.400" />
                            </Center>
                        ) : archivedStories.length === 0 ? (
                            <Center h="100%" flexDirection="column" gap={2}>
                                <Text color="gray.500">No archived stories found</Text>
                            </Center>
                        ) : (
                            <Grid templateColumns="repeat(3, 1fr)" gap={1}>
                                {archivedStories.map((story) => (
                                    <Box
                                        key={story.id}
                                        position="relative"
                                        paddingBottom="177%" // 9:16 aspect ratio
                                        cursor="pointer"
                                        onClick={() => toggleStorySelection(story.id)}
                                    >
                                        <Image
                                            src={story.url}
                                            position="absolute"
                                            top={0}
                                            left={0}
                                            w="100%"
                                            h="100%"
                                            objectFit="cover"
                                            opacity={selectedStoryIds.includes(story.id) ? 0.6 : 1}
                                        />
                                        <Box position="absolute" top={2} right={2} color="white">
                                            {selectedStoryIds.includes(story.id) ? (
                                                <AiFillCheckCircle size={24} color="#0095f6" />
                                            ) : (
                                                <AiOutlineCheckCircle size={24} />
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Grid>
                        )
                    ) : (
                        <VStack p={6} gap={6}>
                            <Center
                                w="150px"
                                h="150px"
                                borderRadius="full"
                                border="1px solid"
                                borderColor="gray.200"
                                overflow="hidden"
                                bg="gray.50"
                            >
                                <Image 
                                    src={archivedStories.find(s => s.id === selectedStoryIds[0])?.url} 
                                    objectFit="cover"
                                    w="100%"
                                    h="100%"
                                />
                            </Center>
                            <Input
                                placeholder="Highlight Name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                variant="flushed"
                                textAlign="center"
                                fontSize="lg"
                                autoFocus
                            />
                        </VStack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CreateHighlightModal;
