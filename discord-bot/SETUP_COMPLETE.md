# Discord Bot Setup Complete ✅

## Summary

The DMT Pattern Hunter Discord Bot has been successfully implemented with all requested features:

---

## ✅ Features Implemented

### Core Commands
- ✅ `/scan` - Pattern scanning with rate limiting
- ✅ `/element` - Check element availability
- ✅ `/generate` - Generate inscription JSON
- ✅ `/reserve` - Reserve elements (VERIFIED+ only)
- ✅ `/discovery` - View recent discoveries
- ✅ `/reputation` - Check user reputation and tier
- ✅ `/leaderboard` - View leaderboard
- ✅ `/myscans` - View personal scan history
- ✅ `/names` - Get available name suggestions
- ✅ `/link` - Link Bitcoin address
- ✅ `/notifications` - Manage rare pattern notifications
- ✅ `/help` - Display command help

### Authentication & Permissions
- ✅ Discord ID-based anonymous scans (5/day limit)
- ✅ Bitcoin address linking for tracked users
- ✅ Role-based access control (BASIC/VERIFIED/TRUSTED)
- ✅ Different scan limits per tier:
  - BASIC (Anonymous): 5 scans/day
  - VERIFIED: 100 scans/day
  - TRUSTED: 1000 scans/day (unlimited)

### Notifications
- ✅ Rare pattern detection (RARE/EXTREMELY RARE)
- ✅ Announcement channel posting
- ✅ User permission opt-in for notifications
- ✅ New discovery announcements

### Database
- ✅ SQLite persistent storage
- ✅ User management (Discord ID ↔ Bitcoin address)
- ✅ Scan history tracking
- ✅ Reservation management
- ✅ Notification preferences

### Infrastructure
- ✅ PM2 ecosystem configuration
- ✅ Environment variable support (.env)
- ✅ Debug mode support
- ✅ Graceful shutdown handling
- ✅ Error logging
- ✅ Periodic tasks (cleanup expired reservations)

---

## 📁 Project Structure

```
discord-bot/
├── package.json                    # Dependencies and scripts
├── README.md                      # Complete documentation
├── QUICKSTART.md                  # Quick setup guide (START HERE)
├── config.discord.json-dist        # Config template
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── index.js                      # Main bot entry point
├── src/
│   ├── register-commands.js       # Command registration script
│   ├── commands/                 # Slash commands
│   │   ├── scan.js
│   │   ├── element.js
│   │   ├── generate.js
│   │   ├── reserve.js
│   │   ├── discovery.js
│   │   ├── reputation.js
│   │   ├── leaderboard.js
│   │   ├── myscans.js
│   │   ├── names.js
│   │   ├── link.js
│   │   ├── notifications.js
│   │   └── help.js
│   ├── db/
│   │   └── sqlite.js            # SQLite database manager
│   └── helpers/
│       ├── embed.js              # Discord embed formatting
│       └── permissions.js        # Role-based access control
├── data/                         # SQLite database (auto-created)
└── logs/                         # Application logs (auto-created)
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd discord-bot
npm install
```

### 2. Configure Bot

**Option A - .env file:**
```bash
cp .env.example .env
# Edit .env with your Discord credentials
```

**Option B - config.discord.json:**
```bash
cp config.discord.json-dist config.discord.json
# Edit config.discord.json with your Discord credentials
```

### 3. Register Commands (Development - Instant)
```bash
npm run register
```

### 4. Start Bot
```bash
npm run dev    # Debug mode
# OR
npm start       # Production mode
```

### 5. (Optional) PM2 Setup
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📋 Discord Setup Checklist

- [ ] Create Discord application at https://discord.com/developers/applications
- [ ] Add bot user and copy token
- [ ] Copy Application ID
- [ ] Invite bot to server with required permissions
- [ ] Enable Developer Mode in Discord settings
- [ ] Get Guild ID (server ID)
- [ ] Get Announcement Channel ID
- [ ] Get Logs Channel ID (optional)
- [ ] Create "Verified" role (optional)
- [ ] Create "Trusted" role (optional)
- [ ] Get Verified Role ID (optional)
- [ ] Get Trusted Role ID (optional)
- [ ] Configure .env or config.discord.json with all IDs
- [ ] Run `npm run register` to register commands
- [ ] Start bot with `npm run dev` or `npm start`

---

## 🔧 Configuration Files

### Environment Variables (.env)

```env
DISCORD_TOKEN=your_bot_token
DISCORD_APPLICATION_ID=your_application_id
DISCORD_GUILD_ID=your_guild_id
DISCORD_ANNOUNCEMENTS_CHANNEL=your_announcements_channel_id
DISCORD_LOGS_CHANNEL=your_logs_channel_id
DISCORD_VERIFIED_ROLE=your_verified_role_id
DISCORD_TRUSTED_ROLE=your_trusted_role_id
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
DEBUG=false
```

