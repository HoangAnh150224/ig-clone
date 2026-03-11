import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCreatePostModalOpen: false,
    isMuted: true, // Default to mute per Instagram standard
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
    },
});

export const { openCreatePostModal, closeCreatePostModal, toggleMute } =
    uiSlice.actions;
export default uiSlice.reducer;
