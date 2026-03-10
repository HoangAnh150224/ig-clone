import React, { useState } from 'react';
import { Box, VStack, Text, Flex } from '@chakra-ui/react';
import { 
  AiFillHome, AiOutlineSearch, AiOutlineCompass, 
  AiOutlineMessage, AiOutlineHeart, AiOutlinePlusSquare, 
  AiOutlineMenu, AiOutlineUser 
} from 'react-icons/ai';
import { BsCollectionPlay } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import UserAvatar from '../common/UserAvatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { openCreatePostModal } from '../../store/slices/uiSlice';
import SearchPanel from './panels/SearchPanel';
import NotificationPanel from './panels/NotificationPanel';

const SidebarItem = ({ icon: IconComponent, label, active, avatar, onClick, isExpanded }) => (
  <Box
    display="flex" alignItems="center" p={3} my={1} borderRadius="8px" width="full" cursor="pointer"
    _hover={{ bg: "rgba(0,0,0,0.05)" }} onClick={onClick}
    transition="background 0.2s"
    role="group"
  >
    <Box flexShrink={0} display="flex" justifyContent="center" width="24px">
      {avatar ? (
        <UserAvatar src={avatar} size="24px" border={active} />
      ) : (
        <IconComponent size={24} style={{ fontWeight: active ? "bold" : "normal" }} />
      )}
    </Box>
    
    <Text 
      ml={4} fontWeight={active ? "bold" : "400"} fontSize="16px" 
      whiteSpace="nowrap"
      overflow="hidden"
      opacity={isExpanded ? 1 : 0}
      visibility={isExpanded ? "visible" : "hidden"}
      transition="opacity 0.2s ease, visibility 0.2s ease"
      color="black"
    >
      {label}
    </Text>
  </Box>
);

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [activePanel, setActivePanel] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
    }
  };

  const handleNavigate = (path) => {
    setActivePanel(null);
    navigate(path);
  };

  // Sidebar chỉ mở rộng khi hover VÀ không có panel nào đang mở
  const isCurrentlyExpanded = isHovered && activePanel === null;
  const isCollapsedMode = activePanel !== null;

  return (
    <>
      {/* Sidebar Container - FIXED WIDTH 72px so it doesn't push content */}
      <Box width="72px" height="100vh" flexShrink={0} />

      {/* Actual Sidebar - Absolute/Fixed and Expanding */}
      <Box
        width={isCurrentlyExpanded ? "245px" : "72px"} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        height="100vh" borderRight="1px solid" borderColor="gray.200"
        p={3} position="fixed" left={0} top={0} display="flex" flexDirection="column" bg="white" zIndex={100}
        transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        overflow="hidden"
        boxShadow={isCurrentlyExpanded ? "xl" : "none"}
      >
        <Box mb={10} p={3} cursor="pointer" onClick={() => handleNavigate('/')} color="black">
          <Box display={isCurrentlyExpanded ? 'none' : 'block'}>
            <FaInstagram size={28} />
          </Box>
          <Text 
            fontSize="24px" fontWeight="bold" 
            display={isCurrentlyExpanded ? "block" : "none"} 
            fontFamily="cursive"
            whiteSpace="nowrap"
            color="black"
          >
            Instagram
          </Text>
        </Box>

        <VStack align="start" gap={0} color="black" width="full">
          <SidebarItem 
            icon={AiFillHome} label="Home" active={location.pathname === '/' && !activePanel} 
            onClick={() => handleNavigate('/')} isExpanded={isCurrentlyExpanded} 
          />
          <SidebarItem 
            icon={AiOutlineSearch} label="Search" active={activePanel === 'search'} 
            onClick={() => togglePanel('search')} isExpanded={isCurrentlyExpanded} 
          />
          <SidebarItem 
            icon={AiOutlineCompass} label="Explore" active={location.pathname === '/explore' && !activePanel}
            onClick={() => handleNavigate('/explore')} isExpanded={isCurrentlyExpanded} 
          />
          <SidebarItem icon={BsCollectionPlay} label="Reels" isExpanded={isCurrentlyExpanded} />
          <SidebarItem icon={AiOutlineMessage} label="Messages" isExpanded={isCurrentlyExpanded} />
          <SidebarItem 
            icon={AiOutlineHeart} label="Notifications" active={activePanel === 'notifications'}
            onClick={() => togglePanel('notifications')} isExpanded={isCurrentlyExpanded} 
          />
          <SidebarItem 
            icon={AiOutlinePlusSquare} label="Create" 
            onClick={() => dispatch(openCreatePostModal())} isExpanded={isCurrentlyExpanded} 
          />
          <SidebarItem 
            avatar={user?.avatar} icon={AiOutlineUser} label="Profile" 
            active={location.pathname === `/${user?.username || 'antigravity_dev'}` && !activePanel}
            onClick={() => handleNavigate(`/${user?.username || 'antigravity_dev'}`)} isExpanded={isCurrentlyExpanded} 
          />
        </VStack>

        <Box flex={1} />
        <SidebarItem icon={AiOutlineMenu} label="More" isExpanded={isCurrentlyExpanded} />
      </Box>

      {/* Panels */}
      <SearchPanel isOpen={activePanel === 'search'} />
      <NotificationPanel isOpen={activePanel === 'notifications'} />
      
      {/* Overlay to close panel when clicking outside */}
      {isCollapsedMode && (
        <Box 
          position="fixed" top={0} left="72px" right={0} bottom={0} 
          zIndex={80} onClick={() => setActivePanel(null)}
        />
      )}
    </>
  );
};

export default Sidebar;
