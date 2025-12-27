# Complete Trac Network Developer Guide

## Overview: What You Need To Know

Trac Network is **NOT** a traditional blockchain. It's a "blockless" peer-to-peer Layer 1 that operates fundamentally differently from Ethereum, Bitcoin, or other chains you might know.

### Key Differences

| Traditional Blockchain | Trac Network |
|----------------------|--------------|
| Transactions bundled into blocks | Transactions validated individually |
| Block consensus (slow) | Transaction-level consensus (fast) |
| Centralized servers/nodes | True peer-to-peer (every user is a node) |
| Gas fees per transaction | Gas-free on Release 1 subnets |
| Solidity smart contracts | JavaScript smart contracts |
| Deploy to chain | Run locally on user devices |

## Core Concepts You Must Understand

### 1. App3 vs Web3

**Web3 (Traditional):**
- Users connect wallets to websites
- Websites connect to blockchain nodes
- Smart contracts run on blockchain
- Users trust the website/node provider

**App3 (Trac Network):**
- Users install apps on their devices
- Apps ARE nodes (embedded contracts)
- Smart contracts run locally on user devices
- No middlemen - pure peer-to-peer

### 2. Contract Execution Model

In Trac Network, **contracts are infrastructure**, not just code on a chain:

- Every participant executes the same contract code
- Contracts run on user devices, not remote servers
- Consensus achieved through deterministic execution
- All nodes reach same state by processing same transactions

### 3. The Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Trac Network App                     │
├─────────────────────────────────────────────────────────────┤
│  App Layer (index.html/index.js - User Interface)           │
├─────────────────────────────────────────────────────────────┤
│  Contract Layer (contract/contract.js - Business Logic)     │
├─────────────────────────────────────────────────────────────┤
│  Protocol Layer (contract/protocol.js - Framework)          │
├─────────────────────────────────────────────────────────────┤
│  Trac Peer (Networking, Storage, Consensus)                 │
├─────────────────────────────────────────────────────────────┤
│  Pear Runtime (P2P Infrastructure via Holepunch)            │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started: Development Environment Setup

### Prerequisites

You need:
- Node.js (v18+ recommended)
- npm or yarn
- Text editor (VS Code recommended)
- Git

### Install Pear Runtime

Pear is THE runtime for Trac Network apps. It provides peer-to-peer capabilities:

```bash
# Install globally
npm install -g pear

# Verify installation
pear -v
```

Pear handles:
- Peer-to-peer networking (via Holepunch)
- Decentralized app distribution
- Local data storage (Hyperbee/Hypercore)
- Identity management

## Building Your First Trac Network App

### Step 1: Clone the Contract Example

This is your starting template:

```bash
git clone https://github.com/Trac-Systems/trac-contract-example.git
cd trac-contract-example
npm install
```

### Step 2: Understand the Project Structure

```
trac-contract-example/
├── contract/
│   ├── contract.js      # Your smart contract logic
│   └── protocol.js      # Contract framework/API
├── features/
│   └── timer/           # Example "oracle" feature
│       └── index.js
├── src/                 # Additional source files
├── index.js             # Main entry point (terminal mode)
├── index.html           # App UI (desktop mode)
├── desktop.js           # Desktop app logic
└── package.json         # App configuration
```

### Step 3: Run Your First Node

```bash
# Run in terminal mode
pear run . store1

# Or with development console
pear run -d . store1
```

The `store1` parameter is your local database name. You can run multiple instances with different stores (store1, store2, etc.) to simulate multiple nodes.

### Step 4: Deploy as Bootstrap (Admin)

When you first run, you'll see setup options. To create your own network:

1. **Choose option 1** - Creates new network
2. **Copy and BACKUP the seedphrase** - This is your identity
3. **Copy the "Peer Writer" key** - This is your contract address
4. **Edit `index.js`** and replace the bootstrap address:

```javascript
// In index.js, find this section:
const bootstrap = "YOUR_COPIED_PEER_WRITER_KEY_HERE";
```

5. **Choose a channel name** - Exactly 32 characters:

```javascript
const channel_name = "my_awesome_contract_channel_32"; // Exactly 32 chars!
```

6. **Restart and add yourself as admin:**

```bash
# Exit with /exit, then restart
pear run . store1

# In the console, add your address as admin
/add_admin --address YOUR_PEER_ADDRESS
```

You're now running your own Trac Network contract!

## Writing Smart Contracts

### The Contract File (`contract/contract.js`)

