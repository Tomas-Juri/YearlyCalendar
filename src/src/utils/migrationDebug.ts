import { getAvailableBackups, restoreFromBackup, CURRENT_VERSION } from './migrations';

/**
 * Development tools for debugging migrations
 * These functions are available in the browser console for debugging
 */

// Make migration tools available globally in development
if (typeof window !== 'undefined' && (window as any).location?.hostname === 'localhost') {
  (window as any).migrationDebug = {
    getCurrentVersion: () => {
      return localStorage.getItem('app_version') || '0';
    },
    
    setVersion: (version: number) => {
      localStorage.setItem('app_version', version.toString());
      console.log(`Version set to ${version}`);
    },
    
    getAvailableBackups: () => {
      const backups = getAvailableBackups();
      console.log('Available backups:', backups);
      return backups;
    },
    
    restoreFromBackup: (backupKey: string) => {
      const success = restoreFromBackup(backupKey);
      if (success) {
        console.log(`Restored from backup: ${backupKey}`);
        console.log('Reload the page to see changes');
      }
      return success;
    },
    
    getCurrentState: () => {
      const state = localStorage.getItem('state');
      if (state) {
        try {
          return JSON.parse(state);
        } catch (error) {
          console.error('Failed to parse state:', error);
          return null;
        }
      }
      return null;
    },
    
    clearState: () => {
      localStorage.removeItem('state');
      localStorage.removeItem('app_version');
      console.log('State cleared. Reload the page to start fresh.');
    },
    
    simulateOldFormat: (format: 'array' | 'v1') => {
      if (format === 'array') {
        const arrayState = [
          {
            "title": "Test Event",
            "description": "Test Description",
            "from": "2025-07-20T22:00:00.000Z",
            "fromType": "Full day",
            "to": "2025-07-20T22:00:00.000Z",
            "toType": "Full day",
            "id": "test-id-123"
          }
        ];
        localStorage.setItem('state', JSON.stringify(arrayState));
        localStorage.setItem('app_version', '0');
        console.log('Simulated old array format. Reload the page to trigger migration.');
      } else if (format === 'v1') {
        const v1State = {
          events: [
            {
              "title": "Test Event",
              "description": "Test Description", 
              "from": "2025-07-20T22:00:00.000Z",
              "fromType": "Full day",
              "to": "2025-07-20T22:00:00.000Z",
              "toType": "Full day",
              "id": "test-id-123"
            }
          ],
          selectedYear: 2025,
          vacationAllowance: { "2025": 27 },
          addEventModal: { opened: false },
          editEventModal: { opened: false },
          deleteEventModal: { opened: false }
        };
        localStorage.setItem('state', JSON.stringify(v1State));
        localStorage.setItem('app_version', '1');
        console.log('Simulated v1 format. Reload the page to trigger migration.');
      }
    },
    
    help: () => {
      console.log(`
Migration Debug Tools:
- getCurrentVersion(): Get current version number
- setVersion(version): Set version number
- getAvailableBackups(): List all available backups
- restoreFromBackup(backupKey): Restore from specific backup
- getCurrentState(): Get current state from localStorage
- clearState(): Clear all state and version info
- simulateOldFormat('array' | 'v1'): Simulate old format for testing
- help(): Show this help message

Current app version: ${CURRENT_VERSION}
Current stored version: ${localStorage.getItem('app_version') || '0'}
      `);
    }
  };
  
  console.log('Migration debug tools available at window.migrationDebug');
  console.log('Type migrationDebug.help() for available commands');
}
