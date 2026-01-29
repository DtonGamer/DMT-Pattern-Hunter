/**
 * Names command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');

async function handleNames(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  if (args.length < 1) {
    const helpMessage = `
💡 *Available Element Names*

Usage: \`/names <pattern> [field]\`

Parameters:
• \`pattern\` (required): Pattern to check
• \`field\` (optional): Field number (0-37, default: 16)

Examples:
• \`/names 69\` - Get names for pattern "69" in field 16
• \`/names 420 10\` - Get names for pattern "420" in field 10
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    const pattern = args[0];
    const field = args[1] ? parseInt(args[1]) : 16;
    
    // Send checking message
    await bot.sendMessage(chatId, `💡 Getting available names for pattern "${pattern}" in field ${field}...`);
    
    // Get available names
    const suggestions = await contract.features.elementRegistry.suggestAvailableNames(pattern, field);
    
    if (suggestions.length === 0) {
      await bot.sendMessage(chatId, `🔍 No available names found for pattern "${pattern}" in field ${field}.`);
      return;
    }
    
    let response = `💡 *Available Names for "${pattern}" in field ${field}*\n\n`;
    
    suggestions.forEach((suggestion, i) => {
      response += `${i + 1}. ${suggestion.name}.${pattern}.${field}.element\n`;
    });
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in names command:', error);
    await bot.sendMessage(chatId, `❌ Error getting available names: ${error.message}`);
  }
}

module.exports = {
  handleNames
};