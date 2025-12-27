/**
 * Register Discord Slash Commands
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    applicationId: process.env.DISCORD_APPLICATION_ID,
    guildId: process.env.DISCORD_GUILD_ID
  }
};

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const fileUrl = pathToFileURL(filePath);
  const module = await import(fileUrl);
  const command = module.default;
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`[Register] Loaded command: ${command.data.name}`);
  }
}

const rest = new REST().setToken(config.discord.token);

(async () => {
  try {
    console.log(`\n[Register] Started refreshing ${commands.length} application (/) commands.`);

    let data;

    if (config.discord.guildId) {
      console.log(`[Register] Registering to guild: ${config.discord.guildId} (fast, for development)`);
      data = await rest.put(
        Routes.applicationGuildCommands(config.discord.applicationId, config.discord.guildId),
        { body: commands }
      );
    } else {
      console.log(`[Register] Registering globally (will take up to 1 hour to propagate)`);
      data = await rest.put(
        Routes.applicationCommands(config.discord.applicationId),
        { body: commands }
      );
    }

    console.log(`[Register] Successfully reloaded ${data.length} application (/) commands.\n`);

  } catch (error) {
    console.error('[Register] Error:', error);
  }
})();
