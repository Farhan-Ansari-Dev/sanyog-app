const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

const navFiles = getFiles('./src/navigation');
const allFiles = getFiles('./src/screens').concat(getFiles('./src/components')).concat(navFiles);

// Extract all registered screens
const registeredScreens = new Set();
navFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match <Stack.Screen name="ScreenName" or <Tab.Screen name="ScreenName" or <Drawer.Screen name="ScreenName"
  const regex = /<(?:Stack|Tab|Drawer)\.Screen\s+name=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    registeredScreens.add(match[1]);
  }
});
// Add Dashboard because it's the drawer wrapping the tabs
registeredScreens.add('Dashboard');

// Also extract all navigated screens
const missingScreens = new Set();
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match navigate('ScreenName'
  // and navigate('ScreenName', { ... })
  // Also push('ScreenName')
  // We need to match .navigate('SomeString' or .navigate("SomeString"
  const regex = /\b(?:navigate|push|replace)\(\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const screen = match[1];
    if (!registeredScreens.has(screen)) {
      missingScreens.add({ file, screen });
    }
  }
});

if (missingScreens.size > 0) {
  console.log("Missing screens found in navigation.navigate calls:");
  missingScreens.forEach(item => {
    console.log(`${item.screen} used in ${item.file}`);
  });
} else {
  console.log("All navigation calls look good! No unregistered screens found.");
}
