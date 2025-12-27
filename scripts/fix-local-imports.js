const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', 'discord-bot', 'src', 'commands');
const helpersDir = path.join(__dirname, '..', 'discord-bot', 'src', 'helpers');

console.log('Fixing local import paths...\n');

const fixLocalImports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix local imports to include .js extension
  // Matches: import X from '../path' without .js
  content = content.replace(
    /import\s+(\w+)\s+from\s+['"](\.\.\/[^'"]+)['"](?!\.js)/g,
    (match, name, importPath) => {
      return `import ${name} from '${importPath}.js'`;
    }
  );

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
  if (fixLocalImports(path.join(commandsDir, file))) {
    fixedCount++;
  }
});

// Fix helpers
const helperFiles = fs.readdirSync(helpersDir).filter(file => file.endsWith('.js'));
console.log('\nHelpers:');
helperFiles.forEach(file => {
  if (fixLocalImports(path.join(helpersDir, file))) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} file(s)!`);
