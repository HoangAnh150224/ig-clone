import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';

// Sử dụng Entity Adapter để chuẩn hóa dữ liệu (Normalized Data)
const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      // Tạm thời dùng dữ liệu giả, sau này sẽ gọi API từ Spring Boot
      // const response = await postService.getAllPosts(page, size);
      // return response.data;
      return []; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    status: 'idle',
    error: null,
    hasMore: true,
    page: 0,
  }),
  reducers: {
    // Tối ưu UI: Like bài viết ngay lập tức (Optimistic Update)
    toggleLikePost: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.entities[postId];
      if (post) {
        const index = post.likes.indexOf(userId);
        if (index === -1) {
          post.likes.push(userId);
          post.likeCount += 1;
        } else {
          post.likes.splice(index, 1);
          post.likeCount -= 1;
        }
      }
    },
    // Mock data để test UI
    setMockPosts: (state, action) => {
      postsAdapter.setAll(state, action.payload);
    },
    addMockPosts: (state, action) => {
      postsAdapter.upsertMany(state, action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        postsAdapter.upsertMany(state, action.payload);
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { toggleLikePost, setMockPosts, addMockPosts } = postSlice.actions;

// Selectors tự động tạo bởi Adapter
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

export default postSlice.reducer;
