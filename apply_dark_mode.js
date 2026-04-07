const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'admin-panel/src');

const replacements = [
  { match: /\bbg-white\b/g, replace: 'bg-white dark:bg-[#0F172A]' },
  { match: /\bbg-\[\#F8FAFC\]\b/g, replace: 'bg-[#F8FAFC] dark:bg-[#0B1120]' },
  { match: /\bbg-\[\#F1F5F9\]\b/g, replace: 'bg-[#F1F5F9] dark:bg-[#1E293B]' },
  { match: /\bbg-slate-50\b/g, replace: 'bg-slate-50 dark:bg-[#1E293B]' },
  { match: /\btext-\[\#0F172A\]\b/g, replace: 'text-[#0F172A] dark:text-[#F8FAFC]' },
  { match: /\btext-\[\#334155\]\b/g, replace: 'text-[#334155] dark:text-[#E2E8F0]' },
  { match: /\btext-\[\#64748B\]\b/g, replace: 'text-[#64748B] dark:text-[#94A3B8]' },
  { match: /\btext-\[\#475569\]\b/g, replace: 'text-[#475569] dark:text-[#CBD5E1]' },
  { match: /\bborder-\[\#E2E8F0\]\b/g, replace: 'border-[#E2E8F0] dark:border-[#1E293B]' },
  { match: /\bborder-\[\#F1F5F9\]\b/g, replace: 'border-[#F1F5F9] dark:border-[#1E293B]' },
];

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Prevent double replacements if script is run twice
      if (!content.includes('dark:bg-[#0F172A]')) {
        for (const { match, replace } of replacements) {
          content = content.replace(match, replace);
        }
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${entry.name}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Dark mode classes injected successfully.');
