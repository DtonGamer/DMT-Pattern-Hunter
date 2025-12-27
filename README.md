# DMT Pattern Hunter - Trac Network

Phase 1 MVP: Bitcoin blockchain pattern discovery and NAT analysis tool built on Trac Network.

## Overview

DMT Pattern Hunter scans Bitcoin blockchain data for patterns, enables `.element` registration for NAT (Non-Arbitrary Token) deployment via TAP Protocol, and provides economic intelligence for token creation.

**Built on Trac Network** - A peer-to-peer "blockless" Layer 1 that runs smart contracts locally.

## Features

### Phase 1 MVP ✅

- 🔍 **Pattern Scanning**: Search across all 38 Bitcoin block data fields
- 📊 **Economic Analysis**: Rarity classification, volatility assessment, token recommendations
- 🌐 **Trac Network Integration**: Share discoveries p2p, persistent reputation system
- 📋 **Element Management**: Check availability, reserve elements, generate registration JSON
- 🏆 **Reputation System**: Tiered access (Anonymous → Verified → Trusted)
- ⚡ **Rate Limiting**: Daily scan limits based on reputation tier
- 📝 **Inscription Generation**: Proper JSON format for all TAP operations
- 🔄 **Dual-Source Block Data**: blockchain.info API with Bitcoin Core fallback
- ✅ **Pattern Verification**: TAP API for verifying pattern existence and inscription data

### Data Fields (0-37)

Supports all Bitcoin block data fields:

- **Block-level** (0-14): hash, size, weight, height, version, merkleroot, time, nonce, bits, difficulty, etc.
- **Transaction-level** (15-23): txid, size, vsize, version, locktime
- **Input fields** (24-29): script asm, hex, sequence, witness, value
- **Output fields** (30-37): script asm, hex, type, fee, coinbase data

**Popular for pattern hunting:**
- Field 16 (txid) - Most popular
- Field 7 (merkleroot)
- Field 10 (nonce)
- Field 11 (bits)

## Architecture

### Block Data Sources

DMT Pattern Hunter uses a **dual-source architecture** for reliable block data access:

```
┌─────────────────────────────────────────┐
│     Block Data Fetcher Layer            │
└─────────────────────────────────────────┘
            │
            ├─► Primary: blockchain.info API
            │   └─ Public API, no setup required
            │   └─ Fast, rate-limited (200 req/min)
            │
            └─► Fallback: Bitcoin Core RPC
                └─ Optional local Bitcoin Core node
                └─ Unlimited access, requires setup
```

**Primary Source: blockchain.info API**
- Automatically used for all block data fetching
- Public API with built-in rate limiting
- No configuration required
- Returns standardized block data with all 38 fields

**Fallback Source: Bitcoin Core RPC**
- Activated automatically if blockchain.info fails
- Requires local Bitcoin Core node running
- Unlimited requests, no rate limits
- Configured via `config.json`:
  ```json
  "blockDataSources": {
    "bitcoinCore": {
      "url": "http://127.0.0.1:8332",
      "username": "your_rpc_username",
      "password": "your_rpc_password"
    }
  }
  ```

**Automatic Failover:**
1. Try blockchain.info API
2. On failure, try Bitcoin Core RPC (if configured)
3. If all sources fail, return null with error details

### Pattern Verification

The **TAP API** is now used exclusively for **pattern verification and inscription data**:

- ✅ Verify if patterns have been registered as inscriptions
- ✅ Check inscription existence and metadata
- ✅ Retrieve TAP protocol data for NAT tokens
- ❌ NOT used for block data fetching (handled by blockchain.info)

**Health Checks:**
Both systems are monitored:
- `blockchain.info` connectivity and latency
- TAP API availability for verification

## Installation

### Quick Deploy (Production)

```bash
# Clone and setup
git clone https://github.com/Trac-Systems/dmt-pattern-hunter.git
cd dmt-pattern-hunter

# Install dependencies
npm run deploy:setup

# Configure environment
cp .env.example .env
nano .env

# Deploy Discord bot with PM2
npm run deploy:start

# Check Discord bot status
npm run deploy:status

# Run pattern scanner (manual, when needed)
npm run scanner
```

**Architecture:**
- 🤖 **Discord Bot**: Deployed with PM2 (24/7 background service)
- 🔍 **Pattern Scanner**: Run manually via `npm run scanner` (interactive CLI)

📖 **Full deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

### Prerequisites

- Node.js 24+ 
- npm or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/Trac-Systems/dmt-pattern-hunter.git
cd dmt-pattern-hunter

# Install dependencies
npm install

# Configure (optional)
cp .env.example .env
# Edit .env with your settings

