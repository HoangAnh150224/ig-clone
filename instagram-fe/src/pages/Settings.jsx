import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Flex,
    VStack,
    Text,
    HStack,
    Button,
    Input,
    Textarea,
    NativeSelect,
    Separator,
    Center,
    IconButton,
    Spinner,
} from "@chakra-ui/react";
import UserAvatar from "../components/common/UserAvatar";
import { LuLock, LuShieldAlert, LuUserPlus } from "react-icons/lu";
import { BsStar, BsSearch, BsX, BsStarFill } from "react-icons/bs";
import userService from "../services/userService";
import profileService from "../services/profileService";
import authService from "../services/authService";
import InstagramAlert from "../components/common/InstagramAlert";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../store/slices/authSlice";

const SettingsItem = ({ icon: IconComponent, label, isActive, onClick }) => (
    <HStack
        px={8}
        py={4}
        cursor="pointer"
        bg={isActive ? "gray.50" : "transparent"}
        _hover={{ bg: "gray.50" }}
        onClick={onClick}
        borderLeft={isActive ? "2px solid black" : "none"}
        transition="all 0.2s"
    >
        <Box as={IconComponent} size={24} />
        <Text fontSize="16px" fontWeight={isActive ? "bold" : "400"}>
            {label}
        </Text>
    </HStack>
);

