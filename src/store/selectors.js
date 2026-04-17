/**
 * Auth Selectors
 * Memoized selectors for accessing auth state
 */

export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

export const selectIsAuthenticated = (state) => !!state.auth.user;

export const selectUserName = (state) => state.auth.user?.result?.name || null;

export const selectUserEmail = (state) => state.auth.user?.result?.email || null;

export const selectUserToken = (state) => state.auth.user?.token || null;

/**
 * Posts Selectors
 * Memoized selectors for accessing posts state
 */

export const selectPosts = (state) => state.posts;

export const selectAllPosts = (state) => state.posts.posts;

export const selectPostsLoading = (state) => state.posts.loading;

export const selectPostsError = (state) => state.posts.error;

export const selectPostCount = (state) => state.posts.posts.length;

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post._id === postId);

export const selectUserPosts = (state, userId) =>
  state.posts.posts.filter((post) => post.creator === userId);

export const selectPostsByTag = (state, tag) =>
  state.posts.posts.filter((post) =>
    post.tags && post.tags.includes(tag)
  );

export const selectLikedPosts = (state, userId) =>
  state.posts.posts.filter((post) =>
    post.likes && post.likes.includes(userId)
  );
