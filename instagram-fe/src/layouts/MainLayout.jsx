import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from '../components/layout/Sidebar';
import CreatePostModal from '../components/modals/CreatePostModal';

const MainLayout = ({ children }) => {
  return (
    <Box display="flex" bg="white">
      {/* Sidebar logic is now self-contained */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        flex={1}
        ml="72px"
        minHeight="100vh"
        bg="white"
        color="black"
        display="flex"
        flexDirection="column"
      >
        <Box bg="white" width="100%">
          {children}
        </Box>
      </Box>

      {/* Global Modals */}
      <CreatePostModal />
    </Box>
  );
};

export default MainLayout;
