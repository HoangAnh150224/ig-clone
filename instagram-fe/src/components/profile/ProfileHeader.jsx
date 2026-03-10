import React, { useState } from 'react';
import { Box, Flex, VStack, HStack, Text, Button, Image, Icon, Link as ChakraLink } from '@chakra-ui/react';
import { BsGearWide } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import StoryModal from '../modals/StoryModal';
import UserListModal from '../modals/UserListModal';
import { userRelationsDB } from '../../api/dummyData';

const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listUsers, setListUsers] = useState([]);

  if (!user) return null;

  const handleAvatarClick = () => {
    // CHỈ MỞ NẾU CÓ TIN MỚI (Active Story)
    if (user.hasStory && user.stories?.length > 0) {
      setIsStoryOpen(true);
    }
  };

  const handleOpenList = (type) => {
    const data = userRelationsDB[user.id] || { followers: [], following: [] };
    if (type === 'followers') {
      setListTitle('Followers');
      setListUsers(data.followers);
    } else {
      setListTitle('Following');
      setListUsers(data.following);
    }
    setIsListOpen(true);
  };

  const handleMessageClick = () => {
    navigate('/direct/inbox');
  };

  // DỮ LIỆU STORY CHỈ CHỨA TIN MỚI, KHÔNG CHỨA HIGHLIGHTS
  const activeStoryData = user.hasStory ? [{
    id: 'active-story',
    title: 'Story',
    user: user,
    stories: user.stories
  }] : [];

  return (
    <>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 20 }} py={8} px={4} align="center">
        {/* Avatar Section */}
        <Box flexShrink={0}>
          <Box 
            width={{ base: "84px", md: "168px" }} height={{ base: "84px", md: "168px" }} borderRadius="full" 
            display="flex" alignItems="center" justifyContent="center" position="relative"
            cursor={user.hasStory ? "pointer" : "default"} p="4px" onClick={handleAvatarClick}
            bg={user.hasStory ? "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" : "transparent"}
            border={!user.hasStory ? "1px solid" : "none"} borderColor="gray.200"
          >
            <Box bg="white" borderRadius="full" p={user.hasStory ? "3px" : "0"} width="100%" height="100%">
              <Box width="100%" height="100%" borderRadius="full" overflow="hidden">
                <Image src={user.avatar} alt={user.username} w="100%" h="100%" objectFit="cover" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Info Section */}
        <VStack align="start" gap={6} flex={1}>
          <HStack gap={4} wrap="wrap">
            <Text fontSize="20px" fontWeight="400" color="black">{user.username}</Text>
            {user.isOwnProfile ? (
              <HStack gap={2}>
                <Button size="sm" bg="#efefef" fontWeight="600" px={4} color="black" borderRadius="8px" _hover={{ bg: "#dbdbdb" }}>Edit profile</Button>
                <Button size="sm" bg="#efefef" fontWeight="600" px={4} color="black" borderRadius="8px" _hover={{ bg: "#dbdbdb" }}>View archive</Button>
                <Icon as={BsGearWide} boxSize={6} cursor="pointer" color="black" />
              </HStack>
            ) : (
              <HStack gap={2}>
                {user.isFollowing ? (
                  <Button size="sm" bg="#efefef" color="black" fontWeight="600" px={6} borderRadius="8px" _hover={{ bg: "#dbdbdb" }}>Following</Button>
                ) : (
                  <Button size="sm" bg="#0095f6" color="white" fontWeight="600" px={6} borderRadius="8px" _hover={{ bg: "#1877f2" }}>Follow</Button>
                )}
                <Button size="sm" bg="#efefef" fontWeight="600" px={4} color="black" borderRadius="8px" _hover={{ bg: "#dbdbdb" }} onClick={handleMessageClick}>
                  Message
                </Button>
              </HStack>
            )}
          </HStack>

          <HStack gap={10} display={{ base: "none", md: "flex" }}>
            <Text fontSize="16px" color="black"><Text as="span" fontWeight="600">{user.postCount}</Text> posts</Text>
            <Text fontSize="16px" color="black" cursor="pointer" onClick={() => handleOpenList('followers')}>
              <Text as="span" fontWeight="600">{user.followerCount?.toLocaleString() || 0}</Text> followers
            </Text>
            <Text fontSize="16px" color="black" cursor="pointer" onClick={() => handleOpenList('following')}>
              <Text as="span" fontWeight="600">{user.followingCount?.toLocaleString() || 0}</Text> following
            </Text>
          </HStack>

          <VStack align="start" gap={0}>
            <Text fontSize="14px" fontWeight="600" color="black">{user.fullName}</Text>
            <Text fontSize="14px" whiteSpace="pre-wrap" color="black">{user.bio}</Text>
            {user.website && (
              <ChakraLink href={user.website} color="#00376b" fontWeight="600" fontSize="14px" isExternal>
                {user.website.replace('https://', '')}
              </ChakraLink>
            )}
          </VStack>
        </VStack>
      </Flex>

      {/* Story Player CHỈ DÀNH CHO ACTIVE STORIES */}
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
        isOwnContext={user.isOwnProfile}
      />
    </>
  );
};

export default ProfileHeader;
