# Discord Bot Setup Guide

## Overview

The DMT Pattern Hunter Discord Bot allows users to scan for blockchain patterns, check element availability, and participate in discovery sharing - all from within Discord!

---

## Prerequisites

- Node.js 24+ (for built-in SQLite support)
- Discord application created (see Discord Setup below)
- Bitcoin address (optional, but recommended for reputation)

---

## Installation

1. **Navigate to discord-bot directory:**

```bash
cd discord-bot
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your Discord credentials:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_GUILD_ID=your_guild_id_here
DISCORD_ANNOUNCEMENTS_CHANNEL=channel_id_here
DISCORD_LOGS_CHANNEL=channel_id_here
DISCORD_VERIFIED_ROLE=role_id_here
DISCORD_TRUSTED_ROLE=role_id_here
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
DEBUG=false
```

4. **Or use config.discord.json:**

```bash
cp config.discord.json-dist config.discord.json
```

Edit `config.discord.json` with your settings.

---

## Discord Setup

1. **Create Discord Application:**

Go to https://discord.com/developers/applications and create a new application.

2. **Create Bot User:**

- Go to "Bot" tab
- Click "Add Bot"
- Copy the "Bot Token" (this is your `DISCORD_TOKEN`)

3. **Get Application ID:**

- Copy the "Application ID" from "General Information" tab (this is your `DISCORD_APPLICATION_ID`)

4. **Configure Intents:**

- Go to "Bot" tab
- Enable:
  - **Server Members Intent** (if needed)
  - **Message Content Intent**
  - **Presence Intent** (optional)

5. **Generate OAuth2 URL:**

- Go to "OAuth2" → "URL Generator"
- Select scopes:
  - `bot`
  - `applications.commands`
- Select bot permissions:
  - **Send Messages**
  - **Embed Links**
  - **Use Slash Commands**
  - **Read Message History** (optional)
- Copy the generated URL and invite your bot to your server

6. **Get IDs:**

- **Guild ID:** Enable Developer Mode in Discord Settings → Right-click server → Copy ID
- **Channel IDs:** Right-click channel → Copy ID
- **Role IDs:** Enable Developer Mode → Server Settings → Roles → Right-click role → Copy ID

---

## Registering Slash Commands

### Development (Instant - for testing)

Set `DISCORD_GUILD_ID` in your config, then:

```bash
npm run register
```

Commands will appear immediately in your test server.

### Production (Global - takes up to 1 hour)

Remove `DISCORD_GUILD_ID` from your config, then:

```bash
npm run register
```

Commands will be registered globally and available across all servers.

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
Link your Bitcoin address to your Discord account.

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
- Notifications posted in announcements channel
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
| DISCORD_TOKEN | Bot token from Discord Developer Portal | Yes |
| DISCORD_APPLICATION_ID | Application ID | Yes |
| DISCORD_GUILD_ID | Guild ID (for development) | No |
| DISCORD_ANNOUNCEMENTS_CHANNEL | Channel ID for announcements | No |
| DISCORD_LOGS_CHANNEL | Channel ID for bot logs | No |
| DISCORD_VERIFIED_ROLE | Role ID for verified users | No |
| DISCORD_TRUSTED_ROLE | Role ID for trusted users | No |
| BLOCKCHAIN_INFO_URL | blockchain.info API URL | No (defaults to https://blockchain.info) |
| BITCOIN_CORE_URL | Bitcoin Core RPC URL (fallback, unlimited) | No |
| BITCOIN_CORE_USERNAME | Bitcoin Core RPC username | No |
| BITCOIN_CORE_PASSWORD | Bitcoin Core RPC password | No |
| ORD_TAP_HOST | TAP API URL for pattern verification | No (defaults to public URL) |
| DEBUG | Enable debug logging | No (false) |

### Configuration File (config.discord.json)

```json
{
  "discord": {
    "token": "YOUR_BOT_TOKEN",
    "applicationId": "YOUR_APP_ID",
    "guildId": "YOUR_GUILD_ID",
    "channels": {
      "announcements": "CHANNEL_ID",
      "logs": "CHANNEL_ID"
    },
    "allowedRoles": {
      "Verified": "ROLE_ID",
      "Trusted": "ROLE_ID"
    },
    "permissions": {
      "allowAnonymousScans": true,
      "askForAnnouncementPermission": true
    }
  }
}
```

---

## Architecture

The Discord bot inherits its block data configuration from the main contract, using a **dual-source architecture**:

### Block Data Fetching

```
Discord Bot Request
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
Users can opt-in to receive notifications when they discover rare patterns. These notifications are posted to the announcements channel.

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
- Production-ready for Discord bots

**Data stored:**
- User data (Discord ID ↔ Bitcoin address mapping)
- Scan history
- Reservations
- Notification preferences

### Rate Limiting
Daily scan limits enforced per tier:
- Tracks scans per Discord user
- Resets automatically at midnight
- Shows remaining scans in /scan response

---

## Troubleshooting

### Commands not appearing
- Wait up to 1 hour for global registration
- Use guild-specific registration for instant updates (set `DISCORD_GUILD_ID`)

### Bot not responding
- Check bot has permissions in the channel
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
- Check file permissions on `discord-bot/data/` directory

---

## Security Notes

⚠️ **Important Security Guidelines:**

1. **Never commit** `.env`, `config.discord.json`, or `discord-bot/data/` to version control
2. **Keep bot token secret** - reset it if accidentally exposed
3. **Limit bot permissions** - only grant what's necessary
4. **Monitor logs** - set up log channel and review regularly
5. **Backup database** - regularly backup `bot.db` file

---

## Development

### Adding New Commands

1. Create new command file in `src/commands/`
2. Export with `data` and `execute` properties
3. Import in `index.js` (automatically loaded)
4. Register with `npm run register`

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  discord_id TEXT PRIMARY KEY,
  bitcoin_address TEXT UNIQUE,
  tier TEXT DEFAULT 'anonymous',
  notification_channel_id TEXT,
  allow_announcements INTEGER DEFAULT 0,
  joined_at INTEGER,
  last_active INTEGER
);

-- Scan history table
CREATE TABLE scan_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT,
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
  discord_id TEXT,
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
