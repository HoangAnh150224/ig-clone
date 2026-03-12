import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Flex,
    VStack,
    Image,
    Text,
    HStack,
    Center,
} from "@chakra-ui/react";
import {
    AiOutlineHeart,
    AiFillHeart,
    AiOutlineMessage,
    AiFillPlayCircle,
} from "react-icons/ai";
import {
    BsThreeDots,
    BsMusicNoteBeamed,
    BsFillVolumeMuteFill,
    BsFillVolumeUpFill,
    BsBookmark,
    BsBookmarkFill,
} from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { toggleMute } from "../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../components/common/UserAvatar";
import ReelCommentPanel from "../components/messages/ReelCommentPanel";
import MoreOptionsModal from "../components/modals/MoreOptionsModal";
import ReelSkeleton from "../components/skeletons/ReelSkeleton";
import reelService from "../services/reelService";
import postService from "../services/postService";
import profileService from "../services/profileService";

const ReelCard = ({ reel, onOpenComments, onOpenMoreOptions, isActive }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth.user);
    const isMuted = useSelector((state) => state.ui.isMuted);
    const videoRef = useRef(null);
    
    const [isLiked, setIsLiked] = useState(reel.isLiked || false);
    const [likeCount, setLikeCount] = useState(reel.likeCount || 0);
    const [isSaved, setIsSaved] = useState(reel.isSaved || false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showHeartAnim, setShowHeartAnim] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isActive) {
                videoRef.current.play().catch(() => {});
                setTimeout(() => setIsPlaying(true), 0);
            } else {
                videoRef.current.pause();
                setTimeout(() => setIsPlaying(false), 0);
            }
        }
    }, [isActive]);

    const isOwnPost = authUser?.id === reel.author?.id;

    const handleLike = async () => {
        try {
            const wasLiked = isLiked;
            setIsLiked(!wasLiked);
            setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);
            const response = await postService.likePost(reel.id);
            setIsLiked(response.isLiked);
            setLikeCount(response.likeCount);
        } catch (error) {
            console.error("Failed to like reel", error);
        }
    };

    const handleSave = async () => {
        try {
            const response = await postService.savePost(reel.id);
            setIsSaved(response.saved);
        } catch (error) {
            console.error("Failed to save reel", error);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play().catch(() => {});
            setIsPlaying(!isPlaying);
        }
    };

    const handleDoubleLike = (e) => {
        e.stopPropagation();
        if (!isLiked) handleLike();
        setShowHeartAnim(true);
        setTimeout(() => setShowHeartAnim(false), 800);
    };

    const handleFollow = async (e) => {
        e.stopPropagation();
        try {
            await profileService.toggleFollow(reel.author.id);
        } catch (error) {
            console.error("Failed to follow", error);
        }
    };

    return (
        <Box
            height="98vh"
            width="min(470px, 98vw)"
            bg="black"
            borderRadius="0px"
            position="relative"
            overflow="hidden"
            scrollSnapAlign="start"
            cursor="pointer"
            onClick={togglePlay}
            onDoubleClick={handleDoubleLike}
        >
            <Box
                as="video"
                ref={videoRef}
                src={reel.media?.[0]?.url}
                width="100%"
                height="100%"
                objectFit="cover"
                loop
                muted={isMuted}
                playsInline
            />

            <Box
                position="absolute"
                top={4}
                right={4}
                bg="blackAlpha.600"
                p={2}
                borderRadius="full"
                color="white"
                zIndex={25}
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(toggleMute());
                }}
            >
                {isMuted ? <BsFillVolumeMuteFill size={18} /> : <BsFillVolumeUpFill size={18} />}
            </Box>

            {!isPlaying && (
                <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="whiteAlpha.800" pointerEvents="none" zIndex={15}>
                    <AiFillPlayCircle size={80} />
                </Box>
            )}

            {showHeartAnim && (
                <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={20} pointerEvents="none">
                    <AiFillHeart size={100} className="heart-animation" color="white" />
                </Box>
            )}

            {/* Right Controls */}
            <VStack position="absolute" right={3} bottom={20} gap={5} color="white" zIndex={10}>
                <VStack gap={1}>
                    <Box onClick={(e) => { e.stopPropagation(); handleLike(); }} cursor="pointer">
                        {isLiked ? <AiFillHeart size={32} color="#ff3040" /> : <AiOutlineHeart size={32} />}
                    </Box>
                    <Text fontSize="12px" fontWeight="bold">{likeCount.toLocaleString()}</Text>
                </VStack>
                <VStack gap={1} onClick={(e) => { e.stopPropagation(); onOpenComments(reel); }} cursor="pointer">
                    <AiOutlineMessage size={32} />
                    <Text fontSize="12px" fontWeight="bold">{reel.commentCount}</Text>
                </VStack>
                <RiSendPlaneFill size={30} cursor="pointer" onClick={(e) => e.stopPropagation()} />
                <Box onClick={(e) => { e.stopPropagation(); handleSave(); }} cursor="pointer">
                    {isSaved ? <BsBookmarkFill size={26} /> : <BsBookmark size={26} />}
                </Box>
                <BsThreeDots size={28} cursor="pointer" onClick={(e) => { e.stopPropagation(); onOpenMoreOptions(reel); }} />
                <Box boxSize="32px" borderRadius="4px" border="1.5px solid white" overflow="hidden" cursor="pointer" onClick={(e) => { e.stopPropagation(); navigate(`/${reel.author?.username}`); }}>
                    <Image src={reel.author?.avatarUrl} w="100%" h="100%" objectFit="cover" />
                </Box>
            </VStack>

            {/* Info Section */}
            <Box position="absolute" bottom={0} left={0} right={0} p={5} bgGradient="linear(to-t, blackAlpha.900, transparent)" color="white" zIndex={5} onClick={(e) => e.stopPropagation()}>
                <HStack gap={3} mb={3}>
                    <Box cursor="pointer" onClick={() => navigate(`/${reel.author?.username}`)}>
                        <UserAvatar src={reel.author?.avatarUrl} size="34px" />
                    </Box>
                    <Text fontWeight="bold" fontSize="14px" cursor="pointer" onClick={() => navigate(`/${reel.author?.username}`)}>
                        {reel.author?.username}
                    </Text>
                    {!isOwnPost && !reel.author?.isFollowing && (
                        <Box px={3} py={1} border="1px solid white" borderRadius="4px" fontSize="xs" fontWeight="bold" cursor="pointer" onClick={handleFollow}>
                            Follow
                        </Box>
                    )}
                </HStack>
                <Text fontSize="14px" mb={3} noOfLines={2}>{reel.caption}</Text>
                {reel.music && (
                    <HStack gap={2}>
                        <BsMusicNoteBeamed size={12} />
                        <Text fontSize="13px" isTruncated>{reel.music}</Text>
                    </HStack>
                )}
            </Box>
        </Box>
    );
};

