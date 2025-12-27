# Deployment Architecture Update

## Summary

Removed pattern scanner from PM2 deployment due to its interactive CLI nature. Only Discord bot is now deployed with PM2.

## Why This Change?

The pattern scanner is an **interactive CLI tool** that requires:
- Real-time user input via `readline`
- Active terminal session
- User interaction for menu selections

PM2 runs applications as **background services** with no TTY/terminal available, causing:
```
Error: ERR_USE_AFTER_CLOSE - readline was closed
```

## New Architecture

```
┌─────────────────────────────────────────┐
│     Deployment Setup                 │
└─────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────┐   ┌────▼─────────────┐
│ Discord   │   │ Pattern Scanner │
│ Bot       │   │ (CLI Tool)      │
│ (PM2)    │   │ (Manual)       │
│ ✅        │   │                │
│ Background│   │ Run when       │
│ Service   │   │ needed         │
│ 24/7      │   │ Interactive    │
└───────────┘   └────────────────┘
```

## Deployment Instructions

### Discord Bot (PM2 Managed)

```bash
# Deploy Discord bot
npm run deploy:start

# Check status
npm run deploy:status

# View logs
npm run deploy:logs
```

**Features:**
- ✅ Background service
- ✅ Auto-restart on crash
- ✅ Managed by PM2
- ✅ Runs 24/7
- ✅ Startup on boot (configured via `pm2 startup`)

### Pattern Scanner (Manual Execution)

```bash
# Run scanner interactively
npm run scanner

# Run in debug mode
npm run scanner:dev
```

**Features:**
- 🔍 Interactive CLI menu
- 🔍 Real-time pattern scanning
- 🔍 Direct user input
- 🔍 Runs in terminal
- ❌ Cannot be background service

## Files Modified

### Configuration
- ✅ `ecosystem.config.js` - Removed dmt-scanner app
- ✅ `package.json` - Added scanner commands

### Deployment Scripts
- ✅ `DEPLOYMENT.md` - Updated with new architecture
- ✅ `COMMANDS.md` - Updated PM2 commands
- ✅ `README.md` - Updated quick start

## Commands Reference

### PM2 (Discord Bot Only)

```bash
npm run deploy:start     # Start Discord bot
npm run deploy:stop      # Stop Discord bot
npm run deploy:restart   # Restart Discord bot
npm run deploy:reload    # Reload Discord bot
npm run deploy:logs      # View Discord bot logs
npm run deploy:status    # Check Discord bot status
npm run deploy:delete    # Remove Discord bot from PM2
```

### Pattern Scanner (Manual)

```bash
npm run scanner         # Run scanner
npm run scanner:dev     # Debug mode
npm start               # Same as scanner
npm run dev             # Same as scanner:dev
```

## User Workflow

### For Daily Use

1. **Deploy Discord bot once:**
   ```bash
   npm run deploy:setup
   npm run deploy:start
   ```

2. **Run scanner when needed:**
   ```bash
   npm run scanner
   ```

3. **Use Discord bot for community access:**
   - Slash commands in Discord
   - Always available (24/7)
   - Pattern sharing
   - Leaderboard

### For Remote Server Deployment

**Option 1: SSH Execution**
```bash
ssh user@server.com "cd /path/to/trac && npm run scanner"
```

**Option 2: Screen/Tmux (Linux)**
```bash
# Create screen session
screen -S dmt-scanner

# Run scanner
npm run scanner

# Detach: Ctrl+A, then D
# Reattach: screen -r dmt-scanner
```

## Troubleshooting

### Scanner Crashes in PM2

**Error:** `ERR_USE_AFTER_CLOSE - readline was closed`

**Cause:** Scanner is being run via PM2 (no terminal)

**Solution:**
```bash
# Stop scanner from PM2
pm2 stop dmt-scanner
pm2 delete dmt-scanner

# Run scanner directly
npm run scanner
```

### Check What's Deployed

```bash
# View PM2 managed apps
pm2 list

# Expected output (only Discord bot):
┌─────┬────────────────┬──────┬─────────┬──────────┬─────────────┐
│ id   │ name           │ mode │ status  │ restarts  │ uptime      │
├─────┼────────────────┼──────┼─────────┼──────────┼─────────────┤
│ 0    │ dmt-discord-bot│ fork │ online  │ 0         │ 0s          │
└─────┴────────────────┴──────┴─────────┴──────────┴─────────────┘
```

### Clean Up Old Scanner from PM2

If you previously had scanner in PM2:

```bash
# Stop and delete
pm2 stop dmt-scanner
pm2 delete dmt-scanner

# Verify
pm2 list
```

## Future: Phase 2 Web UI

The pattern scanner will eventually become a web-based application (Phase 2):

```
Current (Phase 1): Interactive CLI
       ↓
Future (Phase 2): Web Dashboard
       ↓
Background Service + REST API + Web UI
```

This will enable:
- Background scanning
- PM2 deployment
- Multiple concurrent users
- Web-based access

## Documentation Updated

- ✅ `ecosystem.config.js` - Discord bot only
- ✅ `package.json` - Added scanner scripts
- ✅ `DEPLOYMENT.md` - New architecture explained
- ✅ `COMMANDS.md` - Updated PM2 commands
- ✅ `README.md` - Quick start updated

## Migration Complete

✅ Pattern scanner removed from PM2
✅ Discord bot remains in PM2
✅ All documentation updated
✅ New scripts added for scanner management
✅ Architecture clearly documented

**Next Steps:**

1. Stop old scanner from PM2 (if needed):
   ```bash
   pm2 stop dmt-scanner
   pm2 delete dmt-scanner
   ```

2. Deploy Discord bot:
   ```bash
   npm run deploy:start
   ```

3. Use scanner manually:
   ```bash
   npm run scanner
   ```
