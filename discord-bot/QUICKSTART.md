# Discord Bot Quick Start Guide

## Overview

The DMT Pattern Hunter Discord Bot is now ready for testing! This guide will help you set it up and start using it.

---

## Step 1: Create Discord Application (5 minutes)

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "DMT Pattern Hunter"
4. Click "Create"

### Create Bot User
1. Go to "Bot" tab
2. Click "Add Bot" → "Yes, do it!"
3. Copy the **Bot Token** (you'll need this)

### Get Application ID
- Copy the **Application ID** from "General Information" tab

---

## Step 2: Invite Bot to Server (2 minutes)

1. Go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ **Send Messages**
   - ✅ **Embed Links**
   - ✅ **Use Slash Commands**
   - ✅ **Read Message History**
4. Copy the generated URL
5. Paste into browser → Invite bot to your server

---

## Step 3: Get IDs (2 minutes)

Enable **Developer Mode** in Discord Settings:

### Guild ID
1. Right-click your server → Copy ID
2. Save as `DISCORD_GUILD_ID`

### Channel IDs
1. Create a channel for announcements (e.g., #pattern-announcements)
2. Right-click channel → Copy ID → Save as `DISCORD_ANNOUNCEMENTS_CHANNEL`
3. Create a channel for logs (e.g., #bot-logs)
4. Right-click channel → Copy ID → Save as `DISCORD_LOGS_CHANNEL`

### Role IDs (Optional - for testing permissions)
1. Create roles: "Verified" and "Trusted"
2. Server Settings → Roles → Right-click role → Copy ID
3. Save as `DISCORD_VERIFIED_ROLE` and `DISCORD_TRUSTED_ROLE`

---

## Step 4: Configure Bot (1 minute)

### Option A: Using .env file

```bash
cd discord-bot
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_GUILD_ID=your_guild_id_here
DISCORD_ANNOUNCEMENTS_CHANNEL=your_announcements_channel_id
DISCORD_LOGS_CHANNEL=your_logs_channel_id
DISCORD_VERIFIED_ROLE=your_verified_role_id
DISCORD_TRUSTED_ROLE=your_trusted_role_id
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
DEBUG=false
```

### Option B: Using config.discord.json

```bash
cd discord-bot
cp config.discord.json-dist config.discord.json
```

Edit `config.discord.json`:

```json
{
  "discord": {
    "token": "your_bot_token_here",
    "applicationId": "your_application_id_here",
    "guildId": "your_guild_id_here",
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

## Step 5: Install Dependencies

```bash
cd discord-bot
npm install
```

---

## Step 6: Register Slash Commands

### For Testing (Instant - Recommended)

Make sure `DISCORD_GUILD_ID` is set in your config, then:

```bash
npm run register
```

Commands will appear immediately in your server!

### For Production (Global - Takes up to 1 hour)

Remove `DISCORD_GUILD_ID` from your config, then:

```bash
npm run register
```

---

## Step 7: Start Bot

### Development Mode (with debug logs)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Using PM2 (Recommended)

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save process list
pm2 save

# Setup auto-start on system boot
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs dmt-discord-bot
```

---

## Testing the Bot

### Test 1: Basic Scan
```
/scan pattern: 69 field: 16
```

Should return:
- Scan results with statistics
- Rarity classification
- Remaining scans for today

### Test 2: Check Element Availability
```
/element name: lucky pattern: 69 field: 16
```

Should return availability status.

### Test 3: View Help
```
/help
```

Should display all available commands.

### Test 4: Link Address (Optional)
```
/link address: bc1qexample...
```

After linking, you can track reputation and earn upgrades!

### Test 5: Enable Notifications
```
/notifications
```

Click "✅ Enable" to get notified when you discover rare patterns.

---

## Troubleshooting

### Bot not responding to commands
1. Check bot is running (console should show "Logged in as...")
2. Verify bot has permissions in the channel
3. Wait up to 1 hour for global command registration

### Commands not showing in slash menu
1. Run `npm run register` again
2. Make sure bot is invited to the server
3. Try restarting Discord client

### ord-tap connection error
1. Verify `ORD_TAP_HOST` is accessible: https://fra-01.tap-reader.xyz
2. Check internet connection
3. Look at console logs for specific error messages

### SQLite database error
1. Make sure only one bot instance is running
2. Check write permissions on `discord-bot/data/` directory
3. Delete `bot.db` and restart (will reset all data)

---

## Next Steps

1. **Test all commands** - Try each command to ensure they work
2. **Check rate limiting** - Verify scan limits work correctly
3. **Test notifications** - Make sure announcements appear in correct channel
4. **Test role permissions** - Assign yourself "Verified" or "Trusted" role and test restricted commands
5. **Monitor logs** - Check log channel for any issues

---

## Full Documentation

For complete documentation, see:
- `discord-bot/README.md` - Detailed setup and command reference
- `PHASES.md` - Project roadmap and feature status
- `IMPLEMENTATION_STATUS.md` - Current implementation details

---

## Support

- **Discord Community:** https://discord.gg/trac
- **Issues:** https://github.com/Trac-Systems/dmt-pattern-hunter/issues

---

**Ready to hunt for patterns! 🎯**
