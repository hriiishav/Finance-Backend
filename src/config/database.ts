import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export const getDb = async (): Promise<Database> => {
  if (dbInstance) return dbInstance;
  
  dbInstance = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });
  
  return dbInstance;
};

export const initDb = async () => {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('VIEWER', 'ANALYST', 'ADMIN')),
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE'))
    );
    
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_by INTEGER NOT NULL,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};
