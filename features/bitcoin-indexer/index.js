/**
 * Bitcoin Indexer Feature
 * Interface with blockchain.info API for raw Bitcoin block data
 */

const BlockDataFetcher = require('../../src/block-data-fetcher');
const fetch = require('node-fetch');

class BitcoinIndexerFeature {
  constructor(contract) {
    this.contract = contract;
    this.ordTapHost = contract.config.ordTapHost || 'https://fra-01.tap-reader.xyz';
    this.blockFetcher = new BlockDataFetcher(contract.config.blockDataSources);
    this.debug = process.env.DEBUG === 'true';

    if (process.env.DEBUG === 'true') {
      console.log(`[BitcoinIndexer] Initialized`);
      console.log(`[BitcoinIndexer] TAP API host: ${this.ordTapHost}`);
      console.log(`[BitcoinIndexer] Block data source: ${contract.config.blockDataSources?.blockchainInfo?.baseUrl || 'blockchain.info'}`);
    }
  }

  log(message) {
    if (this.debug) {
      console.log(`[BitcoinIndexer] ${message}`);
    }
  }

  async getBlock(blockHeight) {
    try {
      const blockData = await this.blockFetcher.getBlock(blockHeight);

      if (!blockData) {
        this.log(`Failed to fetch block ${blockHeight}`);
        return null;
      }

      this.log(`Successfully fetched block ${blockHeight}`);
      return blockData;

    } catch (error) {
      this.log(`Error fetching block ${blockHeight}: ${error.message}`);
      return null;
    }
  }

  async checkPatternExists(pattern, field) {
    // For now, just return false (pattern doesn't exist)
    // This will be implemented when we integrate with TAP API
    try {
      this.log(`Pattern existence check: ${pattern} field ${field}`);
      return { exists: false, event: null };
    } catch (error) {
      this.log(`Error checking pattern existence: ${error.message}`);
      return { exists: false, event: null };
    }
  }

  async checkHealth() {
    try {
      const start = Date.now();
      this.log('Checking blockchain.info and TAP API health...');

      const healthChecks = [];
      
      // Check blockchain.info
      try {
        const blockchainUrl = this.contract.config.blockDataSources?.blockchainInfo?.baseUrl || 'https://blockchain.info';
        const response = await fetch(`${blockchainUrl}/latestblock`, {
          timeout: 5000,
          headers: {
            'User-Agent': 'DMT-Pattern-Scanner/1.0'
          }
        });

        const latency = Date.now() - start;

        if (response.ok) {
          const data = await response.json();
          healthChecks.push({
            source: 'blockchain.info',
            healthy: true,
            latency: latency,
            message: `blockchain.info API responding (current block: ${data.height})`
          });
          this.log(`blockchain.info healthy (${latency}ms): height=${data.height}`);
        } else {
          healthChecks.push({
            source: 'blockchain.info',
            healthy: false,
            latency: latency,
            message: `blockchain.info error: ${response.status}`
          });
          this.log(`blockchain.info unhealthy: ${response.status}`);
        }
      } catch (error) {
        healthChecks.push({
          source: 'blockchain.info',
          healthy: false,
          latency: -1,
          message: `blockchain.info unreachable: ${error.message}`
        });
        this.log(`blockchain.info error: ${error.message}`);
      }

      // Check TAP API
      try {
        const tapStart = Date.now();
        const tapResponse = await fetch(`${this.ordTapHost}/health`, {
          timeout: 5000
        });

        const tapLatency = Date.now() - tapStart;

        if (tapResponse.ok) {
          healthChecks.push({
            source: 'TAP API',
            healthy: true,
            latency: tapLatency,
            message: `TAP API responding`
          });
          this.log(`TAP API healthy (${tapLatency}ms)`);
        } else {
          healthChecks.push({
            source: 'TAP API',
            healthy: false,
            latency: tapLatency,
            message: `TAP API error: ${tapResponse.status}`
          });
          this.log(`TAP API unhealthy: ${tapResponse.status}`);
        }
      } catch (error) {
        healthChecks.push({
          source: 'TAP API',
          healthy: false,
          latency: -1,
          message: `TAP API unreachable: ${error.message}`
        });
        this.log(`TAP API error: ${error.message}`);
      }

      const blockDataHealthy = healthChecks.find(hc => hc.source === 'blockchain.info')?.healthy || false;
      const tapApiHealthy = healthChecks.find(hc => hc.source === 'TAP API')?.healthy || false;
      const maxLatency = Math.max(...healthChecks.map(hc => hc.latency));

      return {
        healthy: blockDataHealthy || tapApiHealthy,
        latency: maxLatency,
        message: `Block Data: ${blockDataHealthy ? '✅' : '❌'} | TAP API: ${tapApiHealthy ? '✅' : '❌'}`,
        blockDataSource: blockDataHealthy ? 'blockchain.info' : 'none',
        tapApiStatus: tapApiHealthy ? 'healthy' : 'unhealthy',
        healthChecks: healthChecks
      };

    } catch (error) {
      this.log(`Health check error: ${error.message}`);
      return {
        healthy: false,
        latency: -1,
        message: `Health check failed: ${error.message}`,
        blockDataSource: 'error',
        tapApiStatus: 'error',
        healthChecks: []
      };
    }
  }
}

module.exports = BitcoinIndexerFeature;