/**
 * Element command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');

async function handleElement(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  if (args.length < 2) {
    const helpMessage = `
📋 *Element Availability Check*

Usage: \`/element <name> <pattern> [field]\`

Parameters:
• \`name\` (required): Element name (e.g., "lucky")
• \`pattern\` (required): Pattern (e.g., "69")
• \`field\` (optional): Field number (0-37, default: 16)

Examples:
• \`/element lucky 69\` - Check "lucky.69.16.element"
• \`/element satoshi 420 10\` - Check "satoshi.420.10.element"
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    const name = args[0];
    const pattern = args[1];
    const field = args[2] ? parseInt(args[2]) : 16;
    
    // Send checking message
    await bot.sendMessage(chatId, `📋 Checking availability for ${name}.${pattern}.${field}.element...`);
    
    // Check availability
    const check = await contract.checkElementAvailability(name, pattern, field);
    
    let response;
    if (check.available) {
      response = `✅ *${check.elementId}* is AVAILABLE for registration!\n`;
      response += `Source: ${check.source}`;
    } else {
      response = `❌ *${check.elementId}* is NOT available\n`;
      response += `Status: ${check.registered ? 'Registered' : 'Reserved'}\n`;
      response += `Owner: ${check.owner || check.reservedBy || check.discoverer || 'Unknown'}`;
      
      if (check.inscriptionId) {
        response += `\nInscription: ${check.inscriptionId.substring(0, 20)}...`;
      }
    }
    
    await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error in element command:', error);
    await bot.sendMessage(chatId, `❌ Error checking element availability: ${error.message}`);
  }
}

module.exports = {
  handleElement
};