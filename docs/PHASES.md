# DMT Pattern Hunter - Phases & Roadmap

## Overview

DMT Pattern Hunter is a Trac Network application that scans Bitcoin blockchain data for patterns, enables `.element` registration for NAT deployment, and provides economic analysis for token creation.

---

## Phase 1: MVP (Current Sprint)

**Timeline**: 2-3 weeks

### Objectives
- Core pattern scanning functionality
- Basic Trac Network integration
- Hybrid storage model (shared + private)
- Terminal interface
- Reputation-based rate limiting

### Features

#### ✅ Core Scanning
- Pattern search across Bitcoin blockchain fields (0-37)
- Range-based block scanning
- Field extraction for all 38 block data types
- Pattern counting and aggregation

#### ✅ Economic Analysis
- Statistical calculations (mean, std dev, min/max)
- Rarity classification (EXTREMELY RARE, RARE, MODERATE, COMMON)
- Volatility assessment (HIGH, MODERATE, LOW)
- Token economics recommendations

#### ✅ Trac Network Integration
- Connect to ord-tap indexer (instead of blockchain.info)
- Share pattern discoveries via p2p gossip
- Persist shared discoveries to Hyperbee
- Track discovery ownership globally

#### ✅ Hybrid Storage Model
**Shared State (Global):**
- `discoveredPatterns`: Pattern discoveries with ownership
- `leaderboard`: Top discoverers rankings
- `userReputation`: User reputation and tier data

**Private Storage (Local):**
- `scan:*`: Individual scan results
- `user:*:recent`: Recent scan history
- Local cache for quick access

#### ✅ User Tiers
- **Anonymous**: 5 scans/day, cannot submit discoveries
- **Verified**: 100 scans/day, can submit (auto-upgrade at 10 discoveries)
- **Trusted**: 1000 scans/day, can create guilds (auto-upgrade at 50 discoveries + 20 verified)

#### ✅ Rate Limiting
- Contract-based tracking
- Client-side enforcement
- Social reputation consequences for abuse
- Daily reset mechanism

#### ✅ Terminal Interface (`index.js`)
- Interactive menu system
- Pattern scanning command
- Element availability checking
- Inscription JSON generation
- Discovery viewing
- Reputation checking
- Leaderboard viewing

#### ✅ Element Management
- Check element availability (Trac + ord-tap)
- Generate element registration JSON
- Generate NAT deployment JSON
- Generate NAT mint JSON
- Pattern reservation (24-hour window)

#### ✅ Inscription Generation
- Proper JSON format for all TAP operations
- Validation of inscription structure
- Type checking (blk must be number, not string)
- Clear instructions for users

### Deliverables

```
trac-dmt-scanner/
├── package.json
├── config.json
├── .env.example
├── PHASES.md (this file)
├── index.js                     # Terminal interface
├── README.md
├── contract/
│   ├── contract.js             # Main contract logic
│   └── protocol.js             # Trac framework
├── features/
│   ├── bitcoin-indexer/        # ord-tap integration
│   │   └── index.js
│   ├── pattern-scanner/        # Core scanning
│   │   └── index.js
│   ├── element-registry/       # Element management
│   │   └── index.js
│   ├── inscription-generator/  # JSON generation
│   │   └── index.js
│   ├── discovery-sharing/      # P2P sharing
│   │   └── index.js
│   └── reputation/            # Tier system
│       └── index.js
└── src/
    ├── field-map.js            # 38-field mapping
    ├── statistics.js           # Economic analysis
    └── utils.js               # Helper functions
```

### Testing Checklist
- [ ] Block fetching with ord-tap
- [ ] Pattern extraction for all 38 fields
- [ ] Statistical calculations
- [ ] Economic analysis generation
- [ ] Discovery sharing p2p
- [ ] Leaderboard updates
- [ ] Rate limiting enforcement
- [ ] Tier auto-upgrades
- [ ] Element availability checking
- [ ] Inscription JSON generation
- [ ] Terminal interface all commands
- [ ] Local storage caching

---

## Phase 2: Web UI & Collaboration (Next Sprint)

**Timeline**: 2-3 weeks after Phase 1 completion

### Objectives
- Desktop web interface
- Real-time updates
- Guild system
- Collaborative hunting

### Features

#### ✅ Web Interface (`index.html + desktop.js`)
- Visual pattern search dashboard
- Real-time scan progress
- Interactive results display
- Leaderboard visualization
- User profile page

#### ✅ Real-time Updates
- WebSocket integration
- Live scan progress across network
- New discovery notifications
- Leaderboard live updates

#### ✅ Guild System
- Create guilds (Trusted tier only)
- Join/leave guilds
- Guild leaderboards
- Collaborative hunting sessions
- Shared scan results within guild

