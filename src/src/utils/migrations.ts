
export const CURRENT_VERSION = 2;
const VERSION_KEY = 'app_version';
const STATE_KEY = 'state';

export function migrateLocalStorage(): void {
  try {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    const versionNumber = parseInt(currentVersion || '0');
    
    if (versionNumber < CURRENT_VERSION) {
      console.log(`Migrating from version ${versionNumber} to ${CURRENT_VERSION}`);
      runMigrations(versionNumber);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
      console.log('Migration completed successfully');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    // If migration fails, clear state to prevent app crashes
    localStorage.removeItem(STATE_KEY);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    throw error;
  }
}

function runMigrations(fromVersion: number): void {
  if (fromVersion < 1) {
    migrateFromArrayToV1();
  }
  if (fromVersion < 2) {
    migrateFromV1ToV2();
  }
  // Future migrations can be added here
}

/**
 * Migrate from direct array format to v1 format
 * From: [events...]
 * To: { events: [...], addEventModal: {...}, ... }
 */
function migrateFromArrayToV1(): void {
  const currentState = localStorage.getItem(STATE_KEY);
  if (!currentState) return;
  
  try {
    const parsed = JSON.parse(currentState);
    
    // Check if it's a direct array (very old format)
    if (Array.isArray(parsed)) {
      console.log('Migrating from array format to v1');
      
      // Create backup
      const backupKey = `state_backup_array_${Date.now()}`;
      localStorage.setItem(backupKey, currentState);
      
      // Convert to v1 format
      const v1State = {
        events: parsed,
        selectedYear: new Date().getFullYear(),
        vacationAllowance: { [new Date().getFullYear()]: 27 },
        addEventModal: { opened: false },
        editEventModal: { opened: false },
        deleteEventModal: { opened: false }
      };
      
      localStorage.setItem(STATE_KEY, JSON.stringify(v1State));
      console.log('Array format migrated to v1. Backup saved as:', backupKey);
    }
  } catch (error) {
    console.error('Failed to migrate from array format:', error);
    throw error;
  }
}

/**
 * Migrate from v1 flat structure to v2 Redux structure
 * From: { events: [...], addEventModal: {...}, ... }
 * To: { events: { events: [...], addEventModal: {...}, ... } }
 */
function migrateFromV1ToV2(): void {
  const currentState = localStorage.getItem(STATE_KEY);
  if (!currentState) return;
  
  try {
    const parsed = JSON.parse(currentState);
    
    // Check if it's v1 format (flat structure with events array)
    if (parsed.events && Array.isArray(parsed.events) && 
        parsed.addEventModal && parsed.editEventModal && parsed.deleteEventModal &&
        !parsed.events.events) { // Make sure it's not already v2 format
      
      console.log('Migrating from v1 to v2 format');
      
      // Create backup
      const backupKey = `state_backup_v1_${Date.now()}`;
      localStorage.setItem(backupKey, currentState);
      
      // Convert to v2 format (Redux structure)
      const v2State = {
        events: {
          events: parsed.events,
          selectedYear: parsed.selectedYear || new Date().getFullYear(),
          vacationAllowance: parsed.vacationAllowance || { [new Date().getFullYear()]: 27 },
          addEventModal: parsed.addEventModal || { opened: false },
          editEventModal: parsed.editEventModal || { opened: false },
          deleteEventModal: parsed.deleteEventModal || { opened: false }
        }
      };
      
      localStorage.setItem(STATE_KEY, JSON.stringify(v2State));
      console.log('v1 format migrated to v2. Backup saved as:', backupKey);
    }
  } catch (error) {
    console.error('Failed to migrate from v1 to v2:', error);
    throw error;
  }
}

/**
 * Clean up old backups (keep only last 5)
 */
export function cleanupOldBackups(): void {
  try {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('state_backup_'))
      .sort((a, b) => {
        const timestampA = parseInt(a.split('_').pop() || '0');
        const timestampB = parseInt(b.split('_').pop() || '0');
        return timestampB - timestampA; // Sort descending (newest first)
      });
    
    // Keep only the 5 most recent backups
    const keysToDelete = backupKeys.slice(5);
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
      console.log('Cleaned up old backup:', key);
    });
  } catch (error) {
    console.error('Failed to cleanup old backups:', error);
  }
}

/**
 * Get list of available backups
 */
export function getAvailableBackups(): string[] {
  return Object.keys(localStorage)
    .filter(key => key.startsWith('state_backup_'))
    .sort((a, b) => {
      const timestampA = parseInt(a.split('_').pop() || '0');
      const timestampB = parseInt(b.split('_').pop() || '0');
      return timestampB - timestampA; // Sort descending (newest first)
    });
}

/**
 * Restore from backup (for emergency use)
 */
export function restoreFromBackup(backupKey: string): boolean {
  try {
    const backupData = localStorage.getItem(backupKey);
    if (!backupData) {
      console.error('Backup not found:', backupKey);
      return false;
    }
    
    // Validate backup data
    JSON.parse(backupData);
    
    localStorage.setItem(STATE_KEY, backupData);
    console.log('Restored from backup:', backupKey);
    return true;
  } catch (error) {
    console.error('Failed to restore from backup:', error);
    return false;
  }
}
