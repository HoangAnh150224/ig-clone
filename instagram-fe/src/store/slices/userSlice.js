import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "../../services/profileService";

export const toggleFollow = createAsyncThunk(
    "user/toggleFollow",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await profileService.toggleFollow(userId);
            // Response format: { followerId, followingId, status } 
            // status is 'PENDING', 'ACCEPTED', or null (unfollowed)
            return response; 
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
        updatePostInProfile: (state, action) => {
            const { id, changes } = action.payload;
            
            // If post is archived, remove it from the profile view
            if (changes.archived === true) {
                state.posts = state.posts.filter(p => p.id !== id);
                if (state.userProfile) {
                    state.userProfile.postsCount = Math.max(0, (state.userProfile.postsCount || 0) - 1);
                }
                return;
            }

            const index = state.posts.findIndex(p => p.id === id);
            if (index !== -1) {
                state.posts[index] = { ...state.posts[index], ...changes };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleFollow.pending, (state) => {
                // Optimistic Update: Toggle immediately on UI
                if (state.userProfile) {
                    const isFollowing = state.userProfile.isFollowing;
                    const isPending = state.userProfile.isPending;
                    const isPrivate = state.userProfile.privateAccount;

                    if (isFollowing) {
                        // Unfollow
                        state.userProfile.isFollowing = false;
                        state.userProfile.followersCount = Math.max(0, (state.userProfile.followersCount || 0) - 1);
                    } else if (isPending) {
                        // Cancel request
                        state.userProfile.isPending = false;
                    } else {
                        // Follow
                        if (isPrivate) {
                            state.userProfile.isPending = true;
                        } else {
                            state.userProfile.isFollowing = true;
                            state.userProfile.followersCount = (state.userProfile.followersCount || 0) + 1;
                        }
                    }
                }
            })
            .addCase(toggleFollow.fulfilled, (state, action) => {
                // Sync with server response
                if (state.userProfile) {
                    const { status } = action.payload;
                    state.userProfile.isFollowing = (status === "ACCEPTED");
                    state.userProfile.isPending = (status === "PENDING");
                }
            })
            .addCase(toggleFollow.rejected, (state) => {
                // Simple rollback for now - usually we'd need old state
                // This is a bit tricky with multiple toggle modes, 
                // but for now let's just force a refresh or accept the glitch.
            });
    },
});

export const {
    setUserProfile,
    setProfilePosts,
    setLoading,
    resetProfile,
    updateUserProfile,
    updatePostInProfile,
} = userSlice.actions;
export default userSlice.reducer;
