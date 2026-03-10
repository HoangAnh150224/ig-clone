import React, { useEffect, useState } from 'react';
import { Box, HStack, VStack, Text, Button, Link, Flex, Spinner } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../../api/dummyData';
import profileService from '../../api/profileService';

const RightSidebar = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const myUsername = authUser?.username || currentUser.username;
  const myFullName = authUser?.fullName || currentUser.fullName;
  const myAvatar = authUser?.avatar || currentUser.avatar;

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await profileService.getSuggestions();
        setSuggestions(response.data);
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

  return (
    <Box width="320px" display={{ base: "none", lg: "block" }} pt={4} bg="white">
      {/* Current User */}
      <HStack justify="space-between" mb={4} bg="white">
        <HStack gap={3} cursor="pointer" onClick={() => handleUserClick(myUsername)}>
          <UserAvatar src={myAvatar} size="44px" />
          <VStack align="start" gap={0}>
            <Text fontSize="14px" fontWeight="bold" color="black">{myUsername}</Text>
            <Text fontSize="14px" color="gray.500">{myFullName}</Text>
          </VStack>
        </HStack>
        <Button variant="ghost" color="#0095f6" fontSize="12px" fontWeight="bold">Switch</Button>
      </HStack>

      {/* Suggestions Header */}
      <HStack justify="space-between" mb={4}>
        <Text fontSize="14px" fontWeight="bold" color="gray.500">Suggested for you</Text>
        <Button variant="ghost" color="black" fontSize="12px" fontWeight="bold">See All</Button>
      </HStack>

      {/* Dynamic Suggestions List */}
      <VStack gap={3} align="stretch" mb={8}>
        {loading ? (
          <Flex justify="center" py={4}><Spinner size="sm" color="gray.300" /></Flex>
        ) : suggestions.length > 0 ? (
          suggestions.map((user) => (
            <HStack key={user.id} justify="space-between">
              <HStack gap={3} cursor="pointer" onClick={() => handleUserClick(user.username)}>
                <UserAvatar src={user.avatar} size="32px" />
                <VStack align="start" gap={0}>
                  <Text fontSize="14px" fontWeight="bold" color="black">{user.username}</Text>
                  <Text fontSize="12px" color="gray.500" maxW="150px" isTruncated>
                    {user.isVerified ? "Verified Account" : "Suggested for you"}
                  </Text>
                </VStack>
              </HStack>
              <Button variant="ghost" color="#0095f6" fontSize="12px" fontWeight="bold">Follow</Button>
            </HStack>
          ))
        ) : (
          <Text fontSize="12px" color="gray.400">No suggestions available.</Text>
        )}
      </VStack>

      {/* Footer */}
      <Box fontSize="12px" color="#c7c7c7" mb={4}>
        <Flex gap={2} wrap="wrap">
          <Link href="#">About</Link><Link href="#">Help</Link><Link href="#">Press</Link>
          <Link href="#">API</Link><Link href="#">Jobs</Link><Link href="#">Privacy</Link>
          <Link href="#">Terms</Link><Link href="#">Locations</Link><Link href="#">Language</Link>
        </Flex>
      </Box>
      <Text fontSize="12px" color="#c7c7c7">© 2026 INSTAGRAM FROM ANTIGRAVITY</Text>
    </Box>
  );
};

export default RightSidebar;
