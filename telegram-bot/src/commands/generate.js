/**
 * Generate command handler for Telegram bot
 */

const { createUserIfNotExists, updateUserLastActive } = require('../utils/database');

async function handleGenerate(bot, msg, contract, db) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Create user if not exists
  await createUserIfNotExists(db, userId);
  await updateUserLastActive(db, userId);
  
  // Parse command arguments
  const args = msg.text.split(' ').slice(1);
  
  if (args.length < 1) {
    const helpMessage = `
📝 *Generate Inscription JSON*

Usage: \`/generate <type> [parameters]\`

Types:
• \`element-registration\` - Generate element registration JSON
• \`nat-deployment\` - Generate NAT deployment JSON  
• \`nat-mint\` - Generate NAT mint JSON

Element Registration:
• \`/generate element-registration <name> <pattern> <field>\`
• Example: \`/generate element-registration lucky 69 16\`

NAT Deployment:
• \`/generate nat-deployment <ticker> <element> [supply] [data]\`
• Example: \`/generate nat-deployment LUCKY lucky.69.16.element 1000000000\`

NAT Mint:
• \`/generate nat-mint <deployment_id> <ticker> <block_number>\`
• Example: \`/generate nat-mint abc123def456 LUCKY 800045\`
    `;
    
    await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    return;
  }
  
  try {
    const type = args[0].toLowerCase();
    
    if (type === 'element-registration') {
      if (args.length < 4) {
        await bot.sendMessage(chatId, '❌ Missing parameters. Use: `/generate element-registration <name> <pattern> <field>`', { parse_mode: 'Markdown' });
        return;
      }
      
      const name = args[1];
      const pattern = args[2];
      const field = parseInt(args[3]);
      
      const result = await contract.generateElementRegistration(name, pattern, field);
      
      const response = `📝 *Element Registration JSON*\n\n\`\`\`json\n${JSON.stringify(result.inscription, null, 2)}\n\`\`\``;
      await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
      
    } else if (type === 'nat-deployment') {
      if (args.length < 3) {
        await bot.sendMessage(chatId, '❌ Missing parameters. Use: `/generate nat-deployment <ticker> <element> [supply] [data]`', { parse_mode: 'Markdown' });
        return;
      }
      
      const ticker = args[1];
      const elem = args[2];
      const supply = args[3] ? args[3] : null;
      const dta = args[4] ? args[4] : null;
      
      const result = await contract.generateDeployment(ticker, elem, supply, dta);
      
      const response = `📝 *NAT Deployment JSON*\n\n\`\`\`json\n${JSON.stringify(result.inscription, null, 2)}\n\`\`\``;
      await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
      
    } else if (type === 'nat-mint') {
      if (args.length < 4) {
        await bot.sendMessage(chatId, '❌ Missing parameters. Use: `/generate nat-mint <deployment_id> <ticker> <block_number>`', { parse_mode: 'Markdown' });
        return;
      }
      
      const dep = args[1];
      const tick = args[2];
      const block = parseInt(args[3]);
      
      const result = await contract.generateMint(dep, tick, block);
      
      const response = `📝 *NAT Mint JSON*\n\n\`\`\`json\n${JSON.stringify(result.inscription, null, 2)}\n\`\`\``;
      await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
      
    } else {
      await bot.sendMessage(chatId, `❌ Unknown type: ${type}. Use "element-registration", "nat-deployment", or "nat-mint".`, { parse_mode: 'Markdown' });
    }
    
  } catch (error) {
    console.error('Error in generate command:', error);
    await bot.sendMessage(chatId, `❌ Error generating inscription: ${error.message}`);
  }
}

module.exports = {
  handleGenerate
};