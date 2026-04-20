module.exports = {
  apps: [
    {
      name: 'dice-api-production',
      script: './server.js',
      instances: 'max', // Auto-scales to utilize all CPU cores on EC2
      exec_mode: 'cluster', // Enables perfect zero-downtime load balancing
      watch: false, // Production mode should never watch for file changes
      max_memory_restart: '1G', // Auto-reboot memory leaks instantly
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      merge_logs: true,
      time: true,
      node_args: '--max-old-space-size=2048' // Safe V8 heap limit
    }
  ]
};
