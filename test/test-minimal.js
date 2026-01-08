/**
 * Minimal test to isolate the issue
 * Run: node test-minimal.js
 */

import 'dotenv/config';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import DatabaseManager from './src/db/sqlite.js';

console.log('Starting minimal test...');

try {
  console.log('1. Creating Discord client...');
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions
    ]
  });
  console.log('✅ Discord client created');

  console.log('2. Creating database...');
  const db = new DatabaseManager('./data/test-minimal.db');
  console.log('✅ Database created');

  console.log('3. Creating collection...');
  const commands = new Collection();
  console.log('✅ Collection created');

  console.log('4. Creating class...');
  class TestBot {
    constructor() {
      console.log('Inside constructor...');
      this.client = client;
      this.db = db;
      this.commands = commands;
      console.log('Constructor done');
    }
  }
  console.log('✅ Class defined');

  console.log('5. Creating instance...');
  const bot = new TestBot();
  console.log('✅ Instance created');

  console.log('\n🎉 All tests passed! The issue is not with basic initialization.');
  console.log('The problem must be in the full index.js file structure.');

  db.close();

} catch (error) {
  console.error('❌ Test failed:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}