This is where your business logic lives. Here's the basic structure:

```javascript
// contract/contract.js

module.exports = {
  // Contract state (stored in database)
  state: {
    users: {},
    balances: {},
    // ... your state variables
  },

  // Contract functions
  functions: {
    
    // Example: Transfer function
    transfer: function(from, to, amount) {
      // Validation
      if (!this.state.balances[from]) {
        return { success: false, error: "Sender not found" };
      }
      
      if (this.state.balances[from] < amount) {
        return { success: false, error: "Insufficient balance" };
      }
      
      // Execute transfer
      this.state.balances[from] -= amount;
      this.state.balances[to] = (this.state.balances[to] || 0) + amount;
      
      return { success: true };
    },
    
    // Example: Query function (read-only)
    getBalance: function(address) {
      return this.state.balances[address] || 0;
    },
    
    // Your custom functions here...
  },
  
  // Initialization
  init: function() {
    // Set up initial state
    this.state.balances = {};
  }
};
```

### Key Rules for Contracts

1. **Deterministic**: Same input MUST produce same output on every node
2. **No External APIs**: Can't make HTTP requests in contract code
3. **No Randomness**: Can't use `Math.random()` or timestamps
4. **State Management**: All state goes in `this.state`
5. **Return Values**: Always return result objects

### The Protocol File (`contract/protocol.js`)

This defines the API between your contract and the network:

```javascript
// contract/protocol.js

class Protocol {
  constructor(contract, peer) {
    this.contract = contract;
    this.peer = peer;
  }
  
  // API endpoints your app exposes
  api = {
    // Custom API function
    transfer: async (from, to, amount) => {
      // Validate inputs
      if (!from || !to || !amount) {
        return { error: "Missing parameters" };
      }
      
      // Call contract function
      const result = this.contract.functions.transfer(from, to, amount);
      
      // Broadcast transaction to network
      if (result.success) {
        await this.peer.broadcast({
          type: "transfer",
          from,
          to,
          amount,
          timestamp: Date.now()
        });
      }
      
      return result;
    }
  }
  
  // Handle incoming transactions
  async handleTransaction(tx) {
    switch(tx.type) {
      case "transfer":
        return this.contract.functions.transfer(tx.from, tx.to, tx.amount);
      
      // Handle other transaction types...
    }
  }
}

module.exports = Protocol;
```

## Features (Oracles)

Features are like oracles - they provide external data to your contract:

```javascript
// features/timer/index.js

class TimerFeature {
  constructor(contract) {
    this.contract = contract;
    this.interval = null;
  }
  
  start() {
    // Run every 10 seconds
    this.interval = setInterval(() => {
      // Update contract state
      this.contract.state.lastTimestamp = Date.now();
      
      // Trigger contract logic
      this.contract.functions.onTimer();
    }, 10000);
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

module.exports = TimerFeature;
```

## Building User Interfaces

### Terminal Mode (index.js)

For server/validator nodes:

```javascript
// index.js
const TracPeer = require('trac-peer');
const Contract = require('./contract/contract.js');
const Protocol = require('./contract/protocol.js');

// Setup peer
const peer = new TracPeer({
  bootstrap: "your_bootstrap_address",
  channel: "your_channel_name_exactly_32c",
  store: process.argv[2] || 'store1' // Database name
});

// Initialize contract
const contract = new Contract();
const protocol = new Protocol(contract, peer);

// Start peer
await peer.start();

// Console interface
process.stdin.on('data', async (data) => {
  const command = data.toString().trim();
  
  if (command.startsWith('/transfer')) {
    // Parse command and execute
    const [_, from, to, amount] = command.split(' ');
    const result = await protocol.api.transfer(from, to, amount);
    console.log(result);
  }
});
```

### Desktop Mode (index.html + desktop.js)

For end-user apps with GUI:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>My Trac App</title>
</head>
<body>
  <h1>My Trac Network App</h1>
  
  <div id="balance">Balance: <span id="balance-amount">0</span></div>
  
  <form id="transfer-form">
    <input type="text" id="to" placeholder="To address" />
    <input type="number" id="amount" placeholder="Amount" />
    <button type="submit">Transfer</button>
  </form>
  
  <script src="desktop.js"></script>
</body>
</html>
```

```javascript
// desktop.js
const Pear = require('pear');
const TracPeer = require('trac-peer');
const Contract = require('./contract/contract.js');

// Initialize
const peer = new TracPeer({ /* config */ });
const contract = new Contract();

