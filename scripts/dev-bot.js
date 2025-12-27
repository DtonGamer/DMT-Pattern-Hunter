const { execSync } = require('child_process');
const path = require('path');

console.log('Starting Discord bot in development mode...\n');

try {
  execSync('DEBUG=true node index.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'discord-bot')
  });
} catch (error) {
  console.error('\n✗ Failed to start Discord bot in development mode');
  process.exit(1);
}
