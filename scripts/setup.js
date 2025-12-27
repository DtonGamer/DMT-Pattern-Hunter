const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('========================================');
console.log('DMT Pattern Hunter - Setup');
console.log('========================================');
console.log('Requires Node.js 24+ for built-in SQLite support');
console.log('Current Node version:', process.version);
console.log('');

// Create log directories
console.log('Creating log directories...');

const logsDir = path.join(__dirname, '..', 'logs');
const discordLogsDir = path.join(__dirname, '..', 'discord-bot', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✓ Created: logs/');
}

if (!fs.existsSync(discordLogsDir)) {
  fs.mkdirSync(discordLogsDir, { recursive: true });
  console.log('✓ Created: discord-bot/logs/');
}

console.log('');

// Install main project dependencies
console.log('Installing main project dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('\n✓ Main project dependencies installed\n');
} catch (error) {
  console.error('\n✗ Failed to install main project dependencies');
  process.exit(1);
}

// Install Discord bot dependencies
console.log('Installing Discord bot dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..', 'discord-bot') });
  console.log('\n✓ Discord bot dependencies installed\n');
} catch (error) {
  console.warn('\n⚠ Discord bot dependencies installation failed (file lock or permissions)');
  console.warn('\nTo install Discord bot dependencies manually:');
  console.warn('  cd discord-bot');
  console.warn('  npm install\n');
  console.log('Note: Main scanner is ready to use. Discord bot installation is optional.');
}

console.log('========================================');
console.log('✅ Setup Complete!');
console.log('========================================\n');
console.log('Next steps:');
console.log('1. Configure .env files (see README.md)');
console.log('2. Run: npm run deploy:start\n');
