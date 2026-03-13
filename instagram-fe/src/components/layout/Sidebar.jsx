import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Flex, Image } from "@chakra-ui/react";
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
    AiOutlineSetting,
} from "react-icons/ai";
import { BsCollectionPlay, BsCollectionPlayFill } from "react-icons/bs";
import { FaInstagram, FaUserCircle, FaRegUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import UserAvatar from "../common/UserAvatar";
import { useNavigate, useLocation } from "react-router-dom";
import {
    openCreatePostModal,
    setUnreadNotificationCount,
} from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice";
import SearchPanel from "./panels/SearchPanel";
import NotificationPanel from "./panels/NotificationPanel";
import notificationService from "../../services/notificationService";
import authService from "../../services/authService";

const SidebarItem = ({
    icon: OutlineIcon,
    activeIcon: FillIcon,
    label,
    active,
    avatar,
    onClick,
    isExpanded,
    badgeCount,
}) => {
    const IconComponent = active ? FillIcon || OutlineIcon : OutlineIcon;

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            py={3}
            pl="24px"
            my={1}
            borderRadius="8px"
            width="full"
            cursor="pointer"
            _hover={{ bg: "rgba(0,0,0,0.05)" }}
            onClick={onClick}
            transition="background 0.2s"
            role="group"
            position="relative"
        >
            {/* Icon/Avatar Container: Kích thước cố định 24x24 */}
            <Box
                flexShrink={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="24px"
                height="24px"
                position="relative"
            >
                {avatar ? (
                    <Box
                        width="24px"
                        height="24px"
                        borderRadius="full"
                        overflow="hidden"
                        border={active ? "2px solid black" : "none"}
                    >
                        <Image
                            src={avatar}
                            alt="Profile"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    </Box>
                ) : (
                    <IconComponent size={24} />
                )}
                {badgeCount > 0 && (
                    <Box
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        width="8px"
                        height="8px"
                        bg="#ff3040"
                        borderRadius="full"
                        border="2px solid white"
                    />
                )}
            </Box>

            {/* Label */}
            <Box
                ml={4}
                opacity={isExpanded ? 1 : 0}
                visibility={isExpanded ? "visible" : "hidden"}
                transition="opacity 0.2s ease, visibility 0.2s"
                whiteSpace="nowrap"
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
    const { user: authUser } = useSelector((state) => state.auth);
    const unreadNotificationCount = useSelector(
        (state) => state.ui.unreadNotificationCount,
    );
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [activePanel, setActivePanel] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    useEffect(() => {
        if (authUser) {
            notificationService
                .getUnreadCount()
                .then((count) => {
                    dispatch(setUnreadNotificationCount(count));
                })
                .catch(console.error);
        }
    }, [authUser, dispatch]);

    const togglePanel = (panel) => {
        setActivePanel(activePanel === panel ? null : panel);
        setShowMoreMenu(false);
    };

    const handleNavigate = (path) => {
        setActivePanel(null);
        setShowMoreMenu(false);
        navigate(path);
    };

    const isCurrentlyExpanded = isHovered && activePanel === null;
    const isCollapsedMode = activePanel !== null;

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout failed on server", error);
        } finally {
            dispatch(logout());
            navigate("/auth");
        }
    };

    return (
        <>
            <Box width="72px" height="100vh" flexShrink={0} />

            <Box
                width={isCurrentlyExpanded ? "245px" : "72px"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                height="100vh"
                py="12px"
                px={0}
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
                {/* Logo Section */}
                <Box
                    mb={10}
                    pt={6}
                    pb={3}
                    pl="24px"
                    cursor="pointer"
                    onClick={() => handleNavigate("/")}
                    color="black"
                    width="full"
                >
                    <Box display="flex" justifyContent="center" width="24px">
                        <FaInstagram size={24} />
                    </Box>
                </Box>

                {/* Navigation Items */}
                <VStack
                    align="start"
                    gap={0}
                    color="black"
                    width="full"
                    flex={1}
                >
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
                        activeIcon={AiOutlineSearch}
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
                        badgeCount={unreadNotificationCount}
                    />
                    <SidebarItem
                        icon={AiOutlinePlusSquare}
                        activeIcon={AiFillPlusSquare}
                        label="Create"
                        onClick={() => dispatch(openCreatePostModal())}
                        isExpanded={isCurrentlyExpanded}
                    />
                    <SidebarItem
                        avatar={authUser?.avatarUrl}
                        icon={FaRegUserCircle}
                        activeIcon={FaUserCircle}
                        label="Profile"
                        active={
                            location.pathname === `/${authUser?.username}` &&
                            !activePanel
                        }
                        onClick={() => handleNavigate(`/${authUser?.username}`)}
                        isExpanded={isCurrentlyExpanded}
                    />
                </VStack>

                {/* Bottom Section */}
                <Box mt="auto" width="full" pb={4}>
                    {showMoreMenu && (
                        <Box
                            position="absolute"
                            bottom="80px"
                            left="12px"
                            width="220px"
                            bg="white"
                            borderRadius="16px"
                            boxShadow="0 4px 24px rgba(0,0,0,0.15)"
                            p={2}
                            zIndex={110}
                            border="1px solid"
                            borderColor="gray.100"
                        >
                            <VStack align="stretch" gap={0}>
                                <Flex
                                    p={3}
                                    borderRadius="8px"
                                    _hover={{ bg: "gray.50" }}
                                    cursor="pointer"
                                    align="center"
                                    gap={3}
                                    onClick={() =>
                                        handleNavigate("/accounts/edit")
                                    }
                                >
                                    <AiOutlineSetting size={20} />
                                    <Text fontSize="14px">Settings</Text>
                                </Flex>
                                <Box height="1px" bg="gray.100" my={1} />
                                <Flex
                                    p={3}
                                    borderRadius="8px"
                                    _hover={{ bg: "gray.50" }}
                                    cursor="pointer"
                                    align="center"
                                    gap={3}
                                    onClick={handleLogout}
                                >
                                    <Text fontSize="14px">Log out</Text>
                                </Flex>
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
