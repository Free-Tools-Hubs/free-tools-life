import { set, get } from 'idb-keyval';
import { useToastStore } from '../store/useToastStore';

const BACKUP_KEY = 'life-hub-full-backup';

export const backupToIndexedDB = async (data: any) => {
  try {
    // Force serialization to strip non-cloneable items (functions, etc)
    const serializableData = JSON.parse(JSON.stringify(data));
    
    await set(BACKUP_KEY, {
      ...serializableData,
      backupTimestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to backup to IndexedDB', err);
    useToastStore.getState().addToast('Storage quota reached! Your progress might not be saved.', 'error');
  }
};

export const restoreFromIndexedDB = async () => {
  try {
    return await get(BACKUP_KEY);
  } catch (err) {
    console.error('Failed to restore from IndexedDB', err);
    return null;
  }
};
