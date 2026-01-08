# Command Reference

Quick reference for common commands in DMT Pattern Hunter.

## Quick Start

```bash
# Deploy everything (setup dependencies)
npm run deploy:setup

# Deploy Discord bot with 2
npm run deploy:start

# Run scanner manually (when needed)
npm run scanner
```

---

## PM2 Commands (Production)

Discord bot is managed by PM2, pattern scanner runs manually.

### Management

```bash
# Start Discord bot
npm run deploy:start

# Stop Discord bot
npm run deploy:stop

# Restart Discord bot
npm run deploy:restart

# Graceful reload (zero downtime)
npm run deploy:reload

# Delete Discord bot
npm run deploy:delete
```

### Monitoring

```bash
# View Discord bot logs
npm run deploy:logs

# View specific service logs
pm2 logs dmt-discord-bot

# Real-time monitoring
npm run deploy:monit

# Check status
npm run deploy:status

# Flush logs
npm run deploy:flush
```

---

## Pattern Scanner Commands

### Manual Execution

Pattern scanner is an interactive CLI tool - run it manually when you want to scan:

```bash
# Run scanner
npm run scanner

# Run in debug mode
npm run scanner:dev
```

---

## Discord Bot Commands

### Management

```bash
# Start Discord bot
npm run bot:start

# Start in development mode
npm run bot:dev

# Register Discord commands (one-time)
npm run bot:register
```

### Manual (in discord-bot/ directory)

```bash
cd discord-bot

# Start bot
npm start

# Development mode
npm run dev

# Register commands
npm run register
```

---

## Discord Bot Slash Commands

### Pattern Scanning

```
/scan <pattern> [field] [start_block] [end_block]
```
- Scan for patterns in blockchain data

### Element Management

```
/element <name> <pattern> [field]
```
- Check element availability

```
/reserve <name> <pattern> [field]
```
- Reserve element for 24 hours

### Inscription Generation

```
/generate <type> [...params]
```
- Generate inscription JSON
- Types: element-registration, nat-deployment, nat-mint

### Information

```
/discovery [limit]
```
- View recent pattern discoveries

```
/reputation
```
- Check your reputation and tier

```
/leaderboard [type] [limit]
```
- View pattern discovery leaderboard

```
/myscans [limit]
```
- View your recent scan history

```
/names <pattern> [field]
```
- Get suggestions for available element names

### Account

```
/link <address>
```
- Link your Bitcoin address to Discord account

```
/notifications
```
- Toggle rare pattern notifications

```
/help
```
- Display all commands

---

## Git Commands

```bash
# Pull latest changes
git pull origin main

# Check status
git status

# View changes
git diff

# Create new branch
git checkout -b feature-name

# Commit changes
git add .
git commit -m "Description"
```

---

## Docker Commands

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build
```

---

## Troubleshooting Commands

```bash
# Check blockchain.info health
curl https://blockchain.info/q/getblockcount

# Check TAP API health
curl https://fra-01.tap-reader.xyz/health

# Check Bitcoin Core connection
curl -X POST -H "Content-Type: application/json" \
  --user 'username:password' \
  --data '{"jsonrpc":"2.0","id":1,"method":"getblockcount","params":[]}' \
  http://127.0.0.1:8332

# Check PM2 processes
pm2 list

# Check PM2 logs
pm2 logs --lines 100

# Restart PM2 on error
pm2 restart all

# Clear PM2 logs
pm2 flush
```

---

## Environment Variables

```bash
# Set temporary env variable (single command)
DEBUG=true npm start

# View current env variables
printenv | grep -E '(NETWORK|DEBUG|TRAC)'

# Load from .env file
node -r dotenv/config index.js
```

---

## File Locations

```
Root Directory
├── index.js                    # Scanner entry point
├── config.json                 # Main configuration
├── .env                        # Environment variables
├── ecosystem.config.js         # PM2 configuration
├── logs/                       # Scanner logs
│   ├── scanner-out.log
│   └── scanner-error.log
└── discord-bot/
    ├── index.js                # Discord bot entry point
    ├── .env                    # Discord bot environment
    ├── logs/                   # Discord bot logs
    │   ├── out.log
    │   └── error.log
    └── data/
        └── bot.db              # SQLite database
```

---

## Common Workflows

### Deploy Update

```bash
git pull origin main
npm install
cd discord-bot && npm install && cd ..
npm run deploy:restart
```

### Debug Issue

```bash
# Enable debug mode
DEBUG=true npm start

# Check logs
pm2 logs dmt-scanner --lines 50

# Monitor in real-time
pm2 monit
```

### Backup Database

```bash
# Backup Discord bot database
cp discord-bot/data/bot.db discord-bot/data/bot.db.backup.$(date +%Y%m%d)
```

### Check Service Health

```bash
# Check blockchain.info
curl https://blockchain.info/q/getblockcount

# Check TAP API
curl https://fra-01.tap-reader.xyz/health

# Check PM2 status
pm2 status

# View recent errors
pm2 logs --err --lines 20
```

---

## Help & Support

- 📖 **Full Documentation**: [README.md](README.md)
- 🚀 **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🤖 **Discord Bot**: [discord-bot/README.md](discord-bot/README.md)
- 💬 **Discord**: https://discord.gg/trac
- 🐛 **Issues**: https://github.com/Trac-Systems/dmt-pattern-hunter/issues
