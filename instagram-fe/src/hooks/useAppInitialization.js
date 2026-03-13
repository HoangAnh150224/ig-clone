import useAuthSync from "./useAuthSync";
import useFavoriteSync from "./useFavoriteSync";
import useNotificationSync from "./useNotificationSync";

/**
 * Custom hook to initialize global app state and connections.
 * This keeps App.jsx clean and focused on routing.
 */
const useAppInitialization = () => {
    // Sync authentication state from local storage or validate token
    useAuthSync();

    // Sync favorite users state
    useFavoriteSync();

    // Sync non-read notifications and connect to WebSocket STOMP
    useNotificationSync();
};

export default useAppInitialization;
