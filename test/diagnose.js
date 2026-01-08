/**
 * Diagnostic script to check bot configuration
 * Run: node diagnose.js
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Discord Bot Diagnostics...\n');

// Check 1: Environment Variables
console.log('1️⃣ Checking environment variables...');
const requiredEnvVars = ['DISCORD_TOKEN'];
const optionalEnvVars = ['DISCORD_APPLICATION_ID', 'DISCORD_GUILD_ID'];

let envIssues = [];
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName} is set`);
  } else {
    console.log(`   ❌ ${varName} is MISSING`);
    envIssues.push(varName);
  }
});

optionalEnvVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName} is set`);
  } else {
    console.log(`   ⚠️  ${varName} is not set (optional)`);
  }
});

// Check 2: Config files
console.log('\n2️⃣ Checking config files...');
const configFiles = [
  '../config.json',
  '../config.discord.json',
  '.env'
];

configFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ⚠️  ${file} not found`);
  }
});

// Check 3: Required directories
console.log('\n3️⃣ Checking directory structure...');
const requiredDirs = [
  './src/commands',
  './src/db',
  './data'
];

requiredDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${dir} exists`);
  } else {
    console.log(`   ❌ ${dir} is MISSING`);
    envIssues.push(dir);
  }
});

// Check 4: Command files
console.log('\n4️⃣ Checking command files...');
const commandsPath = path.join(__dirname, 'src', 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  if (commandFiles.length > 0) {
    console.log(`   ✅ Found ${commandFiles.length} command file(s):`);
    commandFiles.forEach(file => console.log(`      - ${file}`));
  } else {
    console.log(`   ⚠️  No command files found in ${commandsPath}`);
  }
} else {
  console.log(`   ❌ Commands directory not found`);
}

// Check 5: Contract file
console.log('\n5️⃣ Checking contract files...');
const contractPath = path.join(__dirname, '../contract/contract.mjs');
if (fs.existsSync(contractPath)) {
  console.log(`   ✅ contract.mjs exists`);
} else {
  console.log(`   ⚠️  contract.mjs not found at ${contractPath}`);
  console.log(`      The bot will fail to initialize without this file`);
}

// Check 6: Database module
console.log('\n6️⃣ Checking database module...');
const dbPath = path.join(__dirname, 'src/db/sqlite.js');
if (fs.existsSync(dbPath)) {
  console.log(`   ✅ sqlite.js exists`);
  try {
    const { default: DatabaseManager } = await import('./src/db/sqlite.js');
    console.log(`   ✅ Database module loads successfully`);
  } catch (error) {
    console.log(`   ❌ Database module failed to load: ${error.message}`);
  }
} else {
  console.log(`   ❌ sqlite.js not found`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 DIAGNOSTIC SUMMARY');
console.log('='.repeat(50));

if (envIssues.length === 0) {
  console.log('✅ All critical checks passed!');
  console.log('\nYou should be able to run: npm start');
} else {
  console.log('❌ Issues found:');
  envIssues.forEach(issue => console.log(`   - ${issue}`));
  console.log('\nPlease fix these issues before starting the bot.');
}

console.log('\n💡 Next steps:');
console.log('   1. Fix any issues shown above');
console.log('   2. Make sure your .env file has DISCORD_TOKEN set');
console.log('   3. Run: npm start');
console.log('');