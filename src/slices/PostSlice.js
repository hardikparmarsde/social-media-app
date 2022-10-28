import { createSlice } from "@reduxjs/toolkit";


const PostSlice = createSlice({
    name:"posts",
    initialState: {
        posts: []   
    },
    reducers: {
        fetchingPosts(state, action) {
            state.posts = action.payload;
        },
        postCreated(state, action) {
            state.posts.push(action.payload)
        },
        postUpdated(state, action) {
            return {
               ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post)
            }          
        },
        postDeleted(state, action) {
            return { ...state, posts: state.posts.filter((post) => post._id  !== action.payload) }
        },
        postLiked(state, action) {
            return {
                ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post)
             }          
         }
    }
})

export const { fetchingPosts, postAdded, postDeleted, postUpdated } = PostSlice.actions;

export default PostSlice.reducer;