### Config File (config.discord.json)

```json
{
  "discord": {
    "token": "your_bot_token",
    "applicationId": "your_application_id",
    "guildId": "your_guild_id",
    "channels": {
      "announcements": "your_announcements_channel_id",
      "logs": "your_logs_channel_id"
    },
    "allowedRoles": {
      "Verified": "your_verified_role_id",
      "Trusted": "your_trusted_role_id"
    },
    "permissions": {
      "allowAnonymousScans": true,
      "askForAnnouncementPermission": true
    }
  }
}
```

---

## 🔒 Security Notes

⚠️ **CRITICAL SECURITY PRACTICES:**

1. **Never commit these files to version control:**
   - `.env`
   - `config.discord.json`
   - `discord-bot/data/bot.db`

2. **If bot token is exposed:**
   - Immediately reset it at https://discord.com/developers/applications
   - Update your configuration

3. **Minimize bot permissions:**
   - Only grant what's necessary
   - Review permissions regularly

4. **Enable logging:**
   - Set up log channel to monitor activity
   - Review logs regularly

5. **Backup database:**
   - Regularly backup `discord-bot/data/bot.db`
   - Store backups securely

---

## 🎯 Testing Checklist

### Basic Functionality
- [ ] Bot starts successfully
- [ ] `/scan` command works with anonymous user
- [ ] Rate limiting works (5 scans for anonymous)
- [ ] `/element` command checks availability
- [ ] `/help` displays all commands

### Authentication & Permissions
- [ ] `/link` command connects Bitcoin address
- [ ] Role-based permissions work (VERIFIED/TRUSTED)
- [ ] Scan limits differ for BASIC/VERIFIED/TRUSTED
- [ ] `/generate` and `/reserve` restricted to VERIFIED+

### Notifications
- [ ] `/notifications` shows enable/disable buttons
- [ ] Rare pattern announcements posted to correct channel
- [ ] User permission is respected

### Database
- [ ] User data persists across restarts
- [ ] Scan history recorded correctly
- [ ] Address mapping works
- [ ] Expired reservations cleaned up

### Error Handling
- [ ] Invalid Bitcoin addresses rejected
- [ ] ord-tap connection errors handled gracefully
- [ ] Permission denials show helpful messages
- [ ] Rate limit errors display upgrade requirements

---

## 📊 Database Schema

```sql
users (
  discord_id TEXT PRIMARY KEY,
  bitcoin_address TEXT UNIQUE,
  tier TEXT DEFAULT 'anonymous',
  notification_channel_id TEXT,
  allow_announcements INTEGER DEFAULT 0,
  joined_at INTEGER,
  last_active INTEGER
)

scan_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT,
  pattern TEXT,
  field INTEGER,
  start_block INTEGER,
  end_block INTEGER,
  occurrences INTEGER,
  rarity TEXT,
  timestamp INTEGER
)

reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT,
  element_name TEXT,
  pattern TEXT,
  field INTEGER,
  expires_at INTEGER,
  created_at INTEGER
)
```

---

## 🐛 Troubleshooting

### Commands not appearing
- Check `DISCORD_GUILD_ID` is set for instant registration
- Wait up to 1 hour for global registration
- Restart Discord client

### Bot not responding
- Verify bot token is correct
- Check bot permissions in channel
- View console logs for errors

### ord-tap errors
- Confirm URL is accessible: https://fra-01.tap-reader.xyz
- Check internet connectivity
- Try curl/ping the endpoint

### Database locked
- Stop all bot instances
- Check file permissions
- Delete `bot.db` to reset (caution: data loss)

---

## 📚 Documentation

- **Quick Start:** `discord-bot/QUICKSTART.md` ⭐ START HERE
- **Full Docs:** `discord-bot/README.md`
- **API Docs:** `docs/trac-api.md` (ord-tap endpoints)
- **Project Phases:** `PHASES.md`
- **Implementation Status:** `IMPLEMENTATION_STATUS.md`

---

## 🎉 You're Ready!

The Discord bot is fully implemented and ready for deployment. Follow the Quick Start guide to get it running in your server.

**Key Features:**
- ✅ Anonymous and linked user support
- ✅ Tier-based rate limiting (5/100/1000 scans/day)
- ✅ Role-based permissions
- ✅ Rare pattern notifications
- ✅ Discovery announcements
- ✅ SQLite persistent storage
- ✅ PM2 support for production

**Happy Pattern Hunting! 🎯**
