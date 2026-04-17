import storage from 'redux-persist/lib/storage';
import { encryptData, decryptData } from './encryption';

/**
 * Custom transform for redux-persist that encrypts/decrypts state
 * This ensures all persisted data is encrypted
 */
export const encryptTransform = {
  in: (state) => {
    try {
      const encryptedState = {};
      for (const key in state) {
        encryptedState[key] = encryptData(state[key]);
      }
      return encryptedState;
    } catch (error) {
      console.error('Transform in error:', error);
      return state;
    }
  },
  out: (state) => {
    try {
      const decryptedState = {};
      for (const key in state) {
        const decrypted = decryptData(state[key]);
        // Use decrypted value if successful, otherwise discard corrupted data
        // This will trigger reinitializing from the reducer's initialState
        if (decrypted !== null && decrypted !== undefined) {
          decryptedState[key] = decrypted;
        }
        // If decryption failed, omit this key so the reducer's initialState is used
      }
      return decryptedState;
    } catch (error) {
      console.error('Transform out error:', error);
      // Return empty object on transform error to trigger reducer's initialState
      return {};
    }
  },
};

/**
 * Redux Persist configuration
 */
export const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptTransform],
  // NOTE:
  // We apply persistence at the *slice* level (see `src/store/store.js`).
  // So we should NOT whitelist reducer names here (auth/posts), because at the
  // slice level `whitelist` refers to keys inside that slice state.
  // Slice-specific whitelists live in `store.js`.
  timeout: 5000,
  version: 1,
};

export default persistConfig;
