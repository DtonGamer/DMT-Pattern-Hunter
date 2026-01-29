/**
 * Reputation command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');
const Utils = require('../../../src/utils');

async function handleReputation(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  // For now, we'll use a temporary address based on Telegram ID
  // In a real implementation, users would link their Bitcoin address
  const userAddress = `tg_${userId}`;
  
  try {
    // Get user reputation
    const user = await contract.getUserReputation(userAddress);
    
    if (!user) {
      await bot.sendMessage(chatId, '🔍 User not found. Scan some patterns to build reputation!');
      return;
    }
    
    const tierEmoji = Utils.getTierEmoji(user.tier);
    
    let response = `👤 *User Reputation*\n\n`;
    response += `${tierEmoji} Address: \`${userAddress}\`\n`;
    response += `Tier: ${user.tier}\n`;
    response += `Reputation: ${user.reputation}\n`;
    response += `Discoveries: ${user.discoveries}\n`;
    response += `Verified Discoveries: ${user.verifiedDiscoveries}\n`;
    response += `Scans Today: ${user.scansToday}\n`;
    response += `Violations: ${user.violations}\n`;
    response += `Joined: ${Utils.formatDate(user.joinedAt)}\n`;
    
    // Get rank if available
    const rank = await contract.features.reputation.getUserRank(userAddress);
    if (rank.rank) {
      response += `Leaderboard Rank: #${rank.rank}/${rank.total}\n`;
    }
    
    response += '\n';
    
    // Show tier info and upgrade requirements
    const config = contract.config.tiers[user.tier];
    const limit = config?.scansPerDay || 10;
    response += `Daily Scan Limit: ${limit === -1 ? 'Unlimited' : limit}\n`;
    
    if (user.tier === 'anonymous') {
      response += '\n💡 *Upgrade to VERIFIED:*\n';
      response += '- Make 10 discoveries\n';
      response += '- Increases limit to 100 scans/day\n';
      response += '- Can submit discoveries to network\n';
    } else if (user.tier === 'verified') {
      response += '\n💡 *Upgrade to TRUSTED:*\n';
      response += '- Make 50 total discoveries\n';
      response += '- Have 20 verified discoveries\n';
      response += '- Increases limit to 1000 scans/day\n';
      response += '- Can create guilds (Phase 2)\n';
    }
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in reputation command:', error);
    await bot.sendMessage(chatId, `❌ Error retrieving reputation: ${error.message}`);
  }
}

module.exports = {
  handleReputation
};