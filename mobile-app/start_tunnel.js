const { spawn } = require('child_process');
const fs = require('fs');

console.log('Spawning tunnel...');
const p = spawn('npx.cmd', ['expo', 'start', '--tunnel'], {
  env: { ...process.env, CI: 'true' },
});

p.stdout.on('data', (data) => {
  fs.appendFileSync('expo_tunnel_log.txt', data);
});

p.stderr.on('data', (data) => {
  fs.appendFileSync('expo_tunnel_log.txt', data);
});

// Write pid so we know it's running
fs.writeFileSync('tunnel.pid', String(p.pid));
console.log('Tunnel spawned in background.');
