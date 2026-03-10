import React, { useState } from 'react';
import { Box, Flex, VStack, Text, HStack, Button, Image, Input, Textarea, Divider } from '@chakra-ui/react';
import UserAvatar from '../components/common/UserAvatar';
import { LuLock, LuShieldAlert, LuUserPlus, LuChevronRight } from "react-icons/lu";
import userService from '../services/userService';

const SettingsItem = ({ icon: Icon, label, isActive, onClick }) => (
  <HStack
    px={6} py={3} cursor="pointer" bg={isActive ? "gray.50" : "transparent"}
    _hover={{ bg: "gray.50" }} onClick={onClick} borderLeft={isActive ? "2px solid black" : "none"}
  >
    <Box as={Icon} size={20} />
    <Text fontSize="14px" fontWeight={isActive ? "bold" : "400"}>{label}</Text>
  </HStack>
);

const Settings = () => {
  const currentUser = userService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('edit-profile');
  const [isPrivate, setIsPrivate] = useState(currentUser.privacy.isPrivateAccount);
  const [blockedUsers, setBlockedUsers] = useState(currentUser.social.blockedUsers);

  const unblockUser = (id) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== id));
  };

  return (
    <Flex maxW="935px" mx="auto" mt={8} border="1px solid" borderColor="gray.200" minH="80vh" bg="white">
      {/* Sidebar Cài đặt */}
      <Box width="250px" borderRight="1px solid" borderColor="gray.200" py={4}>
        <Text px={6} py={4} fontWeight="bold" fontSize="xl">Settings</Text>
        <VStack align="stretch" gap={0}>
          <SettingsItem icon={LuUserPlus} label="Edit profile" isActive={activeTab === 'edit-profile'} onClick={() => setActiveTab('edit-profile')} />
          <SettingsItem icon={LuLock} label="Privacy and security" isActive={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} />
          <SettingsItem icon={LuShieldAlert} label="Blocking" isActive={activeTab === 'blocking'} onClick={() => setActiveTab('blocking')} />
        </VStack>
      </Box>

      {/* Nội dung Cài đặt */}
      <Box flex={1} p={8} bg="white" color="black">
        {activeTab === 'edit-profile' && (
          <VStack align="stretch" gap={8} maxW="500px">
            <Text fontSize="20px" fontWeight="bold">Edit profile</Text>
            <HStack gap={4}>
              <UserAvatar src={currentUser.avatar} size="38px" />
              <VStack align="start" gap={0}>
                <Text fontWeight="bold" fontSize="14px">{currentUser.username}</Text>
                <Text color="#0095f6" fontSize="14px" fontWeight="bold" cursor="pointer">Change profile photo</Text>
              </VStack>
            </HStack>
            <Box>
              <Text fontWeight="bold" mb={2}>Website</Text>
              <Input defaultValue={currentUser.website} bg="gray.50" border="1px solid" borderColor="gray.200" fontSize="14px" />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Bio</Text>
              <Textarea defaultValue={currentUser.bio} bg="gray.50" border="1px solid" borderColor="gray.200" fontSize="14px" />
            </Box>
            <Button bg="#0095f6" color="white" w="fit-content" px={6} borderRadius="8px">Submit</Button>
          </VStack>
        )}

        {activeTab === 'privacy' && (
          <VStack align="stretch" gap={8} maxW="500px">
            <Text fontSize="20px" fontWeight="bold">Privacy and security</Text>
            <Flex justify="space-between" align="center">
              <VStack align="start" gap={0}>
                <Text fontWeight="bold">Private Account</Text>
                <Text fontSize="sm" color="gray.500">When your account is private, only people you approve can see your photos and videos on Instagram.</Text>
              </VStack>
              <Box
                as="button" p={1} width="40px" borderRadius="full"
                bg={isPrivate ? "black" : "gray.200"} transition="0.3s"
                onClick={() => setIsPrivate(!isPrivate)}
              >
                <Box boxSize="16px" bg="white" borderRadius="full" transform={isPrivate ? "translateX(18px)" : "translateX(0)"} transition="0.3s" />
              </Box>
            </Flex>
          </VStack>
        )}

        {activeTab === 'blocking' && (
          <VStack align="stretch" gap={6} maxW="500px">
            <Text fontSize="20px" fontWeight="bold">Blocking</Text>
            <Text fontSize="sm" color="gray.500">Once you block someone, that person can no longer see your profile or posts.</Text>
            <VStack align="stretch" gap={4} mt={4}>
              {blockedUsers.map(user => (
                <Flex key={user.id} align="center" justify="space-between">
                  <HStack gap={3}>
                    <UserAvatar src={user.avatar} size="44px" />
                    <Text fontWeight="bold">{user.username}</Text>
                  </HStack>
                  <Button size="sm" onClick={() => unblockUser(user.id)} borderRadius="8px">Unblock</Button>
                </Flex>
              ))}
            </VStack>
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default Settings;
