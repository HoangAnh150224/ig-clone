import React, { useState } from "react";
import {
    Box,
    HStack,
    VStack,
    Text,
    Button,
    Image,
    Icon,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCreatePostModal } from "../../store/slices/uiSlice";
import { FiPlus } from "react-icons/fi";
import StoryModal from "../modals/StoryModal";
import UserListModal from "../modals/UserListModal";
import MoreOptionsModal from "../modals/MoreOptionsModal";
import profileService from "../../services/profileService";
import userService from "../../services/userService";
import { toggleFollow } from "../../store/slices/userSlice";
import { setUser } from "../../store/slices/authSlice";

const ProfileHeader = ({ user, isOwnProfile }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [listUsers, setListUsers] = useState([]);

    if (!user) return null;

    const isBlocked = authUser?.blockedUserIds?.includes(user.id);

    const handleFollowToggle = async () => {
        dispatch(toggleFollow(user.id));
    };

    const handleUnblock = async () => {
        try {
            await userService.blockUser(user.id); // blockUser is a toggle
            if (authUser) {
                const newBlockedIds = authUser.blockedUserIds.filter(id => id !== user.id);
                dispatch(setUser({ ...authUser, blockedUserIds: newBlockedIds }));
            }
        } catch (error) {
            console.error("Failed to unblock user", error);
        }
    };

    const handleAvatarClick = () => {
        if (isBlocked) return;
        // ONLY OPEN IF THERE ARE NEW STORIES (Active Story)
        if (user.hasStory && user.stories?.length > 0) {
            setIsStoryOpen(true);
        } else if (isOwnProfile) {
            dispatch(openCreatePostModal());
        }
    };

    const handleOpenList = async (type) => {
        if (isBlocked) return;
        try {
            if (type === "followers") {
                setListTitle("Followers");
                const response = await profileService.getUserFollowers(user.id);
                // Extract content from PaginatedResponse or fallback to array
                setListUsers(response.content || (Array.isArray(response) ? response : []));
            } else {
                setListTitle("Following");
                const response = await profileService.getUserFollowing(user.id);
                setListUsers(response.content || (Array.isArray(response) ? response : []));
            }
            setIsListOpen(true);
        } catch (error) {
            console.error("Failed to open user list", error);
        }
    };

    const handleMessageClick = () => {
        if (isBlocked) return;
        navigate("/direct/inbox", { state: { selectedUser: user } });
    };

    // STORY DATA ONLY CONTAINS NEW STORIES, NO HIGHLIGHTS
    const activeStoryData = user.hasStory && !isBlocked
        ? [
              {
                  id: "active-story",
                  title: "Story",
                  user: user,
                  stories: user.stories,
              },
          ]
        : [];

    return (
        <>
            <div className="flex flex-row gap-8 md:gap-20 pt-12 pb-10 px-4 items-start max-w-[935px] mx-auto">
                {/* Avatar Section */}
                <Box flexShrink={0} pt={2}>
                    <Box
                        width={{ base: "77px", md: "150px" }}
                        height={{ base: "77px", md: "150px" }}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        cursor={user.hasStory && !isBlocked ? "pointer" : "default"}
                        p="4px"
                        onClick={handleAvatarClick}
                        bg={
                            user.hasStory && !isBlocked
                                ? "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)"
                                : "transparent"
                        }
                        border={!user.hasStory || isBlocked ? "1px solid" : "none"}
                        borderColor="gray.200"
                    >
                        <Box
                            bg="white"
                            borderRadius="full"
                            p={user.hasStory && !isBlocked ? "3px" : "0"}
                            width="100%"
                            height="100%"
                        >
                            <Box
                                width="100%"
                                height="100%"
                                borderRadius="full"
                                overflow="hidden"
                            >
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                    filter={isBlocked ? "grayscale(100%) opacity(0.5)" : "none"}
                                />
                            </Box>
                        </Box>
                        {isOwnProfile && !user.hasStory && (
                            <Box
                                position="absolute"
                                bottom={{ base: "2px", md: "10px" }}
                                right={{ base: "2px", md: "10px" }}
                                bg="#0095f6"
                                borderRadius="full"
                                border="3px solid white"
                                width={{ base: "20px", md: "32px" }}
                                height={{ base: "20px", md: "32px" }}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                color="white"
                            >
                                <FiPlus size={18} strokeWidth={4} />
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Info Section */}
                <VStack align="start" gap={4} flex={1} width="100%">
                    <HStack gap={4} wrap="wrap" width="100%">
                        <Text fontSize="20px" fontWeight="400" color="black">
                            {user.username}
                        </Text>
                        {isOwnProfile ? (
                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    bg="#efefef"
                                    fontWeight="600"
                                    px={4}
                                    color="black"
                                    borderRadius="8px"
                                    _hover={{ bg: "#dbdbdb" }}
                                    onClick={() => navigate("/accounts/edit")}
                                >
                                    Edit profile
                                </Button>
                                <Button
                                    size="sm"
                                    bg="#efefef"
                                    fontWeight="600"
                                    px={4}
                                    color="black"
                                    borderRadius="8px"
                                    _hover={{ bg: "#dbdbdb" }}
                                    onClick={() => navigate("/archive")}
                                >
                                    View archive
                                </Button>
                                <Icon
                                    as={BsThreeDots}
                                    boxSize={6}
                                    cursor="pointer"
                                    color="black"
                                    onClick={() => setIsMoreOptionsOpen(true)}
                                />
                            </HStack>
                        ) : isBlocked ? (
                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    bg="#0095f6"
                                    color="white"
                                    fontWeight="600"
                                    px={6}
                                    borderRadius="8px"
                                    _hover={{ bg: "#1877f2" }}
                                    onClick={handleUnblock}
                                >
                                    Unblock
                                </Button>
                                <Icon
                                    as={BsThreeDots}
                                    boxSize={6}
                                    cursor="pointer"
                                    color="black"
                                    onClick={() => setIsMoreOptionsOpen(true)}
                                />
                            </HStack>
                        ) : (
                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    bg={user.isFollowing || user.isPending ? "#efefef" : "#0095f6"}
                                    color={user.isFollowing || user.isPending ? "black" : "white"}
                                    fontWeight="600"
                                    px={6}
                                    borderRadius="8px"
                                    _hover={{ bg: user.isFollowing || user.isPending ? "#dbdbdb" : "#1877f2" }}
                                    onClick={handleFollowToggle}
                                >
                                    {user.isFollowing ? "Following" : (user.isPending ? "Requested" : "Follow")}
                                </Button>
                                <Button
                                    size="sm"
                                    bg="#efefef"
                                    fontWeight="600"
                                    px={4}
                                    color="black"
                                    borderRadius="8px"
                                    _hover={{ bg: "#dbdbdb" }}
                                    onClick={handleMessageClick}
                                >
                                    Message
                                </Button>
                                <Icon
                                    as={BsThreeDots}
                                    boxSize={6}
                                    cursor="pointer"
                                    color="black"
                                    onClick={() => setIsMoreOptionsOpen(true)}
                                />
                            </HStack>
                        )}
                    </HStack>

                    <HStack gap={10}>
                        <Text fontSize="16px" color="black">
                            <Text as="span" fontWeight="600">
                                {isBlocked ? 0 : (user.postsCount || 0)}
                            </Text>{" "}
                            posts
                        </Text>
                        <Text
                            fontSize="16px"
                            color="black"
                            cursor={isBlocked ? "default" : "pointer"}
                            onClick={() => !isBlocked && handleOpenList("followers")}
                        >
                            <Text as="span" fontWeight="600">
                                {isBlocked ? 0 : (user.followersCount?.toLocaleString() || 0)}
                            </Text>{" "}
                            followers
                        </Text>
                        <Text
                            fontSize="16px"
                            color="black"
                            cursor={isBlocked ? "default" : "pointer"}
                            onClick={() => !isBlocked && handleOpenList("following")}
                        >
                            <Text as="span" fontWeight="600">
                                {isBlocked ? 0 : (user.followingCount?.toLocaleString() || 0)}
                            </Text>{" "}
                            following
                        </Text>
                    </HStack>

                    <VStack align="start" gap={0} width="100%">
                        <Text fontSize="14px" fontWeight="600" color="black">
                            {user.fullName}
                        </Text>
                        {!isBlocked && (
                            <>
                                <Text
                                    fontSize="14px"
                                    whiteSpace="pre-wrap"
                                    color="black"
                                    maxW="100%"
                                >
                                    {user.bio}
                                </Text>
                                {user.website && (
                                    <ChakraLink
                                        href={user.website}
                                        color="#00376b"
                                        fontWeight="600"
                                        fontSize="14px"
                                        isExternal
                                    >
                                        {user.website.replace("https://", "").replace("http://", "")}
                                    </ChakraLink>
                                )}
                            </>
                        )}
                    </VStack>
                </VStack>
            </div>

            {/* Story Player ONLY FOR ACTIVE STORIES */}
            <StoryModal
                isOpen={isStoryOpen}
                onClose={() => setIsStoryOpen(false)}
                highlights={activeStoryData}
                initialHighlightIndex={0}
            />

            <UserListModal
                isOpen={isListOpen}
                onClose={() => setIsListOpen(false)}
                title={listTitle}
                users={listUsers}
                listOwnerId={user.id}
            />

            {/* More Options Modal */}
            <MoreOptionsModal
                isOpen={isMoreOptionsOpen}
                onClose={() => setIsMoreOptionsOpen(false)}
                isProfile={true}
                isOwnProfile={isOwnProfile}
                user={user}
            />
        </>
    );
};

export default ProfileHeader;
