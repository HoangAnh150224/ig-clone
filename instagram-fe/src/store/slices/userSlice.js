import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userProfile: null, // Thông tin user đang xem trên trang Profile
  posts: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setProfilePosts: (state, action) => {
      state.posts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setUserProfile, setProfilePosts, setLoading } = userSlice.actions;
export default userSlice.reducer;