// Create wallet automatically
const wallet = await peer.createWallet();
document.getElementById('address').textContent = wallet.address;

// Handle transfer form
document.getElementById('transfer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const to = document.getElementById('to').value;
  const amount = document.getElementById('amount').value;
  
  const result = await peer.api.transfer(wallet.address, to, amount);
  
  if (result.success) {
    alert('Transfer successful!');
    updateBalance();
  } else {
    alert('Transfer failed: ' + result.error);
  }
});

// Update balance display
async function updateBalance() {
  const balance = await peer.api.getBalance(wallet.address);
  document.getElementById('balance-amount').textContent = balance;
}

// Auto-update every 5 seconds
setInterval(updateBalance, 5000);
```

### Switching Between Modes

Edit `package.json`:

```json
{
  "name": "my-trac-app",
  "main": "index.js",  // For terminal mode
  // "main": "index.html",  // For desktop mode
  "pear": {
    "name": "My Trac App",
    "type": "terminal"  // or "desktop"
  }
}
```

## Accessing Bitcoin/TAP Protocol Data

Your Pattern Scanner needs to read Bitcoin blockchain data. Use the TAP Reader:

### Install TAP Reader

```bash
npm install @trac-systems/tap-reader
```

### Use in Your Contract

```javascript
// In your contract or feature
const TapReader = require('@trac-systems/tap-reader');

class PatternScanner {
  constructor() {
    this.reader = new TapReader({
      channel: 'tap-bitcoin-mainnet' // Official channel
    });
  }
  
  async init() {
    await this.reader.connect();
  }
  
  async getBlockData(blockHeight) {
    // Fetch Bitcoin block data
    const block = await this.reader.getBlock(blockHeight);
    return block;
  }
  
  async scanPattern(pattern, field, startBlock, endBlock) {
    const results = [];
    
    for (let height = startBlock; height <= endBlock; height++) {
      const block = await this.getBlockData(height);
      const count = this.countPattern(block, pattern, field);
      results.push({ block: height, count });
    }
    
    return results;
  }
  
  countPattern(block, pattern, field) {
    // Your pattern counting logic from the Python scanner
    // Adapted to JavaScript
  }
}

module.exports = PatternScanner;
```

## Integrating Your Python Scanner with Trac Network

Your existing Python scanner can become a Feature (oracle) for your Trac contract:

### Option 1: Port to JavaScript

Convert your Python scanner to JavaScript and run it as a feature in Trac Network.

### Option 2: Bridge Architecture

Keep Python scanner separate, expose it via API, call from Trac Network:

```javascript
// features/pattern-scanner/index.js

const fetch = require('node-fetch');

class PatternScannerFeature {
  constructor(contract) {
    this.contract = contract;
    this.scannerAPI = 'http://localhost:5000'; // Your Python Flask server
  }
  
