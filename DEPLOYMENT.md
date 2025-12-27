# Deployment Guide

Complete deployment instructions for DMT Pattern Hunter.

## Architecture Overview

DMT Pattern Hunter consists of two components with different deployment requirements:

### 1. Discord Bot (Background Service)
- **Type:** Background service
- **Deployment:** PM2 process manager
- **Availability:** 24/7 automated
- **User Interaction:** Discord slash commands

### 2. Pattern Scanner (Interactive CLI Tool)
- **Type:** Interactive terminal application
- **Deployment:** Manual execution (not PM2)
- **Usage:** On-demand manual scanning
- **User Interaction:** Terminal menu system

**Why separate deployment?**
The pattern scanner is an interactive CLI tool requiring real-time user input via `readline`. It cannot run as a background service because it needs an active terminal session.

---

## Prerequisites

- Node.js 24+ (for built-in SQLite support)
- PM2 (Process Manager) - for Discord bot only
- Git (for cloning)
- Bitcoin Core (optional, for unlimited access)
- Discord Bot Application (for Discord bot deployment)

### Built-in SQLite Support

The Discord bot uses Node.js 24+ built-in SQLite module (`node:sqlite`):

```javascript
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./bot.db');
```

**Benefits:**
- No external dependencies (no better-sqlite3)
- No build tools required
- Lightweight and fast
- Perfect for Discord bots

---

## Quick Start (Production)

```bash
# 1. Clone and setup
git clone https://github.com/Trac-Systems/dmt-pattern-hunter.git
cd dmt-pattern-hunter

# 2. Install dependencies
npm run deploy:setup

# 3. Configure environment variables
cp .env.example .env
nano .env
cp discord-bot/.env.example discord-bot/.env
nano discord-bot/.env

# 4. Start Discord bot with PM2
npm run deploy:start

# 5. Check Discord bot status
npm run deploy:status

# 6. Run pattern scanner (manual)
npm run scanner
```

---

## Detailed Deployment

### Step 1: Clone Repository

```bash
git clone https://github.com/Trac-Systems/dmt-pattern-hunter.git
cd dmt-pattern-hunter
```

### Step 2: Install Dependencies

Install dependencies for both main project and Discord bot:

```bash
# Create log directories
mkdir -p logs discord-bot/logs

# Install main project dependencies
npm install

# Install Discord bot dependencies
cd discord-bot
npm install
cd ..
```

Or use the helper script:

```bash
npm run deploy:setup
```

### Step 3: Configuration

#### Main Project (.env)

Create `.env` file in root directory:

```env
NETWORK=production
TRAC_CHANNEL=dmt_pattern_hunter_mainnet_r1
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
BLOCKCHAIN_INFO_URL=https://blockchain.info
DEBUG=false
```

#### Main Project (config.json)

Update `config.json` with your production settings:

```json
{
  "active": "production",
  "network": {
    "production": {
      "channel": "dmt_pattern_hunter_mainnet_r1",
      "ordTapHost": "https://fra-01.tap-reader.xyz"
    }
  },
  "blockDataSources": {
    "blockchainInfo": {
      "baseUrl": "https://blockchain.info"
    },
    "bitcoinCore": {
      "url": "http://127.0.0.1:8332",
      "username": "your_rpc_username",
      "password": "your_rpc_password"
    }
  }
}
```

#### Discord Bot (.env)

Create `.env` file in `discord-bot/` directory:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_GUILD_ID=your_guild_id_here
BLOCKCHAIN_INFO_URL=https://blockchain.info
BITCOIN_CORE_URL=http://127.0.0.1:8332
BITCOIN_CORE_USERNAME=your_rpc_username
BITCOIN_CORE_PASSWORD=your_rpc_password
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
DEBUG=false
```

See [discord-bot/README.md](discord-bot/README.md) for full Discord setup.

### Step 4: Deploy Discord Bot with PM2

PM2 manages only the Discord bot (background service):

```bash
# Start Discord bot
npm run deploy:start

