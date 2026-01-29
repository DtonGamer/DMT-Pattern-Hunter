# Telegram Bot Setup Guide

## Overview

The DMT Pattern Hunter Telegram Bot allows users to scan for blockchain patterns, check element availability, and participate in discovery sharing - all from within Telegram!

---

## Prerequisites

- Node.js 24+ (for built-in SQLite support)
- Telegram Bot Token (obtained from @BotFather)
- Bitcoin address (optional, but recommended for reputation)

---

## Installation

1. **Navigate to telegram-bot directory:**

```bash
cd telegram-bot
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your Telegram credentials:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
DEBUG=false
```

4. **Or use config.telegram.json:**

```bash
cp config.telegram.json-dist config.telegram.json
```

Edit `config.telegram.json` with your settings.

---

## Telegram Bot Setup

1. **Create Telegram Bot:**

- Open Telegram and search for `@BotFather`
- Send `/newbot` command
- Follow the instructions to create your bot
- Copy the "HTTP API token" (this is your `TELEGRAM_BOT_TOKEN`)

2. **Get Bot Info:**

- Use `/mybots` command in @BotFather to view your bot
- Note your bot's username and token

---

## Running the Bot

### Development Mode

```bash
npm run dev
```

Enables debug logging.

### Production Mode

```bash
npm start
```

### Using PM2

Start with process manager:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Available Commands

### /scan
Scan for patterns in blockchain data.

**Parameters:**
- `pattern` (required): Pattern to search (e.g., "69", "420", "777")
- `field` (optional): Block field to search (0-37, default: 16)
- `start_block` (optional): Starting block height (default: 800000)
- `end_block` (optional): Ending block height (default: 800050)

**Requirements:** BASIC_SCAN role (everyone)

**Rate Limits:**
- Anonymous: 5 scans/day
- Verified: 100 scans/day
- Trusted: 1000 scans/day

---

### /element
Check if an element is available.

**Parameters:**
- `name` (required): Element name (e.g., "lucky")
- `pattern` (required): Pattern (e.g., "69")
- `field` (optional): Field number (0-37, default: 16)

**Requirements:** ELEMENT_CHECK role (everyone)

---

### /generate
Generate inscription JSON for elements, deployments, or mints.

**Parameters:**
- `type` (required): Type of JSON to generate (element-registration, nat-deployment, nat-mint)
- Type-specific parameters (see /help)

**Requirements:** VERIFIED or TRUSTED tier

---

### /reserve
Reserve an element for 24 hours.

**Parameters:**
- `name` (required): Element name
- `pattern` (required): Pattern
- `field` (optional): Field number (0-37, default: 16)

**Requirements:** VERIFIED or TRUSTED tier

---

### /discovery
View recent pattern discoveries.

**Parameters:**
- `limit` (optional): Number of discoveries to show (default: 20, max: 50)

**Requirements:** BASIC_SCAN role (everyone)

---

### /reputation
Check your reputation and tier.

**Requirements:** BASIC_SCAN role (everyone)

Shows:
- Current tier (BASIC/VERIFIED/TRUSTED)
- Reputation score
- Discoveries count
- Scans remaining today
- Upgrade requirements

---

### /leaderboard
View the pattern discovery leaderboard.

**Parameters:**
- `type` (optional): Leaderboard type (discoverers/patterns, default: discoverers)
- `limit` (optional): Number of entries to show (default: 10, max: 20)

**Requirements:** BASIC_SCAN role (everyone)

---

### /myscans
View your recent scan history.

**Parameters:**
- `limit` (optional): Number of scans to show (default: 10, max: 25)

**Requirements:** BASIC_SCAN role (everyone)

---

### /names
Get suggestions for available element names.

**Parameters:**
- `pattern` (required): Pattern to check
- `field` (optional): Field number (0-37, default: 16)

**Requirements:** ELEMENT_CHECK role (everyone)

---

