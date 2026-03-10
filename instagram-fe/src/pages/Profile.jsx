import React, { useEffect, useState } from 'react';
import { Box, Container, Spinner, Center, VStack, Text, Link as ChakraLink } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import PostGrid from '../components/profile/PostGrid';
import ProfileHighlights from '../components/profile/ProfileHighlights';
import profileService from '../api/profileService';
import { setUserProfile, setProfilePosts, setLoading } from '../store/slices/userSlice';

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { userProfile, posts, loading } = useSelector((state) => state.user);
  const { user: authUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = authUser?.username === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      dispatch(setLoading(true));
      try {
        const [profileRes, postsRes] = await Promise.all([
          profileService.getUserProfile(username),
          profileService.getUserPosts(username)
        ]);
        dispatch(setUserProfile(profileRes.data));
        dispatch(setProfilePosts(postsRes.data));
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProfileData();
  }, [username, dispatch]);

  if (loading && !userProfile) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="gray.400" thickness="3px" />
      </Center>
    );
  }

  if (!userProfile && !loading) {
    return (
      <VStack h="50vh" justify="center" gap={4}>
        <Text fontSize="2xl" fontWeight="bold">Sorry, this page isn't available.</Text>
        <Text color="gray.500">The link you followed may be broken, or the page may have been removed.</Text>
        <ChakraLink href="/" color="blue.900" fontWeight="bold">Go back to Instagram.</ChakraLink>
      </VStack>
    );
  }

  return (
    <Container maxW="935px" p={0} bg="white" color="black">
      <ProfileHeader user={userProfile} />
      
      {/* Profile Highlights Section */}
      <ProfileHighlights isOwnProfile={isOwnProfile} />
      
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Box py={4}>
        {activeTab === 'posts' && <PostGrid posts={posts} loading={loading} />}
        {activeTab === 'saved' && (
          <Center py={20} color="gray.500">
            Saved posts are only visible to you.
          </Center>
        )}
        {activeTab === 'tagged' && (
          <Center py={20} color="gray.500">
            No photos of you.
          </Center>
        )}
      </Box>
    </Container>
  );
};

export default Profile;
