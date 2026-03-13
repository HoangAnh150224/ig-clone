import React, { useState } from "react";
import { Box, Flex, Text, HStack, VStack, Spinner } from "@chakra-ui/react";
import UserAvatar from "../common/UserAvatar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import UserListModal from "../modals/UserListModal";
import { useSelector } from "react-redux";

import commentService from "../../services/commentService";
import { formatRelativeTime } from "../../utils/dateUtils";

const CommentCard = ({ comment, postId, onClose, onReply, postOwnerId }) => {
    const authUser = useSelector((state) => state.auth.user);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [isLiked, setIsLiked] = useState(comment.isLiked || false);
    const [isPinned, setIsPinned] = useState(comment.isPinned || false);
    const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount || 0);
    const [isLikeListOpen, setIsListOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    if (!comment) return null;

    const isOwner = authUser?.id === comment.author?.id;
    const isPostOwner = authUser?.id === postOwnerId;

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

    const handlePin = async () => {
        const previousState = isPinned;
        setIsPinned(!isPinned);
        try {
            await commentService.pinComment(postId, comment.id);
        } catch (error) {
            console.error("Failed to pin/unpin comment", error);
            setIsPinned(previousState);
        }
    };

    const handleUpdateComment = async () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            return;
        }
        setIsUpdating(true);
        try {
            await commentService.updateComment(postId, comment.id, editContent);
            comment.content = editContent; // Update local object
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update comment", error);
        } finally {
            setIsUpdating(false);
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
                    {isEditing ? (
                        <VStack align="stretch" gap={2}>
                            <Box 
                                as="textarea"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                style={{
                                    width: "100%",
                                    fontSize: "14px",
                                    border: "1px solid #dbdbdb",
                                    borderRadius: "4px",
                                    padding: "8px",
                                    backgroundColor: "white",
                                    color: "black",
                                    minHeight: "60px"
                                }}
                            />
                            <HStack gap={3}>
                                <Text 
                                    fontSize="12px" 
                                    color="#0095f6" 
                                    fontWeight="bold" 
                                    cursor="pointer"
                                    onClick={handleUpdateComment}
                                >
                                    {isUpdating ? "Saving..." : "Save"}
                                </Text>
                                <Text 
                                    fontSize="12px" 
                                    color="gray.500" 
                                    fontWeight="bold" 
                                    cursor="pointer"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Text>
                            </HStack>
                        </VStack>
                    ) : (
                        <>
                            <Box>
                                {isPinned && (
                                    <HStack spacing={1} mb={1}>
                                        <svg aria-label="Pinned" color="#8e8e8e" fill="#8e8e8e" height="12" role="img" viewBox="0 0 24 24" width="12">
                                            <title>Pinned</title>
                                            <path d="M12 2a.75.75 0 0 1 .75.75V8.5h4.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-1.5v6.5a.75.75 0 0 1-1.5 0V13h-4.5a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5V2.75A.75.75 0 0 1 12 2Z"></path>
                                        </svg>
                                        <Text fontSize="12px" color="gray.500" fontWeight="bold">Pinned</Text>
                                    </HStack>
                                )}
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
                            </Box>
                            <HStack gap={4} mt={2}>
                                <Text fontSize="12px" color="gray.500">
                                    {comment.createdAt ? formatRelativeTime(comment.createdAt) : (comment.timeAgo || 'just now')}
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
                                {isOwner && (
                                    <Text
                                        fontSize="12px"
                                        color="gray.500"
                                        fontWeight="bold"
                                        cursor="pointer"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </Text>
                                )}
                                {isPostOwner && (
                                    <Text
                                        fontSize="12px"
                                        color="gray.500"
                                        fontWeight="bold"
                                        cursor="pointer"
                                        onClick={handlePin}
                                    >
                                        {isPinned ? "Unpin" : "Pin"}
                                    </Text>
                                )}
                            </HStack>
                        </>
                    )}
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
                                        postOwnerId={postOwnerId}
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

const ReplyItem = ({ reply, postId, onNavigate, onReply, parentComment, postOwnerId }) => {
    const authUser = useSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(reply.isLiked || false);
    const [isPinned, setIsPinned] = useState(reply.isPinned || false);
    const [localLikeCount, setLocalLikeCount] = useState(reply.likeCount || 0);
    const [isListOpen, setIsListOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(reply.content || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const isOwner = authUser?.id === reply.author?.id;
    const isPostOwner = authUser?.id === postOwnerId;

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

    const handlePin = async () => {
        const previousState = isPinned;
        setIsPinned(!isPinned);
        try {
            await commentService.pinComment(postId, reply.id);
        } catch (error) {
            console.error("Failed to pin/unpin reply", error);
            setIsPinned(previousState);
        }
    };

    const handleUpdateReply = async () => {
        if (!editContent.trim() || editContent === reply.content) {
            setIsEditing(false);
            return;
        }
        setIsUpdating(true);
        try {
            await commentService.updateComment(postId, reply.id, editContent);
            reply.content = editContent; // Update local object
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update reply", error);
        } finally {
            setIsUpdating(false);
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
                {isEditing ? (
                    <VStack align="stretch" gap={2}>
                        <Box 
                            as="textarea"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{
                                width: "100%",
                                fontSize: "14px",
                                border: "1px solid #dbdbdb",
                                borderRadius: "4px",
                                padding: "8px",
                                backgroundColor: "white",
                                color: "black",
                                minHeight: "40px"
                            }}
                        />
                        <HStack gap={3}>
                            <Text 
                                fontSize="12px" 
                                color="#0095f6" 
                                fontWeight="bold" 
                                cursor="pointer"
                                onClick={handleUpdateReply}
                            >
                                {isUpdating ? "Saving..." : "Save"}
                            </Text>
                            <Text 
                                fontSize="12px" 
                                color="gray.500" 
                                fontWeight="bold" 
                                cursor="pointer"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Text>
                        </HStack>
                    </VStack>
                ) : (
                    <>
                        <Box>
                            {isPinned && (
                                <HStack spacing={1} mb={1}>
                                    <svg aria-label="Pinned" color="#8e8e8e" fill="#8e8e8e" height="10" role="img" viewBox="0 0 24 24" width="10">
                                        <title>Pinned</title>
                                        <path d="M12 2a.75.75 0 0 1 .75.75V8.5h4.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-1.5v6.5a.75.75 0 0 1-1.5 0V13h-4.5a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75h1.5V2.75A.75.75 0 0 1 12 2Z"></path>
                                    </svg>
                                    <Text fontSize="10px" color="gray.500" fontWeight="bold">Pinned</Text>
                                </HStack>
                            )}
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
                        </Box>
                        <HStack gap={4} mt={1}>
                            <Text fontSize="12px" color="gray.500">
                                {reply.createdAt ? formatRelativeTime(reply.createdAt) : (reply.timeAgo || 'just now')}
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
                            {isOwner && (
                                <Text
                                    fontSize="12px"
                                    color="gray.500"
                                    fontWeight="bold"
                                    cursor="pointer"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Text>
                            )}
                            {isPostOwner && (
                                <Text
                                    fontSize="12px"
                                    color="gray.500"
                                    fontWeight="bold"
                                    cursor="pointer"
                                    onClick={handlePin}
                                >
                                    {isPinned ? "Unpin" : "Pin"}
                                </Text>
                            )}
                        </HStack>
                    </>
                )}
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
