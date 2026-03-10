import React, { useState } from 'react';
import { Box, Flex, VStack, HStack, Text, Button, Image, Icon, Link as ChakraLink } from '@chakra-ui/react';
import { BsGearWide } from 'react-icons/bs';
import StoryModal from '../modals/StoryModal';

const ProfileHeader = ({ user }) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  if (!user) return null;

  const handleAvatarClick = () => {
    if (user.hasStory) {
      setIsStoryOpen(true);
    }
  };

  return (
    <>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 20 }} py={8} px={4} align="center">
        {/* Avatar Section */}
        <Box flexShrink={0}>
          <Box 
            width={{ base: "84px", md: "168px" }} 
            height={{ base: "84px", md: "168px" }} 
            borderRadius="full" 
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            cursor={user.hasStory ? "pointer" : "default"}
            p="4px" // Độ dày của viền gradient
            onClick={handleAvatarClick}
            bg={user.hasStory ? "linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)" : "transparent"}
            border={!user.hasStory ? "1px solid" : "none"}
            borderColor="gray.200"
          >
            <Box 
              bg="white" 
              borderRadius="full" 
              p={user.hasStory ? "3px" : "0"} 
              width="100%" 
              height="100%"
            >
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
                <Button size="sm" bg="#efefef" _hover={{ bg: "#dbdbdb" }} fontWeight="600" px={4} color="black" borderRadius="8px">
                  Edit profile
                </Button>
                <Button size="sm" bg="#efefef" _hover={{ bg: "#dbdbdb" }} fontWeight="600" px={4} color="black" borderRadius="8px">
                  View archive
                </Button>
                <Icon as={BsGearWide} boxSize={6} cursor="pointer" color="black" />
              </HStack>
            ) : (
              <HStack gap={2}>
                <Button size="sm" bg="#0095f6" color="white" _hover={{ bg: "#1877f2" }} fontWeight="600" px={6} borderRadius="8px">
                  Follow
                </Button>
                <Button size="sm" bg="#efefef" _hover={{ bg: "#dbdbdb" }} fontWeight="600" px={4} color="black" borderRadius="8px">
                  Message
                </Button>
              </HStack>
            )}
          </HStack>

          <HStack gap={10} display={{ base: "none", md: "flex" }}>
            <Text fontSize="16px" color="black"><Text as="span" fontWeight="600">{user.postCount}</Text> posts</Text>
            <Text fontSize="16px" color="black"><Text as="span" fontWeight="600">{user.followerCount?.toLocaleString() || 0}</Text> followers</Text>
            <Text fontSize="16px" color="black"><Text as="span" fontWeight="600">{user.followingCount?.toLocaleString() || 0}</Text> following</Text>
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

      {/* Story Player */}
      <StoryModal 
        isOpen={isStoryOpen} 
        onClose={() => setIsStoryOpen(false)} 
        user={user} 
      />
    </>
  );
};

export default ProfileHeader;
