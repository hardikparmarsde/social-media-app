import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import persistConfig from "../utils/persistConfig";
import AuthReducer from "../slices/AuthSlice";
import PostReducer from "../slices/PostSlice";

/**
 * Apply persistence to auth reducer with encryption
 */
const persistedAuthReducer = persistReducer(
  {
    ...persistConfig,
    key: 'auth',
    whitelist: ['user'], // persist only session data
  },
  AuthReducer
);

/**
 * Apply persistence to posts reducer with encryption
 */
const persistedPostsReducer = persistReducer(
  {
    ...persistConfig,
    key: 'posts',
    whitelist: ['posts'], // persist only the posts list (optional but fine)
  },
  PostReducer
);

/**
 * Configure Redux store with middleware and dev tools
 */
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    posts: persistedPostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these actions which contain non-serializable data
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/PURGE',
        ],
        ignoredPaths: ['auth', 'posts'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Create persistor for rehydration
 */
export const persistor = persistStore(store);

export default store;
