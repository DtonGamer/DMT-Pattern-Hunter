/**
 * Database utility functions for Telegram bot
 */

function getUserFromDb(db, telegramId) {
  const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegramId.toString());
  return user || null;
}

function createUserIfNotExists(db, telegramId) {
  const existingUser = getUserFromDb(db, telegramId);
  if (existingUser) {
    return existingUser;
  }

  const now = Date.now();
  db.prepare(`
    INSERT OR IGNORE INTO users
    (telegram_id, tier, joined_at, last_active)
    VALUES (?, 'anonymous', ?, ?)
  `).run(telegramId.toString(), now, now);

  return getUserFromDb(db, telegramId);
}

function updateUserLastActive(db, telegramId) {
  const now = Date.now();
  db.prepare('UPDATE users SET last_active = ? WHERE telegram_id = ?').run(now, telegramId.toString());
}

function getUserReputation(db, telegramId) {
  const user = getUserFromDb(db, telegramId);
  if (!user) {
    return null;
  }

  // Get reputation from the main contract system
  return user;
}

function incrementUserScans(db, telegramId) {
  // This would update scan count for the day
  // Implementation depends on how rate limiting is handled
}

module.exports = {
  getUserFromDb,
  createUserIfNotExists,
  updateUserLastActive,
  getUserReputation,
  incrementUserScans
};