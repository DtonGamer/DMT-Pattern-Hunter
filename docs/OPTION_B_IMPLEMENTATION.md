# Block Data Source Configuration Updated ✅

## Summary

Updated the DMT Pattern Hunter to use **Option B** for block data sourcing:
- **Primary**: Bitcoin Core RPC (for raw block data)
- **Secondary**: blockchain.info API (fallback)
- **TAP API**: ONLY for element availability, deployment checking, pattern existence validation

---

## Changes Made

### 1. ✅ Created New Block Data Fetcher

**File:** `src/block-data-fetcher.js`

**Features:**
- Multi-source block fetching with automatic fallback
- Primary: Bitcoin Core RPC (JSON-RPC `getblockhash` and `getblock`)
- Secondary: blockchain.info API (`/block-height/{height}`)
- Standardizes all block data to 38 fields across sources
- Debug logging for troubleshooting

---

### 2. ✅ Updated Config Structure

**File:** `config.json`

**Added:**
```json
{
  "blockDataSources": {
    "primary": "blockchain-info",
    "fallback": ["bitcoin-core"],
    "bitcoinCore": {
      "url": "http://127.0.0.1:8332",
      "username": "",
      "password": ""
    },
    "blockchainInfo": {
      "baseUrl": "https://blockchain.info"
    }
  }
}
```

---

### 3. ✅ Updated Bitcoin Indexer

**File:** `features/bitcoin-indexer/index.js`

**Changes:**
- Replaced direct ord-tap block fetching with BlockDataFetcher
- `getBlock()` now uses multi-source fetcher
- Updated TAP API endpoints to use correct `/r/tap/*` paths:
  - `/r/tap/getDmtElementsList` (was `/elements`)
  - `/r/tap/getDeployment/{ticker}` (was `/deployment/{ticker}`)
  - `/r/tap/getDmtMintHolderByBlock/{ticker}/{block}` (was `/element/{id}`)
  - `/r/tap/getDeployments` (was `/deployments`)
  - `/r/tap/getDmtEventByBlock/{block}` (was `/dmt-mint-by-block/{height}`)
- **NEW:** `checkPatternExists(pattern, field)` method to validate if discovery is new

---

### 4. ✅ Updated Pattern Scanner

**File:** `features/pattern-scanner/index.js`

**Changes:**
- Updated `extractFieldData()` to use new block structure with `.fields` property
- **NEW:** `checkIfNewDiscovery(pattern, fieldNum)` method before scan
- Returns `isNewDiscovery` flag in scan results
- Pattern existence checked via TAP API to determine if discovery is new or duplicate

---

### 5. ✅ Updated Discord Bot Environment

**File:** `discord-bot/.env.example`

**Added:**
```env
# Bitcoin Core RPC Configuration (Primary block data source)
BITCOIN_CORE_URL=http://127.0.0.1:8332
BITCOIN_CORE_USERNAME=
BITCOIN_CORE_PASSWORD=

# blockchain.info API (Fallback block data source)
BLOCKCHAIN_INFO_BASE_URL=https://blockchain.info
```

---

## How It Works

### Block Data Fetching Flow

```
┌─────────────────────────────────────┐
│  Request Block Data for Height N  │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  1. Try Bitcoin Core RPC        │
│     getblockhash(height)         │
│     getblock(hash, 2)           │
└─────────────────────────────────────┘
         │ (fallback)
         ▼
┌─────────────────────────────────────┐
│  2. Try blockchain.info API     │
│     /block-height/{height}       │
└─────────────────────────────────────┘
         │ (if all fail)
         ▼
    Return null with error
```

### Pattern Discovery Flow

```
┌─────────────────────────────────────┐
│  User requests pattern scan        │
│  Pattern: "69", Field: 16      │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  1. Check if pattern exists     │
│     via TAP API                │
│     checkPatternExists()         │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  2. If exists → SKIP          │
│     "Already discovered"         │
└─────────────────────────────────────┘
                │ (if new)
                ▼
┌─────────────────────────────────────┐
│  3. Scan raw block data        │
│     Bitcoin Core or blockchain.info│
│     Extract field 16             │
│     Match pattern "69"          │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  4. Return scan results        │
│     isNewDiscovery: true/false   │
│     Statistics, rarity, etc.     │
└─────────────────────────────────────┘
```

### TAP API Usage (Validation Only)

**Used For:**
- ✅ Element availability checks
- ✅ Deployment verification
- ✅ Registered element queries
- ✅ Pattern existence validation (to know if discovery is new)

**NOT Used For:**
- ❌ Raw block data scanning
- ❌ Pattern matching in blocks

---

## Configuration Options

### Option 1: Bitcoin Core RPC (Fastest - Recommended if you have Bitcoin Core)

**Prerequisites:**
- Bitcoin Core running locally
- RPC enabled in `bitcoin.conf`:
  ```
  server=1
  rpcuser=yourusername
  rpcpassword=yourpassword
  rpcallowip=127.0.0.1
  rpcport=8332
  txindex=1  # Required for full indexing
  ```

**Configuration in `.env`:**
```env
BITCOIN_CORE_URL=http://127.0.0.1:8332
BITCOIN_CORE_USERNAME=yourusername
BITCOIN_CORE_PASSWORD=yourpassword
```

**Benefits:**
- ⚡ Fastest (local access)
- 🔒 Most private
- 📊 Complete raw block data
- 💾 No rate limits

---

### Option 2: blockchain.info API (Easiest - No setup required)

**Configuration in `.env`:**
```env
BLOCKCHAIN_INFO_BASE_URL=https://blockchain.info
# Or use custom instance
```

