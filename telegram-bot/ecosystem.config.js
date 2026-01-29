/**
 * PM2 Configuration for DMT Pattern Hunter Telegram Bot
 */
module.exports = {
  apps: [{
    name: 'dmt-telegram-bot',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      DEBUG: 'false'
    },
    env_production: {
      NODE_ENV: 'production',
      DEBUG: 'false'
    },
    env_development: {
      NODE_ENV: 'development',
      DEBUG: 'true'
    }
  }]
};