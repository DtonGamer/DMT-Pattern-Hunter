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
    
    // Enable WAL mode for better concurrent access
    this.db.exec('PRAGMA journal_mode = WAL');
    this.db.exec('PRAGMA busy_timeout = 5000');
    this.db.exec('PRAGMA synchronous = NORMAL');
    
    // Prepare statements cache
    this.statements = {};
    
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

    console.log('[Database] Schema initialized with WAL mode');
  }

  // Prepare statement with caching
  prepareStatement(key, sql) {
    if (!this.statements[key]) {
      this.statements[key] = this.db.prepare(sql);
    }
    return this.statements[key];
  }

  getOrCreateUser(discordId) {
    try {
      const selectStmt = this.prepareStatement('getUser', 
        'SELECT * FROM users WHERE discord_id = ?'
      );

      let user = selectStmt.get(discordId);

      if (!user) {
        const insertStmt = this.prepareStatement('insertUser',
          `INSERT INTO users (discord_id, tier, joined_at, last_active)
           VALUES (?, 'anonymous', ?, ?)`
        );

        const now = Date.now();
        insertStmt.run(discordId, now, now);

        user = selectStmt.get(discordId);
        console.log(`[Database] Created new user: ${discordId}`);
      }

      return user;
    } catch (error) {
      console.error('[Database] Error in getOrCreateUser:', error);
      throw error;
    }
  }

  linkAddress(discordId, bitcoinAddress) {
    try {
      const stmt = this.prepareStatement('linkAddress',
        `UPDATE users
         SET bitcoin_address = ?,
             last_active = ?
         WHERE discord_id = ?`
      );

      const result = stmt.run(bitcoinAddress, Date.now(), discordId);

      if (result.changes > 0) {
        console.log(`[Database] Linked address ${bitcoinAddress} to ${discordId}`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Database] Error linking address:', error);
      return false;
    }
  }

  getUser(discordId) {
    try {
      const stmt = this.prepareStatement('getUser',
        'SELECT * FROM users WHERE discord_id = ?'
      );
      return stmt.get(discordId);
    } catch (error) {
      console.error('[Database] Error getting user:', error);
      return null;
    }
  }

  getUserByAddress(bitcoinAddress) {
    try {
      const stmt = this.prepareStatement('getUserByAddress',
        'SELECT * FROM users WHERE bitcoin_address = ?'
      );
      return stmt.get(bitcoinAddress);
    } catch (error) {
      console.error('[Database] Error getting user by address:', error);
      return null;
    }
  }

  updateLastActive(discordId) {
    try {
      const stmt = this.prepareStatement('updateLastActive',
        'UPDATE users SET last_active = ? WHERE discord_id = ?'
      );
      stmt.run(Date.now(), discordId);
    } catch (error) {
      console.error('[Database] Error updating last active:', error);
    }
  }

  updateNotificationPreference(discordId, channelId, allow) {
    try {
      const stmt = this.prepareStatement('updateNotificationPref',
        `UPDATE users
         SET notification_channel_id = ?,
             allow_announcements = ?
         WHERE discord_id = ?`
      );

      stmt.run(channelId, allow ? 1 : 0, discordId);
      console.log(`[Database] Updated notification pref for ${discordId}: ${allow}`);
    } catch (error) {
      console.error('[Database] Error updating notification preference:', error);
    }
  }

  getUsersWithNotificationEnabled() {
    try {
      const stmt = this.prepareStatement('getUsersWithNotifications',
        'SELECT * FROM users WHERE allow_announcements = 1'
      );
      return stmt.all();
    } catch (error) {
      console.error('[Database] Error getting users with notifications:', error);
      return [];
    }
  }

  getLinkedUsers() {
    try {
      const stmt = this.prepareStatement('getLinkedUsers',
        'SELECT * FROM users WHERE bitcoin_address IS NOT NULL'
      );
      return stmt.all();
    } catch (error) {
      console.error('[Database] Error getting linked users:', error);
      return [];
    }
  }

  addScanRecord(discordId, pattern, field, startBlock, endBlock, occurrences, rarity) {
    try {
      const stmt = this.prepareStatement('addScanRecord',
        `INSERT INTO scan_history
         (discord_id, pattern, field, start_block, end_block, occurrences, rarity, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

      const result = stmt.run(discordId, pattern, field, startBlock, endBlock, occurrences, rarity, Date.now());
      console.log(`[Database] Added scan record: ${pattern} in field ${field}`);

      return result.lastInsertRowid;
    } catch (error) {
      console.error('[Database] Error adding scan record:', error);
      return null;
    }
  }

  getRecentScans(discordId, limit = 10) {
    try {
      const stmt = this.prepareStatement('getRecentScans',
        `SELECT * FROM scan_history
         WHERE discord_id = ?
         ORDER BY timestamp DESC
         LIMIT ?`
      );

      return stmt.all(discordId, limit);
    } catch (error) {
      console.error('[Database] Error getting recent scans:', error);
      return [];
    }
  }

  getScanCountToday(discordId) {
    try {
      const stmt = this.prepareStatement('getScanCountToday',
        `SELECT COUNT(*) as count
         FROM scan_history
         WHERE discord_id = ?
           AND timestamp >= ?`
      );

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const result = stmt.get(discordId, startOfDay.getTime());
      return result?.count || 0;
    } catch (error) {
      console.error('[Database] Error getting scan count:', error);
      return 0;
    }
  }

  addReservation(discordId, elementName, pattern, field, expiresAt) {
    try {
      const stmt = this.prepareStatement('addReservation',
        `INSERT INTO reservations
         (discord_id, element_name, pattern, field, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      );

      const result = stmt.run(discordId, elementName, pattern, field, expiresAt, Date.now());
      console.log(`[Database] Added reservation: ${elementName}`);

      return result.lastInsertRowid;
    } catch (error) {
      console.error('[Database] Error adding reservation:', error);
      return null;
    }
  }

  getUserReservations(discordId) {
    try {
      const stmt = this.prepareStatement('getUserReservations',
        `SELECT * FROM reservations
         WHERE discord_id = ? AND expires_at > ?
         ORDER BY expires_at DESC`
      );

      return stmt.all(discordId, Date.now());
    } catch (error) {
      console.error('[Database] Error getting user reservations:', error);
      return [];
    }
  }

  cleanupExpiredReservations() {
    try {
      const stmt = this.prepareStatement('cleanupReservations',
        'DELETE FROM reservations WHERE expires_at < ?'
      );

      const result = stmt.run(Date.now());
      if (result.changes > 0) {
        console.log(`[Database] Cleaned up ${result.changes} expired reservations`);
      }

      return result.changes;
    } catch (error) {
      console.error('[Database] Error cleaning up reservations:', error);
      return 0;
    }
  }

  close() {
    try {
      this.db.close();
      console.log('[Database] Connection closed');
    } catch (error) {
      console.error('[Database] Error closing connection:', error);
    }
  }
}

export default DatabaseManager;