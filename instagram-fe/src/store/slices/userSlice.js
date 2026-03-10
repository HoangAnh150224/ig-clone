import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: null, // Information of the user being viewed on the Profile page
    posts: [],
    loading: false,
};

const userSlice = createSlice({
    name: "user",
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
        },
        resetProfile: (state) => {
            state.userProfile = null;
            state.posts = [];
        },
        updateUserProfile: (state, action) => {
            if (state.userProfile) {
                state.userProfile = { ...state.userProfile, ...action.payload };
            }
        },
    },
});

export const {
    setUserProfile,
    setProfilePosts,
    setLoading,
    resetProfile,
    updateUserProfile,
} = userSlice.actions;
export default userSlice.reducer;
