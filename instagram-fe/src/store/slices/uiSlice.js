import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCreatePostModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreatePostModal: (state) => {
      state.isCreatePostModalOpen = true;
    },
    closeCreatePostModal: (state) => {
      state.isCreatePostModalOpen = false;
    },
  },
});

export const { openCreatePostModal, closeCreatePostModal } = uiSlice.actions;
export default uiSlice.reducer;
