import React, { useState } from "react";
import { Box, VStack, Text, Flex, HStack } from "@chakra-ui/react";
import {
    AiFillHome,
    AiOutlineHome,
    AiOutlineSearch,
    AiFillCompass,
    AiOutlineCompass,
    AiFillMessage,
    AiOutlineMessage,
    AiFillHeart,
    AiOutlineHeart,
    AiFillPlusSquare,
    AiOutlinePlusSquare,
    AiOutlineMenu,
    AiFillSetting,
    AiOutlineSetting,
    AiOutlineClockCircle,
} from "react-icons/ai";
import { BsCollectionPlay, BsCollectionPlayFill } from "react-icons/bs";
import { FaInstagram, FaUserCircle, FaRegUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import UserAvatar from "../common/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import { openCreatePostModal, toggleMute } from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice";
import SearchPanel from "./panels/SearchPanel";
import NotificationPanel from "./panels/NotificationPanel";

const SidebarItem = ({
    icon: OutlineIcon,
    activeIcon: FillIcon,
    label,
    active,
    avatar,
    onClick,
    isExpanded,
}) => {
    const IconComponent = active ? FillIcon || OutlineIcon : OutlineIcon;

    return (
        <Box
            display="flex"
            alignItems="center"
            p={3}
            my={1}
            borderRadius="8px"
            width="full"
            cursor="pointer"
            _hover={{ bg: "rgba(0,0,0,0.05)" }}
            onClick={onClick}
            transition="background 0.2s"
            role="group"
            justifyContent="flex-start"
        >
            <Box
                flexShrink={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="24px"
            >
                {avatar ? (
                    <UserAvatar src={avatar} size="24px" border={active} />
                ) : (
                    <IconComponent size={24} />
                )}
            </Box>
            <Box
                width={isExpanded ? "auto" : "0px"}
                overflow="hidden"
                whiteSpace="nowrap"
                opacity={isExpanded ? 1 : 0}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                ml={isExpanded ? 4 : 0}
            >
                <Text
                    fontWeight={active ? "bold" : "400"}
                    fontSize="16px"
                    color="black"
                >
                    {label}
                </Text>
            </Box>
        </Box>
    );
};

const Sidebar = () => {
    const { user: authUser, isAuthenticated } = useSelector(
        (state) => state.auth,
    );
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [activePanel, setActivePanel] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const togglePanel = (panel) => {
        setActivePanel(activePanel === panel ? null : panel);
        setShowMoreMenu(false);
    };

    const handleNavigate = (path) => {
        setActivePanel(null);
        setShowMoreMenu(false);
        navigate(path);
    };

    const handleProfileClick = () => {
        if (isAuthenticated && authUser?.username) {
            handleNavigate(`/${authUser.username}`);
        } else {
            handleNavigate("/accounts/login");
        }
    };

    const isCurrentlyExpanded = isHovered && activePanel === null;
    const isCollapsedMode = activePanel !== null;

    return (
        <>
            <Box width="72px" height="100vh" flexShrink={0} />
            <Box
                width={isCurrentlyExpanded ? "245px" : "72px"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                height="100vh"
                p="12px"
                position="fixed"
                left={0}
                top={0}
                display="flex"
                flexDirection="column"
                bg="white"
                zIndex={100}
                transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                overflow="hidden"
            >
                <Box
                    mb={10}
                    py={3}
                    cursor="pointer"
                    onClick={() => handleNavigate("/")}
                    color="black"
                    display="flex"
                    justifyContent="flex-start"
                    width="full"
                    pl="12px"
                >
                    <FaInstagram size={28} />
                </Box>

                <VStack align="start" gap={0} color="black" width="full">
                    <SidebarItem
                        icon={AiOutlineHome}
                        activeIcon={AiFillHome}
                        label="Home"
                        active={location.pathname === "/" && !activePanel}
                        onClick={() => handleNavigate("/")}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        icon={AiOutlineSearch}
                        activeIcon={AiOutlineSearch} // Search icon usually doesn't have a specific Fill version in IG, keep Outline but IG will make it bold
                        label="Search"
                        active={activePanel === "search"}
                        onClick={() => togglePanel("search")}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        icon={AiOutlineCompass}
                        activeIcon={AiFillCompass}
                        label="Explore"
                        active={
                            location.pathname === "/explore" && !activePanel
                        }
                        onClick={() => handleNavigate("/explore")}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        icon={BsCollectionPlay}
                        activeIcon={BsCollectionPlayFill}
                        label="Reels"
                        active={location.pathname === "/reels" && !activePanel}
                        onClick={() => handleNavigate("/reels")}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        icon={AiOutlineMessage}
                        activeIcon={AiFillMessage}
                        label="Messages"
                        active={
                            location.pathname === "/direct/inbox" &&
                            !activePanel
                        }
                        onClick={() => handleNavigate("/direct/inbox")}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        icon={AiOutlineHeart}
                        activeIcon={AiFillHeart}
                        label="Notifications"
                        active={activePanel === "notifications"}
                        onClick={() => togglePanel("notifications")}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        icon={AiOutlinePlusSquare}
                        activeIcon={AiFillPlusSquare}
                        label="Create"
                        onClick={() => dispatch(openCreatePostModal())}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        avatar={authUser?.avatar}
                        icon={FaRegUserCircle}
                        activeIcon={FaUserCircle}
                        label="Profile"
                        active={
                            location.pathname === `/${authUser?.username}` &&
                            !activePanel
                        }
                        onClick={handleProfileClick}
                        isExpanded={isCurrentlyExpanded}
                    />
                </VStack>

                <Box flex={1} />

                {showMoreMenu && (
                    <Box
                        position="absolute"
                        bottom="70px"
                        left="12px"
                        width="220px"
                        bg="white"
                        borderRadius="16px"
                        boxShadow="0 4px 24px rgba(0,0,0,0.15)"
                        p={2}
                        zIndex={110}
                    >
                        <VStack align="stretch" gap={0}>
                            <HStack
                                p={3}
                                borderRadius="8px"
                                _hover={{ bg: "gray.50" }}
                                cursor="pointer"
                                onClick={() => handleNavigate("/accounts/edit")}
                            >
                                <AiOutlineSetting size={20} />
                                <Text fontSize="14px">Settings</Text>
                            </HStack>
                            <HStack
                                p={3}
                                borderRadius="8px"
                                _hover={{ bg: "gray.50" }}
                                cursor="pointer"
                                onClick={() =>
                                    handleNavigate("/archive/stories")
                                }
                            >
                                <AiOutlineClockCircle size={20} />
                                <Text fontSize="14px">Archive</Text>
                            </HStack>
                            <HStack
                                p={3}
                                borderRadius="8px"
                                _hover={{ bg: "gray.50" }}
                                cursor="pointer"
                                onClick={() => handleNavigate("/accounts/login")}
                            >
                                <Text fontSize="14px">Switch accounts</Text>
                            </HStack>
                            <Box height="1px" bg="gray.100" my={1} />
                            <HStack
                                p={3}
                                borderRadius="8px"
                                _hover={{ bg: "gray.50" }}
                                cursor="pointer"
                                onClick={() => {
                                    dispatch(logout());
                                    handleNavigate("/accounts/login");
                                }}
                            >
                                <Text fontSize="14px">Log out</Text>
                            </HStack>
                        </VStack>
                    </Box>
                )}

                <SidebarItem
                    icon={AiOutlineMenu}
                    label="More"
                    active={showMoreMenu}
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    isExpanded={isCurrentlyExpanded}
                />
            </Box>

            <SearchPanel isOpen={activePanel === "search"} />
            <NotificationPanel isOpen={activePanel === "notifications"} />
            {(isCollapsedMode || showMoreMenu) && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    zIndex={80}
                    onClick={() => {
                        setActivePanel(null);
                        setShowMoreMenu(false);
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;
