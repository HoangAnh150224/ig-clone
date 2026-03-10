import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import ChatList from '../components/messages/ChatList';
import ChatWindow from '../components/messages/ChatWindow';
import MessageSkeleton from '../components/skeletons/MessageSkeleton';
import messageService from '../services/messageService';

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState(null);
  const [view, setView] = useState('primary'); // 'primary' | 'requests'
  const [primaryChats, setPrimaryChats] = useState([]);
  const [requestChats, setRequestChats] = useState([]);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      const [primaryRes, requestRes, countRes] = await Promise.all([
        messageService.getPrimaryChats(),
        messageService.getRequestChats(),
        messageService.getRequestCount(),
      ]);
      setPrimaryChats(primaryRes);
      setRequestChats(requestRes);
      setRequestCount(countRes);

      // Simulating loading to show skeleton
      setTimeout(() => setLoading(false), 800);
    };
    fetchChats();
  }, []);

  if (loading) {
    return <MessageSkeleton />;
  }

  const displayedChats = view === 'primary' ? primaryChats : requestChats;
  const activeChat = displayedChats.find(chat => chat.id === activeChatId);

  const handleSendMessage = async (text) => {
    if (!activeChat) return;
    
    try {
      const response = await messageService.sendMessage(activeChat.id, text);
      if (response) {
        // Update the chat list to display the new message immediately
        const updatedChats = displayedChats.map(chat => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              lastMessage: text,
              time: 'Now',
              messages: [...chat.messages, response]
            };
          }
          return chat;
        });
        
        if (view === 'primary') setPrimaryChats(updatedChats);
        else setRequestChats(updatedChats);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

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
        <ChatWindow 
          activeChat={activeChat} 
          onSendMessage={handleSendMessage}
        />
      </Flex>
    </Flex>
  );
};

export default Messages;