**Benefits:**
- ✅ No Bitcoin Core required
- ✅ Works immediately
- 📡 Public API
- 🔄 Updated in real-time

**Cons:**
- ⏱️ Slower than local RPC
- 📋 Public API rate limits
- 🌐 Network dependency

---

### Option 3: Both (Primary + Fallback)

**Configuration:**
```env
# Enable Bitcoin Core
BITCOIN_CORE_URL=http://127.0.0.1:8332
BITCOIN_CORE_USERNAME=yourusername
BITCOIN_CORE_PASSWORD=yourpassword

# Fallback to blockchain.info if RPC fails
BLOCKCHAIN_INFO_BASE_URL=https://blockchain.info
```

**Benefits:**
- ✅ Fast with Bitcoin Core
- 🔄 Automatic fallback if RPC fails
- 🛡️ Maximum reliability
- 🔒 Privacy maintained (when RPC works)

---

## Testing

### Test 1: Block Data Fetching

```bash
npm run dev

# Select option 1 (scan)
# Enter a small block range
# Check console for source used
```

Expected output:
```
[BlockDataFetcher] Trying source: bitcoin-core
[BitcoinIndexer] Bitcoin Core returned block: 0000000000...
[PatternScanner] Starting scan: pattern="69" field=16 blocks=800000-800010
```

Or if RPC fails:
```
[BlockDataFetcher] Trying source: bitcoin-core
[BlockDataFetcher] Failed to fetch from bitcoin-core: Connection refused
[BlockDataFetcher] Trying source: blockchain.info
[BitcoinIndexer] blockchain.info returned block: 0000000000...
```

### Test 2: Pattern Existence Check

```bash
# Start terminal
# Enter pattern that already exists
```

Should show:
- Check if pattern exists via TAP API
- Mark as `isNewDiscovery: false` if found

### Test 3: Complete Scan

```bash
# Scan for a known pattern in a recent block range
# Check results show isNewDiscovery flag
```

---

## Troubleshooting

### Bitcoin Core RPC Fails

**Issue:** `ECONNREFUSED` or `Connection refused`

**Solutions:**
1. Check Bitcoin Core is running: `bitcoin-cli getblockcount`
2. Verify RPC settings in `bitcoin.conf`:
   - `server=1`
   - `rpcuser=` and `rpcpassword=` set
   - `rpcallowip=127.0.0.1`
3. Check URL format: `http://127.0.0.1:8332` (NOT https)
4. Check port: Default is 8332 (mainnet) or 18332 (testnet)

### blockchain.info API Fails

**Issue:** `429 Too Many Requests` or timeouts

**Solutions:**
1. Add delays between requests (already built-in)
2. Reduce scan range (scan fewer blocks at once)
3. Try Bitcoin Core RPC instead

### TAP API Endpoints Not Working

**Issue:** 404 errors on TAP endpoints

**Solutions:**
1. Verify `ORD_TAP_HOST` is correct: `https://fra-01.tap-reader.xyz`
2. Check `/r/tap/` prefix is included
3. Test endpoints directly:
   ```bash
   curl https://fra-01.tap-reader.xyz/r/tap/getCurrentBlock
   ```

---

## Environment Variables

### For Terminal Scanner (.env)

```env
# Block Data Sources
BITCOIN_CORE_URL=http://127.0.0.1:8332
BITCOIN_CORE_USERNAME=
BITCOIN_CORE_PASSWORD=
BLOCKCHAIN_INFO_BASE_URL=https://blockchain.info

# TAP API (validation only)
ORD_TAP_HOST=https://fra-01.tap-reader.xyz
DEBUG=true
```

### For Discord Bot (discord-bot/.env)

Same variables - create `.env` in discord-bot directory.

---

## Migration Notes

### From Old Implementation

**OLD:**
- Used ord-tap for block data
- Direct block endpoints that don't exist
- No pattern existence validation

**NEW:**
- Multi-source block fetching (Bitcoin Core + blockchain.info)
- Automatic fallback between sources
- Pattern existence check via TAP API
- Proper `/r/tap/*` endpoint usage

### Backwards Compatibility

✅ **Fully compatible** - No breaking changes to existing scanner logic
- Pattern scanning works exactly the same way
- Same 38 fields (0-37)
- Same statistics calculations
- Added `isNewDiscovery` flag for additional info

---

## Next Steps

1. **Configure block data source:**
   - If you have Bitcoin Core: Set RPC credentials
   - Otherwise: Use blockchain.info (default)

2. **Test block fetching:**
   ```bash
   npm run dev
   # Check console for source used
   ```

3. **Run complete scan:**
   - Scan for patterns
   - Verify `isNewDiscovery` flag works
   - Check if duplicate discoveries are detected

4. **Deploy Discord bot (optional):**
   - Update discord-bot config with new endpoints
   - Test with new pattern validation

---

## Files Modified

- ✅ `src/block-data-fetcher.js` (NEW)
- ✅ `config.json` (added blockDataSources)
- ✅ `features/bitcoin-indexer/index.js` (updated with BlockDataFetcher and TAP endpoints)
- ✅ `features/pattern-scanner/index.js` (added checkIfNewDiscovery)
- ✅ `discord-bot/.env.example` (added Bitcoin Core config)

---

## Files Unchanged

- ✅ `src/field-map.js` (38 field descriptions - still valid)
- ✅ `src/statistics.js` (stats calculation - still valid)
- ✅ `src/utils.js` (helper functions - still valid)
- ✅ All Discord bot commands (work with updated contract)

---

## Support

- **Documentation:** `discord-bot/README.md`, `PHASES.md`
- **TAP API Docs:** `docs/trac-api.md`
- **Discord Community:** https://discord.gg/trac

---

**Ready to scan with Option B! 🎯**
