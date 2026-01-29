/**
 * Scan command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');
const Utils = require('../../../src/utils');

async function handleScan(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  if (args.length < 1) {
    const helpMessage = `
🔍 *Pattern Scan Command*

Usage: \`/scan <pattern> [field] [start_block] [end_block]\`

Parameters:
• \`pattern\` (required): Pattern to search (e.g., "69", "420", "777")
• \`field\` (optional): Block field to search (0-37, default: 16)
• \`start_block\` (optional): Starting block height (default: 800000)
• \`end_block\` (optional): Ending block height (default: 800050)

Examples:
• \`/scan 69\` - Scan for "69" in field 16 (default)
• \`/scan 420 16\` - Scan for "420" in field 16
• \`/scan 777 10 800000 800100\` - Scan for "777" in field 10 from block 800000 to 800100

Popular fields:
• Field 16 (txid) - Most popular for pattern matching
• Field 7 (merkleroot)
• Field 10 (nonce)
• Field 11 (bits)
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    // Extract parameters
    const pattern = args[0];
    const field = args[1] ? parseInt(args[1]) : 16;
    const startBlock = args[2] ? parseInt(args[2]) : 800000;
    const endBlock = args[3] ? parseInt(args[3]) : 800050;
    
    // Validate inputs
    if (!Utils.isValidPattern(pattern)) {
      await bot.sendMessage(chatId, '❌ Invalid pattern format. Please use alphanumeric characters.');
      return;
    }
    
    const fieldValidation = Utils.parseField(field);
    if (!fieldValidation.valid) {
      await bot.sendMessage(chatId, `❌ ${fieldValidation.error}`);
      return;
    }
    
    const rangeValidation = Utils.validateBlockRange(startBlock, endBlock);
    if (!rangeValidation.valid) {
      await bot.sendMessage(chatId, `❌ ${rangeValidation.error}`);
      return;
    }
    
    // Create a temporary address for anonymous users
    // In a real implementation, we'd link Telegram IDs to Bitcoin addresses
    const userAddress = `tg_${userId}`;
    
    // Send initial message
    await bot.sendMessage(chatId, `🔍 Starting scan for pattern "${pattern}" in field ${field} (${Utils.getFieldDescription(field)})\nBlocks: ${startBlock} to ${endBlock}\nPlease wait...`);
    
    // Perform the scan
    const result = await contract.scanPattern(pattern, field, startBlock, endBlock, userAddress);
    
    // Format and send the result
    const stats = result.statistics;
    const report = formatScanResult(result);
    
    await bot.sendMessage(chatId, report, { parse_mode: 'Markdown' });
    
    // Check if it's a rare pattern and notify
    if (stats.rarity.includes('RARE') && stats.totalOccurrences > 0) {
      await bot.sendMessage(chatId, `✨ Wow! This is a *${stats.rarity}* pattern!\nConsider registering it as an element.`, { parse_mode: 'Markdown' });
    }
    
  } catch (error) {
    console.error('Error in scan command:', error);
    await bot.sendMessage(chatId, `❌ Error during scan: ${error.message}`);
  }
}

function formatScanResult(result) {
  const { pattern, field, statistics, results } = result;
  const { totalOccurrences, totalBlocks, frequency, rarity } = statistics;
  
  // Count successful vs failed blocks
  const successfulBlocks = results.filter(r => !r.error).length;
  const failedBlocks = results.length - successfulBlocks;
  
  let report = `🔍 *Scan Results*\n\n`;
  report += `*Pattern:* \`${pattern}\`\n`;
  report += `*Field:* ${field} (${require('../../../src/field-map').getFieldDescription(field)})\n`;
  report += `*Blocks Analyzed:* ${successfulBlocks}/${results.length}\n`;
  report += `*Occurrences:* ${totalOccurrences}\n`;
  report += `*Frequency:* ${(frequency * 100).toFixed(4)}%\n`;
  report += `*Rarity:* ${rarity}\n`;
  
  if (failedBlocks > 0) {
    report += `*Failed Blocks:* ${failedBlocks}\n`;
  }
  
  // Show blocks with occurrences
  const blocksWithOccurrences = results
    .filter(r => r.count > 0 && !r.error)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 blocks with most occurrences
  
  if (blocksWithOccurrences.length > 0) {
    report += `\n*Top Blocks with Pattern:*\n`;
    blocksWithOccurrences.forEach(block => {
      report += `- Block ${block.block}: ${block.count} occurrences\n`;
    });
  }
  
  return report;
}

module.exports = {
  handleScan
};