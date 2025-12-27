/**
 * Block Data Fetcher
 * Multi-source block data fetcher with fallback support
 * Primary: Bitcoin Core RPC
 * Secondary: blockchain.info API
 */

const fetch = require('node-fetch');

class BlockDataFetcher {
  constructor(config) {
    this.config = config;
    this.debug = process.env.DEBUG === 'true';

    if (this.debug) {
      console.log(`[BlockDataFetcher] Initialized with config:`, JSON.stringify(config, null, 2));
    }
  }

  log(message) {
    if (this.debug) {
      console.log(`[BlockDataFetcher] ${message}`);
    }
  }

  async getBlock(blockHeight) {
    const sources = this.getSourcesInOrder();
    let lastError = null;

    for (const source of sources) {
      try {
        this.log(`Trying source: ${source.type}`);
        const blockData = await this.fetchFromSource(source, blockHeight);
        
        if (blockData) {
          const standardized = this.standardizeBlockData(blockData, source.type);
          this.log(`Successfully fetched block ${blockHeight} from ${source.type}`);
          return standardized;
        }
      } catch (error) {
        this.log(`Failed to fetch from ${source.type}: ${error.message}`);
        lastError = error;
        continue;
      }
    }

    console.error(`[BlockDataFetcher] All sources failed for block ${blockHeight}`);
    console.error(`[BlockDataFetcher] Last error:`, lastError?.message);
    return null;
  }

  getSourcesInOrder() {
    const sources = [];

    if (this.config.bitcoinCore && this.config.bitcoinCore.url) {
      sources.push({
        type: 'bitcoin-core',
        priority: 1
      });
    }

    sources.push({
      type: 'blockchain.info',
      priority: 2
    });

    return sources.sort((a, b) => a.priority - b.priority);
  }

  async fetchFromSource(source, blockHeight) {
    switch (source.type) {
      case 'bitcoin-core':
        return await this.fetchFromBitcoinCore(blockHeight);
      case 'blockchain.info':
        return await this.fetchFromBlockchainInfo(blockHeight);
      default:
        throw new Error(`Unknown source type: ${source.type}`);
    }
  }

