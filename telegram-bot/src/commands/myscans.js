/**
 * MyScans command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');
const Utils = require('../../../src/utils');

async function handleMyScans(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  // Get limit from arguments (default 10, max 25)
  let limit = 10;
  if (args.length > 0) {
    const parsedLimit = parseInt(args[0]);
    if (!isNaN(parsedLimit)) {
      limit = Math.min(Math.max(parsedLimit, 1), 25); // Between 1 and 25
    }
  }
  
  // For now, we'll use a temporary address based on Telegram ID
  const userAddress = `tg_${userId}`;
  
  try {
    // Get recent scans for the user
    const scans = await contract.getRecentScans(userAddress, limit);
    
    if (scans.length === 0) {
      await bot.sendMessage(chatId, '📜 No recent scans found. Start scanning with /scan!');
      return;
    }
    
    let response = `📜 *My Recent Scans* (showing ${scans.length})\n\n`;
    
    scans.forEach((scan, i) => {
      const emoji = scan.stats?.rarity === 'EXTREMELY RARE' ? '💎' :
                   scan.stats?.rarity === 'RARE' ? '⭐' :
                   scan.stats?.rarity === 'MODERATE' ? '📊' :
                   scan.stats?.rarity === 'UNDISCOVERED' ? '🔍' : '📋';
      response += `${i + 1}. ${emoji} *"${scan.pattern}"* in field ${scan.field}\n`;
      response += `   Blocks: ${scan.startBlock}-${scan.endBlock}\n`;
      response += `   Occurrences: ${scan.stats?.totalOccurrences || 0}\n`;
      response += `   At: ${Utils.formatDateTime(scan.timestamp)}\n\n`;
    });
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in myscans command:', error);
    await bot.sendMessage(chatId, `❌ Error retrieving scans: ${error.message}`);
  }
}

module.exports = {
  handleMyScans
};