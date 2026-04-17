import { createSlice } from "@reduxjs/toolkit";
import { fetchPosts, fetchTrendingPosts, searchPosts, createPost, updatePost, deletePost, likePost, addComment, deleteComment } from "../actions/actions";

const PostSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Sanitize persisted state from older app versions
        builder.addCase('persist/REHYDRATE', (state, action) => {
            const incoming = action?.payload?.posts;
            if (!incoming) return;

            const persistedPosts = incoming.posts;
            if (Array.isArray(persistedPosts)) return;

            if (persistedPosts && Array.isArray(persistedPosts.data)) {
                state.posts = persistedPosts.data;
            } else {
                state.posts = [];
            }
        });

        // Fetch Posts
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload?.data || [];
                state.currentPage = action.payload?.currentPage || 1;
                state.totalPages = action.payload?.totalPages || 1;
                state.totalItems = action.payload?.totalItems ?? state.posts.length;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create Post
        builder
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                // Show newest post first (matches backend sorting on refresh)
                const next = action.payload;
                state.posts = [next, ...state.posts.filter((p) => p?._id !== next?._id)];
                state.totalItems = (state.totalItems || 0) + 1;
                // Keep list size reasonable for paginated feed (page size is 6)
                if (state.posts.length > 6) state.posts = state.posts.slice(0, 6);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Post
        builder
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                );
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Post
        builder
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = state.posts.filter((post) => post._id !== action.payload);
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Like Post
        builder
            .addCase(likePost.fulfilled, (state, action) => {
                state.posts = state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                );
            })
            .addCase(likePost.rejected, (state, action) => {
                state.error = action.payload;
            });

        // Trending / Search (replace list)
        builder
            .addCase(fetchTrendingPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrendingPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
                state.currentPage = 1;
                state.totalPages = 1;
                state.totalItems = action.payload?.length || 0;
            })
            .addCase(fetchTrendingPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(searchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
                state.currentPage = 1;
                state.totalPages = 1;
                state.totalItems = action.payload?.length || 0;
            })
            .addCase(searchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Comments (update single post in list)
        builder
            .addCase(addComment.fulfilled, (state, action) => {
                state.posts = state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                );
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.posts = state.posts.map((post) =>
                    post._id === action.payload._id ? action.payload : post
                );
            });
    }
});

export default PostSlice.reducer;