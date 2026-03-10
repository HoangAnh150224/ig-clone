import { Box, Flex, VStack, HStack, Text, Button, Image, Icon, Link as ChakraLink } from '@chakra-ui/react';
import { BsGearWide } from 'react-icons/bs';

const ProfileHeader = ({ user }) => {
  if (!user) return null;

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 20 }} py={8} px={4} align="center">
      {/* Avatar Section */}
      <Box flexShrink={0}>
        <Box 
          width={{ base: "77px", md: "150px" }} 
          height={{ base: "77px", md: "150px" }} 
          borderRadius="full" 
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <Image src={user.avatar} alt={user.username} w="100%" h="100%" objectFit="cover" />
        </Box>
      </Box>

      {/* Info Section */}
      <VStack align="start" gap={6} flex={1}>
        {/* Row 1: Username & Actions */}
        <HStack gap={4} wrap="wrap">
          <Text fontSize="xl" fontWeight="regular">{user.username}</Text>
          {user.isOwnProfile ? (
            <HStack gap={2}>
              <Button size="sm" bg="gray.100" _hover={{ bg: "gray.200" }} fontWeight="bold" px={4} color="black">
                Edit profile
              </Button>
              <Button size="sm" bg="gray.100" _hover={{ bg: "gray.200" }} fontWeight="bold" px={4} color="black">
                View archive
              </Button>
              <Icon as={BsGearWide} boxSize={5} cursor="pointer" />
            </HStack>
          ) : (
            <HStack gap={2}>
              <Button size="sm" bg="brand.blue" color="white" _hover={{ bg: "blue.500" }} fontWeight="bold" px={6}>
                Follow
              </Button>
              <Button size="sm" bg="gray.100" _hover={{ bg: "gray.200" }} fontWeight="bold" px={4} color="black">
                Message
              </Button>
            </HStack>
          )}
        </HStack>

        {/* Row 2: Stats */}
        <HStack gap={10} display={{ base: "none", md: "flex" }}>
          <Text fontSize="md"><Text as="span" fontWeight="bold">{user.postCount}</Text> posts</Text>
          <Text fontSize="md"><Text as="span" fontWeight="bold">{user.followerCount?.toLocaleString() || 0}</Text> followers</Text>
          <Text fontSize="md"><Text as="span" fontWeight="bold">{user.followingCount?.toLocaleString() || 0}</Text> following</Text>
        </HStack>

        {/* Row 3: Bio */}
        <VStack align="start" gap={0}>
          <Text fontSize="sm" fontWeight="bold">{user.fullName}</Text>
          <Text fontSize="sm" whiteSpace="pre-wrap">{user.bio}</Text>
          {user.website && (
            <ChakraLink href={user.website} color="blue.900" fontWeight="bold" fontSize="sm" isExternal>
              {user.website.replace('https://', '')}
            </ChakraLink>
          )}
        </VStack>
      </VStack>
    </Flex>
  );
};

export default ProfileHeader;
