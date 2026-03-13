import React from "react";
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
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import UserAvatar from "../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import profileService from "../../services/profileService";

const UserListModal = ({
    isOpen,
    onClose,
    title,
    users: initialUsers = [],
    listOwnerId, // ID of the user whose list is being shown
}) => {
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth.user);
    const [users, setUsers] = React.useState(initialUsers);

    React.useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleUserClick = (username) => {
        onClose();
        navigate(`/${username}`);
    };

    const handleFollowToggle = async (userId) => {
        try {
            // Optimistic update
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
            ));
            await profileService.toggleFollow(userId);
        } catch (error) {
            console.error("Failed to toggle follow", error);
            // Rollback on error
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u
            ));
        }
    };

    const handleRemoveFollower = async (userId) => {
        if (window.confirm("Are you sure you want to remove this follower?")) {
            try {
                await profileService.removeFollower(userId);
                setUsers(prev => prev.filter(u => u.id !== userId));
            } catch (error) {
                console.error("Failed to remove follower", error);
            }
        }
    };

    const isMyFollowersList = title === "Followers" && (!listOwnerId || listOwnerId === authUser?.id);

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onClose();
            }}
            placement="center"
        >
            <DialogBackdrop bg="blackAlpha.600" />
            <DialogPositioner>
                <DialogContent
                    maxW="400px"
                    width="90vw"
                    maxHeight="400px"
                    bg="white"
                    color="black"
                    borderRadius="12px"
                    overflow="hidden"
                >
                    {/* Header */}
                    <Flex
                        p={3}
                        justify="space-between"
                        align="center"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                    >
                        <Box width="32px" />
                        <Text fontWeight="bold" fontSize="16px">
                            {title}
                        </Text>
                        <Box cursor="pointer" onClick={onClose} p={1}>
                            <AiOutlineClose size={20} />
                        </Box>
                    </Flex>

                    <DialogBody p={0} overflowY="auto">
                        <VStack align="stretch" gap={0} py={2}>
                            {users && users.length > 0 ? (
                                users.map((user) => {
                                    const isMe = user.id === authUser?.id;
                                    const isFollowing = user.isFollowing;

                                    return (
                                        <Flex
                                            key={user.id || user.username}
                                            px={4}
                                            py={2}
                                            align="center"
                                            justify="space-between"
                                            _hover={{ bg: "gray.50" }}
                                            transition="0.2s"
                                        >
                                            <HStack
                                                gap={3}
                                                cursor="pointer"
                                                onClick={() => handleUserClick(user.username)}
                                            >
                                                <UserAvatar src={user.avatarUrl} size="44px" />
                                                <VStack align="start" gap={0} minW={0}>
                                                    <Text fontSize="14px" fontWeight="bold" isTruncated maxW="180px">
                                                        {user.username}
                                                    </Text>
                                                    <Text fontSize="14px" color="gray.500" isTruncated maxW="180px">
                                                        {user.fullName}
                                                    </Text>
                                                </VStack>
                                            </HStack>

                                            {!isMe && (
                                                <Box
                                                    as="button"
                                                    bg={isMyFollowersList ? "#efefef" : (isFollowing ? "#efefef" : "#0095f6")}
                                                    color={isMyFollowersList ? "black" : (isFollowing ? "black" : "white")}
                                                    px={4}
                                                    py={1.5}
                                                    borderRadius="8px"
                                                    fontSize="14px"
                                                    fontWeight="bold"
                                                    onClick={() => isMyFollowersList ? handleRemoveFollower(user.id) : handleFollowToggle(user.id)}
                                                >
                                                    {isMyFollowersList ? "Remove" : (isFollowing ? "Following" : "Follow")}
                                                </Box>
                                            )}
                                        </Flex>
                                    );
                                })
                            ) : (
                                <Flex h="100px" align="center" justify="center">
                                    <Text color="gray.500">No users found.</Text>
                                </Flex>
                            )}
                        </VStack>
                    </DialogBody>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};

export default UserListModal;
