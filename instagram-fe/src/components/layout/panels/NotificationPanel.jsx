import React from 'react';
import { Box, Text, VStack, Flex } from '@chakra-ui/react';
import UserAvatar from '../../common/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../../api/dummyData'; // Sửa đường dẫn

const Button = ({ children, bg, color, px, py, borderRadius, fontSize, fontWeight, ...props }) => (
  <Box 
    as="button" bg={bg} color={color} px={px} py={py} 
    borderRadius={borderRadius} fontSize={fontSize} fontWeight={fontWeight} 
    _hover={{ opacity: 0.8 }} 
    transition="all 0.2s"
    {...props}
  >
    {children}
  </Box>
);

const NotificationPanel = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigate = (username) => {
    navigate(`/${username}`);
  };

  return (
    <Box
      position="fixed" left="72px" top={0} height="100vh" width="397px" bg="white"
      zIndex={90} p={4} color="black"
      transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
      opacity={isOpen ? 1 : 0}
      visibility={isOpen ? "visible" : "hidden"}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Text fontSize="24px" fontWeight="bold" mb={6} mt={2} color="black">Notifications</Text>
      
      <VStack align="stretch" gap={5} overflowY="auto" maxH="calc(100vh - 100px)">
        <Text fontWeight="bold" color="black">Recent</Text>
        
        {notifications.map(notif => (
          <Flex 
            key={notif.id} align="center" gap={3} cursor="pointer" p={2} 
            borderRadius="md" _hover={{ bg: "gray.50" }} transition="background 0.2s"
            onClick={() => handleNavigate(notif.user.username)}
          >
            <UserAvatar src={notif.user.avatar} size="44px" />
            <Box flex={1}>
              <Text fontSize="sm" color="black">
                <Text as="span" fontWeight="bold" color="black">{notif.user.username}</Text> {notif.content}
                <Text as="span" color="gray.500" ml={1}>{notif.timeAgo}</Text>
              </Text>
            </Box>
            {notif.type === 'follow' && (
              <Button 
                bg="#0095f6" color="white" px={4} py={1} 
                borderRadius="8px" fontSize="sm" fontWeight="bold"
                onClick={(e) => e.stopPropagation()}
              >
                Follow
              </Button>
            )}
            {notif.type === 'like' && (
               <Box boxSize="44px" bg="gray.100" borderRadius="md" />
            )}
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default NotificationPanel;
