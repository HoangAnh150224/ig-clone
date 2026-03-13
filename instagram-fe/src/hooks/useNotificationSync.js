import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    incrementUnreadNotificationCount,
    setUnreadNotificationCount,
} from "../store/slices/uiSlice";
import { updateUserProfile } from "../store/slices/userSlice";
import notificationService from "../services/notificationService";
import useStomp from "./useStomp";

const useNotificationSync = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { userProfile } = useSelector((state) => state.user);
    const { connected, subscribe } = useStomp("/ws");

    // Fetch initial unread count
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            notificationService
                .getUnreadCount()
                .then((count) => {
                    dispatch(setUnreadNotificationCount(count));
                })
                .catch(console.error);
        }
    }, [dispatch, isAuthenticated, user?.id]);

    // GLOBAL WEBSOCKET FOR NOTIFICATIONS
    useEffect(() => {
        if (connected && user?.id) {
            const sub = subscribe(
                `/user/${user.id}/queue/notifications`,
                (notification) => {
                    dispatch(incrementUnreadNotificationCount());

                    // Real-time sync follow status if looking at the actor's profile
                    if (
                        userProfile &&
                        userProfile.id === notification.actor?.id
                    ) {
                        if (notification.type === "FOLLOW_ACCEPTED") {
                            dispatch(
                                updateUserProfile({
                                    isFollowing: true,
                                    isPending: false,
                                    followersCount:
                                        (userProfile.followersCount || 0) + 1,
                                    canViewContent: true,
                                }),
                            );
                        } else if (notification.type === "FOLLOW_REQUEST") {
                            // Handled by other updates if necessary
                        }
                    }
                },
            );
            return () => sub?.unsubscribe();
        }
    }, [connected, subscribe, user?.id, dispatch, userProfile]);
};

export default useNotificationSync;
