import React from "react";
import {
  DialogRoot,
  DialogBackdrop,
  DialogContent,
  DialogBody,
  DialogPositioner,
  Box,
  Flex,
  Text,
  HStack,
  IconButton
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill, BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import UserAvatar from "../common/UserAvatar";
import CommentCard from "./CommentCard";
import ImageCarousel from "../common/ImageCarousel";
import "./CommentModal.css";
import { useNavigate } from "react-router-dom";

const CommentModal = ({
  onClose,
  isOpen,
  post,
  isLiked,
  handleLike,
  isSaved,
  handleSave,
}) => {
  const navigate = useNavigate();
  if (!post) return null;

  const handleNavigateToAuthor = () => {
    onClose();
    navigate(`/${post.user?.username}`);
  };

  const mockComments = [
    { username: 'messi', content: 'Great post!', time: '1h', avatar: 'https://i.pravatar.cc/150?u=2' },
    { username: 'cristiano', content: 'Siuuuuuuu!', time: '2h', avatar: 'https://i.pravatar.cc/150?u=3' },
    { username: 'nasa', content: 'Explore the stars!', time: '5h', avatar: 'https://i.pravatar.cc/150?u=4' },
    { username: 'coding_vibes', content: 'Love the UI!', time: '1d', avatar: 'https://i.pravatar.cc/150?u=6' },
  ];

  return (
    <DialogRoot
      size={"xl"}
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      placement="center"
    >
      <DialogBackdrop bg="blackAlpha.800" />
      <DialogPositioner>
        <IconButton
          position="fixed" top={4} right={4} variant="ghost" color="white"
          onClick={onClose} aria-label="Close" zIndex={1100}
        >
          <AiOutlineClose size={32} />
        </IconButton>

        <DialogContent maxW="1200px" width="95vw" height="90vh" bg="white" color="black" borderRadius="0" overflow="hidden">
          <DialogBody p={0} height="100%">
            <Flex h="100%" direction={{ base: "column", md: "row" }}>
              {/* Left Column: Carousel with object-fit cover */}
              <Box flex={1.5} bg="black" height="100%">
                <ImageCarousel images={post.images || [post.imageUrl]} height="100%" />
              </Box>

              {/* Right Column */}
              <Box flex={1} display="flex" flexDirection="column" bg="white" height="100%" maxW={{ md: "500px" }}>
                <Flex p={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
                  <HStack gap={3}>
                    <Box cursor="pointer" onClick={handleNavigateToAuthor}>
                      <UserAvatar src={post.user?.avatar} size="32px" />
                    </Box>
                    <Text fontWeight="bold" fontSize="sm" color="black" cursor="pointer" onClick={handleNavigateToAuthor}>
                      {post.user?.username}
                    </Text>
                    <Text fontSize="sm" color="#0095f6" fontWeight="bold" cursor="pointer">Follow</Text>
                  </HStack>
                  <BsThreeDots cursor="pointer" color="black" />
                </Flex>

                <Box flex={1} overflowY="auto" p={4}>
                  <Flex gap={3} mb={6} align="start">
                    <Box cursor="pointer" onClick={handleNavigateToAuthor}>
                      <UserAvatar src={post.user?.avatar} size="32px" />
                    </Box>
                    <Box>
                      <Text fontSize="14px" color="black">
                        <Text as="span" fontWeight="bold" mr={2} cursor="pointer" onClick={handleNavigateToAuthor}>
                          {post.user?.username}
                        </Text>
                        {post.caption}
                      </Text>
                      <Text fontSize="12px" color="gray.500" mt={2}>{post.timeAgo}</Text>
                    </Box>
                  </Flex>

                  <Box display="flex" flexDirection="column" gap={4}>
                    {mockComments.map((c, idx) => (
                      <CommentCard key={idx} comment={c} onClose={onClose} />
                    ))}
                  </Box>
                </Box>

                <Box borderTop="1px solid" borderColor="gray.100" p={4}>
                  <Flex justify="space-between" mb={2}>
                    <HStack gap={4}>
                      <Box onClick={handleLike} cursor="pointer">
                        {isLiked ? <AiFillHeart size={28} color="#ff3040" /> : <AiOutlineHeart size={28} color="black" />}
                      </Box>
                      <FaRegComment size={26} cursor="pointer" color="black" />
                      <RiSendPlaneFill size={26} cursor="pointer" color="black" />
                    </HStack>
                    <Box onClick={handleSave} cursor="pointer">
                      {isSaved ? <BsBookmarkFill size={24} color="black" /> : <BsBookmark size={24} color="black" />}
                    </Box>
                  </Flex>
                  <Text fontWeight="bold" fontSize="sm" color="black">{post.likeCount} likes</Text>
                  <Text fontSize="10px" color="gray.500" uppercase mt={1}>{post.timeAgo}</Text>
                </Box>

                <HStack p={4} gap={3} borderTop="1px solid" borderColor="gray.100">
                  <BsEmojiSmile size={24} cursor="pointer" color="black" />
                  <input style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", backgroundColor: "white", color: "black" }} placeholder="Add a comment..." />
                  <Text color="#0095f6" fontWeight="bold" fontSize="sm" cursor="pointer">Post</Text>
                </HStack>
              </Box>
            </Flex>
          </DialogBody>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CommentModal;
