import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Spinner,
    Center,
    Text,
    Flex,
    HStack,
    VStack,
    IconButton,
    Image,
    Input,
    Button,
    Icon,
} from "@chakra-ui/react";
import { AiFillHeart, AiOutlineHeart, AiFillPlayCircle } from "react-icons/ai";
import {
    BsBookmark,
    BsBookmarkFill,
    BsEmojiSmile,
    BsThreeDots,
    BsFillVolumeMuteFill,
    BsFillVolumeUpFill,
    BsXCircleFill,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import postService from "../services/postService";
import commentService from "../services/commentService";
import UserAvatar from "../components/common/UserAvatar";
import CommentCard from "../components/Comment/CommentCard";
import ImageCarousel from "../components/common/ImageCarousel";
import PostDetailSkeleton from "../components/skeletons/PostDetailSkeleton";
import { formatPostDate } from "../utils/dateUtils";
import { useSelector, useDispatch } from "react-redux";
import { toggleMute } from "../store/slices/uiSlice";

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMuted = useSelector((state) => state.ui.isMuted);
    const authUser = useSelector((state) => state.auth.user);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);

    // COMMENT LOGIC
    const [commentValue, setCommentValue] = useState("");
    const [replyingTo, setReplyingTo] = useState(null); // { id, username }
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const result = await postService.getPostById(postId);
                if (result) {
                    setPost(result);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    const handleReply = (parentComment) => {
        setReplyingTo({
            id: parentComment.id,
            username: parentComment.user.username,
        });
        setCommentValue(`@${parentComment.user.username} `);
        inputRef.current?.focus();
    };

    const handlePostComment = async () => {
        if (!commentValue.trim()) return;

        let response;
        if (replyingTo && commentValue.startsWith(`@${replyingTo.username}`)) {
            // Send Reply
            const content = commentValue
                .replace(`@${replyingTo.username}`, "")
                .trim();
            response = await commentService.addReply(replyingTo.id, content);
        } else {
            // Send new Comment
            response = await commentService.addComment(post.id, commentValue);
        }

        if (response) {
            setCommentValue("");
            setReplyingTo(null);
            // TODO: Update local comment list for immediate feedback
            console.log("Comment/Reply posted successfully");
        }
    };

    const handleSave = async () => {
        const previousState = isSaved;
        setIsSaved(!isSaved);
        try {
            await postService.toggleSavePost(post.id);
        } catch (error) {
            setIsSaved(previousState);
        }
    };

    if (loading) {
        return <PostDetailSkeleton />;
    }

    if (error || !post) {
        return (
            <Center h="70vh" flexDirection="column" gap={4}>
                <Text fontSize="24px" fontWeight="bold">
                    Sorry, this page isn't available.
                </Text>
                <Text color="gray.500">
                    The link you followed may be broken, or the page may have
                    been removed.
                    <Text
                        as="span"
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => navigate("/")}
                    >
                        {" "}
                        Go back to Instagram.
                    </Text>
                </Text>
            </Center>
        );
    }

    const comments = commentService.getCommentsByPostId(post.id) || [];
    const isReel = post.type === "reel" || !!post.videoUrl;

    return (
        <Box maxW="1200px" mx="auto" mt={8} mb={20} px={{ base: 0, md: 4 }}>
            <Flex
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                direction={{ base: "column", md: "row" }}
                minH={{ md: "600px" }}
                height={{ md: "calc(100vh - 120px)" }}
                maxH="900px"
            >
                {/* Left Column: Media Section */}
                <Box
                    flex={1.5}
                    bg="black"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    overflow="hidden"
                >
                    {isReel ? (
                        <Box
                            width="100%"
                            height="100%"
                            position="relative"
                            cursor="pointer"
                            onClick={() => {
                                if (videoRef.current) {
                                    isPlaying
                                        ? videoRef.current.pause()
                                        : videoRef.current.play();
                                    setIsPlaying(!isPlaying);
                                }
                            }}
                        >
                            <Box
                                as="video"
                                ref={videoRef}
                                src={post.videoUrl}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                width="100%"
                                height="100%"
                                objectFit="contain"
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
                                    <BsFillVolumeMuteFill size={18} />
                                ) : (
                                    <BsFillVolumeUpFill size={18} />
                                )}
                            </Box>
                            {!isPlaying && (
                                <Box
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    color="whiteAlpha.800"
                                    pointerEvents="none"
                                >
                                    <AiFillPlayCircle size={80} />
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box width="100%" height="100%">
                            <ImageCarousel
                                images={post.images || [post.imageUrl]}
                                height="100%"
                                objectFit="contain"
                            />
                        </Box>
                    )}
                </Box>

                {/* Right Column: Info & Interaction */}
                <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    bg="white"
                    height="100%"
                    minW={{ md: "400px" }}
                    maxW={{ md: "500px" }}
                    borderLeft={{ md: "1px solid" }}
                    borderColor="gray.200"
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
                                    navigate(`/${post.user?.username}`)
                                }
                            >
                                <UserAvatar
                                    src={post.user?.avatar}
                                    size="32px"
                                />
                            </Box>
                            <Text
                                fontWeight="bold"
                                fontSize="14px"
                                color="black"
                                cursor="pointer"
                                onClick={() =>
                                    navigate(`/${post.user?.username}`)
                                }
                            >
                                {post.user?.username}
                            </Text>
                            <Text as="span" mx={1} color="gray.400">
                                •
                            </Text>
                            <Text
                                fontSize="14px"
                                color="#0095f6"
                                fontWeight="bold"
                                cursor="pointer"
                            >
                                Following
                            </Text>
                        </HStack>
                        <IconButton
                            variant="ghost"
                            icon={<BsThreeDots />}
                            aria-label="More options"
                            color="black"
                        />
                    </Flex>

                    {/* Comments Area */}
                    <Box
                        flex={1}
                        overflowY="auto"
                        p={4}
                        className="hide-scrollbar"
                    >
                        <Flex gap={3} mb={6} align="start">
                            <Box
                                cursor="pointer"
                                onClick={() =>
                                    navigate(`/${post.user?.username}`)
                                }
                            >
                                <UserAvatar
                                    src={post.user?.avatar}
                                    size="32px"
                                />
                            </Box>
                            <Box>
                                <Text fontSize="14px" color="black">
                                    <Text
                                        as="span"
                                        fontWeight="bold"
                                        mr={2}
                                        cursor="pointer"
                                        onClick={() =>
                                            navigate(`/${post.user?.username}`)
                                        }
                                    >
                                        {post.user?.username}
                                    </Text>
                                    {post.caption}
                                </Text>
                                <HStack gap={4} mt={2}>
                                    <Text fontSize="12px" color="gray.500">
                                        {formatPostDate(post.createdAt)}
                                    </Text>
                                    <Text
                                        fontSize="12px"
                                        color="gray.500"
                                        fontWeight="bold"
                                        cursor="pointer"
                                    >
                                        See translation
                                    </Text>
                                </HStack>
                            </Box>
                        </Flex>

                        <Box display="flex" flexDirection="column" gap={6}>
                            {comments.length > 0 ? (
                                comments.map((c) => (
                                    <CommentCard
                                        key={c.id}
                                        comment={c}
                                        onReply={handleReply}
                                    />
                                ))
                            ) : (
                                <Center h="100px">
                                    <Text color="gray.400" fontSize="sm">
                                        No comments yet.
                                    </Text>
                                </Center>
                            )}
                        </Box>
                    </Box>

                    {/* Action Area */}
                    <Box borderTop="1px solid" borderColor="gray.100" p={4}>
                        <Flex justify="space-between" mb={2}>
                            <HStack gap={4}>
                                <Box
                                    onClick={() => setIsLiked(!isLiked)}
                                    cursor="pointer"
                                >
                                    {isLiked ? (
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
                                <FaRegComment
                                    size={26}
                                    cursor="pointer"
                                    color="black"
                                    onClick={() => inputRef.current?.focus()}
                                />
                                <RiSendPlaneFill
                                    size={26}
                                    cursor="pointer"
                                    color="black"
                                />
                            </HStack>
                            <Box
                                onClick={() => setIsSaved(!isSaved)}
                                cursor="pointer"
                            >
                                {isSaved ? (
                                    <BsBookmarkFill size={24} color="black" />
                                ) : (
                                    <BsBookmark size={24} color="black" />
                                )}
                            </Box>
                        </Flex>
                        <Text
                            fontWeight="bold"
                            fontSize="14px"
                            color="black"
                            mb={1}
                        >
                            {post.likeCount?.toLocaleString()} likes
                        </Text>
                        <Text
                            color="gray.500"
                            fontSize="10px"
                            textTransform="uppercase"
                        >
                            {formatPostDate(post.createdAt)}
                        </Text>
                    </Box>

                    {/* Replying Status Indicator */}
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
                                Replying to {replyingTo.username}
                            </Text>
                            <Icon
                                as={BsXCircleFill}
                                color="gray.400"
                                cursor="pointer"
                                onClick={() => {
                                    setReplyingTo(null);
                                    setCommentValue("");
                                }}
                            />
                        </Flex>
                    )}

                    {/* Input Area */}
                    <Box borderTop="1px solid" borderColor="gray.100" p={4}>
                        <HStack gap={3}>
                            <Box cursor="pointer" color="black">
                                <BsEmojiSmile size={24} />
                            </Box>
                            <Input
                                ref={inputRef}
                                value={commentValue}
                                onChange={(e) =>
                                    setCommentValue(e.target.value)
                                }
                                variant="plain"
                                placeholder="Add a comment..."
                                fontSize="14px"
                                bg="transparent"
                                border="none"
                                _focus={{ boxShadow: "none" }}
                                color="black"
                                p={0}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handlePostComment()
                                }
                            />
                            <Button
                                variant="ghost"
                                color="#0095f6"
                                fontWeight="bold"
                                fontSize="14px"
                                p={0}
                                height="auto"
                                _hover={{ bg: "transparent" }}
                                onClick={handlePostComment}
                                disabled={!commentValue.trim()}
                            >
                                Post
                            </Button>
                        </HStack>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default PostDetail;
