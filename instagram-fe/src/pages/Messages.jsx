import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import ChatList from '../components/messages/ChatList';
import ChatWindow from '../components/messages/ChatWindow';
import { allUsers, chatMessages } from '../api/dummyData';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(null);

  // Lọc lấy những user có trong hội thoại hoặc tất cả user để demo
  const mockChats = allUsers.slice(0, 4).map(user => ({
    id: user.id,
    user: user,
    lastMessage: chatMessages[user.username]?.[chatMessages[user.username].length - 1]?.text || 'No messages yet',
    time: chatMessages[user.username]?.[chatMessages[user.username].length - 1]?.time || '',
    unread: user.username === 'leomessi',
    messages: chatMessages[user.username] || []
  }));

  const activeChat = mockChats.find(chat => chat.id === activeChatId);

  return (
    <Flex height="100vh" bg="white" color="black" width="100%">
      <Box width="397px" borderRight="1px solid" borderColor="gray.200">
        <ChatList 
          chats={mockChats} 
          onSelectChat={setActiveChatId} 
          activeChatId={activeChatId} 
        />
      </Box>

      <Flex flex={1}>
        <ChatWindow activeChat={activeChat} />
      </Flex>
    </Flex>
  );
};

export default Messages;
