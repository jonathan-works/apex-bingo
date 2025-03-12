import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DATABASE_FILE = 'path/to/your/database.db'; // Update with your database file path

export const initializeDatabase = async () => {
  const db = await open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    )
  `);

  return db;
};

export const getUsers = async (db) => {
  return await db.all('SELECT * FROM users');
};

export const createUser = async (db, name, email) => {
  const result = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
  return result.lastID;
};