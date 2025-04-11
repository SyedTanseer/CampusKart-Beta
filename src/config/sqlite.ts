import Database from 'better-sqlite3';
import path from 'path';

// Create database instance
const db = new Database(path.join(__dirname, '../../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    college TEXT NOT NULL,
    phone TEXT,
    profile_picture TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create index on email for faster lookups
db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');

export default db; 