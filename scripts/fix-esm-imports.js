const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', 'discord-bot', 'src', 'commands');
const helpersDir = path.join(__dirname, '..', 'discord-bot', 'src', 'helpers');

console.log('Fixing broken ES module imports...\n');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix: import { { X } } from 'discord.js' -> import { X } from 'discord.js'
  content = content.replace(/import\s+\{\s*\{\s*([^}]+)\s*\}\s*\}\s*from/g,
    'import { $1 } from');

  // Fix: export default { -> export default {
  content = content.replace(/export\s+default\s*\{/g, 'export default {');

  // Fix closing brace after export default
  content = content.replace(/}\s*\}\s*from/g, '} from');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed: ${path.basename(filePath)}`);
    return true;
  }
  return false;
};

let fixedCount = 0;

// Fix commands
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
console.log('Commands:');
commandFiles.forEach(file => {
  if (fixFile(path.join(commandsDir, file))) {
    fixedCount++;
  }
});

// Fix helpers
const helperFiles = fs.readdirSync(helpersDir).filter(file => file.endsWith('.js'));
console.log('\nHelpers:');
helperFiles.forEach(file => {
  if (fixFile(path.join(helpersDir, file))) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} file(s)!`);
