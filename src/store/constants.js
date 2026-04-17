/**
 * Redux Constants
 * Centralized constants used across Redux slices and actions
 */

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
};

// Auth States
export const AUTH_STATES = {
  SIGNED_IN: 'signed_in',
  SIGNED_UP: 'signed_up',
  LOGGED_OUT: 'logged_out',
  AUTH_ERROR: 'auth_error',
  TOKEN_EXPIRED: 'token_expired',
};

// Post Actions
export const POST_ACTIONS = {
  FETCH: 'fetch',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIKE: 'like',
  UNLIKE: 'unlike',
  COMMENT: 'comment',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'Email already registered.',
  FETCH_FAILED: 'Failed to fetch posts.',
  CREATE_FAILED: 'Failed to create post.',
  UPDATE_FAILED: 'Failed to update post.',
  DELETE_FAILED: 'Failed to delete post.',
  LIKE_FAILED: 'Failed to like post.',
  TOKEN_EXPIRED: 'Session expired. Please sign in again.',
};

// Persistence Keys
export const PERSIST_KEYS = {
  AUTH: 'auth',
  POSTS: 'posts',
  ROOT: 'root',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'profile',
  ENCRYPTION_KEY: 'REACT_APP_ENCRYPTION_KEY',
};
