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
import cloudinaryService from "../services/cloudinaryService";
import InstagramAlert from "../components/common/InstagramAlert";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/slices/authSlice";

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
        fullName: ""
    });
    const [isPrivate, setIsPrivate] = useState(false);

    // Favorites State
    const [favoriteUsers, setFavoriteUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

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
                fullName: authUser.fullName || ""
            });
            setIsPrivate(authUser.isPrivate || false);
            fetchFavorites();
            fetchBlockedUsers();
        }
    }, [authUser]);

    const fetchFavorites = async () => {
        try {
            const response = await userService.getFavoriteUsers();
            setFavoriteUsers(response.content || response || []);
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        }
    };

    const fetchBlockedUsers = async () => {
        try {
            // Need to implement getBlockedUsers in userService if not exist
            // const response = await userService.getBlockedUsers();
            // setBlockedUsers(response.content || response || []);
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
            } catch {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await userService.updateUserProfile(formData);
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
            const uploadResult = await cloudinaryService.upload(file);
            const response = await userService.updateUserProfile({ avatarUrl: uploadResult.url });
            dispatch(setUser(response));
            setAlertConfig({
                isOpen: true,
                title: "Success",
                message: "Profile photo updated.",
            });
        } catch (error) {
            console.error("Avatar upload failed", error);
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
            const response = await userService.updateUserProfile({ isPrivate: newVal });
            setIsPrivate(response.isPrivate);
            dispatch(setUser(response));
        } catch (error) {
            console.error("Failed to toggle privacy", error);
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
                                        <Flex key={user.id} justify="space-between" align="center" p={4} bg="gray.50" borderRadius="12px">
                                            <HStack gap={4}>
                                                <UserAvatar src={user.avatarUrl} size="50px" />
                                                <VStack align="start" gap={0}>
                                                    <Text fontWeight="bold" fontSize="16px">{user.username}</Text>
                                                    <Text fontSize="14px" color="gray.500">{user.fullName}</Text>
                                                </VStack>
                                            </HStack>
                                            <IconButton icon={<BsStarFill />} variant="ghost" color="black" aria-label="Remove favorite" onClick={() => handleToggleFavorite(user)} />
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
                            <Flex justify="space-between" align="center" p={6} border="1px solid" borderColor="gray.100" borderRadius="12px">
                                <VStack align="start" gap={2} maxW="80%">
                                    <Text fontWeight="bold" fontSize="18px">Private Account</Text>
                                    <Text fontSize="14px" color="gray.500">When your account is private, only people you approve can see your photos and videos.</Text>
                                </VStack>
                                <Box as="button" p={1} width="50px" height="28px" borderRadius="full" bg={isPrivate ? "#0095f6" : "gray.300"} transition="0.3s" onClick={handleTogglePrivate} position="relative">
                                    <Box boxSize="20px" bg="white" borderRadius="full" position="absolute" top="4px" left={isPrivate ? "26px" : "4px"} transition="0.3s" shadow="sm" />
                                </Box>
                            </Flex>
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
