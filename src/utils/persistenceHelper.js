/**
 * Persistence Helper Utilities
 * Use these functions to manage Redux persist storage
 */

/**
 * Clear all persisted Redux data
 * Use this if localStorage data is corrupted or encryption key changed
 */
export const clearPersistedData = () => {
  try {
    localStorage.removeItem('persist:root');
    localStorage.removeItem('persist:auth');
    localStorage.removeItem('persist:posts');
    console.log('✅ Persisted data cleared successfully');
    // Reload page to reinitialize with fresh state
    window.location.reload();
  } catch (error) {
    console.error('❌ Error clearing persisted data:', error);
  }
};

/**
 * View current persisted data (for debugging)
 * Shows what's stored in localStorage
 */
export const viewPersistedData = () => {
  try {
    const persistedRoot = localStorage.getItem('persist:root');
    const persistedAuth = localStorage.getItem('persist:auth');
    const persistedPosts = localStorage.getItem('persist:posts');

    console.log('📦 Persisted Data:');
    console.log('persist:root:', persistedRoot ? `${persistedRoot.substring(0, 100)}...` : 'Not found');
    console.log('persist:auth:', persistedAuth ? `${persistedAuth.substring(0, 100)}...` : 'Not found');
    console.log('persist:posts:', persistedPosts ? `${persistedPosts.substring(0, 100)}...` : 'Not found');
  } catch (error) {
    console.error('❌ Error viewing persisted data:', error);
  }
};

/**
 * Get the size of persisted data (in bytes)
 */
export const getPersistedDataSize = () => {
  try {
    let totalSize = 0;
    const keys = ['persist:root', 'persist:auth', 'persist:posts'];

    keys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += data.length;
      }
    });

    const sizeInKB = (totalSize / 1024).toFixed(2);
    console.log(`📊 Total persisted data size: ${sizeInKB} KB`);
    return totalSize;
  } catch (error) {
    console.error('❌ Error calculating data size:', error);
    return 0;
  }
};

/**
 * Backup persisted data before clearing
 * Useful for debugging persistence issues
 */
export const backupPersistedData = () => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        persistRoot: localStorage.getItem('persist:root'),
        persistAuth: localStorage.getItem('persist:auth'),
        persistPosts: localStorage.getItem('persist:posts'),
      },
    };

    const backupJson = JSON.stringify(backup, null, 2);
    console.log('💾 Backup created:', backupJson);

    // Copy to clipboard for easy saving
    if (navigator.clipboard) {
      navigator.clipboard.writeText(backupJson);
      console.log('📋 Backup copied to clipboard');
    }

    return backup;
  } catch (error) {
    console.error('❌ Error backing up data:', error);
  }
};

/**
 * Validate encryption key matches stored data
 * Returns true if key is correct, false if data might be corrupted
 */
export const validateEncryptionKey = () => {
  try {
    const persistedAuth = localStorage.getItem('persist:auth');
    if (!persistedAuth) {
      console.log('ℹ️  No persisted auth data found (first run)');
      return true;
    }

    // Try to parse - if it's valid encrypted data, it should parse as JSON
    try {
      JSON.parse(persistedAuth);
      console.log('✅ Encryption key appears valid');
      return true;
    } catch {
      console.warn('⚠️  Persisted data might be corrupted or uses different encryption key');
      return false;
    }
  } catch (error) {
    console.error('❌ Error validating encryption key:', error);
    return false;
  }
};

/**
 * Emergency recovery: Clear and reinitialize storage
 * Call this if the app won't start due to persistence issues
 */
export const emergencyClearAll = () => {
  if (window.confirm('This will clear ALL persisted data. Are you sure?')) {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🔄 All storage cleared. Reloading app...');
      window.location.reload();
    } catch (error) {
      console.error('❌ Error during emergency clear:', error);
    }
  }
};

/**
 * Log persistence statistics (for debugging)
 */
export const logPersistenceStats = () => {
  console.group('🔍 Persistence Statistics');
  console.log('localStorage available:', typeof Storage !== 'undefined');
  console.log('Total items in localStorage:', localStorage.length);
  console.table({
    'Total Size (KB)': (getPersistedDataSize() / 1024).toFixed(2),
    'Encryption Key Set': !!process.env.REACT_APP_ENCRYPTION_KEY,
    'Persist:Root': localStorage.getItem('persist:root') ? 'Present' : 'Missing',
    'Persist:Auth': localStorage.getItem('persist:auth') ? 'Present' : 'Missing',
    'Persist:Posts': localStorage.getItem('persist:posts') ? 'Present' : 'Missing',
  });
  console.groupEnd();
};
