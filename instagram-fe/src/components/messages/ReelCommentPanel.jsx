import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Flex, Text, HStack, Input, VStack, Spinner, Center, IconButton } from "@chakra-ui/react";
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import UserAvatar from "../common/UserAvatar";
import commentService from "../../services/commentService";
import { updatePostInStore } from "../../store/slices/postSlice";

const ReelCommentCard = ({ comment, postId }) => {
    const [isLiked, setIsLiked] = useState(comment.isLiked || false);
    const [localLikeCount, setLocalLikeCount] = useState(comment.likeCount || 0);

    const handleLike = async () => {
        const previousState = isLiked;
        const previousCount = localLikeCount;
        setIsLiked(!isLiked);
        setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        try {
            const response = await commentService.likeComment(postId, comment.id);
            setIsLiked(response.isLiked);
            setLocalLikeCount(response.likeCount);
        } catch {
            setIsLiked(previousState);
            setLocalLikeCount(previousCount);
        }
    };

    return (
        <Box mb={6} width="100%">
            <Flex gap={3} align="start">
                <UserAvatar src={comment.author?.avatarUrl} size="32px" />
                <Box flex={1}>
                    <Flex align="center" gap={2} mb={1}>
                        <Text fontWeight="bold" fontSize="13px" color="black">
                            {comment.author?.username}
                        </Text>
                        <Text color="gray.500" fontSize="12px">
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'just now'}
                        </Text>
                    </Flex>
                    <Text fontSize="14px" color="black" lineHeight="1.4" mb={2}>
                        {comment.content}
                    </Text>
                    <HStack gap={4} fontSize="12px" color="gray.500" fontWeight="bold">
                        <Text cursor="pointer">{localLikeCount.toLocaleString()} likes</Text>
                        <Text cursor="pointer">Reply</Text>
                    </HStack>
                </Box>
                <Box pt={1} cursor="pointer" color={isLiked ? "#ff3040" : "gray.400"} onClick={handleLike}>
                    {isLiked ? <AiFillHeart size={14} /> : <AiOutlineHeart size={14} />}
                </Box>
            </Flex>
        </Box>
    );
};

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
    
    const loadMoreRef = useRef(null);

    const fetchComments = useCallback(async (pageNum = 0) => {
        if (!reel?.id) return;
        if (pageNum > 0) setIsFetchingMore(true);
        else setLoading(true);

        try {
            const response = await commentService.getComments(reel.id, pageNum, 20);
            
            // PaginatedResponse fields: content, last
            const newComments = response.content || [];
            const isLast = response.last === true;

            setComments(prev => pageNum > 0 ? [...prev, ...newComments] : newComments);
            setPage(pageNum + 1);
            setHasMore(!isLast && newComments.length > 0);
        } catch (error) {
            console.error("Failed to fetch comments", error);
            setHasMore(false);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [reel?.id]);

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
                if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loading && comments.length > 0) {
                    fetchComments(page);
                }
            },
            { threshold: 0.1 }
        );
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [isOpen, hasMore, isFetchingMore, loading, page, fetchComments, comments.length]);

    const handlePostComment = async () => {
        if (!commentText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const newComment = await commentService.addComment(reel.id, commentText);
            setComments(prev => [newComment, ...prev]);
            setCommentText("");
            // Update UI count
            if (dispatch) {
                // Assuming we might have a slice to update this or local state in parent
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !reel) return null;

    return (
        <Box
            width="min(400px, 90vw)"
            height="95vh"
            bg="white"
            borderRadius="0px"
            display="flex"
            flexDirection="column"
            ml={{ base: 0, lg: 4 }}
            boxShadow="0 0 20px rgba(0,0,0,0.1)"
            border="1px solid"
            borderColor="gray.200"
            position={{ base: "absolute", lg: "relative" }}
            right={{ base: 0, lg: "auto" }}
            zIndex={100}
        >
            <Flex p={4} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
                <IconButton 
                    aria-label="Close"
                    icon={<AiOutlineClose size={24} />} 
                    variant="ghost"
                    onClick={onClose} 
                    color="black"
                />
                <Text fontWeight="bold" color="black">Comments</Text>
                <Box width="24px" />
            </Flex>

            <Box flex={1} overflowY="auto" p={4} css={{ "&::-webkit-scrollbar": { width: "0px" } }}>
                {loading && comments.length === 0 ? (
                    <Center h="100px"><Spinner /></Center>
                ) : (
                    <>
                        {comments.map((c) => (
                            <ReelCommentCard key={c.id} comment={c} postId={reel.id} />
                        ))}
                        
                        {hasMore && (
                            <Box ref={loadMoreRef} h="40px" display="flex" alignItems="center" justifyContent="center">
                                {isFetchingMore && <Spinner size="sm" color="gray.400" />}
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

            <Box p={4} borderTop="1px solid" borderColor="gray.100">
                <Flex align="center" gap={3} bg="gray.50" p={2} px={4} borderRadius="full" border="1px solid" borderColor="gray.200">
                    <UserAvatar src={authUser?.avatarUrl} size="28px" />
                    <Input
                        variant="unstyled"
                        placeholder="Add a comment..."
                        fontSize="14px"
                        color="black"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                    />
                    <Text 
                        color="#0095f6" 
                        fontWeight="bold" 
                        fontSize="sm" 
                        cursor={commentText.trim() && !isSubmitting ? "pointer" : "default"}
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
