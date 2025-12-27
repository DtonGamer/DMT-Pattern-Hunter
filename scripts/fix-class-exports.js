const fs = require('fs');
const path = require('path');

const helpersDir = path.join(__dirname, '..', 'discord-bot', 'src', 'helpers');

console.log('Fixing class exports...\n');

const fixClassExports = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Fix: module.exports = ClassName -> export default class ClassName
  // First, find the class name and convert to export default class
  const classMatch = content.match(/class\s+(\w+)\s*\{/);
  if (classMatch && content.includes('module.exports')) {
    const className = classMatch[1];
    content = content.replace(/class\s+className/g, `export default class ${className}`);
    content = content.replace(/module\.exports\s*=\s*className;?/g, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Fixed: ${path.basename(filePath)} - Added export default to class ${className}`);
      return true;
    }
  }
  return false;
};

let fixedCount = 0;

// Fix helpers
const helperFiles = fs.readdirSync(helpersDir).filter(file => file.endsWith('.js'));
console.log('Helpers:');
helperFiles.forEach(file => {
  if (fixClassExports(path.join(helpersDir, file))) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} file(s)!`);
