import React, { useState } from "react";
import { Box, Flex, Text, HStack, VStack, Spinner } from "@chakra-ui/react";
import UserAvatar from "../common/UserAvatar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import UserListModal from "../modals/UserListModal";

import commentService from "../../services/commentService";

const CommentCard = ({ comment, postId, onClose, onReply }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [isLiked, setIsLiked] = useState(comment.isLiked || false);
    const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount || 0);
    const [isLikeListOpen, setIsListOpen] = useState(false);
    const navigate = useNavigate();

    if (!comment) return null;

    const handleNavigate = (username) => {
        if (onClose) onClose();
        navigate(`/${username}`);
    };

    const handleLike = async () => {
        const previousState = isLiked;
        const previousCount = localLikeCount;
        setIsLiked(!isLiked);
        setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        try {
            await commentService.likeComment(postId, comment.id);
        } catch {
            setIsLiked(previousState);
            setLocalLikeCount(previousCount);
        }
    };

    const handleReplyClick = () => {
        if (onReply) onReply(comment);
    };

    const toggleReplies = async () => {
        if (!showReplies && replies.length === 0) {
            setLoadingReplies(true);
            try {
                // Fetch replies from backend - pass 0 for page, 20 for size, and comment.id for parentId
                const response = await commentService.getComments(postId, 0, 20, comment.id);
                const replyList = Array.isArray(response) ? response : (response?.content || []);
                setReplies(replyList);
            } catch (error) {
                console.error("Failed to fetch replies", error);
            } finally {
                setLoadingReplies(false);
            }
        }
        setShowReplies(!showReplies);
    };

    const likedUsers = []; 

    return (
        <Box mb={4} width="100%">
            <Flex gap={3} align="start" width="100%">
                <Box
                    cursor="pointer"
                    onClick={() => handleNavigate(comment.author?.username)}
                >
                    <UserAvatar src={comment.author?.avatarUrl} size="32px" />
                </Box>
                <Box flex={1}>
                    <Text fontSize="14px" lineHeight="1.4" color="black">
                        <Text
                            as="span"
                            fontWeight="bold"
                            mr={2}
                            cursor="pointer"
                            onClick={() =>
                                handleNavigate(comment.author?.username)
                            }
                            _hover={{ opacity: 0.7 }}
                        >
                            {comment.author?.username}
                        </Text>
                        {comment.content}
                    </Text>
                    <HStack gap={4} mt={2}>
                        <Text fontSize="12px" color="gray.500">
                            {comment.timeAgo || 'just now'}
                        </Text>
                        {localLikeCount > 0 && (
                            <Text
                                fontSize="12px"
                                color="gray.500"
                                fontWeight="bold"
                                cursor="pointer"
                                _hover={{ color: "black" }}
                                onClick={() => setIsListOpen(true)}
                            >
                                {localLikeCount.toLocaleString()} likes
                            </Text>
                        )}
                        <Text
                            fontSize="12px"
                            color="gray.500"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={handleReplyClick}
                        >
                            Reply
                        </Text>
                    </HStack>
                </Box>
                <Box
                    pt={1}
                    cursor="pointer"
                    color={isLiked ? "#ff3040" : "gray.400"}
                    onClick={handleLike}
                >
                    {isLiked ? (
                        <AiFillHeart size={12} />
                    ) : (
                        <AiOutlineHeart size={12} />
                    )}
                </Box>
            </Flex>

            {/* REPLIES SECTION */}
            {comment.replyCount > 0 && (
                <Box ml="44px" mt={3}>
                    {!showReplies ? (
                        <HStack 
                            cursor="pointer" 
                            spacing={3} 
                            onClick={toggleReplies}
                            _hover={{ opacity: 0.8 }}
                        >
                            <Box h="1px" w="24px" bg="gray.300" />
                            <Text fontSize="12px" color="gray.500" fontWeight="bold">
                                View all {comment.replyCount} replies
                            </Text>
                        </HStack>
                    ) : (
                        <VStack align="stretch" gap={4} mt={2}>
                            <HStack 
                                cursor="pointer" 
                                spacing={3} 
                                onClick={() => setShowReplies(false)}
                                _hover={{ opacity: 0.8 }}
                            >
                                <Box h="1px" w="24px" bg="gray.300" />
                                <Text fontSize="12px" color="gray.500" fontWeight="bold">
                                    Hide replies
                                </Text>
                            </HStack>
                            
                            {loadingReplies ? (
                                <Flex py={2} justify="start" pl={2}>
                                    <Spinner size="xs" color="gray.400" />
                                </Flex>
                            ) : (
                                replies.map((reply) => (
                                    <ReplyItem
                                        key={reply.id}
                                        reply={reply}
                                        postId={postId}
                                        onNavigate={handleNavigate}
                                        onReply={onReply}
                                        parentComment={comment}
                                    />
                                ))
                            )}
                        </VStack>
                    )}
                </Box>
            )}

            <UserListModal
                isOpen={isLikeListOpen}
                onClose={() => setIsListOpen(false)}
                title="Likes"
                users={likedUsers}
            />
        </Box>
    );
};

const ReplyItem = ({ reply, postId, onNavigate, onReply, parentComment }) => {
    const [isLiked, setIsLiked] = useState(reply.isLiked || false);
    const [localLikeCount, setLocalLikeCount] = useState(reply.likeCount || 0);
    const [isListOpen, setIsListOpen] = useState(false);

    const handleLike = async () => {
        const previousState = isLiked;
        const previousCount = localLikeCount;
        setIsLiked(!isLiked);
        setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        try {
            await commentService.likeComment(postId, reply.id);
        } catch {
            setIsLiked(previousState);
            setLocalLikeCount(previousCount);
        }
    };

    const handleReplyClick = () => {
        if (onReply) onReply(parentComment || reply);
    };

    const likedUsers = [];

    return (
        <Flex gap={3} align="start">
            <Box
                cursor="pointer"
                onClick={() => onNavigate(reply.author?.username)}
            >
                <UserAvatar src={reply.author?.avatarUrl} size="24px" />
            </Box>
            <Box flex={1}>
                <Text fontSize="14px" color="black" lineHeight="1.4">
                    <Text
                        as="span"
                        fontWeight="bold"
                        mr={2}
                        cursor="pointer"
                        onClick={() => onNavigate(reply.author?.username)}
                    >
                        {reply.author?.username}
                    </Text>
                    {reply.content}
                </Text>
                <HStack gap={4} mt={1}>
                    <Text fontSize="12px" color="gray.500">
                        {reply.timeAgo || 'just now'}
                    </Text>
                    {localLikeCount > 0 && (
                        <Text
                            fontSize="12px"
                            color="gray.500"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setIsListOpen(true)}
                        >
                            {localLikeCount.toLocaleString()} likes
                        </Text>
                    )}
                    <Text
                        fontSize="12px"
                        color="gray.500"
                        fontWeight="bold"
                        cursor="pointer"
                        onClick={handleReplyClick}
                    >
                        Reply
                    </Text>
                </HStack>
            </Box>
            <Box
                pt={1}
                cursor="pointer"
                color={isLiked ? "#ff3040" : "gray.400"}
                onClick={handleLike}
            >
                {isLiked ? (
                    <AiFillHeart size={10} />
                ) : (
                    <AiOutlineHeart size={10} />
                )}
            </Box>

            <UserListModal
                isOpen={isListOpen}
                onClose={() => setIsListOpen(false)}
                title="Likes"
                users={likedUsers}
            />
        </Flex>
    );
};

export default CommentCard;
