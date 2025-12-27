# AI Agent Documentation Guide: Building DMT Pattern Scanner

## Overview for Your Agent

This document contains all technical specifications your AI coding agent (Qwen Coder CLI, Claude, etc.) needs to build a DMT Pattern Scanner correctly. Feed this entire document to your agent when coding.

## Critical Context: What You're Building

You're building a **Pattern Scanner** that searches Bitcoin blockchain data for patterns, which can then be registered as `.element` inscriptions on Bitcoin and used to create Non-Arbitrary Tokens (NATs) via the TAP Protocol.

## 1. Bitcoin Block Data Structure (38 Fields)

Your scanner must access these exact fields. Here's the complete mapping:

```javascript
const FIELD_MAP = {
  // Block-level fields
  0: "block_hash",      // Hex string of block hash
  1: "size",            // Block size in bytes
  2: "strippedsize",    // Size without witness data
  3: "weight",          // Block weight
  4: "height",          // Block number
  5: "version",         // Block version
  6: "versionHex",      // Block version as hex
  7: "merkleroot",      // Merkle root hash
  8: "time",            // Block timestamp (Unix time)
  9: "mediantime",      // Median of last 11 blocks
  10: "nonce",          // Nonce value used in mining
  11: "bits",           // Difficulty target
  12: "difficulty",     // Mining difficulty
  13: "chainwork",      // Total work in chain
  14: "nTx",            // Number of transactions
  
  // Transaction fields
  15: "hex",            // Transaction hex
  16: "txid",           // Transaction ID (hash)
  17: "tx_hash",        // Transaction hash
  18: "size",           // Transaction size
  19: "vsize",          // Virtual transaction size
  20: "weight",         // Transaction weight
  21: "version",        // Transaction version
  22: "locktime",       // Transaction locktime
  23: "blocktime",      // Time transaction was mined
  
  // Input fields
  24: "input_asm",      // Input script assembly
  25: "input_hex",      // Input script hex
  26: "sequence",       // Input sequence number
  27: "txinwitness",    // Segregated witness data
  28: "value",          // Input value
  29: "n",              // Input index
  
  // Output fields
  30: "output_asm",     // Output script assembly
  31: "output_hex",     // Output script hex
  32: "reqSigs",        // Required signatures
  33: "type",           // Output type
  34: "witness",        // Witness flag (boolean)
  35: "btc_fee",        // Transaction fee
  36: "is_coinbase",    // Coinbase transaction flag
  37: "coinbase"        // Coinbase data
};
```

### Field Data Types

Your agent MUST handle these correctly:

- **Hex fields** (0, 6, 7, 13, 15-17, 25, 27, 31, 37): Search as strings, case-insensitive
- **Numeric fields** (1-5, 8-12, 14, 18-23, 26, 28-29, 32, 35): Convert to string for pattern matching
- **Boolean fields** (34, 36): Convert to "true"/"false" strings
- **Array fields** (16, 17 for multiple transactions): Iterate through all items

## 2. Pattern Registration Format (.element)

When a pattern is found, it must be registered using this EXACT format:

```
<name>.<pattern>.<field>.element
```

### Rules Your Agent Must Enforce

```javascript
// Validation rules
const ELEMENT_RULES = {
  // Name field (required)
  name: {
    required: true,
    excludedChars: /[\/.\[\]{}:;"']/g,  // Cannot contain these
    noWhitespace: true,                  // No spaces allowed
    caseInsensitive: true,               // "DOGE" = "doge"
    uniqueRequired: true                 // Must be globally unique
  },
  
  // Pattern field (optional)
  pattern: {
    required: false,
    // If omitted, uses entire field value
    // If present, specifies pattern within field
  },
  
  // Field field (required)
  field: {
    required: true,
    validRange: [0, 37],  // Must be 0-37
    type: 'integer'
  }
};
```

### Example Element Registrations

```javascript
// Valid registrations
const examples = {
  withPattern: "satoshi.69.16.element",      // Pattern "69" in field 16 (txid)
  withoutPattern: "dmt.11.element",          // Entire field 11 (bits) value
  multiDigit: "lucky.777.7.element",         // Pattern "777" in field 7 (merkleroot)
  
  // Invalid registrations
  invalid1: "dmt.3.11.element",              // Name "dmt" already used
  invalid2: "my token.420.16.element",       // Contains whitespace
  invalid3: "gary.11.element"                // Name "gary" if already taken for field 11
};
```

## 3. TAP Protocol Specifications

### Token Deployment (dmt-deploy)

Your agent must generate deployment JSON correctly:

