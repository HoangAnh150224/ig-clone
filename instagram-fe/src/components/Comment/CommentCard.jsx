import React, { useState } from "react";
import { Box, Flex, Text, HStack, VStack } from "@chakra-ui/react";
import UserAvatar from "../common/UserAvatar";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import UserListModal from "../modals/UserListModal";
import { useSelector } from "react-redux";

import commentService from "../../services/commentService";

const CommentCard = ({ comment, onClose, onReply }) => {
    const authUser = useSelector((state) => state.auth.user);
    const [showReplies, setShowReplies] = useState(false);
    const [isLiked, setIsLiked] = useState(
        comment.likedBy?.some((u) => u.id === authUser?.id) || false,
    );
    const [isLikeListOpen, setIsListOpen] = useState(false);
    const navigate = useNavigate();

    if (!comment) return null;

    const handleNavigate = (username) => {
        if (onClose) onClose();
        navigate(`/${username}`);
    };

    const handleLike = async () => {
        const previousState = isLiked;
        setIsLiked(!isLiked);
        try {
            await commentService.toggleLikeComment(comment.id);
        } catch (error) {
            setIsLiked(previousState);
        }
    };

    const handleReplyClick = () => {
        if (onReply) onReply(comment);
    };

    // Calculate the dynamic list of likers based on the like status
    const likedUsers = (() => {
        const baseList = comment.likedBy || [];
        const alreadyLikedInDB = baseList.some((u) => u.id === authUser?.id);

        if (isLiked) {
            if (alreadyLikedInDB) return baseList;
            return [
                ...baseList,
                {
                    id: authUser?.id,
                    username: authUser?.username,
                    avatar: authUser?.avatar,
                    fullName: "You",
                },
            ];
        } else {
            return baseList.filter((u) => u.id !== authUser?.id);
        }
    })();

    const likeCount = likedUsers.length;

    return (
        <Box mb={4} width="100%">
            <Flex gap={3} align="start" width="100%">
                <Box
                    cursor="pointer"
                    onClick={() => handleNavigate(comment.user.username)}
                >
                    <UserAvatar src={comment.user.avatar} size="32px" />
                </Box>
                <Box flex={1}>
                    <Text fontSize="14px" lineHeight="1.4" color="black">
                        <Text
                            as="span"
                            fontWeight="bold"
                            mr={2}
                            cursor="pointer"
                            onClick={() =>
                                handleNavigate(comment.user.username)
                            }
                            _hover={{ opacity: 0.7 }}
                        >
                            {comment.user.username}
                        </Text>
                        {comment.content}
                    </Text>
                    <HStack gap={4} mt={2}>
                        <Text fontSize="12px" color="gray.500">
                            {comment.timeAgo}
                        </Text>
                        {likeCount > 0 && (
                            <Text
                                fontSize="12px"
                                color="gray.500"
                                fontWeight="bold"
                                cursor="pointer"
                                _hover={{ color: "black" }}
                                onClick={() => setIsListOpen(true)}
                            >
                                {likeCount.toLocaleString()} likes
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
            {comment.replies && comment.replies.length > 0 && (
                <Box ml="44px" mt={3}>
                    {!showReplies ? (
                        <Text
                            fontSize="12px"
                            color="gray.500"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setShowReplies(true)}
                        >
                            ——— View all {comment.replies.length} replies
                        </Text>
                    ) : (
                        <VStack align="stretch" gap={4} mt={2}>
                            <Text
                                fontSize="12px"
                                color="gray.500"
                                fontWeight="bold"
                                cursor="pointer"
                                onClick={() => setShowReplies(false)}
                            >
                                ——— Hide replies
                            </Text>
                            {comment.replies.map((reply) => (
                                <ReplyItem
                                    key={reply.id}
                                    reply={reply}
                                    onNavigate={handleNavigate}
                                    onReply={onReply}
                                    parentComment={comment}
                                />
                            ))}
                        </VStack>
                    )}
                </Box>
            )}

            {/* Modal displaying people who liked the comment */}
            <UserListModal
                isOpen={isLikeListOpen}
                onClose={() => setIsListOpen(false)}
                title="Likes"
                users={likedUsers}
            />
        </Box>
    );
};

const ReplyItem = ({ reply, onNavigate, onReply, parentComment }) => {
    const authUser = useSelector((state) => state.auth.user);
    const [isLiked, setIsLiked] = useState(
        reply.likedBy?.some((u) => u.id === authUser?.id) || false,
    );
    const [isListOpen, setIsListOpen] = useState(false);

    const handleLike = async () => {
        const previousState = isLiked;
        setIsLiked(!isLiked);
        try {
            await commentService.toggleLikeComment(reply.id);
        } catch (error) {
            setIsLiked(previousState);
        }
    };

    const handleReplyClick = () => {
        if (onReply) onReply(parentComment || reply);
    };

    const likedUsers = (() => {
        const baseList = reply.likedBy || [];
        const alreadyLikedInDB = baseList.some((u) => u.id === authUser?.id);

        if (isLiked) {
            if (alreadyLikedInDB) return baseList;
            return [
                ...baseList,
                {
                    id: authUser?.id,
                    username: authUser?.username,
                    avatar: authUser?.avatar,
                    fullName: "You",
                },
            ];
        } else {
            return baseList.filter((u) => u.id !== authUser?.id);
        }
    })();

    const likeCount = likedUsers.length;

    return (
        <Flex gap={3} align="start">
            <Box
                cursor="pointer"
                onClick={() => onNavigate(reply.user.username)}
            >
                <UserAvatar src={reply.user.avatar} size="24px" />
            </Box>
            <Box flex={1}>
                <Text fontSize="14px" color="black" lineHeight="1.4">
                    <Text
                        as="span"
                        fontWeight="bold"
                        mr={2}
                        cursor="pointer"
                        onClick={() => onNavigate(reply.user.username)}
                    >
                        {reply.user.username}
                    </Text>
                    {reply.content}
                </Text>
                <HStack gap={4} mt={1}>
                    <Text fontSize="12px" color="gray.500">
                        {reply.timeAgo}
                    </Text>
                    {likeCount > 0 && (
                        <Text
                            fontSize="12px"
                            color="gray.500"
                            fontWeight="bold"
                            cursor="pointer"
                            onClick={() => setIsListOpen(true)}
                        >
                            {likeCount.toLocaleString()} likes
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
