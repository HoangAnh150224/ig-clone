import React, { useState } from 'react';
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogPositioner,
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Image,
  Textarea,
  Button,
  IconButton,
  Separator
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import UserAvatar from "../common/UserAvatar";
import postService from "../../services/postService";
import reelService from "../../services/reelService";

const EditPostModal = ({ isOpen, onClose, post }) => {
  const [caption, setCaption] = useState(post?.caption || "");
  const [loading, setLoading] = useState(false);

  if (!post) return null;

  const isReel = post.type === 'reel' || !!post.videoUrl;

  const handleSave = async () => {
    setLoading(true);
    try {
      let response;
      if (isReel) {
        response = await reelService.updateReel(post.id, { caption });
      } else {
        response = await postService.updatePost(post.id, { caption });
      }

      if (response.success) {
        console.log("Updated successfully");
        onClose();
      }
    } catch (error) {
      console.error("Failed to update", error);
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
        <DialogContent borderRadius="12px" overflow="hidden" bg="white" p={0} maxW="800px" width="90vw" height="500px">
          <DialogHeader borderBottom="1px solid" borderColor="gray.100" py={3}>
            <Flex justify="space-between" align="center" width="100%">
              <Text fontWeight="600" fontSize="16px" color="black" flex={1} textAlign="center" ml={8}>
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
                  <Box as="video" src={post.videoUrl} width="100%" height="100%" objectFit="contain" muted />
                ) : (
                  <Image src={post.imageUrl || post.media?.[0]?.url} width="100%" height="100%" objectFit="contain" />
                )}
              </Box>

              {/* Edit Section */}
              <Box flex={1} p={4} display="flex" flexDirection="column">
                <HStack gap={3} mb={4}>
                  <UserAvatar src={post.user?.avatar} size="28px" />
                  <Text fontWeight="bold" fontSize="14px" color="black">{post.user?.username}</Text>
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
                  flex={1}
                  p={0}
                  resize="none"
                />
                
                <Separator my={4} />
                
                <VStack align="stretch" gap={3}>
                  <Flex justify="space-between" align="center" cursor="pointer">
                    <Text fontSize="14px" color="black">Accessibility</Text>
                    <Box as="svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></Box>
                  </Flex>
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
