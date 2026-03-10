import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import ChatList from '../components/messages/ChatList';
import ChatWindow from '../components/messages/ChatWindow';
import { allUsers, chatMessages, messageRequests } from '../api/dummyData';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [view, setView] = useState('primary'); // 'primary' | 'requests'

  const primaryChats = allUsers.slice(0, 3).map(user => ({
    id: user.id,
    user: user,
    lastMessage: chatMessages[user.username]?.[chatMessages[user.username].length - 1]?.text || 'No messages',
    time: chatMessages[user.username]?.[chatMessages[user.username].length - 1]?.time || '',
    unread: false,
    messages: chatMessages[user.username] || []
  }));

  const requestChats = messageRequests.map(req => ({
    ...req,
    messages: chatMessages[req.user.username] || []
  }));

  const displayedChats = view === 'primary' ? primaryChats : requestChats;
  const activeChat = displayedChats.find(chat => chat.id === activeChatId);

  return (
    <Flex height="100vh" bg="white" color="black" width="100%">
      <ChatList 
        chats={displayedChats} 
        onSelectChat={setActiveChatId} 
        activeChatId={activeChatId}
        currentView={view}
        onViewChange={(newView) => { setView(newView); setActiveChatId(null); }}
        requestCount={messageRequests.length}
      />

      <Flex flex={1}>
        <ChatWindow activeChat={activeChat} />
      </Flex>
    </Flex>
  );
};

export default Messages;
