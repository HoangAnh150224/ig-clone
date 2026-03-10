import React from 'react';
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
  VStack
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import UserAvatar from "../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserListModal = ({ isOpen, onClose, title, users, isOwnContext = false }) => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);

  const handleUserClick = (username) => {
    onClose();
    navigate(`/${username}`);
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => { if (!e.open) onClose(); }}
      placement="center"
    >
      <DialogBackdrop bg="blackAlpha.600" />
      <DialogPositioner>
        <DialogContent 
          maxW="400px" width="90vw" maxHeight="400px" 
          bg="white" color="black" borderRadius="12px" overflow="hidden"
        >
          {/* Header */}
          <Flex p={3} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
            <Box width="32px" /> {/* Spacer */}
            <Text fontWeight="bold" fontSize="16px">{title}</Text>
            <Box cursor="pointer" onClick={onClose} p={1}>
              <AiOutlineClose size={20} />
            </Box>
          </Flex>

          <DialogBody p={0} overflowY="auto">
            <VStack align="stretch" gap={0} py={2}>
              {users && users.length > 0 ? (
                users.map((user) => {
                  const isMe = user.id === authUser?.id || user.username === authUser?.username;
                  const isFollowersList = title === "Followers";
                  const isFollowingList = title === "Following";
                  const isLikesList = title === "Likes";

                  return (
                    <Flex 
                      key={user.id || user.username} px={4} py={2} align="center" justify="space-between" 
                      _hover={{ bg: "gray.50" }} transition="0.2s"
                    >
                      <HStack gap={3} cursor="pointer" onClick={() => handleUserClick(user.username)}>
                        <UserAvatar src={user.avatar} size="44px" />
                        <VStack align="start" gap={0}>
                          <Text fontSize="14px" fontWeight="bold">{user.username}</Text>
                          <Text fontSize="14px" color="gray.500">{user.fullName}</Text>
                        </VStack>
                      </HStack>

                      {/* Logic hiển thị nút điều khiển */}
                      {((isLikesList && isMe) || (isFollowersList && isOwnContext)) && (
                        <Box 
                          as="button" bg="#efefef" px={4} py={1.5} borderRadius="8px" 
                          fontSize="14px" fontWeight="bold" _hover={{ bg: "#dbdbdb" }}
                        >
                          Remove
                        </Box>
                      )}

                      {(isFollowingList && isOwnContext) && (
                        <Box 
                          as="button" bg="#efefef" px={4} py={1.5} borderRadius="8px" 
                          fontSize="14px" fontWeight="bold" _hover={{ bg: "#dbdbdb" }}
                        >
                          Following
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
