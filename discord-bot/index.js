/**
 * DMT Pattern Hunter Discord Bot
 * Main Entry Point
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Client, Collection, GatewayIntentBits, ActivityType } from 'discord.js';
import DatabaseManager from './src/db/sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
      ]
    });

    this.commands = new Collection();
    this.db = new DatabaseManager(process.env.DATABASE_PATH || './discord-bot/data/bot.db');
    this.contract = null;

    this.setupCommands();
    this.setupEventHandlers();
  }

  async init() {
    console.log('========================================');
    console.log('🤖 DMT Pattern Hunter Discord Bot');
    console.log('========================================\n');

    this.loadConfig();

    try {
      // Dynamically import contract using ESM wrapper
      const { default: Contract } = await import('../../contract/contract.mjs');

      this.contract = new Contract('../../config.json');
      await this.contract.init();

      console.log('[Bot] Contract initialized successfully');
      console.log(`[Bot] Channel: ${this.contract.config.channel}`);
      console.log(`[Bot] TAP API: ${this.contract.config.ordTapHost}\n`);

    } catch (error) {
      console.error('[Bot] Failed to initialize contract:', error.message);
      console.error('[Bot] Please check config.json and try again');
      process.exit(1);
    }

    await this.client.login(this.config.discord.token);
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '../../config.discord.json');

      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        this.config = JSON.parse(configData);
        console.log('[Bot] Loaded config from config.discord.json');
      } else {
        this.config = {
          discord: {
            token: process.env.DISCORD_TOKEN,
            applicationId: process.env.DISCORD_APPLICATION_ID,
            guildId: process.env.DISCORD_GUILD_ID,
            channels: {
              announcements: process.env.DISCORD_ANNOUNCEMENTS_CHANNEL,
              logs: process.env.DISCORD_LOGS_CHANNEL
            },
            allowedRoles: {
              Verified: process.env.DISCORD_VERIFIED_ROLE,
              Trusted: process.env.DISCORD_TRUSTED_ROLE
            },
            permissions: {
              allowAnonymousScans: true,
              askForAnnouncementPermission: true
            }
          }
        };
        console.log('[Bot] Loaded config from environment variables');
      }

      if (!this.config.discord.token) {
        throw new Error('Discord bot token not configured. Set DISCORD_TOKEN in .env or config.discord.json');
      }

    } catch (error) {
      console.error('[Bot] Failed to load config:', error.message);
      process.exit(1);
    }
  }

  async setupCommands() {
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const fileUrl = pathToFileURL(filePath);
      const module = await import(fileUrl);
      const command = module.default;

      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
        console.log(`[Bot] Loaded command: ${command.data.name}`);
      }
    }

    console.log(`[Bot] Loaded ${this.commands.size} commands\n`);
  }

  setupEventHandlers() {
    this.client.once('ready', async () => {
      console.log(`[Bot] Logged in as ${this.client.user.tag}`);
      console.log(`[Bot] Connected to ${this.client.guilds.cache.size} guilds`);
      console.log(`[Bot] User ID: ${this.client.user.id}`);
      console.log('');

      this.client.user.setActivity('Scanning blockchain patterns...', { type: ActivityType.Watching });

      await this.periodicTasks();
    });

    this.client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commands.get(interaction.commandName);

      if (!command) {
        console.error(`[Bot] No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction, this.contract, this.db, this.config);
      } catch (error) {
        console.error(`[Bot] Error executing ${interaction.commandName}:`, error);

        const errorReply = {
          content: 'There was an error executing this command!',
          ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorReply);
        } else {
          await interaction.reply(errorReply);
        }
      }
    });

    this.client.on('interactionCreate', async interaction => {
      if (!interaction.isButton()) return;

      const customId = interaction.customId;

      if (customId.startsWith('notify_enable_')) {
        const userId = customId.split('_')[2];
        const channelId = interaction.channelId;

        if (interaction.user.id !== userId) {
          return interaction.reply({ content: 'This button is not for you.', ephemeral: true });
        }

        this.db.updateNotificationPreference(userId, channelId, true);

        await interaction.update({
          content: '✅ Notifications enabled! You will receive alerts when you discover rare patterns.',
          components: []
        });

      } else if (customId.startsWith('notify_disable_')) {
        const userId = customId.split('_')[2];

        if (interaction.user.id !== userId) {
          return interaction.reply({ content: 'This button is not for you.', ephemeral: true });
        }

        const channelId = interaction.channelId;
        this.db.updateNotificationPreference(userId, channelId, false);

        await interaction.update({
          content: '❌ Notifications disabled.',
          components: []
        });
      }
    });

    this.client.on('error', error => {
      console.error('[Bot] Discord client error:', error);
    });

    this.client.on('disconnect', () => {
      console.log('[Bot] Discord client disconnected');
    });

    this.client.on('reconnecting', () => {
      console.log('[Bot] Reconnecting to Discord...');
    });
  }

  async periodicTasks() {
    console.log('[Bot] Starting periodic tasks...');

    setInterval(() => {
      this.db.cleanupExpiredReservations();
    }, 60 * 60 * 1000);

    console.log('[Bot] Periodic tasks scheduled (cleanup expired reservations every hour)');
  }

  async log(message, type = 'info') {
    if (!this.config.discord.channels?.logs) return;

    try {
      const logChannel = await this.client.channels.fetch(this.config.discord.channels.logs);

      const timestamp = new Date().toLocaleString();
      const emoji = type === 'error' ? '❌' :
                     type === 'warning' ? '⚠️' :
                     type === 'success' ? '✅' : 'ℹ️';

      await logChannel.send(`${emoji} [${timestamp}] ${message}`);

    } catch (error) {
      console.error('[Bot] Failed to send to log channel:', error);
    }
  }
}

async function main() {
  const bot = new DiscordBot();

  try {
    await bot.init();

    process.on('SIGINT', () => {
      console.log('\n[Bot] Shutting down gracefully...');
      bot.db.close();
      bot.client.destroy();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n[Bot] Shutting down gracefully...');
      bot.db.close();
      bot.client.destroy();
      process.exit(0);
    });

  } catch (error) {
    console.error('[Bot] Fatal error:', error);
    console.error(error.stack);
    bot.db.close();
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default DiscordBot;
