import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "../../services/profileService";

export const toggleFollow = createAsyncThunk(
    "user/toggleFollow",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await profileService.toggleFollow(userId);
            return response; // Assume returns { isFollowing: boolean }
        } catch (error) {
            return rejectWithValue(error.apiResponse || error.message);
        }
    },
);

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
    extraReducers: (builder) => {
        builder
            .addCase(toggleFollow.pending, (state) => {
                // Optimistic Update: Toggle immediately on UI
                if (state.userProfile) {
                    const isFollowing = state.userProfile.isFollowing;
                    state.userProfile.isFollowing = !isFollowing;
                    state.userProfile.followerCount += isFollowing ? -1 : 1;
                }
            })
            .addCase(toggleFollow.rejected, (state) => {
                // Rollback if API fails
                if (state.userProfile) {
                    const isFollowing = state.userProfile.isFollowing;
                    state.userProfile.isFollowing = !isFollowing;
                    state.userProfile.followerCount += isFollowing ? -1 : 1;
                }
            });
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
