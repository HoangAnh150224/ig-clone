import React from 'react';
import { Box, HStack, VStack, Text, Button, Link, Flex } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import { useSelector } from 'react-redux';

const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const suggestions = [
    { id: 1, username: 'react_dev', subtitle: 'Followed by ronaldo + 2 more' },
    { id: 2, username: 'spring_boot_master', subtitle: 'Suggested for you' },
    { id: 3, username: 'pixel_perfection', subtitle: 'New to Instagram' },
    { id: 4, username: 'vibe_coder', subtitle: 'Followed by nasa' },
  ];

  return (
    <Box width="320px" display={{ base: "none", lg: "block" }} pt={4} bg="white">
      {/* Current User Profile */}
      <HStack justify="space-between" mb={4} bg="white">
        <HStack gap={3}>
          <UserAvatar src={user?.avatar || 'https://i.pravatar.cc/150?u=antigravity'} size="44px" />
          <VStack align="start" gap={0}>
            <Text fontSize="sm" fontWeight="bold" color="black">{user?.username || 'antigravity_dev'}</Text>
            <Text fontSize="sm" color="gray.500">{user?.fullName || 'Antigravity Developer'}</Text>
          </VStack>
        </HStack>
        <Button variant="link" color="#0095f6" fontSize="xs" fontWeight="bold">
          Switch
        </Button>
      </HStack>

      {/* Suggestions Header */}
      <HStack justify="space-between" mb={4}>
        <Text fontSize="sm" fontWeight="bold" color="gray.500">Suggested for you</Text>
        <Button variant="link" color="black" fontSize="xs" fontWeight="bold" _hover={{ color: "gray.500" }}>See All</Button>
      </HStack>

      {/* Suggestions List */}
      <VStack gap={3} align="stretch" mb={8}>
        {suggestions.map((s) => (
          <HStack key={s.id} justify="space-between">
            <HStack gap={3}>
              <UserAvatar src={`https://i.pravatar.cc/150?u=${s.username}`} size="32px" />
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="bold" color="black">{s.username}</Text>
                <Text fontSize="xs" color="gray.500" maxW="150px" isTruncated>{s.subtitle}</Text>
              </VStack>
            </HStack>
            <Button variant="link" color="#0095f6" fontSize="xs" fontWeight="bold">
              Follow
            </Button>
          </HStack>
        ))}
      </VStack>

      {/* Footer Links */}
      <Box fontSize="xs" color="gray.300" mb={4}>
        <Flex gap={2} wrap="wrap">
          <Link href="#">About</Link>
          <Link href="#">Help</Link>
          <Link href="#">Press</Link>
          <Link href="#">API</Link>
          <Link href="#">Jobs</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
        </Flex>
      </Box>
      <Text fontSize="xs" color="gray.300" fontWeight="semibold">© 2026 INSTAGRAM FROM ANTIGRAVITY</Text>
    </Box>
  );
};

export default RightSidebar;
