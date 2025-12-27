const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', 'discord-bot', 'src', 'commands');
const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

console.log('Converting Discord bot commands to ES modules...\n');

files.forEach(file => {
  const filePath = path.join(commandsDir, file);
  console.log(`Processing: ${file}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace require with import (fix regex to not duplicate braces)
  content = content.replace(/const\s+(\{([^}]+)\})\s*=\s*require\(['"]discord\.js['"]\);/g,
    'import { $1 } from \'discord.js\';');

  content = content.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\);/g,
    'import $1 from \'$2\';');

  // Replace module.exports with export default
  content = content.replace(/module\.exports\s*=\s*\{/, 'export default {');

  // Fix duplicate braces if present (from previous bad conversion)
  content = content.replace(/}\s*}\s*from/g, '} from');

  fs.writeFileSync(filePath, content);
  console.log(`  ✓ Converted ${file}`);
});

console.log('\n✅ All commands converted to ES modules!');
