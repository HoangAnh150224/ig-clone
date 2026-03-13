import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Flex, Spinner, Image, Button, HStack } from "@chakra-ui/react";
import { AiOutlineHeart } from "react-icons/ai";
import UserAvatar from "../../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUnreadNotificationCount, setUnreadNotificationCount } from "../../../store/slices/uiSlice";
import { updateUserProfile } from "../../../store/slices/userSlice";
import notificationService from "../../../services/notificationService";
import profileService from "../../../services/profileService";

const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
};

const getSection = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays <= 7) return "This Week";
    return "Earlier";
};

const getNotificationText = (type) => {
    switch (type) {
        case "LIKE": return "liked your post.";
        case "FOLLOW": return "started following you.";
        case "COMMENT": return "commented on your post.";
        case "MENTION": return "mentioned you in a comment.";
        case "FOLLOW_REQUEST": return "requested to follow you.";
        case "FOLLOW_ACCEPTED": return "accepted your follow request.";
        case "TAG": return "tagged you in a post.";
        case "STORY_REPLY": return "replied to your story.";
        default: return "interacted with you.";
    }
};

const NotificationPanel = ({ isOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userProfile } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [followingMap, setFollowingMap] = useState({});
    const loadMoreRef = React.useRef(null);

    const fetchNotifications = React.useCallback(async (cursor = null) => {
        if (cursor) setIsFetchingMore(true);
        else setLoading(true);

        try {
            const res = await notificationService.getNotifications(cursor);
            const data = res.content || [];
            const newCursor = res.nextCursor;
            const moreAvailable = res.hasMore;

            setNotifications(prev => cursor ? [...prev, ...data] : data);
            setNextCursor(newCursor);
            setHasMore(moreAvailable);

            // Initialize following status map
            const initialMap = { ...followingMap };
            data.forEach(n => {
                if (n.actor) {
                    initialMap[n.actor.id] = n.actor.isFollowing || false;
                }
            });
            setFollowingMap(initialMap);

            if (!cursor) {
                // Mark all as read and clear badge on initial open
                notificationService.markAllRead().catch(console.error);
                dispatch(clearUnreadNotificationCount());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, [dispatch, followingMap]);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, fetchNotifications]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !isFetchingMore && notifications.length > 0) {
                    fetchNotifications(nextCursor);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, isFetchingMore, nextCursor, fetchNotifications, notifications.length]);

    const handleNotificationClick = async (notif) => {
        // 1. Mark as read in Backend
        if (!notif.read) {
            try {
                await notificationService.markAsRead(notif.id);
                // Update local state to remove blue dot
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                
                // Refresh unread count globally to be safe
                const count = await notificationService.getUnreadCount();
                dispatch(setUnreadNotificationCount(count));
            } catch (error) {
                console.error("Failed to mark notification as read", error);
            }
        }

        // 2. Navigate
        if (notif.postId) {
            navigate(`/p/${notif.postId}`);
        } else if (notif.actor?.username) {
            navigate(`/${notif.actor.username}`);
        }
    };

    const handleFollowToggle = async (e, userId) => {
        e.stopPropagation();
        try {
            await profileService.toggleFollow(userId);
            setFollowingMap(prev => ({
                ...prev,
                [userId]: !prev[userId]
            }));
        } catch (error) {
            console.error("Failed to toggle follow", error);
        }
    };

    const handleAcceptRequest = async (e, userId, notifId) => {
        e.stopPropagation();
        try {
            await profileService.acceptFollowRequest(userId);
            
            // Mark as read and remove from UI or update type
            setNotifications(prev => prev.filter(n => n.id !== notifId));
            const count = await notificationService.getUnreadCount();
            dispatch(setUnreadNotificationCount(count));

            // SYNC: If we are currently viewing this user's profile, update it
            if (userProfile && userProfile.id === userId) {
                dispatch(updateUserProfile({ 
                    isFollowing: true, 
                    isPending: false,
                    followersCount: (userProfile.followersCount || 0) + 1,
                    canViewContent: true
                }));
            }
        } catch (error) {
            console.error("Failed to accept follow request", error);
        }
    };

    const handleDeclineRequest = async (e, userId, notifId) => {
        e.stopPropagation();
        try {
            await profileService.declineFollowRequest(userId);
            setNotifications(prev => prev.filter(n => n.id !== notifId));
            const count = await notificationService.getUnreadCount();
            dispatch(setUnreadNotificationCount(count));

            // SYNC: If we are currently viewing this user's profile, update it
            if (userProfile && userProfile.id === userId) {
                dispatch(updateUserProfile({ 
                    isFollowing: false, 
                    isPending: false 
                }));
            }
        } catch (error) {
            console.error("Failed to decline follow request", error);
        }
    };

    const sections = ["Today", "Yesterday", "This Week", "Earlier"];
    const groupedNotifications = sections.reduce((acc, section) => {
        acc[section] = notifications.filter((n) => getSection(n.createdAt) === section);
        return acc;
    }, {});

    return (
        <Box
            position="fixed"
            left="72px"
            top={0}
            height="100vh"
            width="397px"
            bg="white"
            zIndex={90}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
            opacity={isOpen ? 1 : 0}
            visibility={isOpen ? "visible" : "hidden"}
            borderRight="1px solid"
            borderColor="gray.200"
            borderRightRadius="16px"
            boxShadow="4px 0 24px rgba(0,0,0,0.08)"
            display="flex"
            flexDirection="column"
            overflow="hidden"
        >
            <Box pt={6} px={6} mb={4}>
                <Text fontSize="24px" fontWeight="bold" tracking="tight" color="black">
                    Notifications
                </Text>
            </Box>

            <Box flex={1} overflowY="auto" pb={10} className="no-scrollbar">
                {loading ? (
                    <VStack px={6} mt={4} gap={6} align="stretch">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Flex key={i} align="center" gap={3}>
                                <Box w="44px" h="44px" borderRadius="full" bg="gray.100" flexShrink={0} className="animate-pulse" />
                                <VStack align="start" gap={2} flex={1}>
                                    <Box h="14px" w="full" bg="gray.100" borderRadius="4px" className="animate-pulse" />
                                    <Box h="10px" w="100px" bg="gray.50" borderRadius="4px" className="animate-pulse" />
                                </VStack>
                            </Flex>
                        ))}
                    </VStack>
                ) : notifications.length === 0 ? (
                    <Flex direction="column" align="center" justify="center" h="60vh" px={10} textAlign="center" gap={4}>
                        <Box p={5} borderRadius="full" border="2px solid" borderColor="blackAlpha.100">
                            <AiOutlineHeart size={40} color="gray" />
                        </Box>
                        <VStack gap={1}>
                            <Text fontSize="14px" fontWeight="bold" color="black">Activity on your posts</Text>
                            <Text fontSize="14px" color="gray.500">When someone likes or comments on one of your posts, you'll see it here.</Text>
                        </VStack>
                    </Flex>
                ) : (
                    sections.map(
                        (section) =>
                            groupedNotifications[section].length > 0 && (
                                <Box key={section} mb={4}>
                                    <Text fontWeight="bold" color="black" px={6} py={4} fontSize="16px">
                                        {section}
                                    </Text>
                                    <VStack align="stretch" gap={0}>
                                        {groupedNotifications[section].map(
                                            (notif) => (
                                                <Flex
                                                    key={notif.id}
                                                    align="center"
                                                    gap={3}
                                                    px={6}
                                                    py={3}
                                                    cursor="pointer"
                                                    _hover={{ bg: "blackAlpha.50" }}
                                                    onClick={() => handleNotificationClick(notif)}
                                                >
                                                    <Box flexShrink={0}>
                                                        <UserAvatar src={notif.actor.avatarUrl} size="44px" />
                                                    </Box>
                                                    
                                                    <Box flex={1} minW={0}>
                                                        <Text fontSize="14px" color="black" lineHeight="tight">
                                                            <Text as="span" fontWeight="bold">{notif.actor.username}</Text>
                                                            {" "}{getNotificationText(notif.type)}
                                                            <Text as="span" color="gray.500" ml={1}>{getTimeAgo(notif.createdAt)}</Text>
                                                        </Text>
                                                    </Box>

                                                    {/* New Notification Indicator (Blue Dot) */}
                                                    {!notif.read && (
                                                        <Box 
                                                            w="8px" h="8px" 
                                                            bg="#0095f6" 
                                                            borderRadius="full" 
                                                            mr={2}
                                                            flexShrink={0}
                                                        />
                                                    )}

                                                    {notif.type === "FOLLOW" || notif.type === "FOLLOW_ACCEPTED" ? (
                                                        <Button
                                                            size="sm"
                                                            bg={followingMap[notif.actor.id] ? "#efefef" : "#0095f6"}
                                                            color={followingMap[notif.actor.id] ? "black" : "white"}
                                                            px={4}
                                                            py={1.5}
                                                            borderRadius="8px"
                                                            fontSize="14px"
                                                            fontWeight="bold"
                                                            cursor="pointer"
                                                            _hover={{ bg: followingMap[notif.actor.id] ? "#dbdbdb" : "#1877f2" }}
                                                            flexShrink={0}
                                                            onClick={(e) => handleFollowToggle(e, notif.actor.id)}
                                                        >
                                                            {followingMap[notif.actor.id] ? "Following" : "Follow"}
                                                        </Button>
                                                    ) : notif.type === "FOLLOW_REQUEST" ? (
                                                        <HStack gap={2} flexShrink={0}>
                                                            <Button
                                                                size="sm"
                                                                bg="#0095f6"
                                                                color="white"
                                                                px={4}
                                                                py={1.5}
                                                                borderRadius="8px"
                                                                fontSize="14px"
                                                                fontWeight="bold"
                                                                _hover={{ bg: "#1877f2" }}
                                                                onClick={(e) => handleAcceptRequest(e, notif.actor.id, notif.id)}
                                                            >
                                                                Confirm
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                bg="#efefef"
                                                                color="black"
                                                                px={4}
                                                                py={1.5}
                                                                borderRadius="8px"
                                                                fontSize="14px"
                                                                fontWeight="bold"
                                                                _hover={{ bg: "#dbdbdb" }}
                                                                onClick={(e) => handleDeclineRequest(e, notif.actor.id, notif.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </HStack>
                                                    ) : (
                                                        notif.postId && (
                                                            <Box 
                                                                w="40px" h="40px" 
                                                                flexShrink={0} 
                                                                overflow="hidden" 
                                                                borderRadius="2px" 
                                                                border="1px solid" 
                                                                borderColor="gray.100"
                                                                cursor="pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleNotificationClick(notif);
                                                                }}
                                                            >
                                                                {notif.postThumbnailUrl ? (
                                                                    <Image src={notif.postThumbnailUrl} w="full" h="full" objectFit="cover" />
                                                                ) : (
                                                                    <Box w="full" h="full" bg="gray.100" />
                                                                )}
                                                            </Box>
                                                        )
                                                    )}
                                                </Flex>
                                            ),
                                        )}
                                    </VStack>
                                    {section !== "Earlier" && (
                                        <Box h="1px" bg="gray.100" mx={6} mt={4} />
                                    )}
                                </Box>
                            ),
                    )
                )}

                {/* Infinite scroll trigger */}
                {hasMore && notifications.length > 0 && (
                    <Box ref={loadMoreRef} h="60px" display="flex" alignItems="center" justifyContent="center" py={4}>
                        {isFetchingMore && <Spinner size="sm" color="gray.400" />}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default NotificationPanel;
