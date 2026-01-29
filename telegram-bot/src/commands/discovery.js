/**
 * Discovery command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');
const Utils = require('../../../src/utils');

async function handleDiscovery(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  // Get limit from arguments (default 20, max 50)
  let limit = 20;
  if (args.length > 0) {
    const parsedLimit = parseInt(args[0]);
    if (!isNaN(parsedLimit)) {
      limit = Math.min(Math.max(parsedLimit, 1), 50); // Between 1 and 50
    }
  }
  
  try {
    // Get recent discoveries
    const discoveries = await contract.getRecentDiscoveries(limit);
    
    if (discoveries.length === 0) {
      await bot.sendMessage(chatId, '🔍 No discoveries yet. Start scanning to discover patterns!');
      return;
    }
    
    let response = `📊 *Recent Discoveries* (showing ${discoveries.length})\n\n`;
    
    discoveries.forEach((discovery, i) => {
      const emoji = Utils.getRarityEmoji(discovery.stats?.rarity);
      response += `${i + 1}. ${emoji} *${discovery.pattern}* in field ${discovery.field}\n`;
      response += `   Discovered by: ${Utils.formatAddress(discovery.discoverer)}\n`;
      response += `   Rarity: ${discovery.stats?.rarity || 'Unknown'}\n`;
      response += `   Frequency: ${(discovery.stats?.frequency * 100).toFixed(1)}%\n`;
      response += `   At: ${Utils.formatDateTime(discovery.timestamp)}\n`;
      
      if (discovery.verified) {
        response += `   ✅ Verified (inscription: ${discovery.inscriptionId?.substring(0, 15)}...)\n`;
      }
      response += '\n';
    });
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in discovery command:', error);
    await bot.sendMessage(chatId, `❌ Error retrieving discoveries: ${error.message}`);
  }
}

module.exports = {
  handleDiscovery
};