  async fetchFromBitcoinCore(blockHeight) {
    const { url, username, password } = this.config.bitcoinCore;
    
    this.log(`Fetching block ${blockHeight} from Bitcoin Core RPC: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getblockhash',
        params: [blockHeight]
      })
    });

    if (!response.ok) {
      throw new Error(`Bitcoin Core RPC error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Bitcoin Core RPC error: ${data.error.message}`);
    }

    const blockHash = data.result;

    const blockResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getblock',
        params: [blockHash, 2] // 2 = JSON with transaction objects
      })
    });

    if (!blockResponse.ok) {
      throw new Error(`Bitcoin Core RPC getblock error: ${blockResponse.status}`);
    }

    const blockData = await blockResponse.json();

    if (blockData.error) {
      throw new Error(`Bitcoin Core RPC getblock error: ${blockData.error.message}`);
    }

    this.log(`Bitcoin Core returned block: ${blockHash}`);

    return {
      source: 'bitcoin-core',
      data: blockData.result
    };
  }

  async fetchFromBlockchainInfo(blockHeight) {
    const baseUrl = this.config.blockchainInfo?.baseUrl || 'https://blockchain.info';
    
    this.log(`Fetching block ${blockHeight} from blockchain.info`);

    const response = await fetch(`${baseUrl}/block-height/${blockHeight}?format=json`, {
      headers: {
        'User-Agent': 'DMT-Pattern-Scanner/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`blockchain.info error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();

    // ✅ FIX: blockchain.info returns { blocks: [...] }
    if (!responseData.blocks || responseData.blocks.length === 0) {
      throw new Error(`No blocks found for height ${blockHeight}`);
    }

    const blockData = responseData.blocks[0]; // ✅ Extract the actual block

    this.log(`blockchain.info returned block: ${blockData.hash}`);

    return {
      source: 'blockchain.info',
      data: blockData
    };
  }

  standardizeBlockData(blockData, sourceType) {
    const fields = {};
    const data = blockData.data;

    if (sourceType === 'bitcoin-core') {
      fields[0] = data.height;
      fields[1] = data.hash;
      fields[2] = data.merkleroot;
      fields[3] = data.time;
      fields[4] = data.bits;
      fields[5] = data.nonce;
      fields[6] = data.version;
      fields[7] = data.difficulty;
      fields[8] = data.chainwork;
      fields[9] = data.nTx;
      fields[10] = data.size;
      fields[11] = data.strippedsize;
      fields[12] = data.weight;
      fields[13] = data.mediantime;
      fields[14] = data.tx ? data.tx[0]?.txid : null;
      fields[15] = data.previousblockhash;
      
      // Safe conversions with checks
      fields[16] = data.nonce ? data.nonce.toString(16) : '';
      fields[17] = data.bits ? data.bits.toString(16) : '';
      fields[18] = data.time ? data.time.toString() : '';
      fields[19] = data.merkleroot ? data.merkleroot : '';
      
      // Hash substrings
      if (data.hash) {
        fields[20] = data.hash.substring(0, 8);
        fields[21] = data.hash.substring(8, 16);
        fields[22] = data.hash.substring(16, 24);
        fields[23] = data.hash.substring(24, 32);
        fields[24] = data.hash.substring(32, 40);
        fields[25] = data.hash.substring(40, 48);
        fields[26] = data.hash.substring(48, 56);
        fields[27] = data.hash.substring(56, 64);
      }
      
      // Previous block hash substrings
      if (data.previousblockhash) {
        fields[28] = data.previousblockhash.substring(0, 8);
        fields[29] = data.previousblockhash.substring(8, 16);
        fields[30] = data.previousblockhash.substring(16, 24);
        fields[31] = data.previousblockhash.substring(24, 32);
      }
      
      fields[32] = data.nextblockhash || null;
      fields[33] = data.weight ? data.weight.toString(16) : '';
      fields[34] = data.size ? data.size.toString(16) : '';
      fields[35] = data.nonce ? data.nonce.toString(2) : '';
      fields[36] = data.bits ? data.bits.toString(2) : '';
      fields[37] = data.version ? data.version.toString(2) : '';

    } else if (sourceType === 'blockchain.info') {
      fields[0] = data.height;
      fields[1] = data.hash;
      fields[2] = data.mrkl_root;
      fields[3] = data.time;
      fields[4] = data.bits;
      fields[5] = data.nonce;
      fields[6] = data.ver;
      fields[7] = data.difficulty;
      fields[8] = null; // chainwork not available
      fields[9] = data.n_tx;
      fields[10] = data.size;
      fields[11] = data.stripped_size || data.size;
      fields[12] = data.weight || data.size * 4;
      fields[13] = data.time; // use time as mediantime
      fields[14] = data.tx && data.tx[0] ? data.tx[0].hash : null;
      fields[15] = data.prev_block;
      
      // Safe conversions with checks
      fields[16] = data.nonce ? data.nonce.toString(16) : '';
      fields[17] = data.bits ? data.bits.toString(16) : '';
      fields[18] = data.time ? data.time.toString() : '';
      fields[19] = data.mrkl_root ? data.mrkl_root : '';
      
      // Hash substrings
      if (data.hash) {
        fields[20] = data.hash.substring(0, 8);
        fields[21] = data.hash.substring(8, 16);
        fields[22] = data.hash.substring(16, 24);
        fields[23] = data.hash.substring(24, 32);
        fields[24] = data.hash.substring(32, 40);
        fields[25] = data.hash.substring(40, 48);
        fields[26] = data.hash.substring(48, 56);
        fields[27] = data.hash.substring(56, 64);
      }
      
      // Previous block hash substrings
      if (data.prev_block) {
        fields[28] = data.prev_block.substring(0, 8);
        fields[29] = data.prev_block.substring(8, 16);
        fields[30] = data.prev_block.substring(16, 24);
        fields[31] = data.prev_block.substring(24, 32);
      }
      
      fields[32] = null; // next block hash not available from blockchain.info
      fields[33] = data.weight ? data.weight.toString(16) : (data.size ? (data.size * 4).toString(16) : '');
      fields[34] = data.size ? data.size.toString(16) : '';
      fields[35] = data.nonce ? data.nonce.toString(2) : '';
      fields[36] = data.bits ? data.bits.toString(2) : '';
      fields[37] = data.ver ? data.ver.toString(2) : '';
    }

    return {
      height: fields[0],
      hash: fields[1],
      fields: fields,
      source: sourceType,
      raw: data
    };
  }
}

module.exports = BlockDataFetcher;