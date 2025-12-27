const { execSync } = require('child_process');
const path = require('path');

console.log('Registering Discord bot commands...');

try {
  execSync('node src/register-commands.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', 'discord-bot')
  });

  console.log('\n✅ Discord bot commands registered successfully!\n');
} catch (error) {
  console.error('\n✗ Failed to register Discord bot commands');
  process.exit(1);
}