# Run
npm start
```

## Configuration

### config.json

```json
{
  "network": {
    "production": {
      "channel": "dmt_pattern_hunter_mainnet_r1",
      "ordTapHost": "https://fra-01.tap-reader.xyz"
    },
    "development": {
      "channel": "dmt_pattern_hunter_testnet_r1",
      "ordTapHost": "https://fra-01.tap-reader.xyz"
    }
  },
  "active": "development",
  "scanner": {
    "defaultField": 16,
    "defaultBlockRange": {
      "start": 800000,
      "end": 800100
    }
  },
  "blockDataSources": {
    "blockchainInfo": {
      "baseUrl": "https://blockchain.info"
    },
    "bitcoinCore": {
      "url": "http://127.0.0.1:8332",
      "username": "",
      "password": ""
    }
  }
}
```

### Environment Variables (.env)

```env
NETWORK=development
TRAC_CHANNEL=dmt_pattern_hunter_testnet_r1
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
BLOCKCHAIN_INFO_URL=https://blockchain.info
DEBUG=false
```

## Usage

### Terminal Interface

```bash
npm start
```

### Menu Options

1. **🔎 Scan for pattern**: Search blocks for pattern occurrences
2. **📋 Check element availability**: See if element is available for registration
3. **📝 Generate inscription JSON**: Create proper JSON for TAP operations
4. **🎫 Reserve element**: Temporarily reserve element (24 hours)
5. **📊 View discoveries**: See recent pattern discoveries
6. **👤 Check reputation**: View your stats and tier
7. **🏆 View leaderboard**: See top discoverers
8. **📜 View my scans**: Your recent scan history
9. **💡 Available element names**: Get suggestions for element names
0. **🚪 Exit**: Quit application

### Example Scenarios

#### Scenario 1: Discover a New Pattern

```bash
# 1. Scan for pattern
Select: 1
Pattern: 69
Field: 16
Start block: 800000
End block: 800100
Your address: bc1p...

# 2. View results
Pattern Rarity: RARE
Token Supply Type: Deflationary - Limited supply

# 3. Reserve element (if rare)
Select: 4
Element name: lucky
Pattern: 69
Field: 16
Your address: bc1p...

# 4. Generate registration JSON
Select: 3
Type: 1
Element name: lucky
Pattern: 69
Field: 16

# 5. Inscribe JSON (copy to unisat.io, ord.io, etc.)
```

#### Scenario 2: Check Before Registering

```bash
# 1. Check availability
Select: 2
Element name: satoshi
Pattern: 69
Field: 16

# If available → reserve and generate
# If taken → try different name
```

#### Scenario 3: Deploy NAT Token

```bash
# 1. Generate deployment JSON
Select: 3
Type: 2
Ticker: LUCKY
Element: lucky.69.16.element
Max supply: 1000000000

# 2. Inscribe deployment JSON
# 3. Use deployment ID for minting
Select: 3
Type: 3
Deployment ID: <inscription_id_from_step_2>
Ticker: LUCKY
Block: 800045
```

## User Tiers

| Tier | Scans/Day | Can Submit | Requirements |
|------|------------|-------------|---------------|
| **Anonymous** | 5 | ❌ | Default (no wallet) |
| **Verified** | 100 | ✅ | 10 discoveries |
| **Trusted** | 1000 | ✅ | 50 discoveries + 20 verified |

**Upgrade automatically** based on contributions!

## Architecture

```
trac-dmt-scanner/
├── contract/              # Main contract logic
│   ├── contract.js      # Business logic
│   └── protocol.js      # Trac framework (simplified)
├── features/             # Modular features
│   ├── bitcoin-indexer/   # ord-tap integration
│   ├── pattern-scanner/   # Core scanning logic
│   ├── element-registry/  # Element management
│   ├── inscription-generator/  # JSON generation
│   ├── discovery-sharing/ # P2P sharing
│   └── reputation/       # Tier system
├── src/                  # Utilities
│   ├── field-map.js     # 38-field mapping
│   ├── statistics.js    # Economic analysis
│   └── utils.js         # Helper functions
├── config.json           # Configuration
├── index.js              # Terminal interface
└── README.md            # This file
```

## How It Works

### 1. Scanning Process

```
User Input → Rate Limit Check → Fetch Blocks (blockchain.info) → Extract Field Data → Count Pattern → Calculate Stats → Cache Result → Share Discovery (if new)
```

### 2. Discovery Sharing

```
New Discovery → Save to Shared State → Update Leaderboard → Broadcast to Peers → Update Reputation
```

### 3. Element Registration

```
Check Availability → Reserve (24h) → Generate JSON → User Inscribes → Verify with Inscription ID
```

## Inscription Formats

### Element Registration

```json
{
  "p": "tap",
  "op": "dmt-element",
  "name": "lucky",
  "pattern": "69",
  "field": 16,
  "timestamp": 1234567890
}
```

### NAT Deployment

```json
{
  "p": "tap",
  "op": "dmt-deploy",
  "tick": "LUCKY",
  "elem": "lucky.69.16.element",
  "supply": "1000000000"
}
```

### NAT Mint

```json
{
  "p": "tap",
  "op": "dmt-mint",
  "dep": "<deployment_inscription_id>",
  "tick": "LUCKY",
  "blk": 800045
}
```

**⚠️ CRITICAL**: `blk` must be a NUMBER (no quotes!), all other fields are STRINGS.

## Development

### Running Locally

```bash
# Run scanner in development mode
npm run dev

