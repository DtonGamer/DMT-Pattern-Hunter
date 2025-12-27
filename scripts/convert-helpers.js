const fs = require('fs');
const path = require('path');

const helpersDir = path.join(__dirname, '..', 'discord-bot', 'src', 'helpers');
const files = fs.readdirSync(helpersDir).filter(file => file.endsWith('.js'));

console.log('Converting Discord bot helpers to ES modules...\n');

files.forEach(file => {
  const filePath = path.join(helpersDir, file);
  console.log(`Processing: ${file}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace require with import
  content = content.replace(/const\s+(\{([^}]+)\})\s*=\s*require\(['"]discord\.js['"]\);/g,
    'import { $1 } from \'discord.js\';');

  content = content.replace(/const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\);/g,
    'import $1 from \'$2\';');

  // Replace module.exports = class with export default class
  content = content.replace(/module\.exports\s*=\s*class\s+(\w+)/g,
    'export default class $1');

  // Replace module.exports = class with export default class
  content = content.replace(/module\.exports\s*=\s*class\s+(\w+)/g,
    'export default class $1');

  fs.writeFileSync(filePath, content);
  console.log(`  ✓ Converted ${file}`);
});

console.log('\n✅ All helpers converted to ES modules!');
