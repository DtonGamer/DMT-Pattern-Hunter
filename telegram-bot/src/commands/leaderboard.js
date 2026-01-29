/**
 * Leaderboard command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');
const Utils = require('../../../src/utils');

async function handleLeaderboard(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  // Determine type and limit from arguments
  let type = 'discoverers'; // default
  let limit = 10; // default
  
  if (args.length > 0) {
    if (['discoverers', 'patterns'].includes(args[0])) {
      type = args[0];
    }
    
    if (args.length > 1) {
      const parsedLimit = parseInt(args[1]);
      if (!isNaN(parsedLimit)) {
        limit = Math.min(Math.max(parsedLimit, 1), 20); // Between 1 and 20
      }
    }
  }
  
  try {
    // Get leaderboard data
    const leaders = await contract.getLeaderboard(type);
    
    if (leaders.length === 0) {
      await bot.sendMessage(chatId, '🏆 Leaderboard is empty. Be the first to discover patterns!');
      return;
    }
    
    // Take only the requested number of entries
    const topLeaders = leaders.slice(0, limit);
    
    let response = `🏆 *Top ${type === 'discoverers' ? 'Discoverers' : 'Patterns'} Leaderboard*\n\n`;
    
    topLeaders.forEach((user, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const emoji = Utils.getTierEmoji(user.tier);
      response += `${medal} ${emoji} ${Utils.formatAddress(user.address)}\n`;
      response += `   Discoveries: ${user.discoveries} | Reputation: ${user.reputation} | Tier: ${user.tier}\n\n`;
    });
    
    response += `Total ${leaders.length} ${type === 'discoverers' ? 'discoverers' : 'patterns'} on leaderboard`;
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in leaderboard command:', error);
    await bot.sendMessage(chatId, `❌ Error retrieving leaderboard: ${error.message}`);
  }
}

module.exports = {
  handleLeaderboard
};