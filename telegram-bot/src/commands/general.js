/**
 * General commands for Telegram bot
 * Includes /start and /help commands
 */

const { getUserFromDb, createUserIfNotExists } = require('../utils/database');

async function handleStart(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  
  const welcomeMessage = `
🎯 *Welcome to DMT Pattern Hunter Telegram Bot!* 

I'm here to help you discover patterns in the Bitcoin blockchain, check element availability, and participate in the Trac Network ecosystem.

*Available Commands:*
• /scan - Scan for patterns in blockchain data
• /element - Check if an element is available
• /generate - Generate inscription JSON
• /reserve - Reserve an element for 24 hours
• /discovery - View recent discoveries
• /reputation - Check your reputation and tier
• /leaderboard - View discovery leaderboard
• /myscans - View your scan history
• /names - Get available element name suggestions
• /link - Link your Bitcoin address
• /notifications - Manage notifications
• /help - Show this help message

Start exploring the Bitcoin blockchain for valuable patterns today! 🚀
  `;
  
  await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
}

async function handleHelp(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  
  const helpMessage = `
📚 *DMT Pattern Hunter - Command Reference*

*🔍 Scanning Commands:*
• \`/scan <pattern> [field] [start_block] [end_block]\` - Scan for patterns
  Example: \`/scan 69 16 800000 800100\`

*📋 Element Commands:*
• \`/element <name> <pattern> [field]\` - Check element availability
  Example: \`/element lucky 69 16\`
• \`/reserve <name> <pattern> [field]\` - Reserve an element
  Example: \`/reserve lucky 69 16\`
• \`/names <pattern> [field]\` - Get available names
  Example: \`/names 69 16\`

*📝 Generation Commands:*
• \`/generate <type> [parameters]\` - Generate inscription JSON
  Types: element-registration, nat-deployment, nat-mint
  Example: \`/generate element-registration lucky 69 16\`

*📊 Information Commands:*
• \`/discovery [limit]\` - View recent discoveries
• \`/reputation\` - Check your reputation
• \`/leaderboard [type] [limit]\` - View leaderboard
• \`/myscans [limit]\` - View your scan history

*👤 Account Commands:*
• \`/link <bitcoin_address>\` - Link your Bitcoin address
• \`/notifications\` - Manage notifications

*ℹ️ Other Commands:*
• \`/help\` - Show this help message
• \`/start\` - Show welcome message

*User Tiers:*
• *Anonymous*: 5 scans/day
• *Verified*: 100 scans/day (make 10 discoveries)
• *Trusted*: 1000 scans/day (make 50 discoveries)

Need more help? Visit our documentation or join our community!
  `;
  
  await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
}

module.exports = {
  handleStart,
  handleHelp
};