```javascript
// Template for NAT deployment
const dmtDeploy = {
  "p": "tap",                    // Protocol: ALWAYS "tap"
  "op": "dmt-deploy",            // Operation: ALWAYS "dmt-deploy"
  "tick": "<TICKER>",            // 1-32 characters (Unicode)
  "elem": "<name>.<pattern>.<field>.element", // References registered element
  "supply": "<optional_max>",    // Optional: Maximum supply cap
  "dta": "<optional_data>"       // Optional: Up to 512 bytes
};

// Example deployment
const natExample = {
  "p": "tap",
  "op": "dmt-deploy",
  "tick": "LUCKY",
  "elem": "lucky.777.7.element",
  "supply": "1000000000"  // Optional cap
};
```

### Token Minting (dmt-mint)

```javascript
// Template for minting NATs
const dmtMint = {
  "p": "tap",                    // Protocol: ALWAYS "tap"
  "op": "dmt-mint",              // Operation: ALWAYS "dmt-mint"
  "dep": "<deployment_inscription_id>",  // References deployment
  "tick": "<TICKER>",            // Must match deployment
  "blk": <block_number>,         // Block number to claim (INTEGER, no quotes!)
  "dta": "<optional_data>"       // Optional: Up to 512 bytes
};

// Example mint
const mintExample = {
  "p": "tap",
  "op": "dmt-mint",
  "dep": "825e287bb7dd163ed633110e31bc6abb6c80815ca68b7dd3cc71d729ecaaa3dci0",
  "tick": "LUCKY",
  "blk": 850000  // INTEGER - no quotes!
};
```

### CRITICAL: Field Type Rules

```javascript
// Your agent MUST use these exact types
const FIELD_TYPES = {
  "p": "string",           // ALWAYS "tap"
  "op": "string",          // "dmt-deploy" or "dmt-mint"
  "tick": "string",        // Token ticker
  "elem": "string",        // Element reference
  "dep": "string",         // Deployment inscription ID
  "blk": "number",         // MUST BE INTEGER (no quotes!)
  "supply": "string",      // Optional max supply
  "dta": "string",         // Optional data (max 512 bytes)
  "amt": "string"          // For regular tokens
};
```

## 4. Bitcoin Blockchain API Access

### Using Blockchain.com API

```javascript
// Base URL
const BASE_URL = "https://blockchain.info";

// Fetch block by height
async function fetchBlock(blockHeight) {
  try {
    // Get block hash from height
    const hashUrl = `${BASE_URL}/block-height/${blockHeight}?format=json`;
    const response = await fetch(hashUrl);
    const data = await response.json();
    
    // blockchain.info returns array of blocks
    if (data.blocks && data.blocks.length > 0) {
      return data.blocks[0];
    }
    return null;
  } catch (error) {
    console.error(`Error fetching block ${blockHeight}:`, error);
    return null;
  }
}

// Block data structure returned
const BLOCK_STRUCTURE = {
  hash: "string",          // Field 0: block_hash
  size: "number",          // Field 1: size
  weight: "number",        // Field 3: weight
  height: "number",        // Field 4: height
  ver: "number",           // Field 5: version
  mrkl_root: "string",     // Field 7: merkleroot
  time: "number",          // Field 8: time
  nonce: "number",         // Field 10: nonce
  bits: "number",          // Field 11: bits
  n_tx: "number",          // Field 14: nTx
  tx: [                    // Array of transactions
    {
      hash: "string",      // Field 16: txid
      size: "number",      // Field 18: size
      lock_time: "number", // Field 22: locktime
      // ... more transaction fields
    }
  ]
};
```

### Using Blockchair API (Alternative)

```javascript
const BLOCKCHAIR_URL = "https://api.blockchair.com/bitcoin";

// Fetch block
async function fetchBlockBlockchair(blockHeight) {
  try {
    const url = `${BLOCKCHAIR_URL}/dashboards/block/${blockHeight}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data[blockHeight];
  } catch (error) {
    console.error(`Error fetching block ${blockHeight}:`, error);
    return null;
  }
}
```

## 5. Pattern Matching Algorithm

Your agent should implement this logic:

```javascript
function countPatternInString(text, pattern) {
  // Convert both to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  const lowerPattern = pattern.toLowerCase();
  
  let count = 0;
  let position = 0;
  
  // Find all occurrences (including overlapping)
  while ((position = lowerText.indexOf(lowerPattern, position)) !== -1) {
    count++;
    position += 1;  // Move by 1 to find overlapping patterns
  }
  
  return count;
}

