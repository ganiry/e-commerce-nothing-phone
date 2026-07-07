import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const DB_FILE = process.env.DB_FILE_NAME ?? 'database.sqlite';

const globalForDb = globalThis as unknown as { __db?: ReturnType<typeof createDb> };

function createDb() {
  const sqlite = new Database(DB_FILE);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle({ client: sqlite });
}

export const db = globalForDb.__db ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__db = db;
}
