import React from 'react';
import { Box, VStack, HStack, Text, Flex } from '@chakra-ui/react';
import UserAvatar from '../common/UserAvatar';
import { LuChevronDown } from 'react-icons/lu';
import { PiNotePencilLight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats, onSelectChat, activeChatId }) => {
  const navigate = useNavigate();

  return (
    <Box 
      width="397px" 
      height="100vh" 
      borderRight="1px solid" 
      borderColor="gray.200" 
      bg="white" 
      color="black" 
      display="flex" 
      flexDirection="column"
    >
      {/* Header */}
      <Flex p={5} justify="space-between" align="center" borderBottom="1px solid" borderColor="gray.100">
        <HStack gap={1} cursor="pointer" onClick={() => navigate('/antigravity_dev')}>
          <Text fontWeight="bold" fontSize="20px">antigravity_dev</Text>
          <LuChevronDown />
        </HStack>
        <PiNotePencilLight size={24} cursor="pointer" />
      </Flex>

      {/* Messages Section */}
      <Box p={5} pb={2}>
        <Text fontWeight="bold" fontSize="16px">Messages</Text>
      </Box>

      {/* Chat Entries */}
      <VStack align="stretch" gap={0} overflowY="auto" flex={1}>
        {chats.map((chat) => (
          <Flex 
            key={chat.id} 
            px={5} 
            py={3} 
            align="center" 
            gap={3} 
            cursor="pointer"
            bg={activeChatId === chat.id ? "gray.50" : "transparent"}
            _hover={{ bg: "gray.50" }}
            onClick={() => onSelectChat(chat.id)}
            transition="background 0.2s"
          >
            <Box cursor="pointer" onClick={(e) => { e.stopPropagation(); navigate(`/${chat.user.username}`); }}>
              <UserAvatar src={chat.user.avatar} size="56px" />
            </Box>
            <Box overflow="hidden">
              <Text fontWeight={chat.unread ? "bold" : "normal"} fontSize="14px" color="black">
                {chat.user.username}
              </Text>
              <Text 
                fontSize="12px" 
                color={chat.unread ? "black" : "gray.500"} 
                isTruncated 
                fontWeight={chat.unread ? "bold" : "normal"}
              >
                {chat.lastMessage} • {chat.time}
              </Text>
            </Box>
            {chat.unread && (
              <Box boxSize="8px" bg="#0095f6" borderRadius="full" ml="auto" />
            )}
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default ChatList;
