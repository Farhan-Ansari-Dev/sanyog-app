const fs = require('fs');
const path = require('path');
const dir = './src/pages';

const processFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Remove Sidebar import
  content = content.replace(/import Sidebar from ["']\.\.\/components\/Sidebar["'];?\n?/g, '');
  
  // Remove <Sidebar /> component tag
  content = content.replace(/<Sidebar \/>\n?/g, '');
  
  // Replace the outer container and main tags which are now handled by Layout.jsx
  // We want to keep the inner content but remove the flex wrapper and sidebars
  
  // Match: <div className="flex min-h-screen bg-gray-50 ...">
  content = content.replace(/<div className="flex min-h-screen[^"]*">/g, '<div className="animate-in fade-in slide-in-from-bottom-4 duration-700">');
  
  // Match: <main className="flex-1 p-6 ... overflow-x-hidden">
  content = content.replace(/<main className="flex-1[^"]*overflow-x-hidden[^"]*">/g, '');
  
  // Remove the closing </main>
  content = content.replace(/<\/main>\n?\s*<\/div>/g, '</div>');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Processed ' + file);
  }
};

fs.readdirSync(dir).forEach(f => {
  if (f.endsWith('.jsx')) processFile(path.join(dir, f));
});
