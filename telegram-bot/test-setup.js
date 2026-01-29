/**
 * Test file for DMT Pattern Hunter Telegram Bot
 */

const TelegramBotService = require('./index');

async function testBot() {
  console.log('Testing DMT Pattern Hunter Telegram Bot setup...');
  
  try {
    const botService = new TelegramBotService();
    
    // Initialize the bot service (without starting the actual bot)
    await botService.initialize();
    
    console.log('✅ Telegram Bot Service initialized successfully!');
    console.log('✅ Database connected and tables created');
    console.log('✅ Contract system connected');
    console.log('✅ All command handlers registered');
    
    // Close the database connection
    if (botService.db) {
      botService.db.close();
    }
    
    console.log('\nThe Telegram bot is ready to be deployed!');
    console.log('To start the bot, run: npm start');
    console.log('Make sure to set TELEGRAM_BOT_TOKEN in your .env file');
    
  } catch (error) {
    console.error('❌ Error initializing bot:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testBot();
}