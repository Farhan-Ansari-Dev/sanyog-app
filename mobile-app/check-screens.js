const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src/screens');
const navDir = path.join(__dirname, 'src/navigation');

// Recursively find all files in a directory
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const allScreenFiles = walk(screensDir).filter(f => f.endsWith('Screen.tsx') || f.endsWith('.tsx'));
const allNavFiles = walk(navDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

const registeredScreens = new Set();
const unregisteredScreens = [];

// Find all screen imports in the navigation directory
allNavFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match `import ScreenName from '../screens/...'`
  const matches = [...content.matchAll(/import\s+(\w+Screen)\s+from\s+['"].*['"]/g)];
  matches.forEach(m => registeredScreens.add(m[1]));
});

// Check which screen files are not in the registered set
allScreenFiles.forEach(file => {
  const basename = path.basename(file, '.tsx');
  if (basename.endsWith('Screen') || basename.endsWith('Wizard')) {
    if (!registeredScreens.has(basename)) {
      unregisteredScreens.push({ name: basename, file: file.replace(__dirname, '') });
    }
  }
});

console.log('--- Unregistered Screens ---');
unregisteredScreens.forEach(s => console.log(s.name, '->', s.file));
console.log(`Total: ${unregisteredScreens.length} missing screens.`);
