import React, { useState, useEffect, useRef } from "react";
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
    VStack,
    IconButton,
} from "@chakra-ui/react";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineClose,
    AiFillPlayCircle,
} from "react-icons/ai";
import {
    BsBookmark,
    BsBookmarkFill,
    BsEmojiSmile,
    BsThreeDots,
    BsFillVolumeMuteFill,
    BsFillVolumeUpFill,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import UserAvatar from "../common/UserAvatar";
import CommentCard from "../Comment/CommentCard";
import ImageCarousel from "../common/ImageCarousel";
import UserListModal from "./UserListModal";
import MoreOptionsModal from "./MoreOptionsModal";
import ShareModal from "../modals/ShareModal";
import "../Comment/CommentModal.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMute } from "../../store/slices/uiSlice";
import { updatePostInStore } from "../../store/slices/postSlice";
import { updatePostInProfile } from "../../store/slices/userSlice";
import { updatePostInExplore } from "../../store/slices/exploreSlice";
import commentService from "../../services/commentService";
import postService from "../../services/postService";
import profileService from "../../services/profileService";
import { formatPostDate } from "../../utils/dateUtils";

const PostDetailModal = ({ onClose, isOpen, post, onPostAction }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const isMuted = useSelector((state) => state.ui.isMuted);
    const authUser = useSelector((state) => state.auth.user);
    const [isLikeListOpen, setIsLikeListOpen] = useState(false);
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showHeartAnim, setShowHeartAnim] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [likedUsers, setLikedUsers] = useState([]);
    const [localIsFollowing, setLocalIsFollowing] = useState(
        post?.author?.isFollowing || false,
    );

    // Local state for immediate UI feedback
    const [localIsLiked, setLocalIsLiked] = useState(post?.isLiked || false);
    const [localLikeCount, setLocalLikeCount] = useState(post?.likeCount || 0);
    const [localIsSaved, setLocalIsSaved] = useState(post?.isSaved || false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (post) {
            setLocalIsLiked(post.isLiked || false);
            setLocalLikeCount(post.likeCount || 0);
            setLocalIsSaved(post.isSaved || false);
            if (post.author) {
                setLocalIsFollowing(post.author.isFollowing);
            }
        }
    }, [post]);

    const isOwnPost = authUser?.id === post?.author?.id;
    const isReel = post?.type === "REEL";
    const isFavoriteUser = authUser?.favoriteUserIds?.includes(
        post?.author?.id,
    );

    useEffect(() => {
        if (isOpen && post?.id) {
            const fetchComments = async () => {
                try {
                    const response = await commentService.getComments(post.id);
                    const commentList = Array.isArray(response)
                        ? response
                        : response?.content || [];
                    setComments(commentList);
                } catch (error) {
                    console.error("Failed to fetch comments", error);
                }
            };
            fetchComments();
        } else {
            setComments([]);
            setReplyingTo(null);
            setCommentText("");
        }
    }, [isOpen, post?.id]);

    if (!post) return null;

    const handleLike = async () => {
        const newState = !localIsLiked;
        setLocalIsLiked(newState);
        setLocalLikeCount((prev) => (newState ? prev + 1 : prev - 1));
        try {
            const response = await postService.likePost(post.id);
            const changes = {
                isLiked: response.liked,
                likeCount: response.likeCount,
            };

            // Sync with backend response
            setLocalIsLiked(response.liked);
            setLocalLikeCount(response.likeCount);

            // PROPAGATE TO ALL SLICES
            dispatch(updatePostInStore({ id: post.id, changes }));
            dispatch(updatePostInProfile({ id: post.id, changes }));
            dispatch(updatePostInExplore({ id: post.id, changes }));
        } catch (error) {
            console.error("Failed to like post", error);
            setLocalIsLiked(!newState);
            setLocalLikeCount((prev) => (!newState ? prev + 1 : prev - 1));
        }
    };

    const handleSave = async () => {
        const newState = !localIsSaved;
        setLocalIsSaved(newState);
        try {
            const response = await postService.savePost(post.id);
            const changes = { isSaved: response.saved };

            setLocalIsSaved(response.saved);

            // PROPAGATE TO ALL SLICES
            dispatch(updatePostInStore({ id: post.id, changes }));
            dispatch(updatePostInProfile({ id: post.id, changes }));
            dispatch(updatePostInExplore({ id: post.id, changes }));
        } catch (error) {
            console.error("Failed to save post", error);
            setLocalIsSaved(!newState);
        }
    };

    const handleDoubleLike = (e) => {
        e.stopPropagation();
        if (!localIsLiked) handleLike();
        setShowHeartAnim(true);
        setTimeout(() => setShowHeartAnim(false), 800);
    };

    const handleReply = (parentComment) => {
        setReplyingTo({
            id: parentComment.id,
            username: parentComment.author.username,
        });
        setCommentText(`@${parentComment.author.username} `);
        inputRef.current?.focus();
    };

    const handlePostComment = async () => {
        if (!commentText.trim() || isSubmittingComment) return;
        setIsSubmittingComment(true);
        try {
            let response;
            if (
                replyingTo &&
                commentText.startsWith(`@${replyingTo.username}`)
            ) {
                const content = commentText
                    .replace(`@${replyingTo.username}`, "")
                    .trim();
                response = await commentService.addComment(
                    post.id,
                    content,
                    replyingTo.id,
                );
            } else {
                response = await commentService.addComment(
                    post.id,
                    commentText,
                );
            }

            if (response) {
                setCommentText("");
                setReplyingTo(null);
                // Refresh comments
                const updated = await commentService.getComments(post.id);
                setComments(
                    Array.isArray(updated) ? updated : updated?.content || [],
                );
                dispatch(
                    updatePostInStore({
                        id: post.id,
                        changes: { commentCount: (post.commentCount || 0) + 1 },
                    }),
                );
            }
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const fetchLikers = async () => {
        try {
            const response = await postService.getPostLikers(post.id);
            setLikedUsers(response.content || []);
            setIsLikeListOpen(true);
        } catch (error) {
            console.error("Failed to fetch likers", error);
        }
    };

    const handleFollow = async () => {
        try {
            const newState = !localIsFollowing;
            setLocalIsFollowing(newState);
            await profileService.toggleFollow(post.author.id);
        } catch (error) {
            console.error("Failed to follow user", error);
            setLocalIsFollowing(!localIsFollowing); // Rollback
        }
    };

    const renderCaptionWithHashtags = (caption) => {
        if (!caption) return null;
        return caption.split(/(\s+)/).map((part, index) => {
            if (part.startsWith("#")) {
                return (
                    <Text
                        key={index}
                        as="span"
                        color="#00376b"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/explore?q=${part.substring(1)}`);
                        }}
                    >
                        {part}
                    </Text>
                );
            }
            return part;
        });
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
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
                        position="fixed"
                        top={4}
                        right={4}
                        variant="ghost"
                        color="white"
                        onClick={onClose}
                        aria-label="Close"
                        zIndex={1100}
                    >
                        <AiOutlineClose size={32} />
                    </IconButton>

                    <DialogContent
                        maxW="1200px"
                        width="95vw"
                        height="90vh"
                        bg="white"
                        color="black"
                        borderRadius="0"
                        overflow="hidden"
                    >
                        <DialogBody p={0} height="100%">
                            <Flex h="100%" direction="row">
                                {/* Media Section */}
                                <Box
                                    flex={1.5}
                                    bg="black"
                                    height="100%"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    position="relative"
                                    cursor="pointer"
                                    onClick={isReel ? togglePlay : undefined}
                                >
                                    {isReel ? (
                                        <>
                                            <Box
                                                as="video"
                                                ref={videoRef}
                                                src={post.media?.[0]?.url}
                                                autoPlay
                                                loop
                                                muted={isMuted}
                                                playsInline
                                                width="100%"
                                                height="100%"
                                                objectFit="cover"
                                                onDoubleClick={handleDoubleLike}
                                            />
                                            <Box
                                                position="absolute"
                                                bottom={4}
                                                right={4}
                                                bg="blackAlpha.700"
                                                p={2}
                                                borderRadius="full"
                                                color="white"
                                                zIndex={25}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(toggleMute());
                                                }}
                                            >
                                                {isMuted ? (
                                                    <BsFillVolumeMuteFill
                                                        size={18}
                                                    />
                                                ) : (
                                                    <BsFillVolumeUpFill
                                                        size={18}
                                                    />
                                                )}
                                            </Box>
                                            {!isPlaying && (
                                                <Box
                                                    position="absolute"
                                                    color="whiteAlpha.800"
                                                    pointerEvents="none"
                                                    zIndex={15}
                                                >
                                                    <AiFillPlayCircle
                                                        size={80}
                                                    />
                                                </Box>
                                            )}
                                        </>
                                    ) : (
                                        <Box
                                            width="100%"
                                            height="100%"
                                            onDoubleClick={handleDoubleLike}
                                            position="relative"
                                        >
                                            <ImageCarousel
                                                images={
                                                    post.media?.map(
                                                        (m) => m.url,
                                                    ) || []
                                                }
                                                height="100%"
                                            />
                                        </Box>
                                    )}
                                    {showHeartAnim && (
                                        <Box
                                            position="absolute"
                                            zIndex={20}
                                            pointerEvents="none"
                                        >
                                            <AiFillHeart
                                                size={100}
                                                className="heart-animation"
                                                color="white"
                                            />
                                        </Box>
                                    )}
                                </Box>

                                {/* Info & Comments */}
                                <Box
                                    flex={1}
                                    display="flex"
                                    flexDirection="column"
                                    bg="white"
                                    height="100%"
                                    maxW={{ md: "500px" }}
                                >
                                    {/* Header */}
                                    <Flex
                                        p={4}
                                        justify="space-between"
                                        align="center"
                                        borderBottom="1px solid"
                                        borderColor="gray.100"
                                    >
                                        <HStack gap={3}>
                                            <Box
                                                cursor="pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/${post.author?.username}`,
                                                    )
                                                }
                                            >
                                                <UserAvatar
                                                    src={post.author?.avatarUrl}
                                                    size="32px"
                                                />
                                            </Box>
                                            <VStack align="start" gap={0}>
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="sm"
                                                    color="black"
                                                    cursor="pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/${post.author?.username}`,
                                                        )
                                                    }
                                                >
                                                    {post.author?.username}
                                                </Text>
                                                {post.locationName && (
                                                    <Text
                                                        fontSize="12px"
                                                        color="gray.600"
                                                        mt="-2px"
                                                    >
                                                        {post.locationName}
                                                    </Text>
                                                )}
                                            </VStack>
                                            {isFavoriteUser && (
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <defs>
                                                            <linearGradient
                                                                id={`detail-star-gradient-${post.id}`}
                                                                x1="0%"
                                                                y1="0%"
                                                                x2="100%"
                                                                y2="100%"
                                                            >
                                                                <stop
                                                                    offset="0%"
                                                                    stopColor="#f09433"
                                                                />
                                                                <stop
                                                                    offset="25%"
                                                                    stopColor="#e6683c"
                                                                />
                                                                <stop
                                                                    offset="50%"
                                                                    stopColor="#dc2743"
                                                                />
                                                                <stop
                                                                    offset="75%"
                                                                    stopColor="#cc2366"
                                                                />
                                                                <stop
                                                                    offset="100%"
                                                                    stopColor="#bc1888"
                                                                />
                                                            </linearGradient>
                                                        </defs>
                                                        <path
                                                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                                            fill={`url(#detail-star-gradient-${post.id})`}
                                                        />
                                                    </svg>
                                                </Box>
                                            )}
                                            {!isOwnPost && (
                                                <Text
                                                    fontSize="sm"
                                                    color={
                                                        localIsFollowing
                                                            ? "gray.500"
                                                            : "#0095f6"
                                                    }
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                    onClick={handleFollow}
                                                >
                                                    •{" "}
                                                    {localIsFollowing
                                                        ? "Following"
                                                        : "Follow"}
                                                </Text>
                                            )}
                                        </HStack>
                                        <Box
                                            cursor="pointer"
                                            color="black"
                                            onClick={() =>
                                                setIsMoreOptionsOpen(true)
                                            }
                                        >
                                            <BsThreeDots size={20} />
                                        </Box>
                                    </Flex>

                                    {/* Comments List */}
                                    <Box flex={1} overflowY="auto" p={4}>
                                        <Flex gap={3} mb={6} align="start">
                                            <UserAvatar
                                                src={post.author?.avatarUrl}
                                                size="32px"
                                            />
                                            <Box>
                                                <Text
                                                    fontSize="14px"
                                                    color="black"
                                                >
                                                    <Text
                                                        as="span"
                                                        fontWeight="bold"
                                                        mr={2}
                                                    >
                                                        {post.author?.username}
                                                    </Text>
                                                    {renderCaptionWithHashtags(
                                                        post.caption,
                                                    )}
                                                </Text>
                                                <Text
                                                    fontSize="12px"
                                                    color="gray.500"
                                                    mt={2}
                                                >
                                                    {formatPostDate(
                                                        post.createdAt,
                                                    )}
                                                </Text>
                                            </Box>
                                        </Flex>

                                        {!post.commentsDisabled ? (
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                gap={4}
                                            >
                                                {Array.from(
                                                    new Map(
                                                        comments.map((c) => [
                                                            c.id,
                                                            c,
                                                        ]),
                                                    ).values(),
                                                ).map((c) => (
                                                    <CommentCard
                                                        key={c.id}
                                                        comment={c}
                                                        postId={post.id}
                                                        onClose={onClose}
                                                        onReply={handleReply}
                                                        postOwnerId={
                                                            post.author?.id
                                                        }
                                                    />
                                                ))}
                                                {comments.length === 0 && (
                                                    <Flex
                                                        h="100px"
                                                        align="center"
                                                        justify="center"
                                                    >
                                                        <Text
                                                            color="gray.400"
                                                            fontSize="sm"
                                                        >
                                                            No comments yet.
                                                        </Text>
                                                    </Flex>
                                                )}
                                            </Box>
                                        ) : (
                                            <Flex
                                                height="100%"
                                                align="center"
                                                justify="center"
                                                direction="column"
                                                gap={2}
                                            >
                                                <Text
                                                    fontWeight="bold"
                                                    fontSize="18px"
                                                    color="black"
                                                >
                                                    Comments are disabled.
                                                </Text>
                                                <Text
                                                    fontSize="14px"
                                                    color="gray.500"
                                                >
                                                    The author has turned off
                                                    commenting for this post.
                                                </Text>
                                            </Flex>
                                        )}
                                    </Box>

                                    {/* Footer Actions */}
                                    <Box
                                        borderTop="1px solid"
                                        borderColor="gray.100"
                                        p={4}
                                    >
                                        <Flex justify="space-between" mb={2}>
                                            <HStack gap={4}>
                                                <Box
                                                    onClick={handleLike}
                                                    cursor="pointer"
                                                >
                                                    {localIsLiked ? (
                                                        <AiFillHeart
                                                            size={28}
                                                            color="#ff3040"
                                                        />
                                                    ) : (
                                                        <AiOutlineHeart
                                                            size={28}
                                                            color="black"
                                                        />
                                                    )}
                                                </Box>
                                                {!post.commentsDisabled && (
                                                    <FaRegComment
                                                        size={26}
                                                        cursor="pointer"
                                                        color="black"
                                                    />
                                                )}
                                                <RiSendPlaneFill
                                                    size={26}
                                                    cursor="pointer"
                                                    color="black"
                                                    onClick={() =>
                                                        setIsShareModalOpen(
                                                            true,
                                                        )
                                                    }
                                                />
                                            </HStack>
                                            <Box
                                                onClick={handleSave}
                                                cursor="pointer"
                                            >
                                                {localIsSaved ? (
                                                    <BsBookmarkFill
                                                        size={24}
                                                        color="black"
                                                    />
                                                ) : (
                                                    <BsBookmark
                                                        size={24}
                                                        color="black"
                                                    />
                                                )}
                                            </Box>
                                        </Flex>
                                        {!post.hideLikeCount && (
                                            <Text
                                                fontWeight="bold"
                                                fontSize="sm"
                                                color="black"
                                                cursor="pointer"
                                                onClick={fetchLikers}
                                            >
                                                {localLikeCount?.toLocaleString()}{" "}
                                                likes
                                            </Text>
                                        )}
                                        <Text
                                            fontSize="10px"
                                            color="gray.500"
                                            mt={1}
                                        >
                                            {formatPostDate(post.createdAt)}
                                        </Text>
                                    </Box>

                                    {/* Replying Status */}
                                    {replyingTo && !post.commentsDisabled && (
                                        <Flex
                                            bg="gray.50"
                                            px={4}
                                            py={2}
                                            justify="space-between"
                                            align="center"
                                            borderTop="1px solid"
                                            borderColor="gray.100"
                                        >
                                            <Text
                                                fontSize="12px"
                                                color="gray.500"
                                            >
                                                Replying to{" "}
                                                {replyingTo.username}
                                            </Text>
                                            <Box
                                                cursor="pointer"
                                                onClick={() => {
                                                    setReplyingTo(null);
                                                    setCommentText("");
                                                }}
                                            >
                                                <AiOutlineClose
                                                    size={12}
                                                    color="gray"
                                                />
                                            </Box>
                                        </Flex>
                                    )}

                                    {/* Input Section */}
                                    <Box
                                        borderTop="1px solid"
                                        borderColor="gray.100"
                                    >
                                        {!post.commentsDisabled ? (
                                            <HStack p={4} gap={3}>
                                                <BsEmojiSmile
                                                    size={24}
                                                    cursor="pointer"
                                                    color="black"
                                                />
                                                <input
                                                    ref={inputRef}
                                                    style={{
                                                        flex: 1,
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: "14px",
                                                        backgroundColor:
                                                            "white",
                                                        color: "black",
                                                    }}
                                                    placeholder="Add a comment..."
                                                    value={commentText}
                                                    onChange={(e) =>
                                                        setCommentText(
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        handlePostComment()
                                                    }
                                                />
                                                <Text
                                                    color="#0095f6"
                                                    fontWeight="bold"
                                                    fontSize="sm"
                                                    cursor={
                                                        commentText.trim() &&
                                                        !isSubmittingComment
                                                            ? "pointer"
                                                            : "default"
                                                    }
                                                    opacity={
                                                        commentText.trim() &&
                                                        !isSubmittingComment
                                                            ? 1
                                                            : 0.3
                                                    }
                                                    onClick={handlePostComment}
                                                >
                                                    Post
                                                </Text>
                                            </HStack>
                                        ) : (
                                            <Box p={4} textAlign="center">
                                                <Text
                                                    fontSize="14px"
                                                    color="gray.500"
                                                >
                                                    Comments are disabled.
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Flex>
                        </DialogBody>
                    </DialogContent>
                </DialogPositioner>
            </DialogRoot>

            <UserListModal
                isOpen={isLikeListOpen}
                onClose={() => setIsLikeListOpen(false)}
                title="Likes"
                users={likedUsers}
            />
            <MoreOptionsModal
                isOpen={isMoreOptionsOpen}
                onClose={() => setIsMoreOptionsOpen(false)}
                post={post}
                isOwnPost={isOwnPost}
                onParentClose={onClose}
                onPostAction={onPostAction}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                post={post}
            />
        </>
    );
};

export default PostDetailModal;
