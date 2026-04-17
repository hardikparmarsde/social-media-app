import CryptoJS from 'crypto-js';

// Use a strong encryption key - in production, use environment variable
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'social-media-app-2026-secure-key-do-not-share';

/**
 * Encrypt data using AES encryption
 * @param {any} data - Data to encrypt
 * @returns {string} - Encrypted data as string
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypt data using AES decryption
 * @param {string} encryptedData - Encrypted data string
 * @returns {any} - Decrypted data object
 */
export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null;
    
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};
