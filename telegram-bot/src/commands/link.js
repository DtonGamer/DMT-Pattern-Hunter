/**
 * Link command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');

async function handleLink(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  if (args.length < 1) {
    const helpMessage = `
🔗 *Link Bitcoin Address*

Usage: \`/link <bitcoin_address>\`

Parameters:
• \`bitcoin_address\` (required): Your Bitcoin address (starts with bc1..., 1..., or 3...)

Benefits:
• Track discoveries across sessions
• Earn reputation
• Upgrade to higher tiers
• Unlock more features
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    const address = args[0];
    
    // Basic validation for Bitcoin address format
    if (!isValidBitcoinAddress(address)) {
      await bot.sendMessage(chatId, '❌ Invalid Bitcoin address format. Valid formats: starts with bc1, 1, or 3.');
      return;
    }
    
    // Update user's Bitcoin address in the database
    const result = db.prepare(`
      UPDATE users 
      SET bitcoin_address = ?, last_active = ?
      WHERE telegram_id = ?
    `).run(address, Date.now(), userId.toString());
    
    if (result.changes > 0) {
      await bot.sendMessage(chatId, `✅ Your Bitcoin address \`${address}\` has been linked to your Telegram account.`, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, '❌ Failed to link your Bitcoin address. Please try again.');
    }
    
  } catch (error) {
    console.error('Error in link command:', error);
    await bot.sendMessage(chatId, `❌ Error linking Bitcoin address: ${error.message}`);
  }
}

function isValidBitcoinAddress(address) {
  // Basic validation for Bitcoin address formats
  // Supports bech32 (bc1...), legacy (1...), and P2SH (3...)
  const bech32Regex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
  return bech32Regex.test(address);
}

module.exports = {
  handleLink
};