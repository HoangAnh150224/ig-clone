import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Flex, Image, Center } from '@chakra-ui/react';
import { AiOutlineHeart } from 'react-icons/ai';
import UserAvatar from '../../common/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../../../api/dummyData';
import NotificationSkeleton from '../../skeletons/NotificationSkeleton';

const NotificationPanel = ({ isOpen }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sections = ['Today', 'Yesterday', 'Earlier'];
  const groupedNotifications = sections.reduce((acc, section) => {
    acc[section] = notifications.filter(n => n.section === section);
    return acc;
  }, {});

  return (
    <Box
      position="fixed" left="72px" top={0} height="100vh" width="397px" bg="white"
      zIndex={90} p={4} color="black"
      transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
      opacity={isOpen ? 1 : 0}
      visibility={isOpen ? "visible" : "hidden"}
      transition="all(0.3s cubic-bezier(0.4, 0, 0.2, 1))"
      boxShadow="20px 0 20px -20px rgba(0,0,0,0.1)"
      borderRight="1px solid" borderColor="gray.100"
    >
      <Text fontSize="24px" fontWeight="bold" mb={6} mt={2} color="black">Notifications</Text>
      
      <Box overflowY="auto" maxH="calc(100vh - 80px)" css={{ '&::-webkit-scrollbar': { width: '0px' } }}>
        {loading ? (
          <NotificationSkeleton />
        ) : notifications.length === 0 ? (
          <Center h="200px" flexDirection="column" gap={4}>
            <Box p={4} borderRadius="full" border="2px solid black">
              <AiOutlineHeart size={32} />
            </Box>
            <Text fontSize="14px" color="gray.500" textAlign="center">
              Activity on your posts will be shown here.
            </Text>
          </Center>
        ) : (
          sections.map(section => groupedNotifications[section].length > 0 && (
            <Box key={section} mb={6}>
              <Text fontWeight="bold" color="black" mb={4} fontSize="16px">{section}</Text>
              <VStack align="stretch" gap={4}>
                {groupedNotifications[section].map(notif => (
                  <Flex key={notif.id} align="center" gap={3} cursor="pointer" p={1} onClick={() => navigate(`/${notif.user.username}`)}>
                    <UserAvatar src={notif.user.avatar} size="44px" />
                    <Box flex={1}>
                      <Text fontSize="14px" color="black" lineHeight="1.2">
                        <Text as="span" fontWeight="bold">{notif.user.username}</Text> {notif.content}
                        <Text as="span" color="gray.500" ml={1}>{notif.timeAgo}</Text>
                      </Text>
                    </Box>
                    
                    {notif.type === 'follow' ? (
                      <Box bg="#0095f6" color="white" px={4} py={1.5} borderRadius="8px" fontSize="12px" fontWeight="bold" _hover={{ opacity: 0.8 }}>
                        Follow
                      </Box>
                    ) : (notif.type === 'like' || notif.type === 'comment' || notif.type === 'mention') && notif.postImage && (
                       <Box boxSize="40px" flexShrink={0}>
                         <Image src={notif.postImage} borderRadius="2px" objectFit="cover" w="100%" h="100%" />
                       </Box>
                    )}
                  </Flex>
                ))}
              </VStack>
              {section !== 'Earlier' && <Box height="1px" bg="gray.100" mt={6} />}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default NotificationPanel;
