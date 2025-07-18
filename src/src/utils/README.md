# Migration System

This migration system automatically handles local storage schema changes without requiring user intervention.

## How it Works

1. **Automatic Detection**: When the app starts, it checks the stored version against the current version
2. **Progressive Migration**: Runs all necessary migrations in sequence
3. **Backup Creation**: Creates automatic backups before each migration
4. **Error Handling**: Falls back to fresh state if migrations fail
5. **Cleanup**: Keeps only the 5 most recent backups

## Version History

- **Version 0**: Direct array format `[events...]`
- **Version 1**: Flat object format `{ events: [...], addEventModal: {...}, ... }`
- **Version 2**: Redux format `{ events: { events: [...], addEventModal: {...}, ... } }`

## Files

- `migrations.ts`: Core migration logic
- `migrationDebug.ts`: Development tools for testing migrations

## Adding New Migrations

1. Update `CURRENT_VERSION` in `migrations.ts`
2. Add a new migration function
3. Call it from `runMigrations()` 
4. Test with debug tools

Example:
```typescript
// migrations.ts
export const CURRENT_VERSION = 3;

function runMigrations(fromVersion: number): void {
  if (fromVersion < 1) {
    migrateFromArrayToV1();
  }
  if (fromVersion < 2) {
    migrateFromV1ToV2();
  }
  if (fromVersion < 3) {
    migrateFromV2ToV3(); // New migration
  }
}

function migrateFromV2ToV3(): void {
  // Migration logic here
}
```

## Development Tools

In development mode, migration debug tools are available in the browser console:

```javascript
// Check current version
migrationDebug.getCurrentVersion()

// List available backups
migrationDebug.getAvailableBackups()

// Simulate old format for testing
migrationDebug.simulateOldFormat('v1')

// Restore from backup
migrationDebug.restoreFromBackup('state_backup_v1_1234567890')

// Get help
migrationDebug.help()
```

## Error Handling

- If migration fails, the app clears local storage and starts fresh
- Users won't lose their data permanently due to automatic backups
- Console warnings are logged for debugging

## Backup Naming

Backups are named with the format:
- `state_backup_array_<timestamp>`: From old array format
- `state_backup_v1_<timestamp>`: From v1 format
- `state_backup_v2_<timestamp>`: From v2 format (future use)

## Testing

1. Use `migrationDebug.simulateOldFormat()` to test migrations
2. Check console logs for migration progress
3. Verify backups are created with `getAvailableBackups()`
4. Test error scenarios by corrupting local storage

## Best Practices

1. **Always create backups** before modifying data
2. **Test migrations thoroughly** with debug tools
3. **Keep migration logic simple** and focused
4. **Document breaking changes** in version comments
5. **Consider data validation** in migration functions
