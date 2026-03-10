import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import ChatList from '../components/messages/ChatList';
import ChatWindow from '../components/messages/ChatWindow';
import messageService from '../services/messageService';

const Messages = () => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [view, setView] = useState('primary'); // 'primary' | 'requests'
  const [primaryChats, setPrimaryChats] = useState([]);
  const [requestChats, setRequestChats] = useState([]);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchChats = async () => {
      const [primaryRes, requestRes, countRes] = await Promise.all([
        messageService.getPrimaryChats(),
        messageService.getRequestChats(),
        messageService.getRequestCount(),
      ]);
      setPrimaryChats(primaryRes.data);
      setRequestChats(requestRes.data);
      setRequestCount(countRes.data);
    };
    fetchChats();
  }, []);

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
        requestCount={requestCount}
      />

      <Flex flex={1}>
        <ChatWindow activeChat={activeChat} />
      </Flex>
    </Flex>
  );
};

export default Messages;
