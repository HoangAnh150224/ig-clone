import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DialogRoot,
    DialogBackdrop,
    DialogContent,
    DialogBody,
    DialogPositioner,
    VStack,
    Box,
    Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import postService from "../../services/postService";
import userService from "../../services/userService";
import profileService from "../../services/profileService";
import { updatePostInStore } from "../../store/slices/postSlice";
import { updatePostInProfile } from "../../store/slices/userSlice";
import { updatePostInExplore } from "../../store/slices/exploreSlice";
import { setUser as setAuthUser } from "../../store/slices/authSlice";
import EditPostModal from "./EditPostModal";

const OptionButton = ({
    label,
    color = "black",
    fontWeight = "normal",
    onClick,
}) => (
    <Box
        width="100%"
        py={3.5}
        textAlign="center"
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        onClick={onClick}
    >
        <Text color={color} fontWeight={fontWeight} fontSize="14px">
            {label}
        </Text>
    </Box>
);

const MoreOptionsModal = ({
    isOpen,
    onClose,
    isOwnPost,
    post,
    isProfile = false,
    isOwnProfile = false,
    user,
    onParentClose,
    isBlocked = false,
    onPostAction,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authUser = useSelector((state) => state.auth.user);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [view, setView] = useState("main"); // 'main', 'report', or 'block'
    const [reportSuccess, setReportSuccess] = useState(false);
    const [blockSuccess, setBlockSuccess] = useState(false);

    const reportReasons = [
        "It's spam",
        "Nudity or sexual activity",
        "Hate speech or symbols",
        "Violence or dangerous organizations",
        "Bullying or harassment",
        "Intellectual property violation",
        "Suicide or self-injury",
        "Eating disorders",
        "Scams or fraud",
        "False information",
    ];

    const handleAction = async (action, extraData = null) => {
        // HANDLE NAVIGATION FIRST
        if (action === "settings") {
            navigate("/accounts/edit");
            onClose();
            if (onParentClose) onParentClose();
            return;
        } else if (action === "go_to_post") {
            navigate(`/p/${post?.id}`);
            onClose();
            if (onParentClose) onParentClose();
            return;
        }

        // HANDLE BACKEND LOGIC
        try {
            const targetUserId = isProfile ? user?.id : post?.author?.id;

            switch (action) {
                case "delete":
                    if (!post?.id) return;
                    await postService.deletePost(post.id);
                    if (onPostAction) onPostAction(post.id, "delete");
                    if (onParentClose) onParentClose();
                    break;
                case "archive": {
                    if (!post?.id) return;
                    const archivedPost = await postService.archivePost(post.id);
                    const changes = { archived: archivedPost?.archived };
                    dispatch(updatePostInStore({ id: post.id, changes }));
                    dispatch(updatePostInProfile({ id: post.id, changes }));
                    dispatch(updatePostInExplore({ id: post.id, changes }));
                    
                    if (onPostAction) onPostAction(post.id, "archive", changes);
                    if (onParentClose) onParentClose();
                    onClose();
                    break;
                }
                case "edit":
                    setIsEditOpen(true);
                    return;
                case "report_init":
                    setView("report");
                    return;
                case "report_submit":
                    if (!post?.id) return;
                    await postService.reportPost(post.id, extraData);
                    setReportSuccess(true);
                    setTimeout(() => handleClose(), 2000);
                    return;
                case "custom_block_init": // Renamed to avoid conflicts
                    setView("block");
                    return;
                case "block_submit":
                    if (!targetUserId) return;
                    await userService.blockUser(targetUserId);
                    setBlockSuccess(true);
                    setTimeout(() => handleClose(), 2000);
                    return;
                case "unblock":
                    if (!targetUserId) return;
                    await userService.blockUser(targetUserId); // Toggle
                    break;
                case "unfollow":
                    if (!targetUserId) return;
                    await profileService.toggleFollow(targetUserId);
                    break;
                case "toggle_favorite_user": {
                    if (!targetUserId) return;
                    await userService.toggleFavoriteUser(targetUserId);
                    if (authUser) {
                        const currentFavs = authUser.favoriteUserIds || [];
                        const isFav = currentFavs.includes(targetUserId);
                        const newFavs = isFav 
                            ? currentFavs.filter(id => id !== targetUserId)
                            : [...currentFavs, targetUserId];
                        
                        dispatch(setAuthUser({
                            ...authUser,
                            favoriteUserIds: newFavs
                        }));
                    }
                    break;
                }
                case "toggle_favorite_post":
                    if (!post?.id) return;
                    await postService.togglePostFavorite(post.id);
                    break;
                case "copy_link": {
                    const linkToCopy = isProfile
                        ? window.location.origin + `/${user?.username}`
                        : window.location.origin + `/p/${post?.id}`;
                    await navigator.clipboard.writeText(linkToCopy);
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            console.error("Action failed:", error);
        }

        if (action !== "report_submit" && action !== "block_submit") handleClose();
    };

    const handleClose = () => {
        setView("main");
        setReportSuccess(false);
        setBlockSuccess(false);
        onClose();
    };

    return (
        <>
            <DialogRoot
                size="xs"
                open={isOpen && !isEditOpen}
                onOpenChange={(e) => {
                    if (!e.open) handleClose();
                }}
                placement="center"
            >
                <DialogBackdrop bg="blackAlpha.600" />
                <DialogPositioner>
                    <DialogContent
                        borderRadius="12px"
                        overflow="hidden"
                        bg="white"
                        p={0}
                        maxW="400px"
                        width="90vw"
                    >
                        <DialogBody p={0}>
                            <VStack gap={0}>
                                {view === "main" ? (
                                    <>
                                        {isProfile ? (
                                            isOwnProfile ? (
                                                <>
                                                    <OptionButton label="Settings" onClick={() => handleAction("settings")} />
                                                    <Box width="100%" height="1px" bg="gray.100" />
                                                    <OptionButton label="Archive" onClick={() => navigate("/archive")} />
                                                    <Box width="100%" height="1px" bg="gray.100" />
                                                    <OptionButton label="QR Code" onClick={() => {}} />
                                                </>
                                            ) : (
                                                <>
                                                    <OptionButton
                                                        label={isBlocked ? "Unblock" : "Block"}
                                                        color="#ed4956"
                                                        fontWeight="bold"
                                                        onClick={() => isBlocked ? handleAction("unblock") : handleAction("block_init")}
                                                    />
                                                    <Box width="100%" height="1px" bg="gray.100" />
                                                    <OptionButton label="Report" color="#ed4956" fontWeight="bold" onClick={() => handleAction("report_init")} />
                                                </>
                                            )
                                        ) : isOwnPost ? (
                                            <>
                                                <OptionButton label="Delete" color="#ed4956" fontWeight="bold" onClick={() => handleAction("delete")} />
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label={post?.archived ? "Unarchive" : "Archive"} onClick={() => handleAction("archive")} />
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label="Edit" onClick={() => handleAction("edit")} />
                                            </>
                                        ) : (
                                            <>
                                                <OptionButton label="Report" color="#ed4956" fontWeight="bold" onClick={() => handleAction("report_init")} />
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label="Unfollow" color="#ed4956" fontWeight="bold" onClick={() => handleAction("unfollow")} />
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton 
                                                    label={authUser?.favoriteUserIds?.includes(post?.author?.id) ? "Remove from Favorites" : "Add to Favorites"} 
                                                    color={authUser?.favoriteUserIds?.includes(post?.author?.id) ? "#ed4956" : "black"}
                                                    onClick={() => handleAction("toggle_favorite_user")} 
                                                />
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton 
                                                    label={post?.isFavorite ? "Remove from favorite posts" : "Add to favorite posts"} 
                                                    onClick={() => handleAction("toggle_favorite_post")} 
                                                />
                                            </>
                                        )}

                                        {!isProfile && (
                                            <>
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label="Go to post" onClick={() => handleAction("go_to_post")} />
                                            </>
                                        )}

                                        <Box width="100%" height="1px" bg="gray.100" />
                                        <OptionButton label="Copy link" onClick={() => handleAction("copy_link")} />
                                        <Box width="100%" height="1px" bg="gray.100" />
                                        <OptionButton label="Cancel" onClick={handleClose} />
                                    </>
                                ) : view === "report" ? (
                                    <Box width="100%">
                                        <Box py={3} borderBottom="1px solid" borderColor="gray.100" textAlign="center">
                                            <Text fontWeight="600" fontSize="16px">Report</Text>
                                        </Box>
                                        {reportSuccess ? (
                                            <Box p={8} textAlign="center">
                                                <Text fontSize="14px" color="gray.600">Thanks for letting us know. Your report has been submitted.</Text>
                                            </Box>
                                        ) : (
                                            <VStack gap={0} maxH="400px" overflowY="auto">
                                                <Box p={4} width="100%">
                                                    <Text fontWeight="600" fontSize="14px" color="gray.600">Why are you reporting this post?</Text>
                                                </Box>
                                                {reportReasons.map((reason, index) => (
                                                    <React.Fragment key={reason}>
                                                        <OptionButton label={reason} onClick={() => handleAction("report_submit", reason)} />
                                                        {index < reportReasons.length - 1 && <Box width="100%" height="1px" bg="gray.100" />}
                                                    </React.Fragment>
                                                ))}
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label="Cancel" onClick={() => setView("main")} />
                                            </VStack>
                                        )}
                                    </Box>
                                ) : (
                                    <Box width="100%">
                                        <Box py={6} px={10} textAlign="center">
                                            <Text fontWeight="600" fontSize="18px" mb={2}>Block {isProfile ? user?.username : post?.author?.username}?</Text>
                                            <Text fontSize="14px" color="gray.500">They won't be able to find your profile, posts or story on Instagram. They won't know you blocked them.</Text>
                                        </Box>
                                        {blockSuccess ? (
                                            <Box p={8} textAlign="center" borderTop="1px solid" borderColor="gray.100">
                                                <Text fontSize="14px" color="#ed4956" fontWeight="600">User blocked.</Text>
                                            </Box>
                                        ) : (
                                            <VStack gap={0}>
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label="Block" color="#ed4956" fontWeight="bold" onClick={() => handleAction("block_submit")} />
                                                <Box width="100%" height="1px" bg="gray.100" />
                                                <OptionButton label="Cancel" onClick={() => setView("main")} />
                                            </VStack>
                                        )}
                                    </Box>
                                )}
                            </VStack>
                        </DialogBody>
                    </DialogContent>
                </DialogPositioner>
            </DialogRoot>

            <EditPostModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); onClose(); }} post={post} />
        </>
    );
};

export default MoreOptionsModal;