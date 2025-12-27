/**
 * DMT Pattern Scanner Contract
 * Main contract logic for Phase 1 MVP
 */

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const Protocol = require('./protocol');
const BitcoinIndexerFeature = require('../features/bitcoin-indexer');
const PatternScannerFeature = require('../features/pattern-scanner');
const ElementRegistryFeature = require('../features/element-registry');
const InscriptionGeneratorFeature = require('../features/inscription-generator');
const DiscoverySharingFeature = require('../features/discovery-sharing');
const ReputationFeature = require('../features/reputation');

const Statistics = require('../src/statistics');
const Utils = require('../src/utils');

class Contract {
  constructor(configPath = './config.json') {
    this.config = this.loadConfig(configPath);
    this.storage = new Storage(this.config.storage || {});
    this.state = new State();
    this.protocol = null;
    this.features = {};
  }

  loadConfig(configPath) {
    let baseConfig;
    let blockDataSources;

    try {
      const configData = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      const active = config.network[config.active] || config.network.development;

      baseConfig = {
        ...active,
        ...config,
        activeNetwork: config.active
      };

      blockDataSources = config.blockDataSources || {
        primary: 'blockchain-info',
        fallback: ['bitcoin-core'],
        bitcoinCore: {
          url: '',
          username: '',
          password: ''
        },
        blockchainInfo: {
          baseUrl: 'https://blockchain.info'
        }
      };

      baseConfig.blockDataSources = blockDataSources;

      if (process.env.DEBUG === 'true') {
        console.log('[Config] Loaded from file:', configPath);
        console.log('[Config] Active network:', config.active);
      }
    } catch (error) {
      console.error(`Error loading config from ${configPath}:`, error.message);
      console.log('Using default configuration as base');

      blockDataSources = {
        primary: 'blockchain-info',
        fallback: ['bitcoin-core'],
        bitcoinCore: {
          url: '',
          username: '',
          password: ''
        },
        blockchainInfo: {
          baseUrl: 'https://blockchain.info'
        }
      };

      baseConfig = {
        channel: 'dmt_pattern_hunter_testnet_r1',
        ordTapHost: 'https://ord-tap.trac.network',
        scanner: {
          defaultField: 16,
          defaultBlockRange: { start: 800000, end: 800100 }
        },
        tiers: {
          anonymous: { scansPerDay: 5 },
          verified: { scansPerDay: 100 },
          trusted: { scansPerDay: 1000 }
        },
        storage: { localCacheMax: 50 },
        blockDataSources: blockDataSources
      };
    }

    const finalConfig = {
      ...baseConfig,
      channel: process.env.TRAC_CHANNEL || baseConfig.channel,
      ordTapHost: process.env.ORD_TAP_HOST || baseConfig.ordTapHost,
      blockDataSources: {
        ...blockDataSources,
        blockchainInfo: {
          baseUrl: process.env.BLOCKCHAIN_INFO_URL || blockDataSources.blockchainInfo?.baseUrl || 'https://blockchain.info'
        }
      }
    };

    if (process.env.DEBUG === 'true') {
      console.log('[Config] Final configuration after environment overrides:');
      console.log('[Config]   Channel:', finalConfig.channel);
      console.log('[Config]   ord-tap Host:', finalConfig.ordTapHost);
    }

    return finalConfig;
  }

  async init() {
    console.log('Initializing DMT Pattern Scanner Contract...');

    if (process.env.DEBUG === 'true') {
      console.log('[Init] Environment variables loaded:');
      console.log('[Init]   ORD_TAP_HOST:', process.env.ORD_TAP_HOST);
      console.log('[Init]   TRAC_CHANNEL:', process.env.TRAC_CHANNEL);
      console.log('[Init]   DEBUG:', process.env.DEBUG);
      console.log('');
    }

    const networkConfig = this.config;

    this.protocol = new Protocol(networkConfig, this.storage, this.state);
    await this.protocol.init();

    this.features.bitcoinIndexer = new BitcoinIndexerFeature(this);
    this.features.patternScanner = new PatternScannerFeature(this, this.features.bitcoinIndexer);
    this.features.elementRegistry = new ElementRegistryFeature(this, this.features.bitcoinIndexer);
    this.features.inscriptionGenerator = new InscriptionGeneratorFeature(this, this.features.elementRegistry);
    this.features.discoverySharing = new DiscoverySharingFeature(this);
    this.features.reputation = new ReputationFeature(this);

    await this.state.init(this.storage);
    await this.features.elementRegistry.cleanupExpiredReservations();

    console.log('Contract initialized successfully');
    console.log(`Channel: ${this.config.channel}`);
    console.log(`ord-tap: ${this.config.ordTapHost}`);

    if (this.config.features?.enableGossip) {
      this.setupGossip();
    }
  }

