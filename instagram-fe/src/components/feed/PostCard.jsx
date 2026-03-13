import React, { useState, useRef, lazy, Suspense } from "react";
import {
    Box,
    HStack,
    VStack,
    Text,
    Input,
    Flex,
    Icon,
    Center,
} from "@chakra-ui/react";
import {
    AiOutlineHeart,
    AiFillHeart,
    AiOutlineMessage,
    AiOutlineSend,
    AiFillPlayCircle,
} from "react-icons/ai";
import {
    BsBookmark,
    BsBookmarkFill,
    BsThreeDots,
    BsFillVolumeMuteFill,
    BsFillVolumeUpFill,
    BsStarFill,
} from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
import UserAvatar from "../common/UserAvatar";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike, updatePostInStore } from "../../store/slices/postSlice";
import { toggleMute } from "../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../common/ImageCarousel";
import { formatPostDate } from "../../utils/dateUtils";
import postService from "../../services/postService";
import commentService from "../../services/commentService";

const PostDetailModal = lazy(() => import("../modals/PostDetailModal"));
const UserListModal = lazy(() => import("../modals/UserListModal"));
const MoreOptionsModal = lazy(() => import("../modals/MoreOptionsModal"));
const ShareModal = lazy(() => import("../modals/ShareModal"));

