import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreatePostModalOpen: false,
    isMuted: true, // Default to mute per Instagram standard
    globalError: null,
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
    },
});

export const {
    openCreatePostModal,
    closeCreatePostModal,
    toggleMute,
    setGlobalError,
    clearGlobalError,
} = uiSlice.actions;
export default uiSlice.reducer;
