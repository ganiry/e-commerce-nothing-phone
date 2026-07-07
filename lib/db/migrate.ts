import { migrate as drizzleMigrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index';

console.log('[migrate] applying migrations to', process.env.DB_FILE_NAME ?? 'database.sqlite');
drizzleMigrate(db, { migrationsFolder: './lib/db/migrations' });
console.log('[migrate] done');
