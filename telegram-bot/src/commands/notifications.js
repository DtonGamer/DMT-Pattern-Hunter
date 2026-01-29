/**
 * Notifications command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');

async function handleNotifications(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  try {
    // Get current notification status
    const user = db.prepare('SELECT notification_enabled FROM users WHERE telegram_id = ?').get(userId.toString());
    
    if (!user) {
      await bot.sendMessage(chatId, '❌ User not found. Please start the bot first with /start.');
      return;
    }
    
    const currentState = user.notification_enabled ? 'ENABLED' : 'DISABLED';
    
    // Toggle notification status
    const newState = !user.notification_enabled;
    db.prepare('UPDATE users SET notification_enabled = ? WHERE telegram_id = ?')
      .run(newState ? 1 : 0, userId.toString());
    
    const newStateText = newState ? 'ENABLED' : 'DISABLED';
    
    const response = `🔔 *Notification Settings*\n\n`;
    response += `Previous state: ${currentState}\n`;
    response += `Current state: ${newStateText}\n\n`;
    
    if (newState) {
      response += `✅ You will now receive notifications for rare pattern discoveries and important updates.`;
    } else {
      response += `❌ You will no longer receive notifications. You can re-enable them anytime.`;
    }
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in notifications command:', error);
    await bot.sendMessage(chatId, `❌ Error managing notifications: ${error.message}`);
  }
}

module.exports = {
  handleNotifications
};