// Example usage
const txHash = "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054";
const pattern = "00";
const count = countPatternInString(txHash, pattern);  // Returns 22
```

## 6. Statistical Analysis Requirements

Your scanner MUST calculate these statistics:

```javascript
function calculateStatistics(patternCounts) {
  const n = patternCounts.length;
  const total = patternCounts.reduce((sum, count) => sum + count, 0);
  const avg = total / n;
  
  // Standard deviation
  const variance = patternCounts.reduce((sum, count) => {
    return sum + Math.pow(count - avg, 2);
  }, 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Min and max
  const min = Math.min(...patternCounts);
  const max = Math.max(...patternCounts);
  
  // Blocks with/without pattern
  const blocksWithPattern = patternCounts.filter(c => c > 0).length;
  const blocksWithoutPattern = patternCounts.filter(c => c === 0).length;
  
  return {
    totalBlocks: n,
    totalOccurrences: total,
    blocksWithPattern,
    blocksWithoutPattern,
    avgPerBlock: avg,
    stdDeviation: stdDev,
    minOccurrences: min,
    maxOccurrences: max
  };
}
```

## 7. Economic Analysis Logic

```javascript
function analyzeTokenEconomics(stats) {
  const { blocksWithPattern, totalBlocks, stdDeviation, avgPerBlock } = stats;
  
  // Rarity assessment
  const patternFrequency = blocksWithPattern / totalBlocks;
  let rarity, tokenType;
  
  if (patternFrequency < 0.1) {
    rarity = "EXTREMELY RARE";
    tokenType = "Highly deflationary - Scarce supply";
  } else if (patternFrequency < 0.3) {
    rarity = "RARE";
    tokenType = "Deflationary - Limited supply";
  } else if (patternFrequency < 0.7) {
    rarity = "MODERATE";
    tokenType = "Balanced supply dynamics";
  } else {
    rarity = "COMMON";
    tokenType = "Inflationary - Abundant supply";
  }
  
  // Volatility assessment
  const cv = avgPerBlock > 0 ? (stdDeviation / avgPerBlock) : 0;
  let volatility;
  
  if (cv > 1.0) {
    volatility = "HIGH - Highly variable minting rewards";
  } else if (cv > 0.5) {
    volatility = "MODERATE - Some variation in rewards";
  } else {
    volatility = "LOW - Consistent minting rewards";
  }
  
  return { rarity, tokenType, volatility, coefficientOfVariation: cv };
}
```

## 8. Error Handling Requirements

Your agent MUST implement these error checks:

```javascript
// Input validation
function validateInputs(pattern, fieldNum, startBlock, endBlock) {
  const errors = [];
  
  // Pattern validation
  if (!pattern || pattern.trim() === "") {
    errors.push("Pattern cannot be empty");
  }
  
  // Field validation
  if (!Number.isInteger(fieldNum) || fieldNum < 0 || fieldNum > 37) {
    errors.push("Field must be integer between 0 and 37");
  }
  
  // Block range validation
  if (!Number.isInteger(startBlock) || startBlock < 0) {
    errors.push("Start block must be positive integer");
  }
  
  if (!Number.isInteger(endBlock) || endBlock < startBlock) {
    errors.push("End block must be >= start block");
  }
  
  if (endBlock - startBlock > 1000) {
    errors.push("WARNING: Scanning more than 1000 blocks may be slow");
  }
  
  return errors;
}

// API error handling
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}
```

## 9. Output Format Requirements

Your scanner MUST output in these formats:

### Console Output

```javascript
// Example output structure
const OUTPUT_FORMAT = {
  header: "=".repeat(70),
  title: "DMT PATTERN ANALYSIS REPORT",
  separator: "=".repeat(70),
  
  sections: [
    "SUMMARY STATISTICS",
    "TOKEN ECONOMICS ANALYSIS", 
    "TOP MINTING OPPORTUNITIES",
    "ELEMENT REGISTRATION FORMAT",
    "NAT DEPLOYMENT SUGGESTION",
    "STRATEGIC RECOMMENDATIONS"
  ]
};
```

### JSON Output

```javascript
const JSON_OUTPUT = {
  pattern: "69",
  field: 16,
  fieldName: "txid",
  blockRange: [850000, 850010],
  
  statistics: {
    totalBlocks: 11,
    totalOccurrences: 12543,
    blocksWithPattern: 11,
    blocksWithoutPattern: 0,
    avgPerBlock: 1140.27,
    stdDeviation: 87.3,
    minOccurrences: 1032,
    maxOccurrences: 1305
  },
  
  economics: {
    rarity: "COMMON",
    tokenType: "Inflationary - Abundant supply",
    volatility: "LOW",
    coefficientOfVariation: 0.08
  },
  
  topBlocks: [
    { block: 850003, count: 1305 },
    { block: 850007, count: 1289 },
    { block: 850001, count: 1267 }
  ],
  
  registration: {
    format: "<yourname>.69.16.element",
    example: "satoshi.69.16.element"
  },
  
  deployment: {
    json: {
      "p": "tap",
      "op": "dmt-deploy",
      "tick": "<YOUR_TICKER>",
      "elem": "<n>.69.16.element"
    }
  }
};
```

## 10. Complete Code Template

```python
# Your agent should generate code based on this structure

