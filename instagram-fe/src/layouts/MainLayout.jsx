import React from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from '../components/layout/Sidebar';
import CreatePostModal from '../components/modals/CreatePostModal';

const MainLayout = ({ children }) => {
  return (
    <Box display="flex" bg="white" minHeight="100vh">
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Main Content Area - Flexible and stretches */}
      <Box
        flex={1}
        bg="white"
        color="black"
        display="flex"
        flexDirection="column"
      >
        {children}
      </Box>

      {/* Global Modals */}
      <CreatePostModal />
    </Box>
  );
};

export default MainLayout;