# Run Discord bot in development mode
npm run bot:dev
```

### Testing

```bash
# Run in debug mode
DEBUG=true npm start

# Test specific features
node test/features/pattern-scanner.test.js
```

### Discord Bot Development

```bash
# Run Discord bot locally
cd discord-bot
npm run dev

# Register Discord commands
npm run register
```

See [discord-bot/README.md](discord-bot/README.md) for detailed Discord bot development guide.

### Adding Features

1. Create new feature in `features/<feature-name>/index.js`
2. Initialize feature in `contract/contract.js` init()
3. Add menu option in `index.js`
4. Add handler in TerminalInterface class

### PM2 Management (Development/Production)

```bash
# Start both services
npm run deploy:start

# View logs
npm run deploy:logs

# Restart services
npm run deploy:restart

# Check status
npm run deploy:status
```

📖 **Full deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

## Roadmap

### Phase 1: MVP ✅ (Current)
- Core scanning
- Basic Trac integration
- Terminal interface
- Reputation system

### Phase 2: Web UI & Collaboration (Next)
- Desktop web interface
- Real-time updates
- Guild system
- Collaborative hunting

### Phase 3: Advanced Features (Future)
- Inscription signing
- Advanced analytics
- Mobile app
- REST API

See [PHASES.md](PHASES.md) for complete roadmap.

## Troubleshooting

### blockchain.info Connection Issues

**Error**: "Failed to fetch block from blockchain.info" or "blockchain.info unreachable"

**Solutions**:
1. Check internet connectivity
2. Verify `BLOCKCHAIN_INFO_URL` in .env (default: `https://blockchain.info`)
3. blockchain.info has rate limits (200 requests/minute):
   - Reduce scan range for batch scans
   - Add delay between requests if doing large scans
4. blockchain.info may be temporarily down:
   - Check status: https://blockchain.info/q/getblockcount
   - Wait and retry later
5. Enable Bitcoin Core fallback for unlimited access:
   ```json
   "blockDataSources": {
     "bitcoinCore": {
       "url": "http://127.0.0.1:8332",
       "username": "your_rpc_username",
       "password": "your_rpc_password"
     }
   }
   ```

**Error**: "blockchain.info rate limit exceeded"

**Solutions**:
1. Wait 1-2 minutes before retrying
2. Configure Bitcoin Core RPC as fallback source (unlimited)
3. Use smaller block ranges for scans
4. Run scans during off-peak hours (blockchain.info gets busy)

### TAP API Connection Issues

**Error**: "TAP API unreachable" or "Pattern verification failed"

**Note**: TAP API is used for pattern verification and inscription data, NOT block fetching.

**Solutions**:
- Check `ORD_TAP_HOST` in .env (default: `https://fra-01.tap-reader.xyz`)
- Verify TAP API is accessible via browser
- If TAP API is down:
  - Block data scanning still works (uses blockchain.info)
  - Pattern verification and inscription checks will fail
  - Monitor TAP API status: https://fra-01.tap-reader.xyz/health
- Try alternative TAP API instance or self-host

### Bitcoin Core RPC Issues

**Error**: "Bitcoin Core RPC error: Connection refused"

**Solutions**:
1. Verify Bitcoin Core is running: `bitcoin-cli getblockcount`
2. Check RPC settings in `bitcoin.conf`:
   ```
   rpcuser=your_username
   rpcpassword=your_password
   rpcport=8332
   rpcallowip=127.0.0.1
   ```
3. Ensure config.json matches Bitcoin Core settings
4. Test connection manually:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     --user 'username:password' \
     --data '{"jsonrpc":"2.0","id":1,"method":"getblockcount","params":[]}' \
     http://127.0.0.1:8332
   ```

### Rate Limit Reached

**Error**: "Daily scan limit reached"

**Solution**:
- Wait for daily reset (midnight UTC)
- Make discoveries to upgrade tier
- Check reputation with option 6

### Element Not Available

**Error**: "Element is not available"

**Solution**:
- Try different name/pattern combination
- Use option 9 to find available names
- Check if reserved by someone else

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

**Development Focus**:
- Phase 1: Core scanning, Trac integration, terminal UI
- Phase 2: Web UI, real-time features, guilds
- Phase 3: Signing, analytics, mobile

## License

MIT License - See LICENSE file for details

## Credits

- **Trac Network** - P2P infrastructure
- **ord-tap** - Bitcoin/TAP indexer
- **TAP Protocol** - NAT and DMT specifications

## Support

- 📖 Documentation: See [PHASES.md](PHASES.md)
- 🚀 Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- ⚡ Command Reference: [COMMANDS.md](COMMANDS.md)
- 🤖 Discord Bot: [discord-bot/README.md](discord-bot/README.md)
- 💬 Discord: https://discord.gg/trac
- 🐛 Issues: https://github.com/Trac-Systems/dmt-pattern-hunter/issues

---

**Built with ❤️ for the Trac Network ecosystem**
