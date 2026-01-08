/**
 * SQLite Database Module
 * Handles persistent storage for Discord bot using Node.js 24+ built-in SQLite
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

class DatabaseManager {
  constructor(dbPath = './data/bot.db') {
    const dir = path.dirname(dbPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(dbPath);
    this.db.exec('PRAGMA journal_mode = WAL');
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        discord_id TEXT PRIMARY KEY,
        bitcoin_address TEXT UNIQUE,
        tier TEXT DEFAULT 'anonymous',
        notification_channel_id TEXT,
        allow_announcements INTEGER DEFAULT 0,
        joined_at INTEGER,
        last_active INTEGER
      );

      CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT,
        pattern TEXT,
        field INTEGER,
        start_block INTEGER,
        end_block INTEGER,
        occurrences INTEGER,
        rarity TEXT,
        timestamp INTEGER,
        FOREIGN KEY (discord_id) REFERENCES users(discord_id)
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discord_id TEXT,
        element_name TEXT,
        pattern TEXT,
        field INTEGER,
        expires_at INTEGER,
        created_at INTEGER,
        FOREIGN KEY (discord_id) REFERENCES users(discord_id)
      );

      CREATE INDEX IF NOT EXISTS idx_scan_history_discord ON scan_history(discord_id);
      CREATE INDEX IF NOT EXISTS idx_scan_history_timestamp ON scan_history(timestamp);
      CREATE INDEX IF NOT EXISTS idx_reservations_expires ON reservations(expires_at);
    `);

    console.log('[Database] Schema initialized');
  }

  getOrCreateUser(discordId) {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE discord_id = ?
    `);

    let user = stmt.get(discordId);

    if (!user) {
      const insertStmt = this.db.prepare(`
        INSERT INTO users (discord_id, tier, joined_at, last_active)
        VALUES (?, 'anonymous', ?, ?)
      `);

      insertStmt.run(discordId, Date.now(), Date.now());

      user = stmt.get(discordId);
      console.log(`[Database] Created new user: ${discordId}`);
    }

    return user;
  }

  linkAddress(discordId, bitcoinAddress) {
    const stmt = this.db.prepare(`
      UPDATE users
      SET bitcoin_address = ?,
          last_active = ?
      WHERE discord_id = ?
    `);

    const result = stmt.run(bitcoinAddress, Date.now(), discordId);

    if (result.changes > 0) {
      console.log(`[Database] Linked address ${bitcoinAddress} to ${discordId}`);
      return true;
    }

    return false;
  }

  getUser(discordId) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE discord_id = ?');
    return stmt.get(discordId);
  }

  getUserByAddress(bitcoinAddress) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE bitcoin_address = ?');
    return stmt.get(bitcoinAddress);
  }

  updateLastActive(discordId) {
    const stmt = this.db.prepare(`
      UPDATE users SET last_active = ? WHERE discord_id = ?
    `);
    stmt.run(Date.now(), discordId);
  }

  updateNotificationPreference(discordId, channelId, allow) {
    const stmt = this.db.prepare(`
      UPDATE users
      SET notification_channel_id = ?,
          allow_announcements = ?
      WHERE discord_id = ?
    `);

    stmt.run(channelId, allow ? 1 : 0, discordId);
    console.log(`[Database] Updated notification pref for ${discordId}: ${allow}`);
  }

  getUsersWithNotificationEnabled() {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE allow_announcements = 1
    `);
    return stmt.all();
  }

  getLinkedUsers() {
    const stmt = this.db.prepare(`
      SELECT * FROM users WHERE bitcoin_address IS NOT NULL
    `);
    return stmt.all();
  }

  addScanRecord(discordId, pattern, field, startBlock, endBlock, occurrences, rarity) {
    const stmt = this.db.prepare(`
      INSERT INTO scan_history
      (discord_id, pattern, field, start_block, end_block, occurrences, rarity, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(discordId, pattern, field, startBlock, endBlock, occurrences, rarity, Date.now());
    console.log(`[Database] Added scan record: ${pattern} in field ${field}`);

    return result.lastInsertRowid;
  }

  getRecentScans(discordId, limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM scan_history
      WHERE discord_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `);

    return stmt.all(discordId, limit);
  }

  getScanCountToday(discordId) {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM scan_history
      WHERE discord_id = ?
        AND timestamp >= ?
    `);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = stmt.get(discordId, startOfDay.getTime());
    return result.count;
  }

  addReservation(discordId, elementName, pattern, field, expiresAt) {
    const stmt = this.db.prepare(`
      INSERT INTO reservations
      (discord_id, element_name, pattern, field, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(discordId, elementName, pattern, field, expiresAt, Date.now());
    console.log(`[Database] Added reservation: ${elementName}`);

    return result.lastInsertRowid;
  }

  getUserReservations(discordId) {
    const stmt = this.db.prepare(`
      SELECT * FROM reservations
      WHERE discord_id = ? AND expires_at > ?
      ORDER BY expires_at DESC
    `);

    return stmt.all(discordId, Date.now());
  }

  cleanupExpiredReservations() {
    const stmt = this.db.prepare(`
      DELETE FROM reservations WHERE expires_at < ?
    `);

    const result = stmt.run(Date.now());
    if (result.changes > 0) {
      console.log(`[Database] Cleaned up ${result.changes} expired reservations`);
    }

    return result.changes;
  }

  close() {
    this.db.close();
    console.log('[Database] Connection closed');
  }
}

export default DatabaseManager;