  async scanPattern(pattern, field, startBlock, endBlock) {
    // Call your Python scanner
    const response = await fetch(`${this.scannerAPI}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern, field, startBlock, endBlock })
    });
    
    const data = await response.json();
    
    // Store results in contract state
    this.contract.state.scanResults = data;
    
    return data;
  }
}

module.exports = PatternScannerFeature;
```

## Deployment Strategies

### Development Deployment (Local)

```bash
# Run multiple instances locally
pear run . store1  # Node 1
pear run . store2  # Node 2
pear run . store3  # Node 3
```

### Production Deployment

1. **Choose deployment model:**
   - **App3**: Distribute as installable app (users run nodes)
   - **Web3**: Run nodes as servers (traditional web app experience)

2. **For App3 (Recommended):**

```bash
# Build for distribution
pear build .

# Generates shareable app key
# Users install with:
pear install <your_app_key>
```

3. **For Web3 (Traditional):**

Run server nodes and expose API:

```javascript
// In index.js
const peer_opts = {
  api_tx_exposed: true,   // Allow external transactions
  api_msg_exposed: true,  // Allow external messages
  port: 3000              // HTTP port
};
```

Then build web frontend that connects to your server nodes.

## Validators and Incentives

### Setting Up Validators

Validators earn fees for securing the network:

```bash
# Add validator
/add_validator --address <validator_address>

# List validators
/list_validators
```

### Fee Structure

Configure in your contract:

```javascript
// contract/contract.js

module.exports = {
  config: {
    validatorFeePercent: 0.5,  // 0.5% to validators
    platformFeePercent: 0.1    // 0.1% to platform
  },
  
  functions: {
    transfer: function(from, to, amount) {
      // Calculate fees
      const validatorFee = amount * (this.config.validatorFeePercent / 100);
      const platformFee = amount * (this.config.platformFeePercent / 100);
      const netAmount = amount - validatorFee - platformFee;
      
      // Execute with fees
      this.state.balances[from] -= amount;
      this.state.balances[to] += netAmount;
      this.state.validatorPool += validatorFee;
      this.state.platformPool += platformFee;
      
      return { success: true };
    }
  }
};
```

## Testing Your Contract

### Unit Testing

```javascript
// test/contract.test.js

const Contract = require('../contract/contract.js');

describe('Transfer Function', () => {
  let contract;
  
  beforeEach(() => {
    contract = new Contract();
    contract.init();
    
    // Set up test state
    contract.state.balances = {
      'alice': 1000,
      'bob': 500
    };
  });
  
  test('should transfer tokens correctly', () => {
    const result = contract.functions.transfer('alice', 'bob', 100);
    
    expect(result.success).toBe(true);
    expect(contract.state.balances['alice']).toBe(900);
    expect(contract.state.balances['bob']).toBe(600);
  });
  
  test('should reject transfer with insufficient balance', () => {
    const result = contract.functions.transfer('bob', 'alice', 1000);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Insufficient balance');
  });
});
```

### Integration Testing

Run multiple nodes locally and test interactions:

```bash
# Terminal 1 - Bootstrap
pear run . store1

# Terminal 2 - Peer 1
pear run . store2

# Terminal 3 - Peer 2
pear run . store3

# Send transactions between them and verify consensus
```

## Common Patterns and Best Practices

### 1. State Management

```javascript
// Good: Organized state
state: {
  users: {
    'address1': { balance: 100, name: 'Alice' },
    'address2': { balance: 200, name: 'Bob' }
  },
  transactions: [],
  config: {}
}

// Bad: Flat unorganized state
state: {
  address1_balance: 100,
  address1_name: 'Alice',
  address2_balance: 200,
  // Gets messy quickly...
}
```

### 2. Transaction Validation

Always validate before executing:

```javascript
functions: {
  transfer: function(from, to, amount) {
    // Validation block
    if (!from || !to || !amount) {
      return { success: false, error: "Invalid parameters" };
    }
    
    if (!this.state.users[from]) {
      return { success: false, error: "Sender not found" };
    }
    
    if (this.state.users[from].balance < amount) {
      return { success: false, error: "Insufficient balance" };
    }
    
    if (amount <= 0) {
      return { success: false, error: "Amount must be positive" };
    }
    
    // Execution block (only after all validation passes)
    this.state.users[from].balance -= amount;
    this.state.users[to].balance += amount;
    
    return { success: true };
  }
}
```

### 3. Event Logging

Track important events:

```javascript
state: {
  events: []
},

functions: {
  transfer: function(from, to, amount) {
    // ... transfer logic ...
    
    // Log event
    this.state.events.push({
      type: 'transfer',
      from,
      to,
      amount,
      timestamp: Date.now(),
      blockHeight: this.peer.currentBlock
    });
    
    return { success: true };
  }
}
```

## Connecting to Mainnet (Future)

When Trac Network mainnet launches:

```javascript
// Update bootstrap address to mainnet
const bootstrap = "mainnet_bootstrap_address";

// Update channel
const channel = "trac_mainnet_channel_32chars";

// Your contract will automatically connect to mainnet
```

## Key Documentation Links

- **Trac Network Docs**: https://docs.trac.network
- **GitHub Repos**: https://github.com/Trac-Systems
- **Contract Example**: https://github.com/Trac-Systems/trac-contract-example
- **TAP Protocol Specs**: https://github.com/Trac-Systems/tap-protocol-specs
- **TAP Reader**: https://github.com/Trac-Systems/tap-reader
- **Hypertokens Example**: https://github.com/Trac-Systems/hypertokens
- **Pear Runtime**: https://pears.com
- **Discord Community**: https://discord.com/invite/trac

## Next Steps for Your Pattern Scanner Project

1. **Port Python scanner to JavaScript** using the contract example
2. **Create a Feature** that runs pattern scans
3. **Build contract functions** for registering `.element` discoveries
4. **Create desktop UI** for Pattern Hunter game
5. **Deploy to subnet** for gas-free operation
6. **Add validator rewards** for pattern verification

You now have everything needed to build on Trac Network!