# Check status
npm run deploy:status
```

Expected output:
```
┌─────┬────────────────┬──────┬─────────┬───────────┬─────────────┐
│ id  │ name           │ mode │ status  │ restarts  │ uptime      │
├─────┼────────────────┼──────┼─────────┼───────────┼─────────────┤
│ 0   │ dmt-discord-bot│ fork │ online  │ 0         │ 0s          │
└─────┴────────────────┴──────┴─────────┴───────────┴─────────────┘
```

### Step 5: Run Pattern Scanner (Manual)

The pattern scanner is an interactive CLI tool and cannot run under PM2. Run it manually:

```bash
# Run scanner
npm run scanner

# Run in debug mode
npm run scanner:dev
```

**Note:** The scanner will display an interactive menu in your terminal.

### Step 6: Register Discord Commands (One-time)

If deploying Discord bot for the first time:

```bash
npm run bot:register
```

Or manually:

```bash
cd discord-bot
npm run register
```

---

## PM2 Management Commands (Discord Bot Only)

### Starting Discord Bot

```bash
# Start Discord bot
npm run deploy:start

# Start with custom environment
pm2 start ecosystem.config.js --env production
```

### Stopping Discord Bot

```bash
# Stop Discord bot
npm run deploy:stop

# Stop specific service
pm2 stop dmt-discord-bot
```

### Restarting Discord Bot

```bash
# Graceful restart (zero downtime)
npm run deploy:reload

# Hard restart
npm run deploy:restart

# Restart specific service
pm2 restart dmt-discord-bot
```

### Monitoring

```bash
# View Discord bot logs
npm run deploy:logs

# View logs for specific service
pm2 logs dmt-discord-bot

# Real-time monitoring
npm run deploy:monit

# Flush logs
npm run deploy:flush
```

### Status Check

```bash
# Check status of Discord bot
npm run deploy:status

# Detailed info
pm2 show dmt-scanner
pm2 show dmt-discord-bot
```

### Deleting Services

```bash
# Stop and remove Discord bot
npm run deploy:delete

# Remove specific service
pm2 delete dmt-discord-bot
```

---

## PM2 Startup on Boot

Configure PM2 to start Discord bot on system boot:

```bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Run generated command (copy-paste the output)
# Example: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u youruser --hp /home/youruser
```

Now PM2 will automatically start Discord bot on server reboot.

## Pattern Scanner Usage

### Running the Scanner

The pattern scanner is an interactive CLI tool. Run it manually:

```bash
# Normal mode
npm run scanner

# Debug mode (verbose logging)
npm run scanner:dev
```

### Interactive Menu

When you run the scanner, you'll see an interactive menu:

```
─────────────────────────────────────────────────────────────────────
MAIN MENU
─────────────────────────────────────────────────────────────────────
1. 🔎 Scan for pattern
2. 📋 Check element availability
3. 📝 Generate inscription JSON
4. 🎫 Reserve element
5. 📊 View discoveries
6. 👤 Check reputation
7. 🏆 View leaderboard
8. 📜 View my scans
9. 💡 Available element names
0. 🚪 Exit
─────────────────────────────────────────────────────────────────────
```

### Remote Scanner Execution

For server deployment, use SSH or screen sessions:

**SSH Method:**
```bash
ssh user@server.com "cd /path/to/trac && npm run scanner"
```

**Screen/Tmux Method (Linux):**
```bash
# Start screen session
screen -S dmt-scanner

# Run scanner
npm run scanner

# Detach: Ctrl+A, then D
# Reattach: screen -r dmt-scanner
```

---

## Docker Deployment (Optional)

### Discord Bot Only (Recommended)

Deploy Discord bot with Docker:

**Dockerfile:**

```dockerfile
FROM node:24-alpine

# Install PM2 globally
RUN npm install -g pm2

# Create app directory
WORKDIR /app

# Copy Discord bot files
COPY discord-bot/package*.json ./discord-bot/

# Install Discord bot dependencies
WORKDIR /app/discord-bot
RUN npm install

# Copy Discord bot source
COPY discord-bot/ ./

# Create log directory
RUN mkdir -p logs

