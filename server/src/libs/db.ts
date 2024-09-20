import sqlite3 from "sqlite3";
import { logger } from "./logger";

const db = new sqlite3.Database('databae.db');

function initDB() {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (userId TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, createdAt TEXT DEFAULT CURRENT_TIMESTAMP)')
  });

  logger.info('Database initialized');
}

export { db, initDB };
