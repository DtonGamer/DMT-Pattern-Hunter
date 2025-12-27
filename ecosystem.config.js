module.exports = {
  apps: [
    {
      name: 'dmt-discord-bot',
      script: './discord-bot/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        ORD_TAP_HOST: 'https://fra-01.tap-reader.xyz',
        DEBUG: 'false'
      },
      error_file: './discord-bot/logs/error.log',
      out_file: './discord-bot/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