import requests
import json
from collections import Counter
from typing import Dict, List, Optional
import time

class DMTPatternScanner:
    def __init__(self):
        self.base_url = "https://blockchain.info"
        self.field_map = {
            0: "block_hash", 1: "size", 4: "height", 7: "merkleroot",
            8: "time", 10: "nonce", 11: "bits", 14: "nTx", 16: "txid"
            # ... complete mapping from section 1
        }
    
    def fetch_block(self, block_height: int) -> Optional[Dict]:
        """Fetch Bitcoin block data"""
        # Implementation from section 4
        pass
    
    def extract_field_data(self, block: Dict, field_num: int) -> List[str]:
        """Extract specific field from block"""
        # Implementation from section 4
        pass
    
    def count_pattern(self, text: str, pattern: str) -> int:
        """Count pattern occurrences"""
        # Implementation from section 5
        pass
    
    def analyze_pattern(self, pattern: str, field_num: int, 
                       start_block: int, end_block: int) -> Dict:
        """Main analysis function"""
        # Implementation combining sections 5-7
        pass
    
    def calculate_statistics(self, counts: List[int]) -> Dict:
        """Calculate statistical metrics"""
        # Implementation from section 6
        pass
    
    def analyze_economics(self, stats: Dict) -> Dict:
        """Analyze token economics"""
        # Implementation from section 7
        pass
    
    def generate_report(self, analysis: Dict) -> str:
        """Generate human-readable report"""
        # Implementation from section 9
        pass
    
    def save_json(self, analysis: Dict, filename: str):
        """Save results as JSON"""
        # Implementation from section 9
        pass

if __name__ == "__main__":
    scanner = DMTPatternScanner()
    # CLI interface here
```

## 11. Testing Requirements

Your agent MUST verify against this known example:

```javascript
// Test Case 1: Known Pattern
const TEST_CASE = {
  pattern: "69",
  field: 16,  // txid
  block: 817577,
  expectedCount: 1088,  // Documented in DMT specs
  tolerance: 50  // Allow ±50 variance due to API differences
};

// Validation function
function validateAgainstKnown(result) {
  const diff = Math.abs(result.count - TEST_CASE.expectedCount);
  if (diff <= TEST_CASE.tolerance) {
    console.log("✓ Test PASSED - Scanner is accurate");
    return true;
  } else {
    console.error(`✗ Test FAILED - Expected ${TEST_CASE.expectedCount}, got ${result.count}`);
    return false;
  }
}
```

## 12. Rate Limiting

```javascript
// Your agent MUST implement rate limiting
const RATE_LIMIT = {
  requestsPerSecond: 2,    // Max 2 requests/second
  delayBetweenRequests: 500 // 500ms delay
};

async function rateLimitedFetch(url) {
  await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.delayBetweenRequests));
  return fetch(url);
}
```

## 13. Critical Rules Summary

**Your agent MUST:**

1. Use EXACT field numbers (0-37) from the field map
2. Generate `.element` format EXACTLY as specified
3. Use correct JSON types (blk as NUMBER, not string)
4. Implement case-insensitive pattern matching
5. Calculate all required statistics
6. Include economic analysis
7. Handle API errors with retries
8. Implement rate limiting
9. Validate against known test case
10. Output in both console and JSON formats

**Your agent MUST NOT:**

1. Use undefined field numbers (>37)
2. Put quotes around block numbers in mint JSON
3. Skip error handling
4. Make requests without rate limiting
5. Generate invalid .element names (with spaces or special chars)

## 14. Documentation Links

Feed these to your agent if it needs more context:

- TAP Protocol Specs: https://github.com/Trac-Systems/tap-protocol-specs
- DMT Gitbook: https://digital-matter-theory.gitbook.io/
- Bitcoin Block API: https://blockchain.info/api/blockchain_api
- Element Registry: https://digital-matter-theory.gitbook.io/digital-matter-theory/introduction/digital-elements/.element-registry

## How To Use This With Your Agent

```bash
# Copy this entire document and use it as a prompt prefix:

# For Qwen Coder CLI:
qwen-coder "Using the specifications in [paste this document], 
build a DMT pattern scanner in Python that scans Bitcoin blocks 
for patterns in field 16 (transaction hashes)"

# For Claude Code:
claude-code "I need you to build a pattern scanner following these 
exact specifications: [paste this document]. Start with the basic 
scanning function for field 16."

# For general AI assistants:
"Here are the complete technical specifications you need: [paste document]
Now write the code to implement the pattern scanner."
```

Your agent can now write correct code without guessing!