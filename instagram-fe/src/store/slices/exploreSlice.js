import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postService";

export const fetchExplorePosts = createAsyncThunk(
    "explore/fetchPosts",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await postService.getExplorePosts(page, size);
            return response;
        } catch (error) {
            return rejectWithValue(error.apiResponse || error.message);
        }
    }
);

const initialState = {
    posts: [],
    loading: false,
    page: 0,
    hasMore: true,
    error: null,
};

const exploreSlice = createSlice({
    name: "explore",
    initialState,
    reducers: {
        updatePostInExplore: (state, action) => {
            const { id, changes } = action.payload;
            const index = state.posts.findIndex(p => p.id === id);
            if (index !== -1) {
                state.posts[index] = { ...state.posts[index], ...changes };
            }
        },
        resetExplore: (state) => {
            state.posts = [];
            state.page = 0;
            state.hasMore = true;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExplorePosts.pending, (state) => {
                state.loading = state.page === 0;
            })
            .addCase(fetchExplorePosts.fulfilled, (state, action) => {
                const newPosts = action.payload.content || action.payload.posts || (Array.isArray(action.payload) ? action.payload : []);
                const isLast = action.payload.last === true;
                
                if (state.page === 0) {
                    state.posts = newPosts;
                } else {
                    state.posts = [...state.posts, ...newPosts];
                }
                
                state.hasMore = !isLast && newPosts.length > 0;
                state.page += 1;
                state.loading = false;
            })
            .addCase(fetchExplorePosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.hasMore = false;
            });
    },
});

export const { updatePostInExplore, resetExplore } = exploreSlice.actions;
export default exploreSlice.reducer;