#### ✅ Enhanced Discovery Sharing
- Session-based hunting
- Block distribution among peers
- Result aggregation
- Session chat

#### ✅ Gamification
- Achievement system
- Badges for milestones
- Discovery streaks
- Rarity hunting achievements

### Deliverables
- `index.html` - Main web interface
- `desktop.js` - Desktop app logic
- Enhanced `discovery-sharing` feature
- New `guilds` feature
- New `achievements` feature
- CSS styling for web UI

---

## Phase 3: Signing & Advanced Features (Future)

**Timeline**: 2-3 weeks after Phase 2 completion

### Objectives
- Inscription signing integration
- Advanced analytics
- Mobile app support

### Features

#### ✅ Inscription Signing
- Integration with trac-crypto-api
- One-click inscription signing
- Direct Bitcoin broadcast
- Transaction tracking

#### ✅ Advanced Analytics
- Pattern trend analysis
- Historical data visualization
- Rarity distribution charts
- Price prediction models

#### ✅ Mobile App
- React Native or similar
- Mobile-optimized interface
- Push notifications
- Offline mode

#### ✅ API Endpoints
- REST API for third-party integration
- Webhook support for discoveries
- GraphQL support

---

## Configuration

### Channel Names

**Production:**
```javascript
"dmt_pattern_hunter_mainnet_r1"  // 32 characters
```

**Development:**
```javascript
"dmt_pattern_hunter_testnet_r1"  // 32 characters
```

### Environment Variables

```env
ORD_TAP_HOST=https://ord-tap.trac.network
TRAC_CHANNEL=dmt_pattern_hunter_mainnet_r1
BOOTSTRAP_PEER=<peer_writer_key>
NETWORK=mainnet
ENABLE_LOGS=true
```

---

## Development Workflow

### Phase 1 Workflow

1. **Setup**
   ```bash
   npm install -g pear
   pear run . store1
   ```

2. **Testing**
   ```bash
   # Terminal mode
   node index.js

   # Run scanner
   Select: 1 (Scan for pattern)
   Enter pattern: 69
   Enter field: 16
   Enter start block: 800000
   Enter end block: 800050
   ```

3. **Development**
   ```bash
   # Test individual features
   node test/features/pattern-scanner.test.js

   # Run with debug output
   DEBUG=true node index.js
   ```

### Phase 2+ Workflow

1. **Start in desktop mode**
   ```bash
   pear run .
   # Opens browser with index.html
   ```

2. **Multi-node testing**
   ```bash
   # Terminal 1
   pear run . store1

   # Terminal 2
   pear run . store2

   # Test p2p communication
   ```

---

## Success Metrics

### Phase 1 Success
- ✅ Scan 1000+ blocks without errors
- ✅ Share discoveries between 2+ nodes
- ✅ Leaderboard updates correctly
- ✅ Rate limiting prevents abuse
- ✅ Terminal interface fully functional

### Phase 2 Success
- ✅ Web UI responsive and intuitive
- ✅ Real-time updates working
- ✅ 3+ active guilds
- ✅ Collaborative hunting sessions
- ✅ Achievement system engaged

### Phase 3 Success
- ✅ End-to-end inscription flow
- ✅ 100+ registered elements
- ✅ Mobile app deployed
- ✅ API endpoints stable

---

## Known Limitations

### Phase 1
- No web interface (terminal only)
- No guild system
- No inscription signing (JSON only)
- Basic analytics only

### Phase 2
- Desktop only (no mobile)
- No inscription signing
- Basic analytics

### Phase 3+
- All limitations addressed

---

## Dependencies

### Core
- `pear` - Trac Network runtime
- Node.js 22+

### Phase 1
- `node-fetch` - HTTP requests
- (No additional dependencies for MVP)

### Phase 2
- `socket.io-client` - WebSocket communication
- `express` - Optional REST API

### Phase 3
- `@trac-systems/trac-crypto-api` - Inscription signing
- `react-native` - Mobile app

---

## Contributing

### Phase 1 Development Focus
1. Core scanning logic
2. Trac Network integration
3. Data model validation
4. Terminal interface polish

### Phase 2 Development Focus
1. Web UI/UX
2. Real-time communication
3. Guild system
4. Gamification

### Phase 3 Development Focus
1. Integration with crypto APIs
2. Advanced analytics
3. Mobile app
4. API development

---

## Status

**Current Phase**: Phase 1 (MVP)

**Progress**:
- [x] Requirements gathered
- [x] Architecture designed
- [ ] Implementation in progress
- [ ] Testing
- [ ] Deployment

**Last Updated**: 2025-12-26
