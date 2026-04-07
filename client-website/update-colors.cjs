const fs = require('fs');
const path = require('path');
const dirs = ['./src/pages', './src/components'];

const processFile = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Backgrounds
  content = content.replace(/bg-gray-50/g, 'bg-gray-50 dark:bg-[#020617]');
  content = content.replace(/bg-white/g, 'bg-white dark:bg-[#0F172A]');
  content = content.replace(/bg-gray-100/g, 'bg-gray-100 dark:bg-[#1E293B]');
  
  // Text
  content = content.replace(/text-gray-900/g, 'text-gray-900 dark:text-white');
  content = content.replace(/text-gray-800/g, 'text-gray-800 dark:text-slate-200');
  content = content.replace(/text-gray-700/g, 'text-gray-700 dark:text-slate-300');
  content = content.replace(/text-gray-600/g, 'text-gray-600 dark:text-slate-400');
  content = content.replace(/text-gray-500/g, 'text-gray-500 dark:text-slate-400');
  
  // Borders
  content = content.replace(/border-gray-100/g, 'border-gray-100 dark:border-[#1E293B]');
  content = content.replace(/border-gray-200/g, 'border-gray-200 dark:border-[#334155]');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
};

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(f => {
      if (f.endsWith('.jsx')) processFile(path.join(dir, f));
    });
  }
});
