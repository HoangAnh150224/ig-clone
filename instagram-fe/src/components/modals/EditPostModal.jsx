import React, { useState } from "react";
import {
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogPositioner,
    Box,
    Flex,
    Text,
    HStack,
    VStack,
    Image,
    Textarea,
    Button,
    Separator,
    Input,
    Switch,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import UserAvatar from "../common/UserAvatar";
import postService from "../../services/postService";
import { updatePostInStore } from "../../store/slices/postSlice";

const EditPostModal = ({ isOpen, onClose, post }) => {
    const dispatch = useDispatch();
    const [caption, setCaption] = useState(post?.caption || "");
    const [locationName, setLocationName] = useState(post?.locationName || "");
    const [commentsDisabled, setCommentsDisabled] = useState(post?.commentsDisabled || false);
    const [hideLikeCount, setHideLikeCount] = useState(post?.hideLikeCount || false);
    const [loading, setLoading] = useState(false);

    if (!post) return null;

    const isReel = post.type === "REEL";

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = {
                caption,
                locationName,
                commentsDisabled,
                hideLikeCount
            };
            const updatedPost = await postService.updatePost(post.id, data);
            
            dispatch(updatePostInStore({ 
                id: post.id, 
                changes: { 
                    caption: updatedPost.caption,
                    locationName: updatedPost.locationName,
                    commentsDisabled: updatedPost.commentsDisabled,
                    hideLikeCount: updatedPost.hideLikeCount
                } 
            }));
            
            onClose();
        } catch (error) {
            console.error("Failed to update post", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogRoot
            size="md"
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onClose();
            }}
            placement="center"
        >
            <DialogBackdrop bg="blackAlpha.600" />
            <DialogPositioner>
                <DialogContent
                    borderRadius="0px"
                    overflow="hidden"
                    bg="white"
                    p={0}
                    maxW="800px"
                    width="90vw"
                    height="600px"
                >
                    <DialogHeader borderBottom="1px solid" borderColor="gray.100" py={3}>
                        <Flex justify="space-between" align="center" width="100%">
                            <Button variant="ghost" color="black" fontSize="14px" onClick={onClose}>
                                Cancel
                            </Button>
                            <Text fontWeight="600" fontSize="16px" color="black">
                                Edit info
                            </Text>
                            <Button
                                variant="ghost"
                                color="#0095f6"
                                fontWeight="bold"
                                fontSize="14px"
                                onClick={handleSave}
                                loading={loading}
                            >
                                Done
                            </Button>
                        </Flex>
                    </DialogHeader>
                    <DialogBody p={0}>
                        <Flex height="100%">
                            {/* Media Preview */}
                            <Box flex={1.2} bg="black" display="flex" alignItems="center" justifyContent="center">
                                {isReel ? (
                                    <Box
                                        as="video"
                                        src={post.media?.[0]?.url}
                                        width="100%"
                                        height="100%"
                                        objectFit="contain"
                                        muted
                                    />
                                ) : (
                                    <Image
                                        src={post.media?.[0]?.url}
                                        width="100%"
                                        height="100%"
                                        objectFit="contain"
                                    />
                                )}
                            </Box>

                            {/* Edit Section */}
                            <Box flex={1} p={4} display="flex" flexDirection="column" overflowY="auto">
                                <HStack gap={3} mb={4}>
                                    <UserAvatar src={post.author?.avatarUrl} size="28px" />
                                    <Text fontWeight="bold" fontSize="14px" color="black">
                                        {post.author?.username}
                                    </Text>
                                </HStack>

                                <Textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write a caption..."
                                    variant="plain"
                                    fontSize="14px"
                                    color="black"
                                    border="none"
                                    _focus={{ boxShadow: "none" }}
                                    minH="150px"
                                    p={0}
                                    resize="none"
                                />

                                <Separator my={4} />
                                
                                <VStack align="stretch" gap={4}>
                                    <Input 
                                        placeholder="Add location" 
                                        variant="flushed" 
                                        fontSize="14px" 
                                        color="black"
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                    />
                                    
                                    <Box pt={2}>
                                        <Text fontSize="14px" fontWeight="600" mb={2} color="black">Advanced settings</Text>
                                        <VStack align="stretch" gap={3}>
                                            <Flex justify="space-between" align="center">
                                                <Text fontSize="14px" color="black">Hide like and view counts</Text>
                                                <Switch 
                                                    colorPalette="blue" 
                                                    size="sm" 
                                                    checked={hideLikeCount} 
                                                    onCheckedChange={(e) => setHideLikeCount(e.checked)}
                                                />
                                            </Flex>
                                            <Text fontSize="11px" color="gray.500">Only you will see the total number of likes and views on this post.</Text>
                                            
                                            <Flex justify="space-between" align="center" mt={2}>
                                                <Text fontSize="14px" color="black">Turn off commenting</Text>
                                                <Switch 
                                                    colorPalette="blue" 
                                                    size="sm" 
                                                    checked={commentsDisabled} 
                                                    onCheckedChange={(e) => setCommentsDisabled(e.checked)}
                                                />
                                            </Flex>
                                            <Text fontSize="11px" color="gray.500">You can change this later by going to the menu at the top of your post.</Text>
                                        </VStack>
                                    </Box>
                                </VStack>
                            </Box>
                        </Flex>
                    </DialogBody>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};

export default EditPostModal;
