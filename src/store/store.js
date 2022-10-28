import { configureStore } from "@reduxjs/toolkit";
import  AuthReducer  from "../slices/AuthSlice";
import PostReducer from "../slices/PostSlice";

const store = configureStore({
    reducer: {
        posts: PostReducer,
        auth: AuthReducer
    }
});

export default store;