### /link
Link your Bitcoin address to your Telegram account.

**Parameters:**
- `address` (required): Your Bitcoin address (starts with bc1...)

**Requirements:** None

**Benefits:**
- Track discoveries across sessions
- Earn reputation
- Upgrade to higher tiers
- Unlock more features

---

### /notifications
Enable or disable rare pattern notifications.

**Requirements:** None

**Features:**
- Toggle notifications when you discover rare patterns
- Notifications sent directly to user
- Configured in bot config

---

### /help
Display all available commands and their descriptions.

**Requirements:** None

---

## User Tiers

### BASIC (Anonymous)
- **Scans:** 5 per day
- **Can Use:** scan, element, discovery, reputation, leaderboard, myscans, names, link, notifications
- **Cannot Use:** generate, reserve
- **Upgrade:** Make 10 discoveries

### VERIFIED
- **Scans:** 100 per day
- **Can Use:** All BASIC commands + generate, reserve
- **Upgrade:** Make 50 total discoveries + 20 verified discoveries

### TRUSTED
- **Scans:** 1000 per day (unlimited)
- **Can Use:** All commands
- **Perks:** Can create guilds (Phase 2)

---

## Configuration

### Environment Variables (.env)

| Variable | Description | Required |
|----------|-------------|-----------|
| TELEGRAM_BOT_TOKEN | Bot token from @BotFather | Yes |
| BLOCKCHAIN_INFO_URL | blockchain.info API URL | No (defaults to https://blockchain.info) |
| BITCOIN_CORE_URL | Bitcoin Core RPC URL (fallback, unlimited) | No |
| BITCOIN_CORE_USERNAME | Bitcoin Core RPC username | No |
| BITCOIN_CORE_PASSWORD | Bitcoin Core RPC password | No |
| ORD_TAP_HOST | TAP API URL for pattern verification | No (defaults to public URL) |
| DEBUG | Enable debug logging | No (false) |

### Configuration File (config.telegram.json)

```json
{
  "telegram": {
    "token": "YOUR_BOT_TOKEN",
    "permissions": {
      "allowAnonymousScans": true,
      "askForAnnouncementPermission": true
    }
  }
}
```

---

## Architecture

The Telegram bot inherits its block data configuration from the main contract, using a **dual-source architecture**:

### Block Data Fetching

```
Telegram Bot Request
    ↓
Contract Layer
    ↓
Block Data Fetcher
    ├─► Primary: blockchain.info API
    │   └─ Public API, no setup required
    │   └─ Automatic rate limiting (200 req/min)
    │
    └─► Fallback: Bitcoin Core RPC
        └─ Local node (if configured)
        └─ Unlimited access, no rate limits
```

**Configuration** (inherited from `../../config.json`):
- blockchain.info is the default (automatic)
- Bitcoin Core is optional fallback (configured in .env)
- Automatic failover when primary fails

### Pattern Verification

The **TAP API** is used exclusively for:
- ✅ Verifying pattern existence as inscriptions
- ✅ Checking inscription metadata
- ✅ Retrieving TAP protocol data

**NOT used for**:
- ❌ Block data fetching (handled by blockchain.info)
- ❌ Pattern scanning (uses blockchain.info data)

### Health Monitoring

Bot monitors both systems:
- blockchain.info connectivity and latency
- TAP API availability for verification
- Automatic fallback to Bitcoin Core if blockchain.info fails

---

## Features

### Rare Pattern Notifications
Users can opt-in to receive notifications when they discover rare patterns. These notifications are sent directly to the user.

**Rarity Levels:**
- EXTREMELY RARE (< 0.01% frequency)
- RARE (< 0.1% frequency)
- MODERATE (< 1% frequency)
- COMMON (≥ 1% frequency)

### Discovery Announcements
When users discover new patterns, announcements are posted (with user permission) to keep the community engaged.

### SQLite Database

Uses **Node.js 24+ built-in SQLite** for persistent storage:

```javascript
import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('./bot.db');
```

**Benefits:**
- No external dependencies (removed better-sqlite3)
- No build tools required
- Lightweight and fast
- Production-ready for Telegram bots

**Data stored:**
- User data (Telegram ID ↔ Bitcoin address mapping)
- Scan history
- Reservations
- Notification preferences

### Rate Limiting
Daily scan limits enforced per tier:
- Tracks scans per Telegram user
- Resets automatically at midnight
- Shows remaining scans in /scan response

---

## Troubleshooting

### Bot not responding
- Check bot has permissions
- Verify bot token is correct
- Check console logs for errors

### blockchain.info connection issues

**Error**: "Failed to fetch block data" or "blockchain.info unreachable"

**Solutions**:
1. Check internet connectivity
2. Verify `BLOCKCHAIN_INFO_URL` in .env (default: `https://blockchain.info`)
3. blockchain.info has rate limits (200 req/min):
   - Bot automatically handles rate limiting
   - Large scans may take longer due to automatic delays
4. blockchain.info may be temporarily down:
   - Check status: https://blockchain.info/q/getblockcount
   - Bot will continue using Bitcoin Core fallback if configured
5. Configure Bitcoin Core as fallback for unlimited access:
   ```env
   BITCOIN_CORE_URL=http://127.0.0.1:8332
   BITCOIN_CORE_USERNAME=your_rpc_username
   BITCOIN_CORE_PASSWORD=your_rpc_password
   ```

**Error**: "All block data sources failed"

**Solutions**:
1. Verify blockchain.info is accessible via browser
2. Configure Bitcoin Core RPC as fallback (see above)
3. Check if blockchain.info is blocking requests (try changing User-Agent in config)
4. Contact support if issue persists

### TAP API connection issues

**Note**: TAP API is used for pattern verification and inscription data, NOT block data fetching.

**Error**: "Pattern verification failed" or "Cannot verify inscription"

**Solutions**:
- Verify `ORD_TAP_HOST` is accessible
- Check network connectivity
- Try using the public URL: `https://fra-01.tap-reader.xyz`
- If TAP API is down:
  - Block scanning still works (uses blockchain.info)
  - Only pattern verification and inscription checks fail
  - Monitor status: https://fra-01.tap-reader.xyz/health

### SQLite database locked
- Ensure only one bot instance is running
- Check file permissions on `telegram-bot/data/` directory

---

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit** `.env`, `config.telegram.json`, or `telegram-bot/data/` to version control
2. **Keep bot token secret** - reset it if accidentally exposed
3. **Monitor logs** - review regularly
4. **Backup database** - regularly backup `bot.db` file

---

## Development

### Adding New Commands

1. Create new command file in `src/commands/`
2. Export with `data` and `execute` properties
3. Import in `index.js` (automatically loaded)

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  telegram_id TEXT PRIMARY KEY,
  bitcoin_address TEXT UNIQUE,
  tier TEXT DEFAULT 'anonymous',
  notification_enabled INTEGER DEFAULT 0,
  allow_announcements INTEGER DEFAULT 0,
  joined_at INTEGER,
  last_active INTEGER
);

-- Scan history table
CREATE TABLE scan_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT,
  pattern TEXT,
  field INTEGER,
  start_block INTEGER,
  end_block INTEGER,
  occurrences INTEGER,
  rarity TEXT,
  timestamp INTEGER
);

-- Reservations table
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id TEXT,
  element_name TEXT,
  pattern TEXT,
  field INTEGER,
  expires_at INTEGER,
  created_at INTEGER
);
```

---

## Support

- **Discord:** https://discord.gg/trac
- **Issues:** https://github.com/Trac-Systems/dmt-pattern-hunter/issues
- **Documentation:** See README.md and PHASES.md

---

## License

MIT License - See LICENSE.md in root directory

---

**Happy Pattern Hunting! 🎯**