  setupGossip() {
    console.log('Setting up gossip protocol...');

    this.protocol.on('newDiscovery', async (discovery) => {
      console.log(`New discovery received: ${discovery.pattern}_${discovery.field}`);
    });
  }

  async scanPattern(pattern, field, startBlock, endBlock, userAddress) {
    if (!userAddress) {
      throw new Error('User address required');
    }

    const limitCheck = await this.features.reputation.checkScanLimit(userAddress);
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.error);
    }

    const result = await this.features.patternScanner.scanPattern(
      pattern,
      field,
      startBlock,
      endBlock,
      userAddress
    );

    await this.features.reputation.incrementScans(userAddress);

    if (result.statistics.totalOccurrences > 0) {
      const shareResult = await this.features.discoverySharing.shareDiscovery(
        pattern,
        field,
        userAddress,
        result.statistics,
        startBlock,
        endBlock
      );

      if (shareResult.success) {
        await this.features.reputation.addDiscovery(userAddress, pattern, field);
      }
    }

    return result;
  }

  async checkElementAvailability(name, pattern, field) {
    return await this.features.elementRegistry.checkAvailability(name, pattern, field);
  }

  async reserveElement(name, pattern, field, userAddress) {
    return await this.features.elementRegistry.reservePattern(name, pattern, field, userAddress);
  }

  async generateElementRegistration(name, pattern, field) {
    return await this.features.inscriptionGenerator.generateElementRegistration(name, pattern, field);
  }

  async generateDeployment(ticker, elem, supply, dta) {
    return await this.features.inscriptionGenerator.generateDeployment(ticker, elem, supply, dta);
  }

  async generateMint(dep, tick, block, dta) {
    return await this.features.inscriptionGenerator.generateMint(dep, tick, block, dta);
  }

  async getDiscoveries() {
    return await this.features.discoverySharing.getAllDiscoveries();
  }

  async getRecentDiscoveries(limit) {
    return await this.features.discoverySharing.getRecentDiscoveries(limit);
  }

  async getUserReputation(address) {
    return await this.features.reputation.getUserReputation(address);
  }

  async getLeaderboard(type) {
    return await this.features.reputation.getLeaderboard(type);
  }

  async getMyReservations(userAddress) {
    return await this.features.elementRegistry.getMyReservations(userAddress);
  }

  async getRecentScans(userAddress, limit) {
    return await this.features.patternScanner.getRecentScans(userAddress, limit);
  }

  async getHealth() {
    const indexerHealth = await this.features.bitcoinIndexer.checkHealth();

    const protocolStats = this.protocol.getStats();

    return {
      indexer: indexerHealth,
      protocol: protocolStats,
      uptime: process.uptime()
    };
  }

  async getStats() {
    const discoveries = await this.features.discoverySharing.getDiscoveryCount();
    const users = await this.features.reputation.getAllUsers();

    return {
      totalDiscoveries: discoveries,
      totalUsers: users.length,
      verifiedDiscoveries: Object.values(await this.features.discoverySharing.getVerifiedDiscoveries()).length,
      networkPeers: this.protocol.peers.length
    };
  }
}

class Storage {
  constructor(config) {
    this.data = {};
    this.maxCache = config.localCacheMax || 50;
  }

  async get(key) {
    return this.data[key];
  }

  async put(key, value) {
    this.data[key] = value;

    const keys = Object.keys(this.data);
    if (keys.length > this.maxCache + 100) {
      for (const oldKey of keys.slice(0, 50)) {
        if (oldKey !== 'user:recent') {
          delete this.data[oldKey];
        }
      }
    }
  }

  async del(key) {
    delete this.data[key];
  }

  async keys() {
    return Object.keys(this.data);
  }
}

class State {
  constructor() {
    this.data = {};
  }

  async init(storage) {
    this.storage = storage;

    const stateKeys = await this.storage.keys();
    for (const key of stateKeys) {
      if (key.startsWith('state:')) {
        const value = await this.storage.get(key);
        this.data[key.replace('state:', '')] = value;
      }
    }

    if (!this.data.discoveredPatterns) {
      this.data.discoveredPatterns = {};
      await this.save('discoveredPatterns', this.data.discoveredPatterns);
    }

    if (!this.data.userReputation) {
      this.data.userReputation = {};
      await this.save('userReputation', this.data.userReputation);
    }

    if (!this.data.leaderboard) {
      this.data.leaderboard = {
        topDiscoverers: [],
        topPatterns: []
      };
      await this.save('leaderboard', this.data.leaderboard);
    }
  }

  async get(key) {
    return this.data[key];
  }

  async put(key, value) {
    this.data[key] = value;
    await this.save(key, value);
  }

  async del(key) {
    delete this.data[key];
    await this.storage.del(`state:${key}`);
  }

  async keys() {
    return Object.keys(this.data);
  }

  async save(key, value) {
    await this.storage.put(`state:${key}`, value);
  }
}

module.exports = Contract;