const PostCard = ({ post }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: authUser } = useSelector((state) => state.auth);
    const isMuted = useSelector((state) => state.ui.isMuted);
    const videoRef = useRef(null);

    // FAVORITES LOGIC
    const favoriteUserIds = authUser?.favoriteUserIds || [];
    const isFavoriteUser = favoriteUserIds.includes(post.author?.id);

    const [showHeartAnim, setShowHeartAnim] = useState(false);
    const [comment, setComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [isLikeListOpen, setIsLikeListOpen] = useState(false);
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [likedUsers, setLikedUsers] = useState([]);

    const isLiked = post.isLiked || false;
    const isSaved = post.isSaved || false;
    const isOwnPost = post.author?.id === authUser?.id;
    const isReel = post.type === "REEL";

    if (post.author?.isActive === false) return null;

    const handleLike = () => {
        dispatch(toggleLike(post.id));
    };

    const handleDoubleLike = (e) => {
        e.stopPropagation();
        if (!isLiked) handleLike();
        setShowHeartAnim(true);
        setTimeout(() => setShowHeartAnim(false), 800);
    };

    const handleSave = async () => {
        try {
            const response = await postService.savePost(post.id);
            dispatch(
                updatePostInStore({
                    id: post.id,
                    changes: { isSaved: response.saved },
                }),
            );
        } catch (error) {
            console.error("Failed to save post", error);
        }
    };

    const handlePostComment = async () => {
        if (!comment.trim() || isSubmittingComment) return;
        setIsSubmittingComment(true);
        try {
            await commentService.addComment(post.id, comment);
            setComment("");
            // Optionally update local comment count
            dispatch(
                updatePostInStore({
                    id: post.id,
                    changes: { commentCount: (post.commentCount || 0) + 1 },
                }),
            );
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

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
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

    return (
        <>
            <Box
                width="100%"
                maxW="470px"
                mx="auto"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="0px" // Bỏ bo góc theo GEMINI.md
                bg="white"
                overflow="hidden"
                color="black"
                mb={4}
            >
                {/* Header */}
                <Flex p={3} justify="space-between" align="center" bg="white">
                    <HStack
                        gap={3}
                        cursor="pointer"
                        onClick={() => navigate(`/${post.author?.username}`)}
                    >
                        <UserAvatar src={post.author?.avatarUrl} />
                        <VStack align="start" gap={0}>
                            <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="black"
                                _hover={{ color: "gray.500" }}
                            >
                                {post.author?.username || "user"}
                            </Text>
                            {post.locationName && (
                                <Text
                                    fontSize="12px"
                                    color="gray.600"
                                    mt="-1px"
                                >
                                    {post.locationName}
                                </Text>
                            )}
                        </VStack>
                    </HStack>

                    <HStack gap={3}>
                        {isFavoriteUser && (
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <defs>
                                        <linearGradient
                                            id={`star-gradient-${post.id}`}
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
                                        fill={`url(#star-gradient-${post.id})`}
                                    />
                                </svg>
                            </Box>
                        )}
                        <Box
                            cursor="pointer"
                            color="black"
                            onClick={() => setIsMoreOptionsOpen(true)}
                        >
                            <BsThreeDots size={18} />
                        </Box>
                    </HStack>
                </Flex>

                {/* Post Media */}
                <Box
                    className="post-media-container"
                    onDoubleClick={handleDoubleLike}
                    bg="black"
                    position="relative"
                    width="100%"
                    paddingBottom="125%" // Standard Instagram ratio
                    overflow="hidden"
                    cursor="pointer"
                    onClick={isReel ? togglePlay : undefined}
                >
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {isReel ? (
                            <>
                                {(() => {
                                    const firstMedia = post.media?.[0];
                                    const mediaUrl =
                                        firstMedia?.url ||
                                        firstMedia?.mediaUrl ||
                                        firstMedia?.contentUrl;
                                    return (
                                        <Box
                                            as="video"
                                            ref={videoRef}
                                            src={mediaUrl}
                                            autoPlay
                                            loop
                                            muted={isMuted}
                                            playsInline
                                            width="100%"
                                            height="100%"
                                            objectFit="cover"
                                        />
                                    );
                                })()}
                                {!isPlaying && (
                                    <Box
                                        position="absolute"
                                        color="whiteAlpha.800"
                                        pointerEvents="none"
                                        zIndex={5}
                                    >
                                        <AiFillPlayCircle size={60} />
                                    </Box>
                                )}
                                <Box
                                    position="absolute"
                                    bottom={4}
                                    right={4}
                                    bg="blackAlpha.700"
                                    p={2}
                                    borderRadius="full"
                                    color="white"
                                    zIndex={10}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(toggleMute());
                                    }}
                                >
                                    {isMuted ? (
                                        <BsFillVolumeMuteFill size={14} />
                                    ) : (
                                        <BsFillVolumeUpFill size={14} />
                                    )}
                                </Box>
                            </>
                        ) : (
                            <ImageCarousel
                                images={
                                    post.media?.map(
                                        (m) =>
                                            m.url || m.mediaUrl || m.contentUrl,
                                    ) || []
                                }
                                height="100%"
                            />
                        )}

                        {showHeartAnim && (
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                zIndex={10}
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
                </Box>

                {/* Action Buttons */}
                <Box px={3} pt={3} bg="white">
                    <Flex justify="space-between" mb={2}>
                        <HStack gap={4}>
                            <Box
                                onClick={handleLike}
                                cursor="pointer"
                                transition="transform 0.1s"
                                _active={{ transform: "scale(1.1)" }}
                            >
                                {isLiked ? (
                                    <AiFillHeart size={26} color="#ff3040" />
                                ) : (
                                    <AiOutlineHeart size={26} color="black" />
                                )}
                            </Box>
                            <AiOutlineMessage
                                size={26}
                                cursor="pointer"
                                color="black"
                                onClick={() => setIsCommentModalOpen(true)}
                            />
                            <AiOutlineSend
                                size={26}
                                cursor="pointer"
                                color="black"
                                onClick={() => setIsShareModalOpen(true)}
                            />
                        </HStack>
                        <Box
                            onClick={handleSave}
                            cursor="pointer"
                            color="black"
                        >
                            {isSaved ? (
                                <BsBookmarkFill size={24} color="black" />
                            ) : (
                                <BsBookmark size={24} />
                            )}
                        </Box>
                    </Flex>

                    {!post.hideLikeCount && (
                        <Text
                            fontSize="14px"
                            fontWeight="600"
                            mb={2}
                            color="black"
                            cursor="pointer"
                            onClick={fetchLikers}
                        >
                            {post.likeCount?.toLocaleString()} likes
                        </Text>
                    )}

                    <Box mb={2}>
                        <Text fontSize="14px" lineHeight="1.4" color="black">
                            <Text
                                as="span"
                                fontWeight="600"
                                mr={2}
                                cursor="pointer"
                                onClick={() =>
                                    navigate(`/${post.author?.username}`)
                                }
                            >
                                {post.author?.username}
                            </Text>
                            {renderCaptionWithHashtags(post.caption)}
                        </Text>
                    </Box>

                    {post.commentCount > 0 && !post.commentsDisabled && (
                        <Text
                            fontSize="14px"
                            color="gray.500"
                            cursor="pointer"
                            mb={2}
                            onClick={() => setIsCommentModalOpen(true)}
                        >
                            View all {post.commentCount} comments
                        </Text>
                    )}

                    {post.commentsDisabled && (
                        <Text fontSize="13px" color="gray.500" mb={2}>
                            Comments are disabled for this post.
                        </Text>
                    )}

                    <Text
                        fontSize="10px"
                        color="gray.500"
                        textTransform="uppercase"
                        mb={3}
                        letterSpacing="0.02em"
                    >
                        {formatPostDate(post.createdAt)}
                    </Text>
                </Box>

                <Box
                    borderTop="1px solid"
                    borderColor="gray.100"
                    px={3}
                    py={3}
                    bg="white"
                    display="block"
                >
                    {post.commentsDisabled ? (
                        <Center py={1}>
                            <Text
                                fontSize="13px"
                                color="gray.500"
                                fontWeight="400"
                            >
                                Comments are disabled.
                            </Text>
                        </Center>
                    ) : (
                        <HStack gap={3} bg="white">
                            <FaRegSmile
                                size={20}
                                cursor="pointer"
                                color="black"
                            />
                            <Input
                                placeholder="Add a comment..."
                                variant="unstyled"
                                fontSize="14px"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                _placeholder={{ color: "gray.500" }}
                                color="black"
                                bg="white"
                            />
                            <Text
                                as="button"
                                color="#0095f6"
                                fontSize="14px"
                                fontWeight="600"
                                opacity={
                                    comment.trim() && !isSubmittingComment
                                        ? 1
                                        : 0.3
                                }
                                cursor={
                                    comment.trim() && !isSubmittingComment
                                        ? "pointer"
                                        : "default"
                                }
                                onClick={handlePostComment}
                            >
                                Post
                            </Text>
                        </HStack>
                    )}
                </Box>
            </Box>

            <Suspense fallback={null}>
                <PostDetailModal
                    isOpen={isCommentModalOpen}
                    onClose={() => setIsCommentModalOpen(false)}
                    post={post}
                />
                <UserListModal
                    isOpen={isLikeListOpen}
                    onClose={() => setIsLikeListOpen(false)}
                    title="Likes"
                    users={likedUsers}
                />
                <MoreOptionsModal
                    isOpen={isMoreOptionsOpen}
                    onClose={() => setIsMoreOptionsOpen(false)}
                    isOwnPost={isOwnPost}
                    post={post}
                    isFavoriteUser={isFavoriteUser}
                />
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    post={post}
                />
            </Suspense>
        </>
    );
};

export default PostCard;