const Reels = () => {
    const authUser = useSelector((state) => state.auth.user);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
    const [activeReel, setActiveReel] = useState(null);
    const [visibleReelId, setVisibleReelId] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchReels = async () => {
            setLoading(true);
            try {
                const response = await reelService.getAllReels();
                
                // Flexible data extraction supporting 'posts', 'content', or direct array
                const data = response?.posts || response?.content || (Array.isArray(response) ? response : []);
                
                setReels(data);
                if (data?.[0]) setVisibleReelId(data[0].id);
            } catch (error) {
                console.error("Failed to fetch reels", error);
                setReels([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReels();
    }, []);

    useEffect(() => {
        const options = { threshold: 0.8 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleReelId(entry.target.getAttribute("data-id"));
                }
            });
        }, options);

        const currentReels = document.querySelectorAll(".reel-item");
        currentReels.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [reels]);

    const handleOpenComments = (reel) => {
        setActiveReel(reel);
        setIsCommentOpen(true);
    };

    const handleOpenMoreOptions = (reel) => {
        setActiveReel(reel);
        setIsMoreOptionsOpen(true);
    };

    if (loading) {
        return (
            <Box height="100vh" width="100%" bg="white" display="flex" alignItems="center" justifyContent="center">
                <ReelSkeleton />
            </Box>
        );
    }

    return (
        <Box height="100vh" width="100%" bg="white" overflow="hidden">
            <Flex height="100%" width="100%" align="center" justify="center" position="relative">
                <Box
                    ref={containerRef}
                    height="100vh"
                    overflowY="auto"
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    css={{
                        scrollSnapType: "y mandatory",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" }
                    }}
                >
                    <VStack gap={0} py={0} width="full" align="center">
                        {Array.isArray(reels) && reels.map((reel) => (
                            <Box key={reel.id} data-id={reel.id} className="reel-item" width="full" display="flex" justifyContent="center">
                                <ReelCard
                                    reel={reel}
                                    isActive={visibleReelId === reel.id}
                                    onOpenComments={handleOpenComments}
                                    onOpenMoreOptions={handleOpenMoreOptions}
                                />
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <ReelCommentPanel
                    isOpen={isCommentOpen}
                    onClose={() => setIsCommentOpen(false)}
                    reel={activeReel}
                />

                <MoreOptionsModal
                    isOpen={isMoreOptionsOpen}
                    onClose={() => setIsMoreOptionsOpen(false)}
                    post={activeReel}
                    isOwnPost={activeReel?.author?.id === authUser?.id}
                />
            </Flex>
        </Box>
    );
};

export default Reels;
