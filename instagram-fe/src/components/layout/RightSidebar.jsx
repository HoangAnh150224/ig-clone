import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Button, Link, Flex, Spinner } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import { useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import profileService from '../../services/profileService';
import userService from '../../services/userService';

const RightSidebar = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = userService.getCurrentUser();
  const myUsername = authUser?.username || currentUser.username;
  const myFullName = authUser?.fullName || currentUser.fullName;
  const myAvatar = authUser?.avatar || currentUser.avatar;

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await profileService.getSuggestions();
        setSuggestions(response);
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleUserClick = (username) => {
    navigate(`/${username}`);
  };

  const footerLinks = [
    { label: 'About', url: 'https://about.instagram.com/' },
    { label: 'Help', url: 'https://help.instagram.com/' },
    { label: 'Press', url: 'https://about.instagram.com/blog/' },
    { label: 'API', url: 'https://developers.facebook.com/docs/instagram' },
    { label: 'Jobs', url: 'https://about.instagram.com/about-us/careers' },
    { label: 'Privacy', url: 'https://privacycenter.instagram.com/policy/' },
    { label: 'Terms', url: 'https://help.instagram.com/581066165581870' },
    { label: 'Locations', url: 'https://www.instagram.com/explore/locations/' },
    { label: 'Language', url: '#' },
  ];

  return (
    <Box width="320px" display={{ base: "none", lg: "block" }} pt={6} px={4} bg="white">
      {/* Current User Section */}
      <HStack justify="space-between" mb={6} align="center">
        <HStack gap={4} cursor="pointer" onClick={() => handleUserClick(myUsername)}>
          <UserAvatar src={myAvatar} size="44px" />
          <VStack align="start" gap={0}>
            <Text fontSize="14px" fontWeight="600" color="black">{myUsername}</Text>
            <Text fontSize="14px" color="gray.500" fontWeight="400">{myFullName}</Text>
          </VStack>
        </HStack>
        <Button 
          variant="ghost" 
          color="#0095f6" 
          fontSize="12px" 
          fontWeight="600"
          p={0}
          height="auto"
          _hover={{ bg: "transparent", color: "blue.800" }}
        >
          Switch
        </Button>
      </HStack>

      {/* Suggestions Header */}
      <HStack justify="space-between" mb={4} align="center">
        <Text fontSize="14px" fontWeight="600" color="gray.500">Suggested for you</Text>
        <Button 
          variant="ghost" 
          color="black" 
          fontSize="12px" 
          fontWeight="600"
          p={0}
          height="auto"
          _hover={{ bg: "transparent", color: "gray.500" }}
        >
          See All
        </Button>
      </HStack>

      {/* Dynamic Suggestions List */}
      <VStack gap={4} align="stretch" mb={10}>
        {loading ? (
          <Flex justify="center" py={4}><Spinner size="sm" color="gray.300" /></Flex>
        ) : suggestions.length > 0 ? (
          suggestions.map((user) => (
            <HStack key={user.id} justify="space-between" align="center">
              <HStack gap={3} cursor="pointer" onClick={() => handleUserClick(user.username)}>
                <UserAvatar src={user.avatar} size="32px" />
                <VStack align="start" gap={0}>
                  <Text fontSize="14px" fontWeight="600" color="black">{user.username}</Text>
                  <Text fontSize="12px" color="gray.500" maxW="150px" isTruncated fontWeight="400">
                    {user.isVerified ? "Verified Account" : "Suggested for you"}
                  </Text>
                </VStack>
              </HStack>
              <Button 
                variant="ghost" 
                color="#0095f6" 
                fontSize="12px" 
                fontWeight="600"
                p={0}
                height="auto"
                _hover={{ bg: "transparent", color: "blue.800" }}
              >
                Follow
              </Button>
            </HStack>
          ))
        ) : (
          <Text fontSize="12px" color="gray.400">No suggestions available.</Text>
        )}
      </VStack>

      {/* Footer */}
      <Box mb={4}>
        <Flex flexWrap="wrap" gap="4px" align="center">
          {footerLinks.map((item, index) => (
            <React.Fragment key={item.label}>
              <Link 
                href={item.url}
                isExternal={item.url !== '#'}
                fontSize="12px" 
                color="gray.400" 
                fontWeight="400"
                _hover={{ textDecoration: "underline" }}
              >
                {item.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <Text color="gray.400" fontSize="12px">•</Text>
              )}
            </React.Fragment>
          ))}
        </Flex>
      </Box>
      <Text fontSize="12px" color="gray.400" fontWeight="400" textTransform="uppercase" letterSpacing="0.5px">
        © 2026 INSTAGRAM FROM META
      </Text>
    </Box>
  );
};

export default RightSidebar;
