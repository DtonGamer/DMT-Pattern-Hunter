const { execSync } = require('child_process');
const path = require('path');

console.log('Starting Discord bot...\n');

try {
  execSync('node index.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'discord-bot')
  });
} catch (error) {
  console.error('\n✗ Failed to start Discord bot');
  process.exit(1);
}