# Start Discord bot with PM2
CMD ["pm2-runtime", "../ecosystem.config.js"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  dmt-discord-bot:
    build: .
    container_name: dmt-discord-bot
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - DISCORD_APPLICATION_ID=${DISCORD_APPLICATION_ID}
      - ORD_TAP_HOST=https://fra-01.tap-reader.xyz
      - BLOCKCHAIN_INFO_URL=https://blockchain.info
    volumes:
      - ./discord-bot/logs:/app/discord-bot/logs
      - ./discord-bot/data:/app/discord-bot/data
    env_file:
      - discord-bot/.env
```

### Scanner (Local Only)

The pattern scanner runs interactively and should be run locally, not in Docker.

---

## Deployment Environments

### Development

**Pattern Scanner:**
```bash
# Run scanner in debug mode
npm run dev
```

**Discord Bot:**
```bash
# Run Discord bot in debug mode
npm run bot:dev
```

### Production

```bash
# Start both services
npm run deploy:start

# Or start with specific environment
pm2 start ecosystem.config.js --env production
```

---

## Monitoring and Logs

### Log Locations

- **Scanner logs**: `./logs/scanner-out.log`, `./logs/scanner-error.log`
- **Discord bot logs**: `./discord-bot/logs/out.log`, `./discord-bot/logs/error.log`

### Log Rotation

PM2 automatically handles log rotation. Check `ecosystem.config.js` for settings.

### Monitoring Tools

```bash
# PM2 Monitor
npm run deploy:monit

# PM2 Plus (web dashboard)
pm2 plus
```

---

## Backup and Recovery

### Database Backup

```bash
# Backup Discord bot SQLite database
cp discord-bot/data/bot.db discord-bot/data/bot.db.backup.$(date +%Y%m%d)

# Automated backup (add to cron)
0 2 * * * cp /path/to/discord-bot/data/bot.db /path/to/backups/bot.db.$(date +\%Y\%m\%d)
```

### PM2 Process List Backup

```bash
# PM2 automatically saves to ~/.pm2/dump.pm2

# Manual save
pm2 save

# Restore
pm2 resurrect
```

---

## Troubleshooting

### Discord Bot Won't Start

```bash
# Check Discord bot logs
pm2 logs dmt-discord-bot --lines 50

# Check configuration
pm2 show dmt-discord-bot

# Verify dependencies are installed
cd discord-bot && npm list

# Test Discord bot manually
cd discord-bot
npm run dev
```

### Pattern Scanner Issues

**Readline Error:**

If you see `ERR_USE_AFTER_CLOSE` or `readline was closed`, the scanner is being run incorrectly.

**Correct usage:**
```bash
# Run scanner directly (not through PM2)
npm run scanner
```

**Wrong usage:**
```bash
# Don't run scanner with PM2
pm2 start dmt-scanner  # This will fail!
```

### Port Conflicts

No port conflicts expected (services are CLI-based).

### Memory Issues

PM2 auto-restarts Discord bot if memory exceeds `max_memory_restart` (500M).

Adjust in `ecosystem.config.js` if needed:

```javascript
max_memory_restart: '1G'
```

### blockchain.info Rate Limits

If hitting rate limits frequently:

1. Configure Bitcoin Core as fallback
2. Use smaller block ranges for scans
3. Monitor logs for rate limit errors

### Discord Bot Issues

```bash
# Check Discord bot logs specifically
pm2 logs dmt-discord-bot

# Test Discord bot connection
cd discord-bot
npm run dev
```

---

## Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install
cd discord-bot && npm install && cd ..

# Restart Discord bot
npm run deploy:restart
```

### Rollback

```bash
# Checkout previous version
git checkout <previous_tag>

# Restart Discord bot
npm run deploy:restart
```

### Health Checks

Check blockchain.info and TAP API health:

```bash
# Blockchain.info
curl https://blockchain.info/q/getblockcount

# TAP API
curl https://fra-01.tap-reader.xyz/health
```

---

## Security Checklist

- [ ] Change default passwords in config.json
- [ ] Set up HTTPS/TLS for any web endpoints
- [ ] Restrict file permissions on `.env` files
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Regular security updates (`npm audit fix`)
- [ ] Backup SQLite database regularly
- [ ] Monitor PM2 logs for suspicious activity
- [ ] Use PM2 keymetrics for production monitoring

---

## Support

- **Discord**: https://discord.gg/trac
- **Issues**: https://github.com/Trac-Systems/dmt-pattern-hunter/issues
- **Documentation**: [README.md](README.md), [PHASES.md](PHASES.md)

---

## License

MIT License - See LICENSE file for details.
