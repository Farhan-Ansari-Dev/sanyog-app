const { exec } = require('child_process');
const fs = require('fs');

console.log('Starting Expo export...');
exec('npx.cmd expo export -c', (error, stdout, stderr) => {
  const output = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n\nERROR:\n${error ? error.message : 'None'}`;
  fs.writeFileSync('expo_export_log.txt', output);
  console.log('Done export check.');
});
