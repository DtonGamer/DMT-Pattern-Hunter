/**
 * Reserve command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');
const Utils = require('../../../src/utils');

async function handleReserve(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  if (args.length < 2) {
    const helpMessage = `
🎫 *Reserve Element*

Usage: \`/reserve <name> <pattern> [field]\`

Parameters:
• \`name\` (required): Element name
• \`pattern\` (required): Pattern
• \`field\` (optional): Field number (0-37, default: 16)

Examples:
• \`/reserve lucky 69\` - Reserve "lucky.69.16.element"
• \`/reserve satoshi 420 10\` - Reserve "satoshi.420.10.element"

Note: You must be VERIFIED or TRUSTED tier to reserve elements.
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    const name = args[0];
    const pattern = args[1];
    const field = args[2] ? parseInt(args[2]) : 16;
    
    // Create a temporary address for the user
    const userAddress = `tg_${userId}`;
    
    // Send reserving message
    await bot.sendMessage(chatId, `🎫 Reserving ${name}.${pattern}.${field}.element for 24 hours...`);
    
    // Attempt to reserve the element
    const result = await contract.reserveElement(name, pattern, field, userAddress);
    
    const response = `✅ *${result.elementId}* reserved for 24 hours\n`;
    response += `Reserved at: ${Utils.formatDateTime(result.reservedAt)}\n`;
    response += `Expires at: ${Utils.formatDateTime(result.expiresAt)}\n\n`;
    response += `💡 Use \`/generate element-registration\` to create registration JSON`;
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in reserve command:', error);
    await bot.sendMessage(chatId, `❌ Error reserving element: ${error.message}`);
  }
}

module.exports = {
  handleReserve
};