const Settings = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = useState("edit-profile");
    const [isLoading, setIsLoading] = useState(false);
    const [isAvatarUploading, setIsAvatarUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        website: "",
        bio: "",
        gender: "PREFER_NOT_TO_SAY",
        fullName: "",
        showActivityStatus: true,
        tagPermission: "EVERYONE"
    });
    const [isPrivate, setIsPrivate] = useState(false);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Favorites State
    const [favoriteUsers, setFavoriteUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Blocking State
    const [blockedUsers, setBlockedUsers] = useState([]);

    // Alert State
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: "",
        message: "",
    });

    useEffect(() => {
        if (authUser) {
            setFormData({
                website: authUser.website || "",
                bio: authUser.bio || "",
                gender: authUser.gender || "PREFER_NOT_TO_SAY",
                fullName: authUser.fullName || "",
                showActivityStatus: authUser.showActivityStatus ?? true,
                tagPermission: authUser.tagPermission || "EVERYONE"
            });
            setIsPrivate(authUser.privateAccount || authUser.isPrivate || false);
        }
    }, [authUser?.id]);

    useEffect(() => {
        if (authUser?.id) {
            fetchFavorites();
            fetchBlockedUsers();
        }
    }, [authUser?.id]);

    const fetchFavorites = async () => {
        try {
            const data = await userService.getFavoriteUsers();
            // Data is either the array or an object with content field
            const list = Array.isArray(data) ? data : (data?.content || []);
            setFavoriteUsers(list);
            
            // Update Redux store with new favoriteUserIds
            if (authUser) {
                const favoriteUserIds = list.map(u => u.id);
                dispatch(setUser({
                    ...authUser,
                    favoriteUserIds: favoriteUserIds
                }));
            }
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        }
    };

    const fetchBlockedUsers = async () => {
        try {
            const data = await userService.getBlockedUsers();
            const list = Array.isArray(data) ? data : (data?.content || []);
            setBlockedUsers(list);

            // Update Redux store with new blockedUserIds
            if (authUser) {
                const blockedUserIds = list.map(u => u.id);
                dispatch(setUser({
                    ...authUser,
                    blockedUserIds: blockedUserIds
                }));
            }
        } catch (error) {
            console.error("Failed to fetch blocked users", error);
        }
    };

    const handleSearch = async (val) => {
        setSearchQuery(val);
        if (val.trim().length > 0) {
            try {
                const response = await profileService.searchUsers(val);
                setSearchResults(response.content || response || []);
            } catch (err) {
                console.error("Search failed", err);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleToggleFavorite = async (targetUser) => {
        try {
            await userService.toggleFavoriteUser(targetUser.id);
            fetchFavorites();
        } catch {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to update favorites.",
            });
        }
    };

    const handleToggleBlock = async (userId) => {
        try {
            await userService.blockUser(userId);
            fetchBlockedUsers();
            setAlertConfig({
                isOpen: true,
                title: "Success",
                message: "User blocking status updated.",
            });
        } catch {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to update block status.",
            });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const onChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "New passwords do not match.",
            });
            return;
        }

        setIsChangingPassword(true);
        try {
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setAlertConfig({
                isOpen: true,
                title: "Success",
                message: "Password changed successfully.",
            });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: error.apiResponse?.message || "Failed to change password.",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const onDeactivateAccount = async () => {
        if (window.confirm("Are you sure you want to deactivate your account? You will be logged out and your profile will be hidden.")) {
            try {
                await userService.deactivateAccount();
                dispatch(logout());
            } catch (error) {
                setAlertConfig({
                    isOpen: true,
                    title: "Error",
                    message: error.apiResponse?.message || "Failed to deactivate account.",
                });
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: type === "checkbox" ? checked : value 
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await userService.updateUserProfile({
                ...formData,
                privateAccount: isPrivate
            });
            dispatch(setUser(response));
            setAlertConfig({
                isOpen: true,
                title: "Success",
                message: "Your profile has been saved.",
            });
        } catch (error) {
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: error.apiResponse?.message || "Failed to update profile.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsAvatarUploading(true);
        try {
            // Pass file directly to userService.updateUserProfile
            const response = await userService.updateUserProfile({}, file);
            dispatch(setUser(response));
            setAlertConfig({
                isOpen: true,
                title: "Success",
                message: "Profile photo updated.",
            });
        } catch (error) {
            console.error("Avatar update failed", error);
            setAlertConfig({
                isOpen: true,
                title: "Error",
                message: "Failed to update profile photo.",
            });
        } finally {
            setIsAvatarUploading(false);
        }
    };

    const handleTogglePrivate = async () => {
        try {
            const newVal = !isPrivate;
            const response = await userService.updateUserProfile({ privateAccount: newVal });
            setIsPrivate(response.privateAccount);
            dispatch(setUser(response));
        } catch (error) {
            console.error("Failed to toggle privacy", error);
        }
    };

    const handleToggleActivityStatus = async () => {
        try {
            const newVal = !formData.showActivityStatus;
            const response = await userService.updateUserProfile({ showActivityStatus: newVal });
            setFormData(prev => ({ ...prev, showActivityStatus: response.showActivityStatus }));
            dispatch(setUser(response));
        } catch (error) {
            console.error("Failed to toggle activity status", error);
        }
    };

    if (!authUser) return null;

    return (
        <>
            <Flex maxW="1200px" width="95%" mx="auto" mt={12} border="1px solid" borderColor="gray.200" minH="85vh" bg="white" borderRadius="0px" overflow="hidden">
                {/* Sidebar */}
                <Box width="300px" borderRight="1px solid" borderColor="gray.200" py={6} bg="white">
                    <Text px={8} py={4} fontWeight="bold" fontSize="24px" mb={4} color="black">Settings</Text>
                    <VStack align="stretch" gap={0} color="black">
                        <SettingsItem icon={LuUserPlus} label="Edit profile" isActive={activeTab === "edit-profile"} onClick={() => setActiveTab("edit-profile")} />
                        <SettingsItem icon={LuLock} label="Change password" isActive={activeTab === "change-password"} onClick={() => setActiveTab("change-password")} />
                        <SettingsItem icon={LuLock} label="Privacy and security" isActive={activeTab === "privacy"} onClick={() => setActiveTab("privacy")} />
                        <SettingsItem icon={BsStar} label="Favorites" isActive={activeTab === "favorites"} onClick={() => setActiveTab("favorites")} />
                        <SettingsItem icon={LuShieldAlert} label="Blocking" isActive={activeTab === "blocking"} onClick={() => setActiveTab("blocking")} />
                    </VStack>
                </Box>

                {/* Content Area */}
                <Box flex={1} p={12} bg="white" color="black" overflowY="auto">
                    {activeTab === "edit-profile" && (
                        <VStack align="stretch" gap={10} width="100%">
                            <Text fontSize="24px" fontWeight="bold">Edit profile</Text>

                            <HStack gap={6} bg="gray.50" p={6} borderRadius="12px">
                                <Box position="relative">
                                    <UserAvatar src={authUser.avatarUrl} size="60px" />
                                    {isAvatarUploading && (
                                        <Center position="absolute" top={0} left={0} w="full" h="full" bg="blackAlpha.400" borderRadius="full">
                                            <Spinner size="sm" color="white" />
                                        </Center>
                                    )}
                                </Box>
                                <VStack align="start" gap={0}>
                                    <Text fontWeight="bold" fontSize="18px">{authUser.username}</Text>
                                    <Text
                                        color="#0095f6"
                                        fontSize="14px"
                                        fontWeight="bold"
                                        cursor="pointer"
                                        _hover={{ color: "blue.800" }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Change profile photo
                                    </Text>
                                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleAvatarChange} />
                                </VStack>
                            </HStack>

                            <VStack align="stretch" gap={6}>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">Full Name</Text>
                                    <Input name="fullName" value={formData.fullName} onChange={handleInputChange} bg="white" border="1px solid" borderColor="gray.300" fontSize="16px" py={6} />
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">Website</Text>
                                    <Input name="website" value={formData.website} onChange={handleInputChange} bg="white" border="1px solid" borderColor="gray.300" fontSize="16px" py={6} />
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">Bio</Text>
                                    <Textarea name="bio" value={formData.bio} onChange={handleInputChange} bg="white" border="1px solid" borderColor="gray.300" fontSize="16px" minH="120px" />
                                    <Text fontSize="xs" color="gray.500" mt={2}>{formData.bio.length} / 150</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">Gender</Text>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field name="gender" value={formData.gender} onChange={handleInputChange} bg="white" color="black" border="1px solid" borderColor="gray.300" fontSize="16px" height="50px">
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                                        </NativeSelect.Field>
                                    </NativeSelect.Root>
                                </Box>
                            </VStack>

                            <Button bg="#0095f6" _hover={{ bg: "#1877f2" }} color="white" w="fit-content" px={10} py={6} fontSize="16px" fontWeight="bold" borderRadius="8px" alignSelf="flex-end" onClick={handleSubmit} isLoading={isLoading}>
                                Submit
                            </Button>
                        </VStack>
                    )}

                    {activeTab === "change-password" && (
                        <VStack align="stretch" gap={10} width="100%">
                            <Text fontSize="24px" fontWeight="bold">Change password</Text>
                            
                            <VStack align="stretch" gap={6}>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">Current password</Text>
                                    <Input 
                                        type="password"
                                        name="currentPassword" 
                                        value={passwordData.currentPassword} 
                                        onChange={handlePasswordChange} 
                                        bg="white" 
                                        border="1px solid" 
                                        borderColor="gray.300" 
                                        fontSize="16px" 
                                        py={6} 
                                    />
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">New password</Text>
                                    <Input 
                                        type="password"
                                        name="newPassword" 
                                        value={passwordData.newPassword} 
                                        onChange={handlePasswordChange} 
                                        bg="white" 
                                        border="1px solid" 
                                        borderColor="gray.300" 
                                        fontSize="16px" 
                                        py={6} 
                                    />
                                </Box>
                                <Box>
                                    <Text fontWeight="bold" mb={3} fontSize="16px">Confirm new password</Text>
                                    <Input 
                                        type="password"
                                        name="confirmPassword" 
                                        value={passwordData.confirmPassword} 
                                        onChange={handlePasswordChange} 
                                        bg="white" 
                                        border="1px solid" 
                                        borderColor="gray.300" 
                                        fontSize="16px" 
                                        py={6} 
                                    />
                                </Box>
                            </VStack>

                            <Button 
                                bg="#0095f6" 
                                _hover={{ bg: "#1877f2" }} 
                                color="white" 
                                w="fit-content" 
                                px={10} 
                                py={6} 
                                fontSize="16px" 
                                fontWeight="bold" 
                                borderRadius="8px" 
                                alignSelf="flex-end" 
                                onClick={onChangePassword} 
                                isLoading={isChangingPassword}
                            >
                                Change password
                            </Button>

                            <Box mt={10} pt={10} borderTop="1px solid" borderColor="gray.100">
                                <Text 
                                    color="#0095f6" 
                                    fontSize="14px" 
                                    fontWeight="bold" 
                                    cursor="pointer"
                                    onClick={() => setAlertConfig({ isOpen: true, title: "Info", message: "Forgot password feature is available on the login page." })}
                                >
                                    Forgot password?
                                </Text>
                            </Box>
                        </VStack>
                    )}

                    {activeTab === "favorites" && (
                        <VStack align="stretch" gap={6} width="100%">
                            <Text fontSize="24px" fontWeight="bold">Favorites</Text>
                            <Text fontSize="16px" color="gray.500">Manage who you want to see first in your feed.</Text>

                            <HStack bg="gray.100" px={4} py={1} borderRadius="10px">
                                <BsSearch color="gray" />
                                <Input placeholder="Search" variant="plain" fontSize="14px" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} border="none" _focus={{ boxShadow: "none" }} p={2} color="black" />
                                {searchQuery && <BsX color="gray" cursor="pointer" onClick={() => { setSearchQuery(""); setSearchResults([]); }} />}
                            </HStack>

                            {searchResults.length > 0 && (
                                <VStack align="stretch" gap={4} p={4} border="1px solid" borderColor="gray.100" borderRadius="8px" shadow="sm">
                                    {searchResults.map((user) => {
                                        const isFav = favoriteUsers.some((u) => u.id === user.id);
                                        return (
                                            <Flex key={user.id} justify="space-between" align="center">
                                                <HStack gap={3}>
                                                    <UserAvatar src={user.avatarUrl} size="44px" />
                                                    <VStack align="start" gap={0}>
                                                        <Text fontWeight="bold" fontSize="14px">{user.username}</Text>
                                                        <Text fontSize="14px" color="gray.500">{user.fullName}</Text>
                                                    </VStack>
                                                </HStack>
                                                <Button size="sm" bg={isFav ? "gray.100" : "#0095f6"} color={isFav ? "black" : "white"} onClick={() => handleToggleFavorite(user)}>
                                                    {isFav ? "Remove" : "Add"}
                                                </Button>
                                            </Flex>
                                        );
                                    })}
                                </VStack>
                            )}

                            <Separator />

                            <VStack align="stretch" gap={4} mt={4}>
                                <Text fontWeight="bold" fontSize="16px">{favoriteUsers.length} in favorites</Text>
                                {favoriteUsers.length > 0 ? (
                                    favoriteUsers.map((user) => (
                                        <Flex key={user.id} justify="space-between" align="center" p={4} bg="gray.50" borderRadius="12px" _hover={{ bg: "gray.100" }} transition="0.2s">
                                            <HStack gap={4}>
                                                <UserAvatar src={user.avatarUrl} size="50px" />
                                                <VStack align="start" gap={0}>
                                                    <Text fontWeight="bold" fontSize="16px">{user.username}</Text>
                                                    <Text fontSize="14px" color="gray.500">{user.fullName}</Text>
                                                </VStack>
                                            </HStack>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                borderColor="gray.300" 
                                                color="black" 
                                                fontWeight="bold"
                                                _hover={{ bg: "gray.200", borderColor: "gray.400" }}
                                                onClick={() => handleToggleFavorite(user)}
                                            >
                                                Remove
                                            </Button>
                                        </Flex>
                                    ))
                                ) : (
                                    <Center py={10}>
                                        <Text color="gray.500" fontSize="16px">Your favorites list is empty.</Text>
                                    </Center>
                                )}
                            </VStack>
                        </VStack>
                    )}

                    {activeTab === "privacy" && (
                        <VStack align="stretch" gap={8} width="100%">
                            <Text fontSize="24px" fontWeight="bold">Privacy and security</Text>
                            
                            <Box border="1px solid" borderColor="gray.100" borderRadius="12px" p={6}>
                                <Flex justify="space-between" align="center" mb={6}>
                                    <VStack align="start" gap={2} maxW="80%">
                                        <Text fontWeight="bold" fontSize="18px">Private Account</Text>
                                        <Text fontSize="14px" color="gray.500">When your account is private, only people you approve can see your photos and videos.</Text>
                                    </VStack>
                                    <Box as="button" p={1} width="50px" height="28px" borderRadius="full" bg={isPrivate ? "#0095f6" : "gray.300"} transition="0.3s" onClick={handleTogglePrivate} position="relative">
                                        <Box boxSize="20px" bg="white" borderRadius="full" position="absolute" top="4px" left={isPrivate ? "26px" : "4px"} transition="0.3s" shadow="sm" />
                                    </Box>
                                </Flex>

                                <Separator mb={6} />

                                <Flex justify="space-between" align="center" mb={6}>
                                    <VStack align="start" gap={2} maxW="80%">
                                        <Text fontWeight="bold" fontSize="18px">Show Activity Status</Text>
                                        <Text fontSize="14px" color="gray.500">Allow accounts you follow and anyone you message to see when you were last active or are currently active on Instagram apps.</Text>
                                    </VStack>
                                    <Box as="button" p={1} width="50px" height="28px" borderRadius="full" bg={formData.showActivityStatus ? "#0095f6" : "gray.300"} transition="0.3s" onClick={handleToggleActivityStatus} position="relative">
                                        <Box boxSize="20px" bg="white" borderRadius="full" position="absolute" top="4px" left={formData.showActivityStatus ? "26px" : "4px"} transition="0.3s" shadow="sm" />
                                    </Box>
                                </Flex>

                                <Separator mb={6} />

                                <Box>
                                    <Text fontWeight="bold" fontSize="18px" mb={2}>Tags</Text>
                                    <Text fontSize="14px" color="gray.500" mb={4}>Choose who can tag you in their photos and videos.</Text>
                                    <VStack align="start" gap={3}>
                                        <HStack as="label" cursor="pointer" width="100%" justify="space-between">
                                            <Text fontSize="16px">Everyone</Text>
                                            <input type="radio" name="tagPermission" value="EVERYONE" checked={formData.tagPermission === "EVERYONE"} onChange={handleInputChange} />
                                        </HStack>
                                        <HStack as="label" cursor="pointer" width="100%" justify="space-between">
                                            <Text fontSize="16px">People You Follow</Text>
                                            <input type="radio" name="tagPermission" value="PEOPLE_YOU_FOLLOW" checked={formData.tagPermission === "PEOPLE_YOU_FOLLOW"} onChange={handleInputChange} />
                                        </HStack>
                                        <HStack as="label" cursor="pointer" width="100%" justify="space-between">
                                            <Text fontSize="16px">No One</Text>
                                            <input type="radio" name="tagPermission" value="NO_ONE" checked={formData.tagPermission === "NO_ONE"} onChange={handleInputChange} />
                                        </HStack>
                                    </VStack>
                                </Box>
                            </Box>

                            <Box mt={10}>
                                <Text fontWeight="bold" fontSize="18px" mb={4}>Account Status</Text>
                                <Box border="1px solid" borderColor="red.100" borderRadius="12px" p={6} bg="red.50">
                                    <Flex justify="space-between" align="center">
                                        <VStack align="start" gap={1}>
                                            <Text fontWeight="bold" color="red.700">Deactivate Account</Text>
                                            <Text fontSize="14px" color="red.600">Temporarily hide your profile and posts. You can reactivate by logging back in.</Text>
                                        </VStack>
                                        <Button 
                                            variant="ghost" 
                                            color="red.600" 
                                            fontWeight="bold" 
                                            _hover={{ bg: "red.100" }}
                                            onClick={onDeactivateAccount}
                                        >
                                            Deactivate
                                        </Button>
                                    </Flex>
                                </Box>
                            </Box>
                        </VStack>
                    )}

                    {activeTab === "blocking" && (
                        <VStack align="stretch" gap={6} width="100%">
                            <Text fontSize="24px" fontWeight="bold">Blocking</Text>
                            <Text fontSize="16px" color="gray.500">Once you block someone, that person can no longer see your profile or posts.</Text>

                            <VStack align="stretch" gap={4} mt={4}>
                                <Text fontWeight="bold" fontSize="16px">Blocked users</Text>
                                {blockedUsers.length > 0 ? (
                                    blockedUsers.map((user) => (
                                        <Flex key={user.id} justify="space-between" align="center" p={4} bg="gray.50" borderRadius="12px">
                                            <HStack gap={4}>
                                                <UserAvatar src={user.avatarUrl} size="50px" />
                                                <VStack align="start" gap={0}>
                                                    <Text fontWeight="bold" fontSize="16px">{user.username}</Text>
                                                    <Text fontSize="14px" color="gray.500">{user.fullName}</Text>
                                                </VStack>
                                            </HStack>
                                            <Button variant="outline" borderColor="gray.300" color="black" size="sm" onClick={() => handleToggleBlock(user.id)}>
                                                Unblock
                                            </Button>
                                        </Flex>
                                    ))
                                ) : (
                                    <Center py={10}>
                                        <Text color="gray.500" fontSize="16px">You haven't blocked anyone yet.</Text>
                                    </Center>
                                )}
                            </VStack>
                        </VStack>
                    )}
                </Box>
            </Flex>

            <InstagramAlert
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                title={alertConfig.title}
                message={alertConfig.message}
            />
        </>
    );
};

export default Settings;
