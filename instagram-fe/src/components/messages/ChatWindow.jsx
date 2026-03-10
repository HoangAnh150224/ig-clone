import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Flex, Input } from '@chakra-ui/react';
import { AiOutlineInfoCircle, AiOutlineHeart, AiOutlinePicture } from 'react-icons/ai';
import { HiOutlineMicrophone } from 'react-icons/hi';
import { BsEmojiSmile } from 'react-icons/bs';
import UserAvatar from '../common/UserAvatar';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({ activeChat, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  if (!activeChat) {
    return (
      <Flex flex={1} bg="white" color="black" direction="column" align="center" justify="center" gap={4}>
        <Box 
          borderRadius="full" border="2px solid" borderColor="black" p={6}
          display="flex" align="center" justify="center" bg="white"
        >
          <AiOutlinePicture size={60} color="black" />
        </Box>
        <Text fontSize="2xl" fontWeight="500" color="black">Your messages</Text>
        <Text color="gray.500">Send photos and private messages to a friend or group.</Text>
        <Box 
          as="button" bg="#0095f6" color="white" px={5} py={2} 
          borderRadius="8px" fontSize="sm" fontWeight="bold" mt={2}
        >
          Send message
        </Box>
      </Flex>
    );
  }

  const handleNavigate = () => {
    navigate(`/${activeChat.user.username}`);
  };

  return (
    <Box flex={1} bg="white" color="black" display="flex" flexDirection="column" height="100vh">
      {/* Header */}
      <Flex p={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between" bg="white">
        <HStack gap={3} cursor="pointer" onClick={handleNavigate}>
          <UserAvatar src={activeChat.user.avatar} size="32px" />
          <Text fontWeight="bold" color="black">{activeChat.user.username}</Text>
        </HStack>
        <AiOutlineInfoCircle size={24} cursor="pointer" color="black" />
      </Flex>

      {/* Messages */}
      <VStack flex={1} p={4} overflowY="auto" align="stretch" gap={4} bg="white">
        {activeChat.messages.map((msg) => (
          <Flex key={msg.id} justify={msg.sender === 'me' ? 'flex-end' : 'flex-start'}>
            <Box 
              maxW="70%" p={3} px={4} borderRadius="22px" 
              bg={msg.sender === 'me' ? '#3797f0' : 'gray.100'} 
              color={msg.sender === 'me' ? 'white' : 'black'}
              fontSize="sm"
            >
              {msg.text}
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* Input */}
      <Box p={4} px={5} bg="white">
        <Flex 
          border="1px solid" borderColor="gray.200" borderRadius="22px" 
          p={1} px={4} align="center" gap={3} bg="white"
        >
          <BsEmojiSmile size={24} cursor="pointer" color="black" />
          <Input 
            variant="unstyled" placeholder="Message..." flex={1} py={2}
            value={message} onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            color="black"
            bg="white"
            _placeholder={{ color: "gray.500" }}
          />
          {message.length > 0 ? (
            <Text fontWeight="bold" color="#0095f6" cursor="pointer" onClick={handleSend}>Send</Text>
          ) : (
            <HStack gap={4}>
              <HiOutlineMicrophone size={24} cursor="pointer" color="black" />
              <AiOutlinePicture size={24} cursor="pointer" color="black" />
              <AiOutlineHeart size={24} cursor="pointer" color="black" />
            </HStack>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatWindow;
