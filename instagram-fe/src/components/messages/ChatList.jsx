import React from 'react';
import { Box, VStack, HStack, Text, Flex } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import { LuChevronDown, LuArrowLeft } from 'react-icons/lu';
import { PiNotePencilLight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats, onSelectChat, activeChatId, currentView, onViewChange, requestCount }) => {
  const navigate = useNavigate();

  return (
    <Box width="397px" height="100vh" borderRight="1px solid" borderColor="gray.200" bg="white" color="black" display="flex" flexDirection="column">
      {/* Header */}
      <Flex p={5} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
        {currentView === 'requests' ? (
          <HStack gap={4}>
            <Box cursor="pointer" onClick={() => onViewChange('primary')}>
              <LuArrowLeft size={24} />
            </Box>
            <Text fontWeight="bold" fontSize="20px">Requests</Text>
          </HStack>
        ) : (
          <HStack gap={1} cursor="pointer" onClick={() => navigate('/antigravity_dev')}>
            <Text fontWeight="bold" fontSize="20px">antigravity_dev</Text>
            <LuChevronDown />
          </HStack>
        )}
        <PiNotePencilLight size={24} cursor="pointer" />
      </Flex>

      {/* Primary / Requests Tabs */}
      {currentView === 'primary' && (
        <Flex px={5} py={4} justify="space-between" align="center">
          <Text fontWeight="bold" fontSize="16px">Messages</Text>
          {requestCount > 0 && (
            <Text 
              color="#0095f6" fontWeight="600" fontSize="14px" cursor="pointer"
              onClick={() => onViewChange('requests')}
            >
              Requests ({requestCount})
            </Text>
          )}
        </Flex>
      )}

      {/* List */}
      <VStack align="stretch" gap={0} overflowY="auto" flex={1}>
        {chats.map((chat) => (
          <Flex 
            key={chat.id} px={5} py={3} align="center" gap={3} cursor="pointer"
            bg={activeChatId === chat.id ? "gray.50" : "transparent"}
            _hover={{ bg: "gray.50" }}
            onClick={() => onSelectChat(chat.id)}
            transition="0.2s"
          >
            <UserAvatar src={chat.user.avatar} size="56px" />
            <Box overflow="hidden">
              <Text fontWeight={chat.unread ? "bold" : "normal"} fontSize="14px" color="black">
                {chat.user.username}
              </Text>
              <Text fontSize="12px" color={chat.unread ? "black" : "gray.500"} isTruncated>
                {typeof chat.lastMessage === 'object' ? chat.lastMessage.text : chat.lastMessage} • {chat.time}
              </Text>
            </Box>
            {chat.unread && <Box boxSize="8px" bg="#0095f6" borderRadius="full" ml="auto" />}
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default ChatList;
