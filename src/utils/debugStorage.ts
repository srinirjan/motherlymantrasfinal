import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugStorage = async () => {
  try {
    console.log('=== ASYNC STORAGE DEBUG ===');
    
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    console.log('All keys:', keys);
    
    // Get all values
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`${key}:`, value);
    }
    
    console.log('=== END DEBUG ===');
  } catch (error) {
    console.error('Debug storage error:', error);
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All storage cleared');
  } catch (error) {
    console.error('Clear storage error:', error);
  }
}; 