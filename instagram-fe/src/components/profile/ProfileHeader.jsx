import React, { useState } from 'react';
import { Box, Flex, VStack, HStack, Text, Button, Image, Icon, Link as ChakraLink } from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import StoryModal from '../modals/StoryModal';
import UserListModal from '../modals/UserListModal';
import MoreOptionsModal from '../modals/MoreOptionsModal';
import userService from '../../services/userService';
import { updateUserProfile } from '../../store/slices/userSlice';

const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listUsers, setListUsers] = useState([]);

  if (!user) return null;

  const handleFollow = async () => {
    try {
      await userService.followUser(user.id);
      dispatch(updateUserProfile({
        isFollowing: true,
        followerCount: user.followerCount + 1
      }));
    } catch (error) {
      console.error("Follow failed", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await userService.unfollowUser(user.id);
      dispatch(updateUserProfile({
        isFollowing: false,
        followerCount: user.followerCount - 1
      }));
    } catch (error) {
      console.error("Unfollow failed", error);
    }
  };

  const handleAvatarClick = () => {
    // ONLY OPEN IF THERE ARE NEW STORIES (Active Story)
    if (user.hasStory && user.stories?.length > 0) {
      setIsStoryOpen(true);
    }
  };

  const handleOpenList = async (type) => {
    try {
      if (type === 'followers') {
        setListTitle('Followers');
        const followers = await userService.getFollowersList(user.id);
        setListUsers(followers);
      } else {
        setListTitle('Following');
        const following = await userService.getFollowingList(user.id);
        setListUsers(following);
      }
      setIsListOpen(true);
    } catch (error) {
      console.error("Failed to open user list", error);
    }
  };

  const handleMessageClick = () => {
    navigate('/direct/inbox');
  };

  // STORY DATA ONLY CONTAINS NEW STORIES, NO HIGHLIGHTS
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
                <Button 
                  size="sm" 
                  bg="#efefef" 
                  fontWeight="600" 
                  px={4} 
                  color="black" 
                  borderRadius="8px" 
                  _hover={{ bg: "#dbdbdb" }}
                  onClick={() => navigate('/accounts/edit')}
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
                  onClick={() => navigate('/archive/stories')}
                >
                  View archive
                </Button>
                <Icon as={BsThreeDots} boxSize={6} cursor="pointer" color="black" onClick={() => setIsMoreOptionsOpen(true)} />
              </HStack>
            ) : (
              <HStack gap={2}>
                {user.isFollowing ? (
                  <Button 
                    size="sm" bg="#efefef" color="black" fontWeight="600" px={6} 
                    borderRadius="8px" _hover={{ bg: "#dbdbdb" }} onClick={handleUnfollow}
                  >
                    Following
                  </Button>
                ) : (
                  <Button 
                    size="sm" bg="#0095f6" color="white" fontWeight="600" px={6} 
                    borderRadius="8px" _hover={{ bg: "#1877f2" }} onClick={handleFollow}
                  >
                    Follow
                  </Button>
                )}
                <Button size="sm" bg="#efefef" fontWeight="600" px={4} color="black" borderRadius="8px" _hover={{ bg: "#dbdbdb" }} onClick={handleMessageClick}>
                  Message
                </Button>
                <Icon as={BsThreeDots} boxSize={6} cursor="pointer" color="black" onClick={() => setIsMoreOptionsOpen(true)} />
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
        isOwnContext={user.isOwnProfile}
      />

      {/* More Options Modal */}
      <MoreOptionsModal 
        isOpen={isMoreOptionsOpen} 
        onClose={() => setIsMoreOptionsOpen(false)} 
        isProfile={true}
        isOwnProfile={user.isOwnProfile}
        user={user}
      />
    </>
  );
};

export default ProfileHeader;
