/**
 * DMT Pattern Hunter Discord Bot
 * Main Entry Point
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Client, Collection, GatewayIntentBits, ActivityType } from 'discord.js';
import DatabaseManager from './src/db/sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DiscordBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
      ]
    });

    this.db = new DatabaseManager(process.env.DATABASE_PATH || './data/bot.db');
    this.contract = null;
    this.commands = new Collection();
  }

  async initialize() {
    await this.setupCommands();
    this.setupEventHandlers();
  }

  async init() {
    console.log('========================================');
    console.log('🤖 DMT Pattern Hunter Discord Bot');
    console.log('========================================\n');

    this.loadConfig();

    try {
      const { default: Contract } = await import('../contract/contract.mjs');
      this.contract = new Contract('../config.json');
      await this.contract.init();
      console.log('[Bot] Contract initialized successfully\n');
    } catch (error) {
      console.warn('[Bot] Warning: Failed to initialize contract:', error.message);
      console.warn('[Bot] Running in limited mode without blockchain integration\n');
      this.contract = null;
    }

    await this.client.login(this.config.discord.token);
  }

  getDefaultTiers() {
    return {
      anonymous: {
        name: "BASIC",
        scansPerDay: 5,
        canSubmitDiscoveries: false,
        canVerifyPatterns: false
      },
      verified: {
        name: "VERIFIED",
        scansPerDay: 100,
        canSubmitDiscoveries: true,
        canVerifyPatterns: true,
        upgradeRequirement: {
          discoveries: 10
        }
      },
      trusted: {
        name: "TRUSTED",
        scansPerDay: 1000,
        canCreateGuilds: true,
        canRegisterElements: true,
        upgradeRequirement: {
          discoveries: 50,
          verifiedDiscoveries: 20
        }
      }
    };
  }

  loadConfig() {
    try {
      // Load main config with tiers from config.json
      const mainConfigPath = path.join(__dirname, '../config.json');
      const discordConfigPath = path.join(__dirname, '../config.discord.json');

      let mainConfig = {};
      if (fs.existsSync(mainConfigPath)) {
        const mainConfigData = fs.readFileSync(mainConfigPath, 'utf8');
        mainConfig = JSON.parse(mainConfigData);
        console.log('[Bot] Loaded main config from config.json');
      }

      // Load Discord-specific config
      if (fs.existsSync(discordConfigPath)) {
        const discordConfigData = fs.readFileSync(discordConfigPath, 'utf8');
        const discordConfig = JSON.parse(discordConfigData);
        
        // Merge: discord settings + tiers from main config
        this.config = {
          ...discordConfig,
          tiers: mainConfig.tiers || this.getDefaultTiers()
        };
        
        console.log('[Bot] Loaded Discord config + tiers');
      } else {
        // Environment variables fallback
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
          },
          tiers: mainConfig.tiers || this.getDefaultTiers()
        };
        console.log('[Bot] Loaded config from environment variables');
      }

      // VALIDATE tiers exist
      if (!this.config.tiers || !this.config.tiers.anonymous) {
        console.error('[Bot] WARNING: Tiers not properly loaded, using defaults');
        this.config.tiers = this.getDefaultTiers();
      }

      // Debug log
      console.log('[Bot] Config loaded with tiers:', Object.keys(this.config.tiers).join(', '));

      if (!this.config.discord || !this.config.discord.token) {
        throw new Error('Discord bot token not configured. Set DISCORD_TOKEN in .env');
      }
    } catch (error) {
      console.error('[Bot] Failed to load config:', error.message);
      process.exit(1);
    }
  }

  async setupCommands() {
    const commandsPath = path.join(__dirname, 'src', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath);
        const module = await import(fileUrl);
        const command = module.default;

        if ('data' in command && 'execute' in command) {
          this.commands.set(command.data.name, command);
          console.log(`[Bot] Loaded command: ${command.data.name}`);
        }
      } catch (error) {
        console.error(`[Bot] Failed to load ${file}:`, error.message);
      }
    }

    console.log(`[Bot] Loaded ${this.commands.size} commands\n`);
  }

  setupEventHandlers() {
    this.client.once('clientReady', async () => {
      console.log(`[Bot] Logged in as ${this.client.user.tag}`);
      console.log(`[Bot] Connected to ${this.client.guilds.cache.size} guild(s)`);
      console.log('');

      this.client.user.setActivity('Scanning blockchain patterns...', { type: ActivityType.Watching });
      await this.periodicTasks();
    });

    this.client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commands.get(interaction.commandName);
      if (!command) return;

      try {
        // Debug: Log command execution
        console.log(`[Bot] Executing command: ${interaction.commandName}`);
        console.log(`[Bot] Config tiers available:`, this.config?.tiers ? 'Yes' : 'No');
        
        await command.execute(interaction, this.contract, this.db, this.config);
      } catch (error) {
        console.error(`[Bot] Error executing ${interaction.commandName}:`, error);

        const errorReply = {
          content: 'There was an error executing this command!',
          flags: 64 // Use flags instead of ephemeral
        };

        try {
          if (interaction.deferred) {
            await interaction.editReply(errorReply);
          } else if (!interaction.replied) {
            await interaction.reply(errorReply);
          }
          // If already replied, do nothing
        } catch (replyError) {
          console.error('[Bot] Could not send error reply:', replyError.message);
        }
      }
    });

    this.client.on('interactionCreate', async interaction => {
      if (!interaction.isButton()) return;

      const customId = interaction.customId;

      try {
        if (customId.startsWith('notify_enable_')) {
          const userId = customId.split('_')[2];
          if (interaction.user.id !== userId) {
            return interaction.reply({ content: 'This button is not for you.', flags: 64 });
          }

          this.db.updateNotificationPreference(userId, interaction.channelId, true);
          await interaction.update({
            content: '✅ Notifications enabled! You will receive alerts when you discover rare patterns.',
            components: []
          });
        } else if (customId.startsWith('notify_disable_')) {
          const userId = customId.split('_')[2];
          if (interaction.user.id !== userId) {
            return interaction.reply({ content: 'This button is not for you.', flags: 64 });
          }

          this.db.updateNotificationPreference(userId, interaction.channelId, false);
          await interaction.update({
            content: '❌ Notifications disabled.',
            components: []
          });
        }
      } catch (error) {
        console.error('[Bot] Error handling button interaction:', error);

        try {
          if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
              content: 'There was an error processing your request!',
              flags: 64
            });
          } else {
            await interaction.reply({
              content: 'There was an error processing your request!',
              flags: 64
            });
          }
        } catch (replyError) {
          console.error('[Bot] Error sending error reply for button:', replyError.message);
        }
      }
    });

    this.client.on('error', error => {
      console.error('[Bot] Discord client error:', error);
    });
  }

  async periodicTasks() {
    setInterval(() => {
      this.db.cleanupExpiredReservations();
    }, 60 * 60 * 1000);
  }

  async log(message, type = 'info') {
    if (!this.config.discord.channels?.logs) return;

    try {
      const logChannel = await this.client.channels.fetch(this.config.discord.channels.logs);
      const timestamp = new Date().toLocaleString();
      const emoji = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
      await logChannel.send(`${emoji} [${timestamp}] ${message}`);
    } catch (error) {
      console.error('[Bot] Failed to send to log channel:', error);
    }
  }
}

async function main() {
  const bot = new DiscordBot();

  try {
    await bot.initialize();
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
    bot.db.close();
    process.exit(1);
  }
}

// Windows-compatible module detection
const isMainModule = process.argv[1] && (
  import.meta.url === pathToFileURL(process.argv[1]).href ||
  import.meta.url.endsWith('index.js')
);

if (isMainModule) {
  main().catch(error => {
    console.error('[Bot] Fatal error:', error);
    process.exit(1);
  });
}

export default DiscordBot;