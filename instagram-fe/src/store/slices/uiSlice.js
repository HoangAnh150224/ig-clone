import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreatePostModalOpen: false,
    isMuted: true, // Default to mute per Instagram standard
    globalError: null,
    unreadNotificationCount: 0,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openCreatePostModal: (state) => {
            state.isCreatePostModalOpen = true;
        },
        closeCreatePostModal: (state) => {
            state.isCreatePostModalOpen = false;
        },
        toggleMute: (state) => {
            state.isMuted = !state.isMuted;
        },
        setGlobalError: (state, action) => {
            state.globalError = action.payload;
        },
        clearGlobalError: (state) => {
            state.globalError = null;
        },
        setUnreadNotificationCount: (state, action) => {
            state.unreadNotificationCount = action.payload;
        },
        incrementUnreadNotificationCount: (state) => {
            state.unreadNotificationCount += 1;
        },
        clearUnreadNotificationCount: (state) => {
            state.unreadNotificationCount = 0;
        },
    },
});

export const {
    openCreatePostModal,
    closeCreatePostModal,
    toggleMute,
    setGlobalError,
    clearGlobalError,
    setUnreadNotificationCount,
    incrementUnreadNotificationCount,
    clearUnreadNotificationCount,
} = uiSlice.actions;
export default uiSlice.reducer;
