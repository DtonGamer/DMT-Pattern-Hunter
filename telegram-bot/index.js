/**
 * DMT Pattern Hunter Telegram Bot
 * Main entry point for the Telegram bot
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Import contract from main project
const Contract = require('../contract/contract');

// Import command handlers
const { handleStart, handleHelp } = require('./src/commands/general');
const { handleScan } = require('./src/commands/scan');
const { handleElement } = require('./src/commands/element');
const { handleGenerate } = require('./src/commands/generate');
const { handleReserve } = require('./src/commands/reserve');
const { handleDiscovery } = require('./src/commands/discovery');
const { handleReputation } = require('./src/commands/reputation');
const { handleLeaderboard } = require('./src/commands/leaderboard');
const { handleMyScans } = require('./src/commands/myscans');
const { handleNames } = require('./src/commands/names');
const { handleLink } = require('./src/commands/link');
const { handleNotifications } = require('./src/commands/notifications');

class TelegramBotService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    if (!this.token) {
      throw new Error('TELEGRAM_BOT_TOKEN is required in environment variables');
    }
    
    this.bot = new TelegramBot(this.token, { polling: true });
    this.contract = null;
    this.db = null;
  }

  async initialize() {
    console.log('Initializing DMT Pattern Hunter Telegram Bot...');
    
    // Initialize the main contract
    this.contract = new Contract();
    await this.contract.init();
    
    // Initialize database
    await this.initializeDatabase();
    
    // Set up command handlers
    this.setupCommandHandlers();
    
    // Set up error handling
    this.setupErrorHandling();
    
    console.log('Telegram Bot initialized successfully');
  }

  async initializeDatabase() {
    // Create database file in telegram-bot directory
    this.db = new DatabaseSync(path.join(__dirname, 'bot.db'));
    
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        telegram_id TEXT PRIMARY KEY,
        bitcoin_address TEXT UNIQUE,
        tier TEXT DEFAULT 'anonymous',
        notification_enabled INTEGER DEFAULT 0,
        allow_announcements INTEGER DEFAULT 0,
        joined_at INTEGER,
        last_active INTEGER
      )
    `);
    
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id TEXT,
        pattern TEXT,
        field INTEGER,
        start_block INTEGER,
        end_block INTEGER,
        occurrences INTEGER,
        rarity TEXT,
        timestamp INTEGER
      )
    `);
    
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id TEXT,
        element_name TEXT,
        pattern TEXT,
        field INTEGER,
        expires_at INTEGER,
        created_at INTEGER
      )
    `);
    
    console.log('Database initialized');
  }

  setupCommandHandlers() {
    // General commands
    this.bot.onText(/\/start/, (msg) => {
      handleStart(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/help/, (msg) => {
      handleHelp(this.bot, msg, this.contract, this.db);
    });
    
    // Main functionality commands
    this.bot.onText(/\/scan/, (msg) => {
      handleScan(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/element/, (msg) => {
      handleElement(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/generate/, (msg) => {
      handleGenerate(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/reserve/, (msg) => {
      handleReserve(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/discovery/, (msg) => {
      handleDiscovery(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/reputation/, (msg) => {
      handleReputation(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/leaderboard/, (msg) => {
      handleLeaderboard(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/myscans/, (msg) => {
      handleMyScans(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/names/, (msg) => {
      handleNames(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/link/, (msg) => {
      handleLink(this.bot, msg, this.contract, this.db);
    });
    
    this.bot.onText(/\/notifications/, (msg) => {
      handleNotifications(this.bot, msg, this.contract, this.db);
    });
    
    console.log('Command handlers set up');
  }

  setupErrorHandling() {
    this.bot.on('polling_error', (error) => {
      console.error('Polling error:', error);
    });
    
    this.bot.on('error', (error) => {
      console.error('Bot error:', error);
    });
  }

  async start() {
    console.log('Telegram Bot is listening for messages...');
  }
  
  getBot() {
    return this.bot;
  }
}

// Create and start the bot
async function main() {
  try {
    const botService = new TelegramBotService();
    await botService.initialize();
    await botService.start();
  } catch (error) {
    console.error('Failed to start Telegram bot:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TelegramBotService;