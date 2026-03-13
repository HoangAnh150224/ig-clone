import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Box,
    Flex,
    Text,
    HStack,
    Input,
    VStack,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import UserAvatar from "../common/UserAvatar";
import CommentCard from "../Comment/CommentCard";
import commentService from "../../services/commentService";

const ReelCommentPanel = ({ isOpen, onClose, reel }) => {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);

    const loadMoreRef = useRef(null);
    const inputRef = useRef(null);

    const fetchComments = useCallback(
        async (pageNum = 0) => {
            if (!reel?.id) return;
            if (pageNum > 0) setIsFetchingMore(true);
            else setLoading(true);

            try {
                const response = await commentService.getComments(
                    reel.id,
                    pageNum,
                    20,
                );

                // PaginatedResponse fields: content, last
                const newComments = response.content || [];
                const isLast = response.last === true;

                setComments((prev) =>
                    pageNum > 0 ? [...prev, ...newComments] : newComments,
                );
                setPage(pageNum + 1);
                setHasMore(!isLast && newComments.length > 0);
            } catch (error) {
                console.error("Failed to fetch comments", error);
                setHasMore(false);
            } finally {
                setLoading(false);
                setIsFetchingMore(false);
            }
        },
        [reel?.id],
    );

    useEffect(() => {
        if (isOpen && reel?.id) {
            setPage(0);
            setComments([]);
            fetchComments(0);
        }
    }, [isOpen, reel?.id, fetchComments]);

    useEffect(() => {
        if (!isOpen) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isFetchingMore &&
                    !loading &&
                    comments.length > 0
                ) {
                    fetchComments(page);
                }
            },
            { threshold: 0.1 },
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [
        isOpen,
        hasMore,
        isFetchingMore,
        loading,
        page,
        fetchComments,
        comments.length,
    ]);

    const handlePostComment = async () => {
        if (!commentText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const content = replyingTo
                ? `@${replyingTo.author?.username} ${commentText}`
                : commentText;
            const parentId = replyingTo ? replyingTo.id : null;

            const newComment = await commentService.addComment(
                reel.id,
                content,
                parentId,
            );

            if (replyingTo) {
                // If it's a reply, we might need to refresh the parent's replies or just add to list
                // For simplicity in Reels, we'll just prepend to the main list if needed or refresh
                fetchComments(0);
            } else {
                setComments((prev) => [newComment, ...prev]);
            }

            setCommentText("");
            setReplyingTo(null);
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = (comment) => {
        setReplyingTo(comment);
        setCommentText("");
        if (inputRef.current) inputRef.current.focus();
    };

    if (!isOpen || !reel) return null;

    return (
        <Box
            width="min(400px, 90vw)"
            height="calc(100vh - 40px)"
            bg="white"
            borderRadius="8px"
            display="flex"
            flexDirection="column"
            ml={0}
            boxShadow="0 0 20px rgba(0,0,0,0.1)"
            border="1px solid"
            borderColor="gray.200"
            position="relative"
            zIndex={100}
            transition="all 0.3s ease"
        >
            <Flex
                p={4}
                justify="space-between"
                align="center"
                borderBottom="1px solid"
                borderColor="gray.100"
            >
                <Box onClick={onClose} cursor="pointer" color="black">
                    <AiOutlineClose size={24} />
                </Box>
                <Text fontWeight="bold" color="black">
                    Comments
                </Text>
                <Box width="24px" />
            </Flex>

            <Box
                flex={1}
                overflowY="auto"
                p={4}
                css={{ "&::-webkit-scrollbar": { width: "0px" } }}
            >
                {loading && comments.length === 0 ? (
                    <Center h="100px">
                        <Spinner />
                    </Center>
                ) : (
                    <>
                        {comments.map((c) => (
                            <CommentCard
                                key={c.id}
                                comment={c}
                                postId={reel.id}
                                onClose={onClose}
                                onReply={handleReply}
                                postOwnerId={reel.author?.id}
                            />
                        ))}

                        {hasMore && (
                            <Box
                                ref={loadMoreRef}
                                h="40px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {isFetchingMore && (
                                    <Spinner size="sm" color="gray.400" />
                                )}
                            </Box>
                        )}

                        {comments.length === 0 && !loading && (
                            <Center h="100%" flexDirection="column">
                                <Text color="gray.400">No comments yet.</Text>
                            </Center>
                        )}
                    </>
                )}
            </Box>

            {replyingTo && (
                <Flex
                    bg="gray.50"
                    px={4}
                    py={2}
                    justify="space-between"
                    align="center"
                    borderTop="1px solid"
                    borderColor="gray.100"
                >
                    <Text fontSize="12px" color="gray.500">
                        Replying to {replyingTo.author?.username}
                    </Text>
                    <Box cursor="pointer" onClick={() => setReplyingTo(null)}>
                        <AiOutlineClose size={12} color="gray" />
                    </Box>
                </Flex>
            )}

            <Box p={4} borderTop="1px solid" borderColor="gray.100">
                <Flex
                    align="center"
                    gap={3}
                    bg="gray.50"
                    p={2}
                    px={4}
                    borderRadius="full"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <UserAvatar src={authUser?.avatarUrl} size="28px" />
                    <Input
                        ref={inputRef}
                        variant="unstyled"
                        placeholder={
                            replyingTo
                                ? `Reply to ${replyingTo.author?.username}...`
                                : "Add a comment..."
                        }
                        fontSize="14px"
                        color="black"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && handlePostComment()
                        }
                    />
                    <Text
                        color="#0095f6"
                        fontWeight="bold"
                        fontSize="sm"
                        cursor={
                            commentText.trim() && !isSubmitting
                                ? "pointer"
                                : "default"
                        }
                        opacity={commentText.trim() && !isSubmitting ? 1 : 0.3}
                        onClick={handlePostComment}
                    >
                        Post
                    </Text>
                </Flex>
            </Box>
        </Box>
    );
};

export default ReelCommentPanel;
